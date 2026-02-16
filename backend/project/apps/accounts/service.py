from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.core import signing

User = get_user_model()

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

    token = signing.dumps({
        "user_id": user.pk,
        "email": user.email
    })

    print(f"User created: {user.email} (ID: {user.pk})")
    
    return user, token