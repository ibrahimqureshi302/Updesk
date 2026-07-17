"""
Seed the database with realistic mock data so the dashboard and the Swagger
API can be explored without a live Upwork connection.

Usage:
    python manage.py seed_mock                 # create / top-up demo data
    python manage.py seed_mock --fresh         # wipe existing demo data first

A demo dashboard account is created:
    username: demo
    password: demo12345

Everything is idempotent — rows are keyed on their unique `upwork_id`, so the
command can be run repeatedly without creating duplicates.
"""
from datetime import timedelta
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone

from apps.clients.models import Client
from apps.projects.models import Contract, Milestone
from apps.messages.models import MessageThread, Message
from apps.proposals.models import Proposal
from apps.profile.models import FreelancerProfile
from apps.sync.models import SyncLog

User = get_user_model()

DEMO_USERNAME = "demo"
DEMO_PASSWORD = "demo12345"


class Command(BaseCommand):
    help = "Populate the database with mock UpDesk data for local development."

    def add_arguments(self, parser):
        parser.add_argument(
            "--fresh",
            action="store_true",
            help="Delete the demo user's existing data before seeding.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        now = timezone.now()
        today = now.date()

        user = self._get_user()

        if options["fresh"]:
            self.stdout.write("Wiping existing demo data...")
            for model in (SyncLog, Proposal, Message, MessageThread,
                          Milestone, Contract, Client):
                model.objects.filter(**self._user_filter(model, user)).delete()
            FreelancerProfile.objects.filter(user=user).delete()

        self._seed_profile(user, today)
        clients = self._seed_clients(user, now)
        contracts = self._seed_contracts(user, clients, today)
        self._seed_milestones(contracts, today)
        self._seed_messages(user, contracts, now)
        self._seed_proposals(user, now)
        self._seed_sync_logs(user, now)

        self.stdout.write(self.style.SUCCESS(
            "\nMock data ready.\n"
            f"  Dashboard login -> username: {DEMO_USERNAME}  password: {DEMO_PASSWORD}\n"
            f"  Clients: {Client.objects.filter(user=user).count()}  "
            f"Contracts: {Contract.objects.filter(user=user).count()}  "
            f"Milestones: {Milestone.objects.filter(contract__user=user).count()}\n"
            f"  Threads: {MessageThread.objects.filter(user=user).count()}\n"
            f"  Proposals: {Proposal.objects.filter(user=user).count()}  "
            f"SyncLogs: {SyncLog.objects.filter(user=user).count()}"
        ))

    # ── helpers ──────────────────────────────────────────────────────────────
    @staticmethod
    def _user_filter(model, user):
        """Return the right filter kwargs to scope a model to `user`."""
        field_names = {f.name for f in model._meta.get_fields()}
        if "user" in field_names:
            return {"user": user}
        if model is Milestone:
            return {"contract__user": user}
        if model is Message:
            return {"thread__user": user}
        return {}

    def _get_user(self):
        user, created = User.objects.get_or_create(
            username=DEMO_USERNAME,
            defaults={"email": "demo@updesk.local", "is_staff": True, "is_superuser": True},
        )
        if created:
            user.set_password(DEMO_PASSWORD)
            user.save()
            self.stdout.write(f"Created demo user '{DEMO_USERNAME}'.")
        else:
            self.stdout.write(f"Reusing demo user '{DEMO_USERNAME}'.")
        return user

    # ── seeders ──────────────────────────────────────────────────────────────
    def _seed_profile(self, user, today):
        FreelancerProfile.objects.update_or_create(
            user=user,
            defaults=dict(
                upwork_id="fl_demo_001",
                name="Alex Freelancer",
                email="alex@updesk.local",
                title="Full-Stack Developer - Django & React",
                description="10 years building web apps. Specializing in Django REST "
                            "backends and React dashboards.",
                hourly_rate=Decimal("65.00"),
                currency="USD",
                job_success_score=98.0,
                total_earnings=Decimal("184500.00"),
                total_jobs=72,
                connects_balance=120,
                member_since=today.replace(year=today.year - 6),
                profile_url="https://www.upwork.com/freelancers/~demo001",
                skills=["Python", "Django", "DRF", "React", "PostgreSQL", "Celery"],
                last_synced_at=timezone.now(),
            ),
        )

    def _seed_clients(self, user, now):
        data = [
            dict(upwork_id="cl_001", name="Sarah Chen", company_name="BrightLabs Inc.",
                 email="sarah@brightlabs.io", country="United States",
                 total_hires=14, total_reviews=12),
            dict(upwork_id="cl_002", name="Tom Becker", company_name="Nordic Apps AB",
                 email="tom@nordicapps.se", country="Sweden",
                 total_hires=5, total_reviews=5),
            dict(upwork_id="cl_003", name="Priya Nair", company_name="FinEdge Pvt Ltd",
                 email="priya@finedge.in", country="India",
                 total_hires=22, total_reviews=20),
        ]
        clients = {}
        for d in data:
            obj, _ = Client.objects.update_or_create(
                upwork_id=d["upwork_id"],
                defaults={**d, "user": user, "last_synced_at": now,
                          "notes": "Great communication."},
            )
            clients[d["upwork_id"]] = obj
        return clients

    def _seed_contracts(self, user, clients, today):
        data = [
            dict(upwork_id="ct_001", title="SaaS Dashboard — Django + React",
                 client=clients["cl_001"], status="ACTIVE", contract_type="HOURLY",
                 hourly_rate=Decimal("65.00"), start_date=today - timedelta(days=90)),
            dict(upwork_id="ct_002", title="Payment Integration (Stripe + Webhooks)",
                 client=clients["cl_003"], status="ACTIVE", contract_type="FIXED",
                 fixed_price=Decimal("4200.00"), start_date=today - timedelta(days=40)),
            dict(upwork_id="ct_003", title="Mobile API Backend",
                 client=clients["cl_002"], status="ENDED", contract_type="FIXED",
                 fixed_price=Decimal("2800.00"), start_date=today - timedelta(days=200),
                 end_date=today - timedelta(days=120)),
        ]
        contracts = {}
        for d in data:
            obj, _ = Contract.objects.update_or_create(
                upwork_id=d["upwork_id"],
                defaults={**d, "user": user, "currency": "USD",
                          "last_synced_at": timezone.now()},
            )
            contracts[d["upwork_id"]] = obj
        return contracts

    def _seed_milestones(self, contracts, today):
        data = [
            dict(upwork_id="ms_001", contract=contracts["ct_002"], title="API design & schema",
                 amount=Decimal("1400.00"), status="RELEASED", due_date=today - timedelta(days=25)),
            dict(upwork_id="ms_002", contract=contracts["ct_002"], title="Stripe integration",
                 amount=Decimal("1800.00"), status="FUNDED", due_date=today + timedelta(days=10)),
            dict(upwork_id="ms_003", contract=contracts["ct_002"], title="Webhook handling & tests",
                 amount=Decimal("1000.00"), status="PENDING", due_date=today + timedelta(days=25)),
            dict(upwork_id="ms_004", contract=contracts["ct_003"], title="Final delivery",
                 amount=Decimal("2800.00"), status="RELEASED", due_date=today - timedelta(days=121)),
        ]
        for d in data:
            Milestone.objects.update_or_create(
                upwork_id=d["upwork_id"],
                defaults={**d, "currency": "USD"},
            )

    def _seed_messages(self, user, contracts, now):
        threads = [
            dict(upwork_room_id="rm_001", contract=contracts["ct_001"],
                 last_preview="Sounds good, ship it!", unread=2,
                 sender="Sarah Chen", sender_id="cl_001"),
            dict(upwork_room_id="rm_002", contract=contracts["ct_002"],
                 last_preview="Can we add Apple Pay too?", unread=0,
                 sender="Priya Nair", sender_id="cl_003"),
        ]
        for i, t in enumerate(threads):
            thread, _ = MessageThread.objects.update_or_create(
                upwork_room_id=t["upwork_room_id"],
                defaults=dict(user=user, contract=t["contract"],
                              last_preview=t["last_preview"], unread_count=t["unread"],
                              last_synced_at=now),
            )
            convo = [
                ("them", t["sender"], t["sender_id"], "Hi! How is the progress this week?"),
                ("me", "Alex Freelancer", "fl_demo_001", "Going well — wrapping up the main view."),
                ("them", t["sender"], t["sender_id"], t["last_preview"]),
            ]
            for j, (who, name, sid, body) in enumerate(convo):
                Message.objects.update_or_create(
                    upwork_id=f"msg_{i:02d}_{j:02d}",
                    defaults=dict(thread=thread, sender_id=sid, sender_name=name,
                                  body=body, sent_at=now - timedelta(hours=(len(convo) - j))),
                )

    def _seed_proposals(self, user, now):
        data = [
            ("pr_001", "Build a Django analytics API", "WON", Decimal("3500.00"), 20),
            ("pr_002", "React dashboard revamp", "INTERVIEWING", Decimal("2800.00"), 8),
            ("pr_003", "Celery task queue setup", "SHORTLISTED", Decimal("1500.00"), 5),
            ("pr_004", "WordPress to Django migration", "VIEWED", Decimal("6000.00"), 3),
            ("pr_005", "Quick bug fix in DRF serializer", "SUBMITTED", Decimal("250.00"), 1),
            ("pr_006", "Legacy PHP rewrite", "DECLINED", Decimal("8000.00"), 12),
        ]
        for uid, title, status, bid, days_ago in data:
            Proposal.objects.update_or_create(
                upwork_id=uid,
                defaults=dict(
                    user=user, job_title=title, job_upwork_id=f"job_{uid}",
                    status=status, currency="USD", bid_amount=bid,
                    cover_letter="Hi, I'd love to help with this project. "
                                 "I have strong experience in exactly this stack.",
                    submitted_at=now - timedelta(days=days_ago),
                    last_synced_at=now,
                ),
            )

    def _seed_sync_logs(self, user, now):
        modules = ["profile", "clients", "projects", "messages", "proposals"]
        for i, module in enumerate(modules):
            SyncLog.objects.create(
                user=user, module=module, status="SUCCESS",
                records_synced=5 + i, finished_at=now - timedelta(minutes=i),
            )
