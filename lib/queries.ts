import { gql } from "@apollo/client";

// --- SEKTÖRLER ---
export const GET_ALL_SECTORS = gql`
  query GetAllSectors {
    sectors(first: 100, where: { parent: 0, orderby: COUNT, order: DESC }) {
      nodes {
        id
        name
        slug
        count
        sectorDetails {
          icon
          iconName
          color
          featuredImage
        }
        children {
          nodes {
            id
            name
            slug
          }
        }
      }
    }
  }
`;

// --- FİRMALAR ---
export const GET_COMPANIES = gql`
  query GetCompanies {
    companies(first: 50, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        content
        companyDetails {
          isVerified
          email
          phone
          address
          mapLat
          mapLng
          coverImage
        }
        featuredImage {
          node {
            sourceUrl
          }
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
      }
    }
  }
`;

export const GET_COMPANIES_PAGINATED = gql`
  query GetCompaniesPaginated($first: Int = 50, $after: String, $search: String) {
    companies(
      first: $first
      after: $after
      where: { search: $search, orderby: { field: DATE, order: DESC } }
    ) {
      nodes {
        id
        title
        slug
        content
        date
        companyDetails {
          isVerified
          email
          phone
          address
          mapLat
          mapLng
          coverImage
          website
        }
        featuredImage {
          node {
            sourceUrl
          }
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
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

// --- ETKİNLİKLER (AJANDA) ---
export const GET_EVENTS = gql`
  query GetEvents {
    events(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
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
          price
          organizer
        }
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

export const GET_EVENTS_PAGINATED = gql`
  query GetEventsPaginated($first: Int = 100, $after: String) {
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

// --- TALEPLER (LEADS) ---
export const GET_LEADS = gql`
  query GetLeads {
    leads(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
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
          isHiddenName
          viewCount
          offerCount
        }
        sectors {
          nodes {
            name
          }
        }
      }
    }
  }
`;

// --- İŞ İLANLARI (KARİYER) - YENİ ---
export const GET_JOBS = gql`
  query GetJobs {
    jobs(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        date
        jobDetails {
          companyName
          location
          workType
          experience
          isFeatured
          deadline
        }
      }
    }
  }
`;

// --- HABERLER ---
export const GET_ALL_POSTS = gql`
  query GetAllPosts($after: String) {
    posts(first: 50, after: $after, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        excerpt
        date
        content
        featuredImage {
          node {
            sourceUrl
          }
        }
        categories {
          nodes {
            id
            name
            slug
          }
        }
        author {
          node {
            name
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
    categories(first: 50, where: { orderby: COUNT, order: DESC, hideEmpty: true }) {
      nodes {
        id
        name
        slug
        count
      }
    }
  }
`;

// --- ARAMA: FİRMALAR ---
export const SEARCH_COMPANIES = gql`
  query SearchCompanies($search: String!) {
    companies(first: 10, where: { search: $search, orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        companyDetails {
          isVerified
          address
        }
        featuredImage {
          node {
            sourceUrl
          }
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
      }
    }
  }
`;

// --- ARAMA: HABERLER ---
export const SEARCH_POSTS = gql`
  query SearchPosts($search: String!) {
    posts(first: 10, where: { search: $search, orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        excerpt
        date
        featuredImage {
          node {
            sourceUrl
          }
        }
        categories {
          nodes {
            id
            name
            slug
          }
        }
      }
    }
  }
`;

// --- ARAMA: ETKİNLİKLER ---
export const SEARCH_EVENTS = gql`
  query SearchEvents($search: String!) {
    events(first: 10, where: { search: $search, orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        eventDetails {
          eventType
          startDate
          venue
          organizer
        }
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

// --- ARAMA: İŞ İLANLARI ---
export const SEARCH_JOBS = gql`
  query SearchJobs($search: String!) {
    jobs(first: 10, where: { search: $search, orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        date
        jobDetails {
          companyName
          location
          workType
          deadline
        }
      }
    }
  }
`;

export const GET_JOB_DATA = gql`
  query GetJobData($slug: ID!) {
    job(id: $slug, idType: SLUG) {
      id
      title
      slug
      date
      content
      jobDetails {
        companyName
        location
        workType
        experience
        education
        salary
        deadline
        isFeatured
      }
    }
  }
`;