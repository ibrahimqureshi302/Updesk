"""
Messages views — READ-ONLY. All class-based generics.
Sending messages is done by the user on Upwork via the open-in-upwork link.
No @api_view decorators anywhere.
"""
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import MessageThread
from .serializers import ThreadSerializer, UpworkLinkSerializer

class ThreadListView(generics.ListAPIView):
    """
    GET /api/v1/messages/
    Returns all message threads synced from Upwork.
    Each thread is linked to a contract and contains all messages exchanged.
    Messages are READ-ONLY — to reply, use the open-in-upwork link.
    """
    serializer_class = ThreadSerializer

    def get_queryset(self):
        return MessageThread.objects.filter(
            user=self.request.user
        ).select_related("contract")


class ThreadDetailView(generics.RetrieveAPIView):
    """
    GET /api/v1/messages/{id}/
    Returns a single message thread with all its messages.
    Resets unread_count to 0 when the thread is viewed.
    """
    serializer_class = ThreadSerializer

    def get_queryset(self):
        return MessageThread.objects.filter(
            user=self.request.user
        ).prefetch_related("messages")

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.unread_count > 0:
            instance.unread_count = 0
            instance.save(update_fields=["unread_count"])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class OpenInUpworkView(APIView):
    """
    GET /api/v1/messages/{id}/open-in-upwork/
    Returns the direct Upwork URL to open this conversation.
    Because sending messages via API is not supported, this link
    lets the user click through to Upwork to reply directly.
    """
    permission_classes = [IsAuthenticated]
    serializer_class   = UpworkLinkSerializer    # Swagger reads this

    def get(self, request, pk):
        try:
            thread    = MessageThread.objects.get(pk=pk, user=request.user)
            upwork_url = f"https://www.upwork.com/messages/rooms/{thread.upwork_room_id}"
            serializer = UpworkLinkSerializer({"upwork_url": upwork_url})
            return Response(serializer.data)
        except MessageThread.DoesNotExist:
            return Response(
                {"error": "Thread not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        
