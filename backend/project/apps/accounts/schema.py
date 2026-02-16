import graphene
from graphene_django import DjangoObjectType
from . import service
from .models import User


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("id", "email", "first_name", "last_name")


class SignupPayload(graphene.ObjectType):
    access_token = graphene.String(required=True)
    user = graphene.Field(UserType, required=True)


class Signup(graphene.Mutation):
    class Arguments:
        first_name = graphene.String(required=True)
        last_name = graphene.String(required=True)
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    Output = SignupPayload

    @staticmethod
    def mutate(root, info, first_name, last_name, email, password):
        user, access_token, refresh_token = service.create_user(
            first_name,
            last_name,
            email,
            password
        )
        # Attach refresh token to the context to be picked up by middleware
        info.context.refresh_token = refresh_token
        
        return SignupPayload(
            access_token=access_token,
            user=user
        )


class RefreshTokenPayload(graphene.ObjectType):
    access_token = graphene.String(required=True)


class RefreshTokenMutation(graphene.Mutation):
    Output = RefreshTokenPayload

    @staticmethod
    def mutate(root, info):
        refresh_token = info.context.COOKIES.get('refresh_token')
        if not refresh_token:
            raise Exception("Refresh token not found in cookies.")

        access_token, new_refresh_token = service.refresh_access_token(refresh_token)

        # Attach new refresh token to context for middleware to set cookie
        info.context.refresh_token = new_refresh_token

        return RefreshTokenPayload(access_token=access_token)


class Mutation(graphene.ObjectType):
    signup = Signup.Field()
    refresh_token = RefreshTokenMutation.Field()
