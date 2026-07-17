"""
UpworkClient — the ONLY place in the project that calls Upwork's GraphQL API.
Every service.py imports and uses this class.
"""
import logging
import requests
from django.conf import settings
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from apps.authentication.services import refresh_token as do_refresh

logger = logging.getLogger(__name__)


class UpworkAPIError(Exception):
    pass


class UpworkClient:
    """
    Usage in a service:
        client = UpworkClient(user)
        data   = client.query(SOME_QUERY, variables={...})
    """

    def __init__(self, user):
        self.user     = user
        self.endpoint = settings.UPWORK_GRAPHQL_URL
        self._load_token()

    def _load_token(self):
        try:
            self.token = self.user.upwork_token
        except Exception:
            raise UpworkAPIError(
                "No Upwork token found for this user. "
                "Please connect your Upwork account first via /api/v1/auth/upwork/login/"
            )

    def _headers(self):
        if self.token.is_expired:
            logger.info("Token expired — refreshing for user %s", self.user.username)
            self.token = do_refresh(self.token)
        return {
            "Authorization": f"Bearer {self.token.access_token}",
            "Content-Type":  "application/json",
        }

    @retry(
        retry=retry_if_exception_type(requests.exceptions.RequestException),
        stop=stop_after_attempt(3),
        wait=wait_exponential(min=2, max=10),
        reraise=True,
    )
    def query(self, gql: str, variables: dict = None) -> dict:
        """Execute a GraphQL query. Returns the 'data' dict or raises UpworkAPIError."""
        payload = {"query": gql}
        if variables:
            payload["variables"] = variables

        resp = requests.post(
            self.endpoint,
            json=payload,
            headers=self._headers(),
            timeout=20,
        )

        # On 401 — refresh once and retry
        if resp.status_code == 401:
            self.token = do_refresh(self.token)
            resp = requests.post(self.endpoint, json=payload, headers=self._headers(), timeout=20)

        resp.raise_for_status()
        result = resp.json()

        if "errors" in result:
            msgs = [e.get("message", "unknown") for e in result["errors"]]
            raise UpworkAPIError("GraphQL error: " + "; ".join(msgs))

        return result.get("data", {})
