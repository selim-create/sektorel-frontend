import { onError } from "@apollo/client/link/error";

const DEFAULT_GRAPHQL_ENDPOINT = "https://api.sektorelajanda.com/graphql";

export const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.trim() ||
  process.env.WORDPRESS_API_URL?.trim() ||
  DEFAULT_GRAPHQL_ENDPOINT;

function stringifyErrorParts(parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(" | ");
}

function safeJson(value: unknown) {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export function extractGraphQLErrorDetails(error: unknown) {
  if (error instanceof Error) {
    return stringifyErrorParts([error.name, error.message, error.stack]);
  }

  if (!error || typeof error !== "object") {
    return String(error);
  }

  const inner = error as Record<string, unknown>;
  const graphQLErrors = Array.isArray(inner.graphQLErrors) ? inner.graphQLErrors : [];
  const graphQLMessages = graphQLErrors
    .map((item) => {
      if (!item || typeof item !== "object") return undefined;
      const gqlErr = item as Record<string, unknown>;
      return stringifyErrorParts([
        typeof gqlErr.message === "string" ? gqlErr.message : undefined,
        Array.isArray(gqlErr.path) ? `path:${gqlErr.path.join(".")}` : undefined,
        gqlErr.extensions ? `extensions:${safeJson(gqlErr.extensions)}` : undefined,
      ]);
    })
    .filter(Boolean)
    .join(" || ");

  return stringifyErrorParts([
    typeof inner.message === "string" ? inner.message : undefined,
    graphQLMessages ? `graphQLErrors:${graphQLMessages}` : undefined,
    inner.networkError ? `networkError:${safeJson(inner.networkError)}` : undefined,
    inner.cause ? `cause:${safeJson(inner.cause)}` : undefined,
  ]) || safeJson(error);
}

export function logGraphQLError(scope: string, error: unknown) {
  console.warn(`[GraphQL] ${scope}: ${extractGraphQLErrorDetails(error)}`);
}

export function createApolloErrorLink(scope: string) {
  return onError(({ graphQLErrors, networkError, operation }) => {
    if (graphQLErrors?.length) {
      graphQLErrors.forEach((error) => {
        console.warn(
          `[GraphQL] ${scope} (${operation.operationName || "anonymous"})`,
          error.message,
        );
      });
    }

    if (networkError) {
      console.warn(
        `[GraphQL] ${scope} network error (${operation.operationName || "anonymous"})`,
        networkError,
      );
    }
  });
}
