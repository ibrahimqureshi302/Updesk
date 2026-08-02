from django.urls import path
from .views import (
    NotificationListView, MarkAllReadView, NotificationDetailView,
    WhatsAppSettingsView, WhatsAppStatusView, WhatsAppTestView,
)

urlpatterns = [
    path("",                    NotificationListView.as_view(),  name="notification-list"),
    path("mark-read/",          MarkAllReadView.as_view(),        name="notification-mark-all-read"),
    path("<int:pk>/",           NotificationDetailView.as_view(), name="notification-detail"),
    path("whatsapp-settings/",  WhatsAppSettingsView.as_view(),   name="whatsapp-settings"),
    path("whatsapp-status/",    WhatsAppStatusView.as_view(),     name="whatsapp-status"),
    path("whatsapp-test/",      WhatsAppTestView.as_view(),       name="whatsapp-test"),
]


