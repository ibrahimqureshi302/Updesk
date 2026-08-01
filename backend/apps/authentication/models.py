"""
UpworkToken stores OAuth tokens encrypted using Python's cryptography library.
One token row per user — updated on every refresh.
"""
import base64
from django.db import models
from django.contrib.auth import get_user_model
from django.conf import settings
from cryptography.fernet import Fernet

User = get_user_model()

def _fernet():
    """Return a Fernet instance keyed from Django's SECRET_KEY."""
    # Derive a 32-byte URL-safe base64 key from SECRET_KEY
    key = base64.urlsafe_b64encode(settings.SECRET_KEY.encode()[:32].ljust(32, b"0"))
    return Fernet(key)


class UpworkToken(models.Model):
    user          = models.OneToOneField(User, on_delete=models.CASCADE, related_name="upwork_token")
    _access_token  = models.TextField(db_column="access_token")
    _refresh_token = models.TextField(db_column="refresh_token")
    expires_at    = models.DateTimeField()
    scope         = models.TextField(blank=True, default="")
    created_at    = models.DateTimeField(auto_now_add=True)
    updated_at    = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "upwork_tokens"

    # ── Transparent encryption/decryption via properties ──────────────────────
    @property
    def access_token(self):
        return _fernet().decrypt(self._access_token.encode()).decode()

    @access_token.setter
    def access_token(self, value):
        self._access_token = _fernet().encrypt(value.encode()).decode()

    @property
    def refresh_token(self):
        return _fernet().decrypt(self._refresh_token.encode()).decode()

    @refresh_token.setter
    def refresh_token(self, value):
        self._refresh_token = _fernet().encrypt(value.encode()).decode()

    @property
    def is_expired(self):
        from django.utils import timezone
        return self.expires_at <= timezone.now()

    def __str__(self):
        return f"Token for {self.user.username}"
