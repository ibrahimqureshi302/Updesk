"""
Proposals views — all class-based generics and APIView.
No @api_view decorators anywhere. Swagger reads everything automatically.
"""
from rest_framework import generics, filters, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Proposal
from .serializers import ProposalSerializer, ProposalStatsSerializer, ProposalUpworkLinkSerializer


class ProposalListView(generics.ListAPIView):
    """
    GET /api/v1/proposals/
    Returns all proposals submitted via Upwork.
    Filter by status using ?status=SUBMITTED or ?status=WON etc.
    Search by job title using ?search=react
    Order by submitted_at or bid_amount using ?ordering=-submitted_at
    Available statuses: SUBMITTED, VIEWED, SHORTLISTED, INTERVIEWING, WON, DECLINED, WITHDRAWN
    """
    serializer_class = ProposalSerializer
    filter_backends  = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["status"]
    search_fields    = ["job_title"]
    ordering_fields  = ["submitted_at", "bid_amount"]
    ordering         = ["-submitted_at"]

    def get_queryset(self):
        return Proposal.objects.filter(user=self.request.user)


class ProposalDetailView(generics.RetrieveAPIView):
    """
    GET /api/v1/proposals/{id}/
    Returns a single proposal with full cover letter and details.
    """
    serializer_class = ProposalSerializer

    def get_queryset(self):
        return Proposal.objects.filter(user=self.request.user)


class ProposalStatsView(APIView):
    """
    GET /api/v1/proposals/stats/
    Returns win rate analytics for the proposal pipeline.
    Shows total proposals, how many were won, overall win percentage,
    and a count breakdown per status stage.
    This powers the proposal pipeline panel in the dashboard.
    """
    permission_classes = [IsAuthenticated]
    serializer_class   = ProposalStatsSerializer    # Swagger reads this

    def get(self, request):
        qs    = Proposal.objects.filter(user=request.user)
        total = qs.count()
        won   = qs.filter(status="WON").count()
        data  = {
            "total":    total,
            "won":      won,
            "win_rate": round(won / total * 100, 1) if total else 0,
            "by_status": {
                s: qs.filter(status=s).count()
                for s, _ in Proposal.STATUS_CHOICES
            },
        }
        serializer = ProposalStatsSerializer(data)
        return Response(serializer.data)


class ProposalOpenInUpworkView(APIView):
    """
    GET /api/v1/proposals/{id}/open-in-upwork/
    Returns the Upwork URL to view the job posting this proposal was sent to.
    Useful for quickly reviewing the job details from the dashboard.
    """
    permission_classes = [IsAuthenticated]
    serializer_class   = ProposalUpworkLinkSerializer   # Swagger reads this

    def get(self, request, pk):
        try:
            p   = Proposal.objects.get(pk=pk, user=request.user)
            url = (
                f"https://www.upwork.com/jobs/{p.job_upwork_id}"
                if p.job_upwork_id
                else "https://www.upwork.com/nx/proposals/"
            )
            serializer = ProposalUpworkLinkSerializer({"upwork_url": url})
            return Response(serializer.data)
        except Proposal.DoesNotExist:
            return Response(
                {"error": "Proposal not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
