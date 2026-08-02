import { ApolloLink, HttpLink, type OperationVariables, type QueryOptions } from "@apollo/client";
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";
import { createApolloErrorLink, GRAPHQL_ENDPOINT, logGraphQLError } from "@/lib/error-handler";

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
        // Gerekirse auth headerları buraya eklenebilir
      }),
    ]),
  });
});

export async function queryWithFallback<TData, TVariables extends OperationVariables = OperationVariables>(
  options: QueryOptions<TVariables, TData>,
  fallbackData: TData,
  scope = "query",
) {
  try {
    const result = await getClient().query<TData, TVariables>({
      ...options,
      errorPolicy: "all",
    });

    if (result.error) {
      logGraphQLError(scope, result.error);
    }

    return {
      data: result.data ?? fallbackData,
      hasError: Boolean(result.error),
    };
  } catch (error) {
    logGraphQLError(scope, error);

    return {
      data: fallbackData,
      hasError: true,
    };
  }
}