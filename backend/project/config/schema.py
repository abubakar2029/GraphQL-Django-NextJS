import graphene

from apps.accounts.schema import Mutation as AccountsMutation


class Query(graphene.ObjectType):
    health_check = graphene.String(default_value="ok")


class Mutation(AccountsMutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
