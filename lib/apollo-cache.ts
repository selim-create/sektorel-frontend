import { InMemoryCache } from "@apollo/client-integration-nextjs";

export function createApolloCache() {
  return new InMemoryCache({
    typePolicies: {
      Event: {
        fields: {
          eventDetails: {
            merge: true,
          },
        },
      },
      Company: {
        fields: {
          companyDetails: {
            merge: true,
          },
        },
      },
      Lead: {
        fields: {
          leadDetails: {
            merge: true,
          },
        },
      },
      Job: {
        fields: {
          jobDetails: {
            merge: true,
          },
        },
      },
      Sector: {
        fields: {
          sectorDetails: {
            merge: true,
          },
        },
      },
    },
  });
}
