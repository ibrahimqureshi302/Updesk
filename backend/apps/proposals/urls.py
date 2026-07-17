from django.urls import path
from .views import (
    ProposalListView,
    ProposalDetailView,
    ProposalStatsView,
    ProposalOpenInUpworkView,
)

urlpatterns = [
    path("",                         ProposalListView.as_view(),        name="proposal-list"),
    path("stats/",                   ProposalStatsView.as_view(),       name="proposal-stats"),
    path("<int:pk>/",                ProposalDetailView.as_view(),      name="proposal-detail"),
    path("<int:pk>/open-in-upwork/", ProposalOpenInUpworkView.as_view(),name="proposal-upwork-link"),
]
