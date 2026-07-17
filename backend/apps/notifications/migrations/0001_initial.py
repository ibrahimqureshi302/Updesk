from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Notification",
            fields=[
                ("id",         models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("ntype",      models.CharField(choices=[("message", "New Message"), ("proposal", "Proposal Update"), ("client", "New Client")], max_length=20)),
                ("title",      models.CharField(max_length=255)),
                ("body",       models.TextField()),
                ("read",       models.BooleanField(default=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("user",       models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="notifications", to=settings.AUTH_USER_MODEL)),
            ],
            options={
                "db_table": "notifications",
                "ordering": ["-created_at"],
            },
        ),
        migrations.CreateModel(
            name="WhatsAppSettings",
            fields=[
                ("id",               models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("phone_number",     models.CharField(blank=True, help_text="E.164 format, e.g. +14155238886", max_length=20)),
                ("enabled",          models.BooleanField(default=False)),
                ("notify_messages",  models.BooleanField(default=True)),
                ("notify_proposals", models.BooleanField(default=True)),
                ("notify_clients",   models.BooleanField(default=True)),
                ("updated_at",       models.DateTimeField(auto_now=True)),
                ("user",             models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name="whatsapp_settings", to=settings.AUTH_USER_MODEL)),
            ],
            options={
                "db_table": "whatsapp_settings",
            },
        ),
    ]
