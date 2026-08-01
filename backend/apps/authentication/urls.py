from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, UpworkLoginView, UpworkCallbackView, UpworkStatusView

urlpatterns = [
    # Local Django auth
    path("register/",        RegisterView.as_view(),         name="register"),
    path("token/",           TokenObtainPairView.as_view(),  name="token-obtain"),
    path("token/refresh/",   TokenRefreshView.as_view(),     name="token-refresh"),

    # Upwork OAuth
    path("upwork/login/",    UpworkLoginView.as_view(),      name="upwork-login"),
    path("upwork/callback/", UpworkCallbackView.as_view(),   name="upwork-callback"),
    path("upwork/status/",   UpworkStatusView.as_view(),     name="upwork-status"),
]

