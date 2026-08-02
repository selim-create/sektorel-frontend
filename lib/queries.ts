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

// --- ETKİNLİKLER (AJANDA) ---
export const GET_EVENTS = gql`
  query GetEvents {
    events(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        content
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