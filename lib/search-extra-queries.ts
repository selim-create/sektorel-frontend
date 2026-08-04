import { gql } from "@apollo/client";

export const SEARCH_SECTORS = gql`
  query SearchSectors($search: String!) {
    sectors(
      first: 10
      where: { search: $search, orderby: NAME, order: ASC, hideEmpty: false }
    ) {
      nodes {
        id
        databaseId
        name
        slug
        description
        count
        sectorDetails {
          iconName
          color
          featuredImage
        }
      }
    }
  }
`;

export const SEARCH_LEADS = gql`
  query SearchLeads($search: String!) {
    leads(first: 10, where: { search: $search, orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        date
        leadDetails {
          leadType
          status
          budgetString
          expiryDate
          deliveryLocation
          isPremium
          offerCount
        }
        sectors {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;
