"""
Upwork OAuth 2.0 — authorization URL, code exchange, token refresh.
"""
import secrets
import requests
from datetime import timedelta
from django.conf import settings
from django.utils import timezone
from .models import UpworkToken

AUTH_URL  = "https://www.upwork.com/ab/account-security/oauth2/authorize"
TOKEN_URL = "https://www.upwork.com/api/v3/oauth2/token"


def build_auth_url(state: str) -> str:
    return (
        f"{AUTH_URL}"
        f"?response_type=code"
        f"&client_id={settings.UPWORK_CLIENT_ID}"
        f"&redirect_uri={settings.UPWORK_REDIRECT_URI}"
        f"&state={state}"
    )


def exchange_code(user, code: str) -> UpworkToken:
    """Exchange authorization code → access + refresh tokens. Save to DB."""
    resp = requests.post(TOKEN_URL, data={
        "grant_type":    "authorization_code",
        "code":          code,
        "redirect_uri":  settings.UPWORK_REDIRECT_URI,
        "client_id":     settings.UPWORK_CLIENT_ID,
        "client_secret": settings.UPWORK_CLIENT_SECRET,
    }, timeout=15)
    resp.raise_for_status()
    data = resp.json()

    token, _ = UpworkToken.objects.get_or_create(user=user)
    token.access_token  = data["access_token"]
    token.refresh_token = data["refresh_token"]
    token.expires_at    = timezone.now() + timedelta(seconds=data["expires_in"])
    token.scope         = data.get("scope", "")
    token.save()
    return token


def refresh_token(token: UpworkToken) -> UpworkToken:
    """Use refresh token to get a new access token."""
    resp = requests.post(TOKEN_URL, data={
        "grant_type":    "refresh_token",
        "refresh_token": token.refresh_token,
        "client_id":     settings.UPWORK_CLIENT_ID,
        "client_secret": settings.UPWORK_CLIENT_SECRET,
    }, timeout=15)
    resp.raise_for_status()
    data = resp.json()

    token.access_token  = data["access_token"]
    token.refresh_token = data.get("refresh_token", token.refresh_token)
    token.expires_at    = timezone.now() + timedelta(seconds=data["expires_in"])
    token.save(update_fields=["_access_token", "_refresh_token", "expires_at", "updated_at"])
    return token
