import { onError } from "@apollo/client/link/error";

const DEFAULT_GRAPHQL_ENDPOINT = "http://api.sektorelajanda.com/graphql";

export const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.trim() ||
  process.env.WORDPRESS_API_URL?.trim() ||
  DEFAULT_GRAPHQL_ENDPOINT;

export function logGraphQLError(scope: string, error: unknown) {
  console.error(`[GraphQL] ${scope}`, error);
}

export function createApolloErrorLink(scope: string) {
  return onError(({ graphQLErrors, networkError, operation }) => {
    if (graphQLErrors?.length) {
      graphQLErrors.forEach((error) => {
        console.error(
          `[GraphQL] ${scope} (${operation.operationName || "anonymous"})`,
          error.message,
        );
      });
    }

    if (networkError) {
      console.error(
        `[GraphQL] ${scope} network error (${operation.operationName || "anonymous"})`,
        networkError,
      );
    }
  });
}
