from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Contract, Milestone
from .serializers import ContractSerializer, MilestoneSerializer

class ContractListView(generics.ListAPIView):
    serializer_class = ContractSerializer
    filter_backends  = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["status","contract_type"]
    search_fields    = ["title"]
    ordering_fields  = ["start_date","updated_at"]
    def get_queryset(self):
        return Contract.objects.filter(user=self.request.user).select_related("client").prefetch_related("milestones")

class ContractDetailView(generics.RetrieveAPIView):
    serializer_class = ContractSerializer
    def get_queryset(self):
        return Contract.objects.filter(user=self.request.user).prefetch_related("milestones")

class MilestoneListView(generics.ListAPIView):
    """All milestones across all contracts — useful for the milestone tracker."""
    serializer_class = MilestoneSerializer
    filter_backends  = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["status"]
    ordering_fields  = ["due_date","amount"]
    def get_queryset(self):
        return Milestone.objects.filter(contract__user=self.request.user).select_related("contract")
