from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Client
from .serializers import ClientSerializer

class ClientListView(generics.ListAPIView):
    serializer_class = ClientSerializer
    filter_backends  = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["country"]
    search_fields    = ["name","company_name","email"]
    ordering_fields  = ["name","updated_at"]

    def get_queryset(self):
        return Client.objects.filter(user=self.request.user)

class ClientDetailView(generics.RetrieveUpdateAPIView):
    """Retrieve a client or update private notes."""
    serializer_class = ClientSerializer
    def get_queryset(self):
        return Client.objects.filter(user=self.request.user)
