"""
Root URL file.  All API routes live under /api/v1/
"""
from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView


urlpatterns = [
    path("admin/",              admin.site.urls),
    path("api/v1/auth/",        include("apps.authentication.urls")),
    path("api/v1/clients/",     include("apps.clients.urls")),
    path("api/v1/projects/",    include("apps.projects.urls")),
    path("api/v1/messages/",    include("apps.messages.urls")),
    path("api/v1/proposals/",   include("apps.proposals.urls")),
    path("api/v1/profile/",     include("apps.profile.urls")),
    path("api/v1/sync/",          include("apps.sync.urls")),
    path("api/v1/notifications/", include("apps.notifications.urls")),
    # ── Swagger / OpenAPI ─────────────────────────────────────────────────────
    # Downloads the raw schema JSON/YAML file
    path("api/schema/",  SpectacularAPIView.as_view(),        name="schema"),
    # Beautiful Swagger UI — open this in your browser
    path("api/docs/",    SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    # Alternative ReDoc UI
    path("api/redoc/",   SpectacularRedocView.as_view(url_name="schema"),   name="redoc"),

]
