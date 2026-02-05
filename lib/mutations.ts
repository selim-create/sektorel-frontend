import { gql } from "@apollo/client";

// Giriş Yap (JWT Token Alır)
export const LOGIN_MUTATION = gql`
  mutation LoginUser($username: String!, $password: String!) {
    login(input: { clientMutationId: "uniqueId", username: $username, password: $password }) {
      authToken
      refreshToken
      user {
        id
        name
        email
      }
    }
  }
`;

// Kayıt Ol
export const REGISTER_MUTATION = gql`
  mutation RegisterUser(
    $email: String!, 
    $password: String!, 
    $firstName: String!, 
    $phone: String!, 
    $accountType: String!, 
    $companyName: String = "", 
    $taxOffice: String = "", 
    $taxNumber: String = "", 
    $sector: String = ""
  ) {
    registerSektorelUser(input: {
      clientMutationId: "uniqueId", 
      email: $email, 
      password: $password, 
      firstName: $firstName, 
      phone: $phone, 
      accountType: $accountType, 
      companyName: $companyName, 
      taxOffice: $taxOffice, 
      taxNumber: $taxNumber, 
      sector: $sector
    }) {
      success
      message
      userId
    }
  }
`;

// YENİ: Firma Ekleme (Güncellendi: postalCode eklendi)
export const CREATE_COMPANY_MUTATION = gql`
  mutation SubmitCompany(
    $title: String!,
    $officialName: String,
    $sector: String,
    $companyType: String,
    $description: String,
    $email: String,
    $phone: String,
    $website: String,
    $city: String,
    $district: String,
    $postalCode: String,
    $address: String
  ) {
    submitCompany(input: {
      clientMutationId: "submitComp",
      title: $title,
      officialName: $officialName,
      sector: $sector,
      companyType: $companyType,
      description: $description,
      email: $email,
      phone: $phone,
      website: $website,
      city: $city,
      district: $district,
      postalCode: $postalCode,
      address: $address
    }) {
      success
      message
      postId
    }
  }
`;