from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, min_length=6)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

class TokenResponseSerializer(serializers.Serializer):
    access  = serializers.CharField()
    refresh = serializers.CharField()
    user    = serializers.DictField()


class UpworkStatusSerializer(serializers.Serializer):
    connected  = serializers.BooleanField()
    expires_at = serializers.DateTimeField(required=False)
    is_expired = serializers.BooleanField(required=False)


class UpworkAuthURLSerializer(serializers.Serializer):
    auth_url = serializers.URLField()
