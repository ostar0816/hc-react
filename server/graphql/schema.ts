import { GraphQLDateTime, GraphQLDate } from 'graphql-iso-date';
import GraphQLJSON from 'graphql-type-json';
import StudyTableColumns from '../constants/studyTableColumns';
import { resolveViewerType, GraphQLObjectId } from './helpers';
import { gql } from 'apollo-server';

import { viewerResolvers } from './resolvers/viewer';
import { userResolvers } from './resolvers/user';
import { studyResolvers } from './resolvers/study';
import { worklistResolvers } from './resolvers/worklist';
import { studyDescriptionResolvers } from './resolvers/studyDescription';
import { facilityResolvers } from './resolvers/facility';
import { studyNoteMessageResolvers } from './resolvers/studyNoteMessage';

import { mutationResolvers } from './resolvers/mutation';

import { GQLResolver } from './types';

export const typeDefs = gql`
  scalar DateTime
  scalar Date
  scalar JSON
  scalar ObjectId

  enum PermissionEnum {
    LIST_ALL_STUDIES
    LIST_ALLOWED_STUDIES
    LIST_STUDIES_ASSIGNED_TO_ME
    ASSIGN_STUDY
    CONFIRM_STUDY
    OPEN_REPORT_WINDOW
    SIGN_OFF_STUDY
    RESOLVE_SUPPORT_REQUEST
  }

  enum ContrastEnum {
    NA
    W
    WO
    W_WO
  }

  enum ContrastPresentEnum {
    NOT_SELECTED
    YES
    NO
  }

  enum ContrastRequirementsEnum {
    NEVER_SEEN
    OPTIONAL
    REQUIRED
  }
  
  enum ModalityEnum {
    CT
    MR
    CR
    DX
    XR
    US
    PET
    MG
    NM
  }

  enum ReadTypeEnum {
    PRELIM
    PRELIM_OR_FINAL
    FINAL
  }

  enum StudyStatusEnum {
    NEW
    CONFIRMED
    ASSIGNED
    SIGNED_OFF
  }

  enum StudyPriorityEnum {
    STAT
    URGENT
    CRITICAL
    ROUTINE
    STROKE
  }

  enum StudyLateralityEnum {
    NOT_SELECTED
    LEFT
    RIGHT
  }

  enum AssignPriorityEnum {
    ZERO
    PLUS_ONE
    PLUS_TWO
    MINUS_ONE
    MINUS_TWO
    NEVER
  }

  enum NoteTypeEnum {
    SUPPORT_STUDY_REQUEST
    SUPPORT_URGENCY_REQUEST
  }

  enum StudySupportRequestStatusEnum {
    NONE
    PENDING
    RESOLVED
  }

  type AssignOption {
    radiologist: User!
    assignPriority: AssignPriorityEnum!
  }

  type Study {
    _id: ObjectId!
    canBeAssignedTo: [AssignOption]
    assignedTo: User
    contrastPresent: ContrastPresentEnum
    contrastType: String
    studyDescription: StudyDescription
    facility: Facility
    referringPhysicians: [ReferringPhysician]
    priorStudies: [Study]!
    notes: [StudyNote]
    report: Report
    addendums: [Report!]!
    ${Object.keys(StudyTableColumns).map(
      columnKey => `${columnKey}: ${StudyTableColumns[columnKey].type}`,
    )}
  }
  
  type StudySearchResult {
    totalCount: Int!
    studies: [Study]
  }

  enum FilterEnum {
    CONTAINS_STRING
    EQUAL_NUMBER
    DATE_RANGE
    DATE_PRESET
  }

  input SearchFilterInput {
    columnName: String!
    type: FilterEnum!
    stringValue: String
    numberValue: Float
    startDate: Date
    endDate: Date
    datePreset: String
  }
  
  input SearchSortInput {
    columnName: String!
    order: Int
  }

  type StudyNoteMessage {
    createdBy: User!
    createdTime: DateTime
    text: String
  }

  type StudyNote {
    _id: ObjectId!
    type: NoteTypeEnum
    title: String!
    messages: [StudyNoteMessage]!
    resolved: Boolean
  }

  type Filter {
    type: FilterEnum!
    stringValue: String
    numberValue: Float
    startDate: Date
    endDate: Date
    datePreset: String
  }

  type Column {
    key: String!
    width: Int!
    filter: Filter
  }

  type SortType {
    order: Int!
    columnName: String!
  }

  type StudyDescription {
    _id: ObjectId!
    name: String!
    modality: ModalityEnum
    contrast: ContrastEnum
    reportTemplate: ReportTemplate
  }
  
  type ReportTemplate {
    _id: ObjectId!
    name: String!
    description: String!
    template: JSON!
  }

  type Report {
    content: JSON!
    signedOffDate: DateTime
  }


  type Worklist {
    _id: ObjectId!
    name: String!
    displayOnTop: Boolean!
    description: String
    sorting: [SortType]
    columns: [Column]
    totalCount: Int
  }
  
  type Workspace {
    _id: ObjectId!
    layout: JSON
  }

  type AssignPriority {
    studyDescriptionNameRegex: String!
    studyDescriptionModalityRegex: String!
    facilityNameRegex: String!
    studyPriorityRegex: String!
    assignPriority: AssignPriorityEnum!
  }
  
  type User {
    _id: ObjectId!
    firstName: String
    lastName: String
    email: String!
    workspaces: [Workspace]
    worklists: [Worklist]
    userRole: UserRole
    assignedFacilities: [Facility]!
    allowedFacilities: [Facility]!
    assignPriorities: [AssignPriority]
    pendingStudies: [Study]
    online: Boolean!
    radiologyCapacity: Int
  }
  
  type UserRole {
    _id: ObjectId!
    name: String!
    description: String!
    permissions: [PermissionEnum]
  }
  
  type ReferringPhysician {
    _id: ObjectId!
    physicianUid: String!
    name: String!
    email: String!
    phone: String!
    fax: String
    dicomValue: String
  } 
  
  type FacilityDicomDetails {
    AETitle: String
  }
  
  type TATLimit {
    timeSeconds: Int!
    studyPriority: StudyPriorityEnum!
  }

  input TATLimitInput {
    timeSeconds: Int!
    studyPriority: StudyPriorityEnum!
  }

  type FacilityTechConf {
    contrastRequirements: [ContrastRequirement!]!
    readType: ReadTypeEnum
    tatLimits: [TATLimit!]!
  }
  
  type Facility {
    _id: ObjectId!
    institutionName: String!
    address: String
    city: String
    state: String
    zip: String
    websiteUrl: String
    faxNumber: String
    phoneNumber: String
    email: String
    dicomDetails: FacilityDicomDetails
    techConf: FacilityTechConf
    referringPhysicians: [ReferringPhysician]
  }
  
  
  type Viewer {
    _id: ObjectId!
    user: User
    studyDescriptions: [StudyDescription]
    facilities: [Facility]
    reportTemplates: [ReportTemplate]
    userRoles: [UserRole]
    users: [User]
    searchFacilityById(facilityId: ObjectId): Facility
    searchStudies(skip: Int!, limit: Int!, sorting: [SearchSortInput], filters: [SearchFilterInput]): StudySearchResult
    searchStudyById(studyId: ObjectId): Study
    searchUserById(userId: ObjectId): User

  }
  
  type Query {
    viewer: Viewer
  }
  
  input ColumnInput {
    key: String!
    width: Int!
    filter: FilterInput
  }
  
  input FilterInput {
    type: FilterEnum!
    stringValue: String
    numberValue: Float
    startDate: Date
    endDate: Date
    datePreset: String
  }
  
  input SortInput {
    columnName: String!
    order: Int!
  }

  input ContrastRequirementsInput {
    modality: ModalityEnum!
    requirement: ContrastRequirementsEnum!
  }

  type ContrastRequirement {
    modality: ModalityEnum!
    requirement: ContrastRequirementsEnum!
  }
  
  input UserRolePermissionsInput {
    userRoleId: ObjectId!
    permissions: [PermissionEnum]!
  }

  input AssignPriorityInput {
    studyDescriptionNameRegex: String!
    studyDescriptionModalityRegex: String!
    facilityNameRegex: String!
    studyPriorityRegex: String!
    assignPriority: AssignPriorityEnum!
  }


  type Mutation {
    login (
      email: String!
      password: String!  
    ) : Query
    
    logout : Query
    
    addWorklist (
      name: String!
      description: String!
      sorting: [SortInput]!
      columns: [ColumnInput]!
    ): Query
    
    updateWorklist (
      worklistId: ObjectId!
      sorting: [SortInput]!
      columns: [ColumnInput]!
    ): Query

    updateWorklistDisplayOnTop (
      worklistId: ObjectId!
      displayOnTop: Boolean!
    ): Query

    deleteWorklist (
      worklistId: ObjectId!
    ) : Query

    updateWorkspace (
      workspaceId: ObjectId!
      layout: JSON!
    ) : Query
    
    addStudyDescription (
      name: String!
      modality: ModalityEnum!
      reportTemplateId: ObjectId
      contrast: ContrastEnum!
    ) : Query
    
    deleteStudyDescription (
      studyDescriptionId: ObjectId!
    ) : Query
    
    updateStudyDescription (
      studyDescriptionId: ObjectId!
      name: String!
      modality: ModalityEnum!
      contrast: ContrastEnum!
      reportTemplateId: ObjectId
    ) : StudyDescription
    
    addReportTemplate (
      name: String!
      description: String!
      template: JSON!
    ) : Query
    
    updateReportTemplate (
      reportTemplateId: ObjectId!
      name: String!
      description: String!
      template: JSON!
    ) : ReportTemplate
    
    addUserRole (
      name: String!
      description: String!
    ) : Query
    
    updateUserRole (
      userRoleId: ObjectId!
      name: String!
      description: String!
    ) : UserRole

    addUser (
      firstName: String!
      lastName: String!
      email: String!
      password: String!
      userRoleId: ObjectId!
    ) : Query
    
    updateUser(
      userId: ObjectId!
      email: String!
      firstName: String!
      lastName: String!
      password: String
      userRoleId: ObjectId!
    ) : User
  
    updateUserRolePermissions(
      userRolePermissions: [UserRolePermissionsInput]
    ) : Query

    deleteReportTemplate (
      reportTemplateId: ObjectId!
    ) : Query

    addFacility (
      institutionName: String!
      address: String!
      city: String!
      state: String!
      zip: String!
      websiteUrl: String!
      faxNumber: String!
      phoneNumber: String!
      email: String!
    ) : Query
    
    updateFacility (
      facilityId: ObjectId!
      institutionName: String!
      address: String!
      city: String!
      state: String!
      zip: String!
      websiteUrl: String!
      faxNumber: String!
      phoneNumber: String!
      email: String!
    ) : Facility
    
    deleteFacility (
      facilityId: ObjectId!
    ) : Query
    
    addReferringPhysician (
      facilityId: ObjectId!
      physicianUid: String!
      name: String!
      email: String!
      phone: String!
      fax: String!
      dicomValue: String!
    ) : Facility
        
    updateReferringPhysician (
      referringPhysicianId: ObjectId!
      physicianUid: String!
      name: String!
      email: String!
      phone: String!
      fax: String!
      dicomValue: String!
    ) : ReferringPhysician
        
    deleteReferringPhysician (
      referringPhysicianId: ObjectId!
    ) : Facility
        
    updateFacilityTechConf (
      facilityId: ObjectId!
      contrastRequirements: [ContrastRequirementsInput]!
      readType: ReadTypeEnum!
      tatLimits: [TATLimitInput!]!
    ) : Facility
    
    updateFacilityDicomDetails (
      facilityId: ObjectId!
      AETitle: String!
    ) : Facility
    
    confirmStudy(
      studyId: ObjectId!
      patientName: String!
      patientId: String!
      patientDOB: Date!,
      patientSex: String!
      studyDescriptionId: ObjectId!
      contrastPresent: ContrastPresentEnum!
      contrastType: String!
      studyPriority: StudyPriorityEnum!
      laterality: StudyLateralityEnum!
      readType: ReadTypeEnum!
      history: String!
      referringPhysicianIds: [ObjectId!]!
    ) : Study

    updateAssignPriorities(
      userId: ObjectId!
      assignPriorities: [AssignPriorityInput]!
    ) : User

    assignStudiesToRadiologist(
      radiologistId: ObjectId!
      studyIds: [ObjectId!]!
    ) : User

    updateAllowedFacilitiesForUser(userId: ObjectId!, facilityIds: [ObjectId!]!) : User
    signOffReport(studyId: ObjectId!, content: JSON!) : Study
    signOffAddendum(studyId: ObjectId!, content: JSON!) : Study

    addStudyNote(studyId: ObjectId!, title: String!, text: String!, type: NoteTypeEnum) : Study
    addStudyNoteMessage(studyId: ObjectId!, noteId: ObjectId!, text: String!, resolved: Boolean) : Study

    updateStudyFacility(studyIds: [ObjectId!]!, facilityId: ObjectId!) : [Study!]!
  }

`;

const queryResolvers = {
  viewer: resolveViewerType,
};

export const resolvers: GQLResolver = {
  Query: queryResolvers,
  Viewer: viewerResolvers,
  User: userResolvers,
  Study: studyResolvers,
  Worklist: worklistResolvers,
  Facility: facilityResolvers,
  StudyDescription: studyDescriptionResolvers,
  StudyNoteMessage: studyNoteMessageResolvers,
  Mutation: mutationResolvers,
  DateTime: GraphQLDateTime,
  Date: GraphQLDate,
  JSON: GraphQLJSON,
  ObjectId: GraphQLObjectId,
};
