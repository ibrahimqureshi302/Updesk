"""
Sync views — all class-based APIView.
No @api_view decorators. Swagger reads everything automatically.
"""
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import SyncLog
from .serializers import SyncLogSerializer, SyncStatusSerializer, SyncTriggerResponseSerializer
from .tasks import task_sync_all

MODULES = ["profile", "clients", "projects", "messages", "proposals"]


class SyncStatusView(APIView):
    """
    GET /api/v1/sync/status/
    Returns the latest sync log entry for every data module.
    This powers the Sync Health Monitor panel in the dashboard.
    A null value means that module has never been synced.
    Status values: RUNNING, SUCCESS, ERROR
    """
    permission_classes = [IsAuthenticated]
    serializer_class   = SyncStatusSerializer    # Swagger reads this

    def get(self, request):
        result = {}
        for module in MODULES:
            latest = SyncLog.objects.filter(
                user=request.user, module=module
            ).first()
            result[module] = SyncLogSerializer(latest).data if latest else None
        return Response(result)


class SyncTriggerView(APIView):
    """
    POST /api/v1/sync/trigger/
    Manually triggers a full sync of all data modules.
    This is what the Sync Now button in the dashboard calls.
    The sync runs in the background via Celery — response is immediate.
    You can check progress using GET /api/v1/sync/status/
    No request body needed.
    """
    permission_classes = [IsAuthenticated]
    serializer_class   = SyncTriggerResponseSerializer    # Swagger reads this

    def post(self, request):
        task_sync_all.delay(request.user.id)
        serializer = SyncTriggerResponseSerializer(
            {"message": "Sync started in background."}
        )
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)


class SyncHistoryView(generics.ListAPIView):
    """
    GET /api/v1/sync/history/
    Returns the last 50 sync log entries across all modules.
    Useful for debugging sync issues and seeing a history of all runs.
    Most recent entries appear first.
    """
    serializer_class = SyncLogSerializer

    def get_queryset(self):
        return SyncLog.objects.filter(user=self.request.user)[:50]
