"""
Notification service — creates DB records and sends WhatsApp via Evolution API.
Evolution API v1.8.x self-hosted at localhost:8080.

Each user gets their own Evolution API instance (updesk_{user.id}) so they
can independently connect their own WhatsApp number by scanning a QR code.
"""
import logging
import requests
from django.conf import settings

logger = logging.getLogger(__name__)


def _evo_config(user=None):
    api_url = getattr(settings, "EVOLUTION_API_URL", "").rstrip("/")
    api_key = getattr(settings, "EVOLUTION_API_KEY", "")
    # Per-user instance so every user connects their own WhatsApp independently
    if user is not None:
        instance = f"updesk_{user.id}"
    else:
        instance = getattr(settings, "EVOLUTION_INSTANCE", "updesk")
    return api_url, api_key, instance


def _evo_headers(api_key):
    return {"apikey": api_key, "Content-Type": "application/json"}


# ── Public API ────────────────────────────────────────────────────────────────

def create_notification(user, ntype: str, title: str, body: str):
    from .models import Notification
    notif = Notification.objects.create(user=user, ntype=ntype, title=title, body=body)
    _maybe_send_whatsapp(user, ntype, title, body)
    return notif


def get_evolution_status(user):
    """
    Returns the WhatsApp connection status for this specific user's instance.
    Auto-creates the instance if it does not exist yet (404 response).

    Return keys:
      connected  (bool)
      state      (str)  "open" | "waiting_scan" | "not_configured" | "server_unreachable" | "error"
      qr_base64  (str|None)  base64 PNG when state == "waiting_scan"
      error      (str|None)
    """
    api_url, api_key, instance = _evo_config(user)

    if not all([api_url, api_key]):
        return {
            "connected": False,
            "state": "not_configured",
            "qr_base64": None,
            "error": "EVOLUTION_API_URL or EVOLUTION_API_KEY not set in .env",
        }

    headers = _evo_headers(api_key)

    try:
        resp = requests.get(
            f"{api_url}/instance/connectionState/{instance}",
            headers=headers,
            timeout=10,
        )

        if resp.status_code == 404:
            return _create_instance(api_url, headers, instance)

        resp.raise_for_status()
        data  = resp.json()
        state = data.get("instance", {}).get("state", "close")

        if state == "open":
            return {"connected": True, "state": "open", "qr_base64": None, "error": None}

        return _fetch_qr(api_url, headers, instance, state)

    except requests.exceptions.ConnectionError:
        return {
            "connected": False,
            "state": "server_unreachable",
            "qr_base64": None,
            "error": f"Cannot reach Evolution API at {api_url}. Is the server running?",
        }
    except requests.exceptions.RequestException as e:
        return {"connected": False, "state": "error", "qr_base64": None, "error": str(e)}


def send_test_whatsapp(to_number: str, user):
    """
    Sends a test WhatsApp message from the user's own instance.
    Returns {"success": bool, "error": str|None}.
    """
    api_url, api_key, instance = _evo_config(user)

    if not all([api_url, api_key]):
        return {"success": False, "error": "Evolution API not configured in .env"}

    number = to_number.replace("+", "").replace(" ", "").replace("-", "")
    payload = {
        "number": number,
        "options": {"delay": 1000, "presence": "composing"},
        "textMessage": {"text": "*UpDesk Test*\nWhatsApp notifications are working correctly."},
    }

    try:
        resp = requests.post(
            f"{api_url}/message/sendText/{instance}",
            json=payload,
            headers=_evo_headers(api_key),
            timeout=10,
        )
        resp.raise_for_status()
        return {"success": True, "error": None}
    except requests.exceptions.ConnectionError:
        return {"success": False, "error": f"Cannot reach Evolution API at {api_url}"}
    except requests.exceptions.RequestException as e:
        return {"success": False, "error": str(e)}


# ── Internal helpers ──────────────────────────────────────────────────────────

def _maybe_send_whatsapp(user, ntype: str, title: str, body: str):
    from .models import WhatsAppSettings
    try:
        wa = WhatsAppSettings.objects.get(user=user)
    except WhatsAppSettings.DoesNotExist:
        return

    if not wa.enabled or not wa.phone_number:
        return

    flag_map = {
        "message":  wa.notify_messages,
        "proposal": wa.notify_proposals,
        "client":   wa.notify_clients,
    }
    if not flag_map.get(ntype, False):
        return

    _send_evolution_whatsapp(wa.phone_number, f"*{title}*\n{body}", user)


def _send_evolution_whatsapp(to_number: str, message: str, user):
    api_url, api_key, instance = _evo_config(user)

    if not all([api_url, api_key]):
        logger.warning("Evolution API not configured — skipping WhatsApp send")
        return

    number = to_number.replace("+", "").replace(" ", "").replace("-", "")
    payload = {
        "number": number,
        "options": {"delay": 1000, "presence": "composing"},
        "textMessage": {"text": message},
    }

    try:
        resp = requests.post(
            f"{api_url}/message/sendText/{instance}",
            json=payload,
            headers=_evo_headers(api_key),
            timeout=10,
        )
        resp.raise_for_status()
        logger.info("WhatsApp notification sent to %s via instance %s", to_number, instance)
    except requests.exceptions.RequestException as e:
        logger.error("Failed to send WhatsApp via Evolution API (instance %s): %s", instance, e)


def _create_instance(api_url, headers, instance):
    try:
        resp = requests.post(
            f"{api_url}/instance/create",
            json={"instanceName": instance, "qrcode": True},
            headers=headers,
            timeout=15,
        )
        resp.raise_for_status()
        data   = resp.json()
        qrcode = data.get("qrcode", {})
        return {
            "connected": False,
            "state": "waiting_scan",
            "qr_base64": qrcode.get("base64"),
            "error": None,
        }
    except requests.exceptions.RequestException as e:
        return {
            "connected": False,
            "state": "error",
            "qr_base64": None,
            "error": f"Failed to create Evolution instance: {e}",
        }


def _fetch_qr(api_url, headers, instance, current_state):
    try:
        resp = requests.get(
            f"{api_url}/instance/connect/{instance}",
            headers=headers,
            timeout=15,
        )
        resp.raise_for_status()
        data = resp.json()
        # Evolution API v1.8.x returns base64 at root level (not nested under "qrcode")
        qr_base64 = data.get("base64")
        if qr_base64:
            return {
                "connected": False,
                "state": "waiting_scan",
                "qr_base64": qr_base64,
                "error": None,
            }
        return {"connected": False, "state": current_state, "qr_base64": None, "error": None}
    except requests.exceptions.RequestException as e:
        return {"connected": False, "state": current_state, "qr_base64": None, "error": str(e)}
