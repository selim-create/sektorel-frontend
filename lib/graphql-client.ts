import { HttpLink } from "@apollo/client";
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";

// WordPress GraphQL Endpoint'iniz (Lokal veya Canlı)
const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "http://api.sektorelajanda.com/graphql";

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: GRAPHQL_ENDPOINT,
      // Gerekirse auth headerları buraya eklenebilir
    }),
  });
});