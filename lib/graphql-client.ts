import { ApolloLink, HttpLink, type OperationVariables, type QueryOptions } from "@apollo/client";
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";
import { createApolloErrorLink, GRAPHQL_ENDPOINT, logGraphQLError } from "@/lib/error-handler";

const REQUEST_TIMEOUT_MS = 5000;
const RETRY_ATTEMPTS = 0;

async function timedFetch(input: RequestInfo | URL, init?: RequestInit) {
  const timeoutSignal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  const signal = init?.signal
    ? AbortSignal.any([init.signal, timeoutSignal])
    : timeoutSignal;

  return fetch(input, {
    ...init,
    signal,
  });
}

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        errorPolicy: "all",
      },
      watchQuery: {
        errorPolicy: "all",
      },
    },
    link: ApolloLink.from([
      createApolloErrorLink("server"),
      new HttpLink({
        uri: GRAPHQL_ENDPOINT,
        fetch: timedFetch,
      }),
    ]),
  });
});

export async function queryWithFallback<TData, TVariables extends OperationVariables = OperationVariables>(
  options: QueryOptions<TVariables, TData>,
  fallbackData: TData,
  scope = "query",
) {
  for (let attempt = 0; attempt <= RETRY_ATTEMPTS; attempt += 1) {
    try {
      const result = await getClient().query<TData, TVariables>({
        ...options,
        errorPolicy: "all",
      });

      if (result.error) {
        logGraphQLError(`${scope} (attempt ${attempt + 1})`, result.error);
      }

      return {
        data: result.data ?? fallbackData,
        hasError: Boolean(result.error),
      };
    } catch (error) {
      logGraphQLError(`${scope} (attempt ${attempt + 1})`, error);

      return {
        data: fallbackData,
        hasError: true,
      };
    }
  }

  return {
    data: fallbackData,
    hasError: true,
  };
}
