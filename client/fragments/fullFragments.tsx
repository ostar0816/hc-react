import gql from 'graphql-tag';

export const referringPhysicianFragment = gql`
  fragment FullFragment_referringPhysician on ReferringPhysician {
    _id
    name
    physicianUid
    email
    phone
    fax
    dicomValue
  }
`;

export const facilityFragment = gql`
  fragment FullFragment_Facility on Facility {
    _id
    institutionName
    address
    city
    state
    zip
    websiteUrl
    faxNumber
    phoneNumber
    email
  }
`;

export const userRoleFullFragment = gql`
  fragment FullFragment_UserRole on UserRole {
    _id
    name
    description
    permissions
  }
`;

export const userFullFragment = gql`
  fragment FullFragment_User on User {
    _id
    firstName
    lastName
    email
    workspaces {
      _id
    }
    worklists {
      _id
    }
    userRole {
      ...FullFragment_UserRole
    }
  }
  ${userRoleFullFragment}
`;

export const reportTemplateFullFragment = gql`
  fragment FullFragment_ReportTemplate on ReportTemplate {
    _id
    name
    description
    template
  }
`;

export const studyDescriptionFullFragment = gql`
  fragment FullFragment_StudyDescription on StudyDescription {
    _id
    name
    modality
    contrast
    reportTemplate {
      ...FullFragment_ReportTemplate
    }
  }
  ${reportTemplateFullFragment}
`;
