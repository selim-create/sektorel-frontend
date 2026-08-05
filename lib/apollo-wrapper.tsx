"use client";

import { ApolloLink, HttpLink, Observable } from "@apollo/client";
import {
  ApolloNextAppProvider,
  ApolloClient,
  SSRMultipartLink,
} from "@apollo/client-integration-nextjs";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import { createApolloErrorLink, GRAPHQL_ENDPOINT } from "@/lib/error-handler";
import { getValidAccessToken } from "@/lib/auth";
import { createApolloCache } from "@/lib/apollo-cache";

function makeClient() {
  const httpLink = new HttpLink({
    uri: GRAPHQL_ENDPOINT,
  });

  const authLink = new ApolloLink((operation, forward) => {
    return new Observable((observer) => {
      let subscription: { unsubscribe: () => void } | undefined;
      let cancelled = false;

      getValidAccessToken()
        .then((token) => {
          if (cancelled) return;

          operation.setContext(({ headers = {} }) => ({
            headers: {
              ...headers,
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }));

          subscription = forward(operation).subscribe({
            next: (value) => observer.next(value),
            error: (error) => observer.error(error),
            complete: () => observer.complete(),
          });
        })
        .catch((error) => observer.error(error));

      return () => {
        cancelled = true;
        subscription?.unsubscribe();
      };
    });
  });

  const transportLink = typeof window === "undefined"
    ? ApolloLink.from([
        new SSRMultipartLink({ stripDefer: true }),
        httpLink,
      ])
    : ApolloLink.from([authLink, httpLink]);

  return new ApolloClient({
    cache: createApolloCache(),
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
