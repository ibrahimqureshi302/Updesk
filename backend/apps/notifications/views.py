from rest_framework.views import APIView
from rest_framework import generics, status
from rest_framework.response import Response
from .models import Notification, WhatsAppSettings
from .serializers import NotificationSerializer, WhatsAppSettingsSerializer


class NotificationListView(APIView):
    """GET  /notifications/  — list recent + unread count."""

    def get(self, request):
        qs = Notification.objects.filter(user=request.user)[:50]
        unread_count = Notification.objects.filter(user=request.user, read=False).count()
        return Response({
            "results":      NotificationSerializer(qs, many=True).data,
            "unread_count": unread_count,
        })

class MarkAllReadView(APIView):
    """POST  /notifications/mark-read/  — mark every notification as read."""

    def post(self, request):
        Notification.objects.filter(user=request.user, read=False).update(read=True)
        return Response({"status": "ok"})


class NotificationDetailView(generics.UpdateAPIView):
    """PATCH  /notifications/<id>/  — mark a single notification read."""
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


class WhatsAppSettingsView(generics.RetrieveUpdateAPIView):
    """GET / PUT / PATCH  /notifications/whatsapp-settings/"""
    serializer_class = WhatsAppSettingsSerializer

    def get_object(self):
        obj, _ = WhatsAppSettings.objects.get_or_create(user=self.request.user)
        return obj


class WhatsAppStatusView(APIView):
    """GET /notifications/whatsapp-status/ — Evolution API connection state + QR code for this user."""

    def get(self, request):
        from .services import get_evolution_status
        return Response(get_evolution_status(request.user))


class WhatsAppTestView(APIView):
    """POST /notifications/whatsapp-test/ — send a test WhatsApp message from this user's instance."""

    def post(self, request):
        from .services import send_test_whatsapp

        phone = request.data.get("phone_number")
        if not phone:
            try:
                wa = WhatsAppSettings.objects.get(user=request.user)
                phone = wa.phone_number
            except WhatsAppSettings.DoesNotExist:
                pass

        if not phone:
            return Response(
                {"error": "No phone number provided and none saved in WhatsApp settings"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        result = send_test_whatsapp(phone, request.user)
        if result["success"]:
            return Response({"status": "sent", "to": phone})
        return Response({"error": result["error"]}, status=status.HTTP_502_BAD_GATEWAY)
