from django.urls import path
from .views import ThreadListView, ThreadDetailView, OpenInUpworkView

urlpatterns = [
    path("",                          ThreadListView.as_view(),   name="thread-list"),
    path("<int:pk>/",                 ThreadDetailView.as_view(), name="thread-detail"),
    path("<int:pk>/open-in-upwork/",  OpenInUpworkView.as_view(), name="thread-upwork-link"),
]
