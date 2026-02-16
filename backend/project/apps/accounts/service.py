import secrets
import hashlib
from datetime import timedelta
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from .models import RefreshToken

User = get_user_model()


def _generate_access_token(user_id, expiry_hours=24):
    """
    Generates a JWT access token.
    Format: {user_id}.{expiry_timestamp}.{signature}
    """
    expiry_timestamp = int((timezone.now() + timedelta(hours=expiry_hours)).timestamp())
    random_part = secrets.token_urlsafe(32)
    payload = f"{user_id}.{expiry_timestamp}.{random_part}"
    signature = hashlib.sha256(payload.encode()).hexdigest()
    
    return f"{user_id}.{expiry_timestamp}.{random_part}.{signature}"


def _generate_refresh_token():
    """
    Generates a secure random string for the refresh token.
    """
    return secrets.token_urlsafe(64)


def create_user(first_name, last_name, email, password):
    normalized_email = email.strip().lower()

    if User.objects.filter(email=normalized_email).exists():
        raise Exception("A user with this email already exists.")

    user = User.objects.create(
        username=normalized_email,
        email=normalized_email,
        first_name=first_name.strip(),
        last_name=last_name.strip(),
        password=make_password(password),
    )

    access_token = _generate_access_token(user.pk, expiry_hours=24)
    refresh_token_value = _generate_refresh_token()
    
    refresh_token_obj = RefreshToken.objects.create(
        user=user,
        token=refresh_token_value,
        expires_at=timezone.now() + timedelta(days=7)
    )

    print(f"User created: {user.email} (ID: {user.pk})")
    print(f"Refresh token stored with expiry: {refresh_token_obj.expires_at}")

    return user, access_token, refresh_token_value