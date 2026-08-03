import { ApolloLink, HttpLink, type OperationVariables, type QueryOptions } from "@apollo/client";
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";
import { createApolloErrorLink, GRAPHQL_ENDPOINT, logGraphQLError } from "@/lib/error-handler";

const RETRY_ATTEMPTS = 2;
const RETRY_BASE_DELAY_MS = 250;

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
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

      if (!result.error || attempt === RETRY_ATTEMPTS) {
        if (result.error) {
          logGraphQLError(`${scope} (attempt ${attempt + 1})`, result.error);
        }

        return {
          data: result.data ?? fallbackData,
          hasError: Boolean(result.error),
        };
      }

      logGraphQLError(`${scope} (attempt ${attempt + 1})`, result.error);
    } catch (error) {
      if (attempt === RETRY_ATTEMPTS) {
        logGraphQLError(`${scope} (attempt ${attempt + 1})`, error);

        return {
          data: fallbackData,
          hasError: true,
        };
      }

      logGraphQLError(`${scope} (attempt ${attempt + 1})`, error);
    }

    await sleep(RETRY_BASE_DELAY_MS * 2 ** attempt);
  }

  return {
    data: fallbackData,
    hasError: true,
  };
}
