import { gql } from "@apollo/client";

export const GET_AGENDA_EVENTS_PAGINATED = gql`
  query GetAgendaEventsPaginated($first: Int = 100, $after: String) {
    events(first: $first, after: $after, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        content
        date
        eventDetails {
          eventType
          isOfficial
          startDate
          endDate
          locationType
          venue
          address
          price
          organizer
          registrationLink
          officialCategory
          officialInstitution
          officialSourceUrl
        }
        sectors {
          nodes {
            name
            slug
          }
        }
        locations {
          nodes {
            name
            slug
          }
        }
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;
