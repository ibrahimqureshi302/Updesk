from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from rest_framework import status
from .models import FreelancerProfile
from .serializers import ProfileSerializer

class ProfileView(RetrieveAPIView):
    serializer_class = ProfileSerializer

    def get_object(self):
        try:
            return FreelancerProfile.objects.get(user=self.request.user)
        except FreelancerProfile.DoesNotExist:
            from rest_framework.exceptions import NotFound
            raise NotFound("Profile not synced yet. Trigger a sync first.")
