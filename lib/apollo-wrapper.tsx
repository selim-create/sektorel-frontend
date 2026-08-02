"use client";

import { ApolloLink, HttpLink } from "@apollo/client";
import {
  ApolloNextAppProvider,
  NextSSRApolloClient,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import { createApolloErrorLink, GRAPHQL_ENDPOINT } from "@/lib/error-handler";

function makeClient() {
  const httpLink = new HttpLink({
    uri: GRAPHQL_ENDPOINT,
  });

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    defaultOptions: {
      query: {
        errorPolicy: "all",
      },
      watchQuery: {
        errorPolicy: "all",
      },
    },
    link:
      typeof window === "undefined"
        ? ApolloLink.from([
            createApolloErrorLink("ssr"),
            new SSRMultipartLink({
              stripDefer: true,
            }),
            httpLink,
          ])
        : ApolloLink.from([createApolloErrorLink("client"), httpLink]),
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