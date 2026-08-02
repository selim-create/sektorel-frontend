import { onError } from "@apollo/client/link/error";

const DEFAULT_GRAPHQL_ENDPOINT = "http://api.sektorelajanda.com/graphql";

export const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.trim() ||
  process.env.WORDPRESS_API_URL?.trim() ||
  DEFAULT_GRAPHQL_ENDPOINT;

export function logGraphQLError(scope: string, error: unknown) {
  if (error instanceof Error) {
    console.error(`[GraphQL] ${scope}: ${error.message}`, error.stack ?? "");
  } else if (error && typeof error === "object") {
    const parts: string[] = [];
    const inner = error as Record<string, unknown>;
    if (inner.error instanceof Error) {
      parts.push(`message: ${inner.error.message}`);
      if (inner.error.stack) parts.push(`stack: ${inner.error.stack}`);
    }
    if (inner.errorInfo && typeof inner.errorInfo === "object") {
      const ei = inner.errorInfo as Record<string, unknown>;
      if (ei.componentStack) parts.push(`componentStack: ${String(ei.componentStack)}`);
    }
    console.error(`[GraphQL] ${scope}`, parts.length ? parts.join("\n") : JSON.stringify(error));
  } else {
    console.error(`[GraphQL] ${scope}`, error);
  }
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
