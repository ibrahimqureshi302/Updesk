"""
Authentication views — all class-based so Swagger reads them automatically.
No @api_view decorators anywhere.
"""
import secrets
from django.contrib.auth import get_user_model
from django.shortcuts import redirect
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .services import build_auth_url, exchange_code
from .models import UpworkToken
from .serializers import (
    RegisterSerializer,
    TokenResponseSerializer,
    UpworkStatusSerializer,
    UpworkAuthURLSerializer,
)

User = get_user_model()


class RegisterView(APIView):
    """
    POST /api/v1/auth/register/
    Create a local dashboard account.
    This is NOT your Upwork account — it is your UpDesk dashboard login.
    """
    permission_classes = [AllowAny]
    serializer_class   = RegisterSerializer      # Swagger reads this

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"success": False, "error": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        username = serializer.validated_data["username"]
        password = serializer.validated_data["password"]
        user     = User.objects.create_user(username=username, password=password)
        refresh  = RefreshToken.for_user(user)
        return Response({
            "access":  str(refresh.access_token),
            "refresh": str(refresh),
            "user":    {"id": user.id, "username": user.username},
        }, status=status.HTTP_201_CREATED)


class UpworkLoginView(APIView):
    """
    GET /api/v1/auth/upwork/login/
    Returns the Upwork OAuth URL.
    Open this URL in your browser to connect your Upwork account.
    """
    permission_classes = [IsAuthenticated]
    serializer_class   = UpworkAuthURLSerializer

    def get(self, request):
        nonce = secrets.token_urlsafe(16)
        # Embed user ID in state so the callback can identify the user.
        # The callback is an unauthenticated browser redirect from Upwork —
        # no JWT is present, so request.user would be anonymous there.
        state = f"{nonce}.{request.user.id}"
        return Response({"auth_url": build_auth_url(state)})


class UpworkCallbackView(APIView):
    """
    GET /api/v1/auth/upwork/callback/
    Upwork redirects here after the user approves access.
    Exchanges the authorization code for tokens and saves them.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        code  = request.GET.get("code",  "")
        state = request.GET.get("state", "")

        if not code:
            return Response(
                {"error": "Missing code from Upwork."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Decode user ID from state (format: "<nonce>.<user_id>")
        try:
            user_id = int(state.rsplit(".", 1)[1])
            user    = User.objects.get(pk=user_id)
        except (IndexError, ValueError, User.DoesNotExist):
            return Response(
                {"error": "Invalid OAuth state. Please try connecting your Upwork account again."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            exchange_code(user, code)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return redirect("http://localhost:3000/dashboard?connected=true")


class UpworkStatusView(APIView):
    """
    GET /api/v1/auth/upwork/status/
    Check whether the current user has connected their Upwork account.
    Returns connected: true/false and token expiry information.
    """
    permission_classes = [IsAuthenticated]
    serializer_class   = UpworkStatusSerializer

    def get(self, request):
        try:
            t = request.user.upwork_token
            return Response({
                "connected":  True,
                "expires_at": t.expires_at,
                "is_expired": t.is_expired,
            })
        except UpworkToken.DoesNotExist:
            return Response({"connected": False})
