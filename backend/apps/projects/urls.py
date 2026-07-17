from django.urls import path
from . import views
urlpatterns = [
    path("",             views.ContractListView.as_view(),   name="contract-list"),
    path("<int:pk>/",    views.ContractDetailView.as_view(), name="contract-detail"),
    path("milestones/",  views.MilestoneListView.as_view(),  name="milestone-list"),
]
