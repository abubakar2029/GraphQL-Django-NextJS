import graphene
from graphene_django import DjangoObjectType
from . import service
from .models import User


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("id", "email", "first_name", "last_name")


class SignupPayload(graphene.ObjectType):
    token = graphene.String(required=True)
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
        user, token = service.create_user(
            first_name,
            last_name,
            email,
            password
        )
        return SignupPayload(token=token, user=user)


class Mutation(graphene.ObjectType):
    signup = Signup.Field()