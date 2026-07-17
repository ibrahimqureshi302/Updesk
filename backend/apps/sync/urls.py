from django.urls import path
from .views import SyncStatusView, SyncTriggerView, SyncHistoryView

urlpatterns = [
    path("status/",  SyncStatusView.as_view(),  name="sync-status"),
    path("trigger/", SyncTriggerView.as_view(),  name="sync-trigger"),
    path("history/", SyncHistoryView.as_view(),  name="sync-history"),
]
