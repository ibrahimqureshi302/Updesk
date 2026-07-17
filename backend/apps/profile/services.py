import logging
from django.utils import timezone
from apps.sync.graphql import UpworkClient
from apps.sync.queries.profile import QUERY
from .models import FreelancerProfile

logger = logging.getLogger(__name__)

def sync_profile(user) -> int:
    data = UpworkClient(user).query(QUERY)
    p    = data.get("freelancerProfile") or {}
    if not p.get("id"):
        logger.warning("sync_profile: empty response for user=%s", user.username)
        return 0
    rate = p.get("hourlyRate")   or {}
    earn = p.get("totalEarnings") or {}
    FreelancerProfile.objects.update_or_create(
        user=user,
        defaults={
            "upwork_id":         p["id"],
            "name":              p.get("name",""),
            "email":             p.get("email",""),
            "title":             p.get("title",""),
            "description":       p.get("description",""),
            "hourly_rate":       rate.get("amount"),
            "currency":          rate.get("currencyCode","USD"),
            "job_success_score": p.get("jobSuccessScore"),
            "total_earnings":    earn.get("amount"),
            "total_jobs":        p.get("totalJobs",0),
            "connects_balance":  p.get("connectsBalance",0),
            "member_since":      p.get("memberSince"),
            "profile_url":       p.get("profileUrl",""),
            "skills":            p.get("skills",[]),
            "last_synced_at":    timezone.now(),
        },
    )
    logger.info("sync_profile: updated for user=%s", user.username)
    return 1
