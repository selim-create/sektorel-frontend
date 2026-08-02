"use client";

import { ApolloLink, HttpLink } from "@apollo/client";
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
  SSRMultipartLink,
} from "@apollo/client-integration-nextjs";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import { createApolloErrorLink, GRAPHQL_ENDPOINT } from "@/lib/error-handler";
import { getAccessToken } from "@/lib/auth";

function makeClient() {
  const httpLink = new HttpLink({
    uri: GRAPHQL_ENDPOINT,
  });

  const authLink = new ApolloLink((operation, forward) => {
    const token = getAccessToken();

    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }));

    return forward(operation);
  });

  const transportLink = typeof window === "undefined"
    ? ApolloLink.from([
        new SSRMultipartLink({ stripDefer: true }),
        httpLink,
      ])
    : ApolloLink.from([authLink, httpLink]);

  return new ApolloClient({
    cache: new InMemoryCache(),
    defaultOptions: {
      query: { errorPolicy: "all" },
      watchQuery: { errorPolicy: "all" },
    },
    link: ApolloLink.from([
      createApolloErrorLink(typeof window === "undefined" ? "ssr" : "client"),
      transportLink,
    ]),
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ErrorBoundary>
      <ApolloNextAppProvider makeClient={makeClient}>
        {children}
      </ApolloNextAppProvider>
    </ErrorBoundary>
  );
}
