"use client";

import { HttpLink } from "@apollo/client/link/http";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import {
    ApolloNextAppProvider,
    ApolloClient,
    InMemoryCache,
} from "@apollo/client-integration-nextjs";
import { Observable } from "@apollo/client/utilities";

import { getAccessToken, setAccessToken, removeAccessToken } from "@/lib/auth";

function makeClient() {
    const httpLink = new HttpLink({
        uri: "http://127.0.0.1:8000/graphql/",
    });

    const authLink = setContext((_, { headers }) => {
        const token = getAccessToken();
        return {
            headers: {
                ...headers,
                authorization: token ? `JWT ${token}` : "",
            },
        };
    });

    const errorLink = onError(({ error, operation, forward }) => {
        if (error instanceof CombinedGraphQLErrors) {
            for (const err of error.errors) {

                if (
                    err.message === "Signature has expired" ||
                    err.message.includes("expired") ||
                    err.message.includes("Unauthorized")
                ) {
                    const context = operation.getContext();
                    if (context.hasRetried) return;

                    return new Observable(observer => {
                        fetch("http://127.0.0.1:8000/graphql/", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            credentials: "include",
                            body: JSON.stringify({
                                query: `mutation RefreshToken { refreshToken { accessToken } }`
                            })
                        })
                            .then(res => res.json())
                            .then(data => {
                                const newToken = data.data?.refreshToken?.accessToken;

                                if (newToken) {
                                    setAccessToken(newToken);

                                    operation.setContext(({ headers = {} }) => ({
                                        headers: {
                                            ...headers,
                                            authorization: `JWT ${newToken}`,
                                        },
                                        hasRetried: true,
                                    }));

                                    forward(operation).subscribe({
                                        next: observer.next.bind(observer),
                                        error: observer.error.bind(observer),
                                        complete: observer.complete.bind(observer),
                                    });
                                } else {
                                    removeAccessToken();
                                    observer.error(err);
                                }
                            })
                            .catch(e => {
                                removeAccessToken();
                                observer.error(e);
                            });
                    });
                }
            }
        }
    });

    return new ApolloClient({
        cache: new InMemoryCache(),
        link: authLink.concat(errorLink).concat(httpLink),
    });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
    return (
        <ApolloNextAppProvider makeClient={makeClient}>
            {children}
        </ApolloNextAppProvider>
    );
}
