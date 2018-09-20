

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AdminFacilities_root
// ====================================================

export interface AdminFacilities_root_viewer_facilities {
  _id: any;
  institutionName: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  websiteUrl: string | null;
  faxNumber: string | null;
  phoneNumber: string | null;
  email: string | null;
}

export interface AdminFacilities_root_viewer {
  _id: any;
  facilities: (AdminFacilities_root_viewer_facilities | null)[] | null;
}

export interface AdminFacilities_root {
  viewer: AdminFacilities_root_viewer | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FacilityEdit_root
// ====================================================

export interface FacilityEdit_root_viewer_searchFacility_dicomDetails {
  AETitle: string | null;
}

export interface FacilityEdit_root_viewer_searchFacility_techConf_contrastRequirements {
  requirement: ContrastRequirementsEnum;
  modality: ModalityEnum;
}

export interface FacilityEdit_root_viewer_searchFacility_techConf_tatLimits {
  timeSeconds: number;
  studyPriority: StudyPriorityEnum;
}

export interface FacilityEdit_root_viewer_searchFacility_techConf {
  contrastRequirements: FacilityEdit_root_viewer_searchFacility_techConf_contrastRequirements[];
  readType: ReadTypeEnum | null;
  tatLimits: FacilityEdit_root_viewer_searchFacility_techConf_tatLimits[];
}

export interface FacilityEdit_root_viewer_searchFacility {
  _id: any;
  institutionName: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  websiteUrl: string | null;
  faxNumber: string | null;
  phoneNumber: string | null;
  email: string | null;
  dicomDetails: FacilityEdit_root_viewer_searchFacility_dicomDetails | null;
  techConf: FacilityEdit_root_viewer_searchFacility_techConf | null;
}

export interface FacilityEdit_root_viewer {
  _id: any;
  searchFacility: FacilityEdit_root_viewer_searchFacility | null;
}

export interface FacilityEdit_root {
  viewer: FacilityEdit_root_viewer | null;
}

export interface FacilityEdit_rootVariables {
  facilityId?: any | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateFacilityDicomDetails
// ====================================================

export interface updateFacilityDicomDetails_updateFacilityDicomDetails_dicomDetails {
  AETitle: string | null;
}

export interface updateFacilityDicomDetails_updateFacilityDicomDetails {
  _id: any;
  dicomDetails: updateFacilityDicomDetails_updateFacilityDicomDetails_dicomDetails | null;
}

export interface updateFacilityDicomDetails {
  updateFacilityDicomDetails: updateFacilityDicomDetails_updateFacilityDicomDetails | null;
}

export interface updateFacilityDicomDetailsVariables {
  facilityId: any;
  AETitle: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateFacility
// ====================================================

export interface updateFacility_updateFacility {
  _id: any;
  institutionName: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  websiteUrl: string | null;
  faxNumber: string | null;
  phoneNumber: string | null;
  email: string | null;
}

export interface updateFacility {
  updateFacility: updateFacility_updateFacility | null;
}

export interface updateFacilityVariables {
  facilityId: any;
  institutionName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  websiteUrl: string;
  faxNumber: string;
  phoneNumber: string;
  email: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateFacilityTechConf
// ====================================================

export interface updateFacilityTechConf_updateFacilityTechConf_techConf_contrastRequirements {
  requirement: ContrastRequirementsEnum;
  modality: ModalityEnum;
}

export interface updateFacilityTechConf_updateFacilityTechConf_techConf_tatLimits {
  timeSeconds: number;
  studyPriority: StudyPriorityEnum;
}

export interface updateFacilityTechConf_updateFacilityTechConf_techConf {
  contrastRequirements: updateFacilityTechConf_updateFacilityTechConf_techConf_contrastRequirements[];
  readType: ReadTypeEnum | null;
  tatLimits: updateFacilityTechConf_updateFacilityTechConf_techConf_tatLimits[];
}

export interface updateFacilityTechConf_updateFacilityTechConf {
  _id: any;
  techConf: updateFacilityTechConf_updateFacilityTechConf_techConf | null;
}

export interface updateFacilityTechConf {
  updateFacilityTechConf: updateFacilityTechConf_updateFacilityTechConf | null;
}

export interface updateFacilityTechConfVariables {
  facilityId: any;
  contrastRequirements: ContrastRequirementsInput[];
  readType: ReadTypeEnum;
  tatLimits: TATLimitInput[];
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: addFacility
// ====================================================

export interface addFacility_addFacility_viewer_facilities {
  _id: any;
  institutionName: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  websiteUrl: string | null;
  faxNumber: string | null;
  phoneNumber: string | null;
  email: string | null;
}

export interface addFacility_addFacility_viewer {
  _id: any;
  facilities: (addFacility_addFacility_viewer_facilities | null)[] | null;
}

export interface addFacility_addFacility {
  viewer: addFacility_addFacility_viewer | null;
}

export interface addFacility {
  addFacility: addFacility_addFacility | null;
}

export interface addFacilityVariables {
  institutionName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  websiteUrl: string;
  faxNumber: string;
  phoneNumber: string;
  email: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateUserRolePermissions
// ====================================================

export interface updateUserRolePermissions_updateUserRolePermissions_viewer_userRoles {
  _id: any;
  name: string;
  permissions: (PermissionEnum | null)[] | null;
}

export interface updateUserRolePermissions_updateUserRolePermissions_viewer {
  userRoles: (updateUserRolePermissions_updateUserRolePermissions_viewer_userRoles | null)[] | null;
}

export interface updateUserRolePermissions_updateUserRolePermissions {
  viewer: updateUserRolePermissions_updateUserRolePermissions_viewer | null;
}

export interface updateUserRolePermissions {
  updateUserRolePermissions: updateUserRolePermissions_updateUserRolePermissions | null;
}

export interface updateUserRolePermissionsVariables {
  userRolePermissions: (UserRolePermissionsInput | null)[];
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AdminPermission_root
// ====================================================

export interface AdminPermission_root_viewer_userRoles {
  _id: any;
  name: string;
  permissions: (PermissionEnum | null)[] | null;
}

export interface AdminPermission_root_viewer {
  _id: any;
  userRoles: (AdminPermission_root_viewer_userRoles | null)[] | null;
}

export interface AdminPermission_root {
  viewer: AdminPermission_root_viewer | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: addReportTemplate
// ====================================================

export interface addReportTemplate_addReportTemplate_viewer_reportTemplates {
  _id: any;
  name: string;
  description: string;
  template: any;
}

export interface addReportTemplate_addReportTemplate_viewer {
  _id: any;
  reportTemplates: (addReportTemplate_addReportTemplate_viewer_reportTemplates | null)[] | null;
}

export interface addReportTemplate_addReportTemplate {
  viewer: addReportTemplate_addReportTemplate_viewer | null;
}

export interface addReportTemplate {
  addReportTemplate: addReportTemplate_addReportTemplate | null;
}

export interface addReportTemplateVariables {
  name: string;
  description: string;
  template: any;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateReportTemplate
// ====================================================

export interface updateReportTemplate_updateReportTemplate {
  _id: any;
  name: string;
  description: string;
  template: any;
}

export interface updateReportTemplate {
  updateReportTemplate: updateReportTemplate_updateReportTemplate | null;
}

export interface updateReportTemplateVariables {
  reportTemplateId: any;
  name: string;
  description: string;
  template: any;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: deleteReportTemplate
// ====================================================

export interface deleteReportTemplate_deleteReportTemplate_viewer_reportTemplates {
  _id: any;
  name: string;
  description: string;
  template: any;
}

export interface deleteReportTemplate_deleteReportTemplate_viewer {
  _id: any;
  reportTemplates: (deleteReportTemplate_deleteReportTemplate_viewer_reportTemplates | null)[] | null;
}

export interface deleteReportTemplate_deleteReportTemplate {
  viewer: deleteReportTemplate_deleteReportTemplate_viewer | null;
}

export interface deleteReportTemplate {
  deleteReportTemplate: deleteReportTemplate_deleteReportTemplate | null;
}

export interface deleteReportTemplateVariables {
  reportTemplateId: any;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AdminReportTemplate_root
// ====================================================

export interface AdminReportTemplate_root_viewer_reportTemplates {
  _id: any;
  name: string;
  description: string;
  template: any;
}

export interface AdminReportTemplate_root_viewer {
  _id: any;
  reportTemplates: (AdminReportTemplate_root_viewer_reportTemplates | null)[] | null;
}

export interface AdminReportTemplate_root {
  viewer: AdminReportTemplate_root_viewer | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: addStudyDescription
// ====================================================

export interface addStudyDescription_addStudyDescription_viewer_studyDescriptions_reportTemplate {
  _id: any;
  name: string;
  description: string;
  template: any;
}

export interface addStudyDescription_addStudyDescription_viewer_studyDescriptions {
  _id: any;
  name: string;
  modality: ModalityEnum | null;
  contrast: ContrastEnum | null;
  reportTemplate: addStudyDescription_addStudyDescription_viewer_studyDescriptions_reportTemplate | null;
}

export interface addStudyDescription_addStudyDescription_viewer {
  _id: any;
  studyDescriptions: (addStudyDescription_addStudyDescription_viewer_studyDescriptions | null)[] | null;
}

export interface addStudyDescription_addStudyDescription {
  viewer: addStudyDescription_addStudyDescription_viewer | null;
}

export interface addStudyDescription {
  addStudyDescription: addStudyDescription_addStudyDescription | null;
}

export interface addStudyDescriptionVariables {
  name: string;
  modality: ModalityEnum;
  contrast: ContrastEnum;
  reportTemplateId?: any | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateStudyDescription
// ====================================================

export interface updateStudyDescription_updateStudyDescription_reportTemplate {
  _id: any;
  name: string;
  description: string;
  template: any;
}

export interface updateStudyDescription_updateStudyDescription {
  _id: any;
  name: string;
  modality: ModalityEnum | null;
  contrast: ContrastEnum | null;
  reportTemplate: updateStudyDescription_updateStudyDescription_reportTemplate | null;
}

export interface updateStudyDescription {
  updateStudyDescription: updateStudyDescription_updateStudyDescription | null;
}

export interface updateStudyDescriptionVariables {
  studyDescriptionId: any;
  name: string;
  modality: ModalityEnum;
  contrast: ContrastEnum;
  reportTemplateId: any;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: deleteStudyDescription
// ====================================================

export interface deleteStudyDescription_deleteStudyDescription_viewer_studyDescriptions_reportTemplate {
  _id: any;
  name: string;
  description: string;
  template: any;
}

export interface deleteStudyDescription_deleteStudyDescription_viewer_studyDescriptions {
  _id: any;
  name: string;
  modality: ModalityEnum | null;
  contrast: ContrastEnum | null;
  reportTemplate: deleteStudyDescription_deleteStudyDescription_viewer_studyDescriptions_reportTemplate | null;
}

export interface deleteStudyDescription_deleteStudyDescription_viewer {
  _id: any;
  studyDescriptions: (deleteStudyDescription_deleteStudyDescription_viewer_studyDescriptions | null)[] | null;
}

export interface deleteStudyDescription_deleteStudyDescription {
  viewer: deleteStudyDescription_deleteStudyDescription_viewer | null;
}

export interface deleteStudyDescription {
  deleteStudyDescription: deleteStudyDescription_deleteStudyDescription | null;
}

export interface deleteStudyDescriptionVariables {
  studyDescriptionId: any;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AdminStudyDescription_root
// ====================================================

export interface AdminStudyDescription_root_viewer_studyDescriptions_reportTemplate {
  _id: any;
  name: string;
  description: string;
  template: any;
}

export interface AdminStudyDescription_root_viewer_studyDescriptions {
  _id: any;
  name: string;
  modality: ModalityEnum | null;
  contrast: ContrastEnum | null;
  reportTemplate: AdminStudyDescription_root_viewer_studyDescriptions_reportTemplate | null;
}

export interface AdminStudyDescription_root_viewer_reportTemplates {
  _id: any;
  name: string;
  description: string;
  template: any;
}

export interface AdminStudyDescription_root_viewer {
  _id: any;
  studyDescriptions: (AdminStudyDescription_root_viewer_studyDescriptions | null)[] | null;
  reportTemplates: (AdminStudyDescription_root_viewer_reportTemplates | null)[] | null;
}

export interface AdminStudyDescription_root {
  viewer: AdminStudyDescription_root_viewer | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: addUserRole
// ====================================================

export interface addUserRole_addUserRole_viewer_userRoles {
  _id: any;
  name: string;
  description: string;
  permissions: (PermissionEnum | null)[] | null;
}

export interface addUserRole_addUserRole_viewer {
  _id: any;
  userRoles: (addUserRole_addUserRole_viewer_userRoles | null)[] | null;
}

export interface addUserRole_addUserRole {
  viewer: addUserRole_addUserRole_viewer | null;
}

export interface addUserRole {
  addUserRole: addUserRole_addUserRole | null;
}

export interface addUserRoleVariables {
  name: string;
  description: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateUserRole
// ====================================================

export interface updateUserRole_updateUserRole {
  _id: any;
  name: string;
  description: string;
  permissions: (PermissionEnum | null)[] | null;
}

export interface updateUserRole {
  updateUserRole: updateUserRole_updateUserRole | null;
}

export interface updateUserRoleVariables {
  userRoleId: any;
  name: string;
  description: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AdminUserRoles_root
// ====================================================

export interface AdminUserRoles_root_viewer_userRoles {
  _id: any;
  name: string;
  description: string;
}

export interface AdminUserRoles_root_viewer {
  _id: any;
  userRoles: (AdminUserRoles_root_viewer_userRoles | null)[] | null;
}

export interface AdminUserRoles_root {
  viewer: AdminUserRoles_root_viewer | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AdminUsers_root
// ====================================================

export interface AdminUsers_root_viewer_users_userRole {
  _id: any;
  name: string;
}

export interface AdminUsers_root_viewer_users {
  _id: any;
  firstName: string | null;
  lastName: string | null;
  email: string;
  userRole: AdminUsers_root_viewer_users_userRole | null;
}

export interface AdminUsers_root_viewer {
  _id: any;
  users: (AdminUsers_root_viewer_users | null)[] | null;
}

export interface AdminUsers_root {
  viewer: AdminUsers_root_viewer | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: addUser
// ====================================================

export interface addUser_addUser_viewer_users_userRole {
  _id: any;
  name: string;
}

export interface addUser_addUser_viewer_users {
  _id: any;
  firstName: string | null;
  lastName: string | null;
  email: string;
  userRole: addUser_addUser_viewer_users_userRole | null;
}

export interface addUser_addUser_viewer {
  _id: any;
  users: (addUser_addUser_viewer_users | null)[] | null;
}

export interface addUser_addUser {
  viewer: addUser_addUser_viewer | null;
}

export interface addUser {
  addUser: addUser_addUser | null;
}

export interface addUserVariables {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userRoleId: any;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AdminUserPriorityForm_root
// ====================================================

export interface AdminUserPriorityForm_root_viewer_studyDescriptions {
  _id: any;
  name: string;
  modality: ModalityEnum | null;
}

export interface AdminUserPriorityForm_root_viewer_facilities {
  _id: any;
  institutionName: string;
}

export interface AdminUserPriorityForm_root_viewer {
  _id: any;
  studyDescriptions: (AdminUserPriorityForm_root_viewer_studyDescriptions | null)[] | null;
  facilities: (AdminUserPriorityForm_root_viewer_facilities | null)[] | null;
}

export interface AdminUserPriorityForm_root {
  viewer: AdminUserPriorityForm_root_viewer | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserEdit_root
// ====================================================

export interface UserEdit_root_viewer_searchUser_assignedFacilities {
  _id: any;
  institutionName: string;
  address: string | null;
  city: string | null;
  state: string | null;
  email: string | null;
  phoneNumber: string | null;
  faxNumber: string | null;
  websiteUrl: string | null;
}

export interface UserEdit_root_viewer_searchUser_assignPriorities {
  studyDescriptionNameRegex: string;
  studyDescriptionModalityRegex: string;
  facilityNameRegex: string;
  studyPriorityRegex: string;
  assignPriority: AssignPriorityEnum;
}

export interface UserEdit_root_viewer_searchUser_allowedFacilities {
  _id: any;
  institutionName: string;
  address: string | null;
  city: string | null;
  state: string | null;
  email: string | null;
  phoneNumber: string | null;
  faxNumber: string | null;
  websiteUrl: string | null;
}

export interface UserEdit_root_viewer_searchUser_workspaces {
  _id: any;
}

export interface UserEdit_root_viewer_searchUser_worklists {
  _id: any;
}

export interface UserEdit_root_viewer_searchUser_userRole {
  _id: any;
  name: string;
  description: string;
  permissions: (PermissionEnum | null)[] | null;
}

export interface UserEdit_root_viewer_searchUser {
  _id: any;
  assignedFacilities: (UserEdit_root_viewer_searchUser_assignedFacilities | null)[];
  assignPriorities: (UserEdit_root_viewer_searchUser_assignPriorities | null)[] | null;
  allowedFacilities: (UserEdit_root_viewer_searchUser_allowedFacilities | null)[];
  firstName: string | null;
  lastName: string | null;
  email: string;
  workspaces: (UserEdit_root_viewer_searchUser_workspaces | null)[] | null;
  worklists: (UserEdit_root_viewer_searchUser_worklists | null)[] | null;
  userRole: UserEdit_root_viewer_searchUser_userRole | null;
}

export interface UserEdit_root_viewer_userRoles {
  _id: any;
  name: string;
}

export interface UserEdit_root_viewer_facilities {
  _id: any;
  institutionName: string;
  address: string | null;
  city: string | null;
  state: string | null;
  email: string | null;
  phoneNumber: string | null;
  faxNumber: string | null;
  websiteUrl: string | null;
}

export interface UserEdit_root_viewer {
  _id: any;
  searchUser: UserEdit_root_viewer_searchUser | null;
  userRoles: (UserEdit_root_viewer_userRoles | null)[] | null;
  facilities: (UserEdit_root_viewer_facilities | null)[] | null;
}

export interface UserEdit_root {
  viewer: UserEdit_root_viewer | null;
}

export interface UserEdit_rootVariables {
  userId?: any | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateAllowedFacilitiesForUser
// ====================================================

export interface updateAllowedFacilitiesForUser_updateAllowedFacilitiesForUser_allowedFacilities {
  _id: any;
  institutionName: string;
  address: string | null;
  city: string | null;
  state: string | null;
  email: string | null;
  phoneNumber: string | null;
  faxNumber: string | null;
  websiteUrl: string | null;
}

export interface updateAllowedFacilitiesForUser_updateAllowedFacilitiesForUser {
  _id: any;
  allowedFacilities: (updateAllowedFacilitiesForUser_updateAllowedFacilitiesForUser_allowedFacilities | null)[];
}

export interface updateAllowedFacilitiesForUser {
  updateAllowedFacilitiesForUser: updateAllowedFacilitiesForUser_updateAllowedFacilitiesForUser | null;
}

export interface updateAllowedFacilitiesForUserVariables {
  userId: any;
  facilityIds: any[];
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateUser
// ====================================================

export interface updateUser_updateUser_workspaces {
  _id: any;
}

export interface updateUser_updateUser_worklists {
  _id: any;
}

export interface updateUser_updateUser_userRole {
  _id: any;
  name: string;
  description: string;
  permissions: (PermissionEnum | null)[] | null;
}

export interface updateUser_updateUser {
  _id: any;
  firstName: string | null;
  lastName: string | null;
  email: string;
  workspaces: (updateUser_updateUser_workspaces | null)[] | null;
  worklists: (updateUser_updateUser_worklists | null)[] | null;
  userRole: updateUser_updateUser_userRole | null;
}

export interface updateUser {
  updateUser: updateUser_updateUser | null;
}

export interface updateUserVariables {
  userId: any;
  firstName: string;
  lastName: string;
  email: string;
  password?: string | null;
  userRoleId: any;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserTabGeneralForm_root
// ====================================================

export interface UserTabGeneralForm_root_viewer_userRoles {
  _id: any;
  name: string;
}

export interface UserTabGeneralForm_root_viewer {
  _id: any;
  userRoles: (UserTabGeneralForm_root_viewer_userRoles | null)[] | null;
}

export interface UserTabGeneralForm_root {
  viewer: UserTabGeneralForm_root_viewer | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateAssignPriorities
// ====================================================

export interface updateAssignPriorities_updateAssignPriorities_assignPriorities {
  studyDescriptionNameRegex: string;
  studyDescriptionModalityRegex: string;
  facilityNameRegex: string;
  studyPriorityRegex: string;
  assignPriority: AssignPriorityEnum;
}

export interface updateAssignPriorities_updateAssignPriorities {
  _id: any;
  assignPriorities: (updateAssignPriorities_updateAssignPriorities_assignPriorities | null)[] | null;
}

export interface updateAssignPriorities {
  updateAssignPriorities: updateAssignPriorities_updateAssignPriorities | null;
}

export interface updateAssignPrioritiesVariables {
  userId: any;
  assignPriorities: (AssignPriorityInput | null)[];
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: appQuery
// ====================================================

export interface appQuery_viewer_user {
  _id: any;
}

export interface appQuery_viewer {
  _id: any;
  user: appQuery_viewer_user | null;
}

export interface appQuery {
  viewer: appQuery_viewer | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: logout
// ====================================================

export interface logout_logout_viewer_user {
  _id: any;
}

export interface logout_logout_viewer {
  _id: any;
  user: logout_logout_viewer_user | null;
}

export interface logout_logout {
  viewer: logout_logout_viewer | null;
}

export interface logout {
  logout: logout_logout | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: confirmStudy
// ====================================================

export interface confirmStudy_confirmStudy_studyDescription {
  _id: any;
}

export interface confirmStudy_confirmStudy_referringPhysicians {
  _id: any;
}

export interface confirmStudy_confirmStudy {
  _id: any;
  patientName: string | null;
  patientId: string | null;
  patientDOB: any | null;
  patientSex: string | null;
  contrastPresent: ContrastPresentEnum | null;
  contrastType: string | null;
  studyPriority: StudyPriorityEnum | null;
  readType: string | null;
  laterality: StudyLateralityEnum | null;
  history: string | null;
  studyDescription: confirmStudy_confirmStudy_studyDescription | null;
  referringPhysicians: (confirmStudy_confirmStudy_referringPhysicians | null)[] | null;
  studyStatus: StudyStatusEnum | null;
}

export interface confirmStudy {
  confirmStudy: confirmStudy_confirmStudy | null;
}

export interface confirmStudyVariables {
  studyId: any;
  patientName: string;
  patientId: string;
  patientDOB: any;
  patientSex: string;
  studyDescriptionId: any;
  contrastPresent: ContrastPresentEnum;
  contrastType: string;
  studyPriority: StudyPriorityEnum;
  laterality: StudyLateralityEnum;
  readType: ReadTypeEnum;
  history: string;
  referringPhysicianIds: any[];
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DBStudyConfirm_root
// ====================================================

export interface DBStudyConfirm_root_viewer_user_userRole {
  permissions: (PermissionEnum | null)[] | null;
}

export interface DBStudyConfirm_root_viewer_user {
  _id: any;
  userRole: DBStudyConfirm_root_viewer_user_userRole | null;
}

export interface DBStudyConfirm_root_viewer_searchStudy_studyDescription {
  _id: any;
}

export interface DBStudyConfirm_root_viewer_searchStudy_referringPhysicians {
  _id: any;
}

export interface DBStudyConfirm_root_viewer_searchStudy_facility_referringPhysicians {
  _id: any;
  name: string;
  physicianUid: string;
  phone: string;
  email: string;
  fax: string | null;
  dicomValue: string | null;
}

export interface DBStudyConfirm_root_viewer_searchStudy_facility_techConf_contrastRequirements {
  modality: ModalityEnum;
  requirement: ContrastRequirementsEnum;
}

export interface DBStudyConfirm_root_viewer_searchStudy_facility_techConf {
  contrastRequirements: DBStudyConfirm_root_viewer_searchStudy_facility_techConf_contrastRequirements[];
  readType: ReadTypeEnum | null;
}

export interface DBStudyConfirm_root_viewer_searchStudy_facility {
  _id: any;
  institutionName: string;
  referringPhysicians: (DBStudyConfirm_root_viewer_searchStudy_facility_referringPhysicians | null)[] | null;
  techConf: DBStudyConfirm_root_viewer_searchStudy_facility_techConf | null;
}

export interface DBStudyConfirm_root_viewer_searchStudy {
  _id: any;
  patientName: string | null;
  patientId: string | null;
  patientDOB: any | null;
  patientSex: string | null;
  contrastPresent: ContrastPresentEnum | null;
  contrastType: string | null;
  studyPriority: StudyPriorityEnum | null;
  readType: string | null;
  laterality: StudyLateralityEnum | null;
  history: string | null;
  studyDescription: DBStudyConfirm_root_viewer_searchStudy_studyDescription | null;
  referringPhysicians: (DBStudyConfirm_root_viewer_searchStudy_referringPhysicians | null)[] | null;
  facility: DBStudyConfirm_root_viewer_searchStudy_facility | null;
}

export interface DBStudyConfirm_root_viewer_studyDescriptions {
  _id: any;
  name: string;
  modality: ModalityEnum | null;
  contrast: ContrastEnum | null;
}

export interface DBStudyConfirm_root_viewer {
  _id: any;
  user: DBStudyConfirm_root_viewer_user | null;
  searchStudy: DBStudyConfirm_root_viewer_searchStudy | null;
  studyDescriptions: (DBStudyConfirm_root_viewer_studyDescriptions | null)[] | null;
}

export interface DBStudyConfirm_root {
  viewer: DBStudyConfirm_root_viewer | null;
}

export interface DBStudyConfirm_rootVariables {
  studyId?: any | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: addReferringPhysician
// ====================================================

export interface addReferringPhysician_addReferringPhysician_referringPhysicians {
  _id: any;
  name: string;
  physicianUid: string;
  email: string;
  phone: string;
  fax: string | null;
  dicomValue: string | null;
}

export interface addReferringPhysician_addReferringPhysician {
  _id: any;
  referringPhysicians: (addReferringPhysician_addReferringPhysician_referringPhysicians | null)[] | null;
}

export interface addReferringPhysician {
  addReferringPhysician: addReferringPhysician_addReferringPhysician | null;
}

export interface addReferringPhysicianVariables {
  facilityId: any;
  name: string;
  physicianUid: string;
  email: string;
  phone: string;
  fax: string;
  dicomValue: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateReferringPhysician
// ====================================================

export interface updateReferringPhysician_updateReferringPhysician {
  _id: any;
  name: string;
  physicianUid: string;
  email: string;
  phone: string;
  fax: string | null;
  dicomValue: string | null;
}

export interface updateReferringPhysician {
  updateReferringPhysician: updateReferringPhysician_updateReferringPhysician | null;
}

export interface updateReferringPhysicianVariables {
  referringPhysicianId: any;
  physicianUid: string;
  name: string;
  email: string;
  phone: string;
  fax: string;
  dicomValue: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: deleteReferringPhysician
// ====================================================

export interface deleteReferringPhysician_deleteReferringPhysician_referringPhysicians {
  _id: any;
  name: string;
  physicianUid: string;
  email: string;
  phone: string;
  fax: string | null;
  dicomValue: string | null;
}

export interface deleteReferringPhysician_deleteReferringPhysician {
  _id: any;
  referringPhysicians: (deleteReferringPhysician_deleteReferringPhysician_referringPhysicians | null)[] | null;
}

export interface deleteReferringPhysician {
  deleteReferringPhysician: deleteReferringPhysician_deleteReferringPhysician | null;
}

export interface deleteReferringPhysicianVariables {
  referringPhysicianId: any;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DBStudyReport_root
// ====================================================

export interface DBStudyReport_root_viewer_user_userRole {
  permissions: (PermissionEnum | null)[] | null;
}

export interface DBStudyReport_root_viewer_user_pendingStudies {
  _id: any;
}

export interface DBStudyReport_root_viewer_user {
  _id: any;
  userRole: DBStudyReport_root_viewer_user_userRole | null;
  pendingStudies: (DBStudyReport_root_viewer_user_pendingStudies | null)[] | null;
}

export interface DBStudyReport_root_viewer_searchStudy_studyDescription_reportTemplate {
  _id: any;
  template: any;
}

export interface DBStudyReport_root_viewer_searchStudy_studyDescription {
  _id: any;
  name: string;
  modality: ModalityEnum | null;
  reportTemplate: DBStudyReport_root_viewer_searchStudy_studyDescription_reportTemplate | null;
}

export interface DBStudyReport_root_viewer_searchStudy_report {
  content: any;
  signedOffDate: any | null;
}

export interface DBStudyReport_root_viewer_searchStudy_addendums {
  content: any;
}

export interface DBStudyReport_root_viewer_searchStudy_priorStudies_studyDescription {
  modality: ModalityEnum | null;
  name: string;
}

export interface DBStudyReport_root_viewer_searchStudy_priorStudies {
  _id: any;
  arriveTimeStart: any | null;
  studyDescription: DBStudyReport_root_viewer_searchStudy_priorStudies_studyDescription | null;
}

export interface DBStudyReport_root_viewer_searchStudy_notes_messages_createdBy {
  _id: any;
  firstName: string | null;
  lastName: string | null;
}

export interface DBStudyReport_root_viewer_searchStudy_notes_messages {
  createdBy: DBStudyReport_root_viewer_searchStudy_notes_messages_createdBy;
  createdTime: any | null;
  text: string | null;
}

export interface DBStudyReport_root_viewer_searchStudy_notes {
  _id: any;
  type: NoteTypeEnum | null;
  title: string;
  messages: (DBStudyReport_root_viewer_searchStudy_notes_messages | null)[];
  resolved: boolean | null;
}

export interface DBStudyReport_root_viewer_searchStudy {
  _id: any;
  patientName: string | null;
  patientSex: string | null;
  patientId: string | null;
  patientDOB: any | null;
  accessionNumber: string | null;
  history: string | null;
  facilityName: string | null;
  readType: string | null;
  arriveTimeStart: any | null;
  contrastType: string | null;
  studyDescription: DBStudyReport_root_viewer_searchStudy_studyDescription | null;
  studyStatus: StudyStatusEnum | null;
  report: DBStudyReport_root_viewer_searchStudy_report | null;
  addendums: DBStudyReport_root_viewer_searchStudy_addendums[];
  priorStudies: (DBStudyReport_root_viewer_searchStudy_priorStudies | null)[];
  notes: (DBStudyReport_root_viewer_searchStudy_notes | null)[] | null;
}

export interface DBStudyReport_root_viewer {
  _id: any;
  user: DBStudyReport_root_viewer_user | null;
  searchStudy: DBStudyReport_root_viewer_searchStudy | null;
}

export interface DBStudyReport_root {
  viewer: DBStudyReport_root_viewer | null;
}

export interface DBStudyReport_rootVariables {
  studyId?: any | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: addStudyNote
// ====================================================

export interface addStudyNote_addStudyNote_notes_messages_createdBy {
  _id: any;
  firstName: string | null;
  lastName: string | null;
}

export interface addStudyNote_addStudyNote_notes_messages {
  createdBy: addStudyNote_addStudyNote_notes_messages_createdBy;
  createdTime: any | null;
  text: string | null;
}

export interface addStudyNote_addStudyNote_notes {
  _id: any;
  type: NoteTypeEnum | null;
  title: string;
  messages: (addStudyNote_addStudyNote_notes_messages | null)[];
  resolved: boolean | null;
}

export interface addStudyNote_addStudyNote {
  _id: any;
  notes: (addStudyNote_addStudyNote_notes | null)[] | null;
  supportRequestStatus: StudySupportRequestStatusEnum | null;
}

export interface addStudyNote {
  addStudyNote: addStudyNote_addStudyNote | null;
}

export interface addStudyNoteVariables {
  studyId: any;
  title: string;
  text: string;
  type?: NoteTypeEnum | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: signOffReport
// ====================================================

export interface signOffReport_signOffReport_report {
  content: any;
  signedOffDate: any | null;
}

export interface signOffReport_signOffReport {
  _id: any;
  studyStatus: StudyStatusEnum | null;
  report: signOffReport_signOffReport_report | null;
}

export interface signOffReport {
  signOffReport: signOffReport_signOffReport | null;
}

export interface signOffReportVariables {
  studyId: any;
  content: any;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: signOffAddendum
// ====================================================

export interface signOffAddendum_signOffAddendum_addendums {
  content: any;
}

export interface signOffAddendum_signOffAddendum {
  _id: any;
  studyStatus: StudyStatusEnum | null;
  addendums: signOffAddendum_signOffAddendum_addendums[];
}

export interface signOffAddendum {
  signOffAddendum: signOffAddendum_signOffAddendum | null;
}

export interface signOffAddendumVariables {
  studyId: any;
  content: any;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: addStudyNoteMessage
// ====================================================

export interface addStudyNoteMessage_addStudyNoteMessage_notes_messages_createdBy {
  _id: any;
  firstName: string | null;
  lastName: string | null;
}

export interface addStudyNoteMessage_addStudyNoteMessage_notes_messages {
  createdBy: addStudyNoteMessage_addStudyNoteMessage_notes_messages_createdBy;
  createdTime: any | null;
  text: string | null;
}

export interface addStudyNoteMessage_addStudyNoteMessage_notes {
  _id: any;
  type: NoteTypeEnum | null;
  title: string;
  messages: (addStudyNoteMessage_addStudyNoteMessage_notes_messages | null)[];
  resolved: boolean | null;
}

export interface addStudyNoteMessage_addStudyNoteMessage {
  _id: any;
  notes: (addStudyNoteMessage_addStudyNoteMessage_notes | null)[] | null;
  supportRequestStatus: StudySupportRequestStatusEnum | null;
}

export interface addStudyNoteMessage {
  addStudyNoteMessage: addStudyNoteMessage_addStudyNoteMessage | null;
}

export interface addStudyNoteMessageVariables {
  studyId: any;
  noteId: any;
  text: string;
  resolved?: boolean | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DBStudyTableRoot
// ====================================================

export interface DBStudyTableRoot_viewer_user_worklists_sorting {
  columnName: string;
  order: number;
}

export interface DBStudyTableRoot_viewer_user_worklists_columns_filter {
  type: FilterEnum;
  stringValue: string | null;
  numberValue: number | null;
  startDate: any | null;
  endDate: any | null;
  datePreset: string | null;
}

export interface DBStudyTableRoot_viewer_user_worklists_columns {
  key: string;
  width: number;
  filter: DBStudyTableRoot_viewer_user_worklists_columns_filter | null;
}

export interface DBStudyTableRoot_viewer_user_worklists {
  _id: any;
  name: string;
  description: string | null;
  sorting: (DBStudyTableRoot_viewer_user_worklists_sorting | null)[] | null;
  displayOnTop: boolean;
  totalCount: number | null;
  columns: (DBStudyTableRoot_viewer_user_worklists_columns | null)[] | null;
}

export interface DBStudyTableRoot_viewer_user_userRole {
  permissions: (PermissionEnum | null)[] | null;
}

export interface DBStudyTableRoot_viewer_user {
  _id: any;
  worklists: (DBStudyTableRoot_viewer_user_worklists | null)[] | null;
  userRole: DBStudyTableRoot_viewer_user_userRole | null;
}

export interface DBStudyTableRoot_viewer {
  _id: any;
  user: DBStudyTableRoot_viewer_user | null;
}

export interface DBStudyTableRoot {
  viewer: DBStudyTableRoot_viewer | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DBStudyTableSearchStudies
// ====================================================

export interface DBStudyTableSearchStudies_viewer_searchStudies_studies_assignedTo {
  _id: any;
  firstName: string | null;
  lastName: string | null;
}

export interface DBStudyTableSearchStudies_viewer_searchStudies_studies_canBeAssignedTo_radiologist_pendingStudies {
  _id: any;
}

export interface DBStudyTableSearchStudies_viewer_searchStudies_studies_canBeAssignedTo_radiologist {
  _id: any;
  firstName: string | null;
  lastName: string | null;
  online: boolean;
  radiologyCapacity: number | null;
  pendingStudies: (DBStudyTableSearchStudies_viewer_searchStudies_studies_canBeAssignedTo_radiologist_pendingStudies | null)[] | null;
}

export interface DBStudyTableSearchStudies_viewer_searchStudies_studies_canBeAssignedTo {
  radiologist: DBStudyTableSearchStudies_viewer_searchStudies_studies_canBeAssignedTo_radiologist;
  assignPriority: AssignPriorityEnum;
}

export interface DBStudyTableSearchStudies_viewer_searchStudies_studies {
  _id: any;
  patientName: string | null;
  studyDescriptionString: string | null;
  assignedTo: DBStudyTableSearchStudies_viewer_searchStudies_studies_assignedTo | null;
  canBeAssignedTo: (DBStudyTableSearchStudies_viewer_searchStudies_studies_canBeAssignedTo | null)[] | null;
  studyStatus: StudyStatusEnum | null;
  arriveTimeStart: any | null;
  AETitle: string | null;
  patientDOB: any | null;
  patientSex: string | null;
  patientId: string | null;
  accessionNumber: string | null;
  stationName: string | null;
  modality: string | null;
  supportRequestStatus: StudySupportRequestStatusEnum | null;
  readType: string | null;
  laterality: StudyLateralityEnum | null;
  history: string | null;
  studyDate: any | null;
  studyPriority: StudyPriorityEnum | null;
  noOfImages: number | null;
  facilityName: string | null;
  reportSignedOffDate: any | null;
  assignedRadiologistName: string | null;
  tatLimitDate: any | null;
}

export interface DBStudyTableSearchStudies_viewer_searchStudies {
  studies: (DBStudyTableSearchStudies_viewer_searchStudies_studies | null)[] | null;
  totalCount: number;
}

export interface DBStudyTableSearchStudies_viewer {
  _id: any;
  searchStudies: DBStudyTableSearchStudies_viewer_searchStudies | null;
}

export interface DBStudyTableSearchStudies {
  viewer: DBStudyTableSearchStudies_viewer | null;
}

export interface DBStudyTableSearchStudiesVariables {
  skip: number;
  limit: number;
  sorting: (SearchSortInput | null)[];
  filters?: (SearchFilterInput | null)[] | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: addWorklist
// ====================================================

export interface addWorklist_addWorklist_viewer_user_worklists_sorting {
  columnName: string;
  order: number;
}

export interface addWorklist_addWorklist_viewer_user_worklists_columns_filter {
  type: FilterEnum;
  stringValue: string | null;
  numberValue: number | null;
  startDate: any | null;
  endDate: any | null;
  datePreset: string | null;
}

export interface addWorklist_addWorklist_viewer_user_worklists_columns {
  key: string;
  width: number;
  filter: addWorklist_addWorklist_viewer_user_worklists_columns_filter | null;
}

export interface addWorklist_addWorklist_viewer_user_worklists {
  _id: any;
  name: string;
  description: string | null;
  sorting: (addWorklist_addWorklist_viewer_user_worklists_sorting | null)[] | null;
  displayOnTop: boolean;
  totalCount: number | null;
  columns: (addWorklist_addWorklist_viewer_user_worklists_columns | null)[] | null;
}

export interface addWorklist_addWorklist_viewer_user {
  _id: any;
  worklists: (addWorklist_addWorklist_viewer_user_worklists | null)[] | null;
}

export interface addWorklist_addWorklist_viewer {
  _id: any;
  user: addWorklist_addWorklist_viewer_user | null;
}

export interface addWorklist_addWorklist {
  viewer: addWorklist_addWorklist_viewer | null;
}

export interface addWorklist {
  addWorklist: addWorklist_addWorklist | null;
}

export interface addWorklistVariables {
  name: string;
  description: string;
  sorting: (SortInput | null)[];
  columns: (ColumnInput | null)[];
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateWorklist
// ====================================================

export interface updateWorklist_updateWorklist_viewer_user_worklists_sorting {
  columnName: string;
  order: number;
}

export interface updateWorklist_updateWorklist_viewer_user_worklists_columns_filter {
  type: FilterEnum;
  stringValue: string | null;
  numberValue: number | null;
  startDate: any | null;
  endDate: any | null;
  datePreset: string | null;
}

export interface updateWorklist_updateWorklist_viewer_user_worklists_columns {
  key: string;
  width: number;
  filter: updateWorklist_updateWorklist_viewer_user_worklists_columns_filter | null;
}

export interface updateWorklist_updateWorklist_viewer_user_worklists {
  _id: any;
  name: string;
  description: string | null;
  sorting: (updateWorklist_updateWorklist_viewer_user_worklists_sorting | null)[] | null;
  displayOnTop: boolean;
  totalCount: number | null;
  columns: (updateWorklist_updateWorklist_viewer_user_worklists_columns | null)[] | null;
}

export interface updateWorklist_updateWorklist_viewer_user {
  _id: any;
  worklists: (updateWorklist_updateWorklist_viewer_user_worklists | null)[] | null;
}

export interface updateWorklist_updateWorklist_viewer {
  _id: any;
  user: updateWorklist_updateWorklist_viewer_user | null;
}

export interface updateWorklist_updateWorklist {
  viewer: updateWorklist_updateWorklist_viewer | null;
}

export interface updateWorklist {
  updateWorklist: updateWorklist_updateWorklist | null;
}

export interface updateWorklistVariables {
  worklistId: any;
  sorting: (SortInput | null)[];
  columns: (ColumnInput | null)[];
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateWorklistDisplayOnTop
// ====================================================

export interface updateWorklistDisplayOnTop_updateWorklistDisplayOnTop_viewer_user_worklists_sorting {
  columnName: string;
  order: number;
}

export interface updateWorklistDisplayOnTop_updateWorklistDisplayOnTop_viewer_user_worklists_columns_filter {
  type: FilterEnum;
  stringValue: string | null;
  numberValue: number | null;
  startDate: any | null;
  endDate: any | null;
  datePreset: string | null;
}

export interface updateWorklistDisplayOnTop_updateWorklistDisplayOnTop_viewer_user_worklists_columns {
  key: string;
  width: number;
  filter: updateWorklistDisplayOnTop_updateWorklistDisplayOnTop_viewer_user_worklists_columns_filter | null;
}

export interface updateWorklistDisplayOnTop_updateWorklistDisplayOnTop_viewer_user_worklists {
  _id: any;
  name: string;
  description: string | null;
  sorting: (updateWorklistDisplayOnTop_updateWorklistDisplayOnTop_viewer_user_worklists_sorting | null)[] | null;
  displayOnTop: boolean;
  totalCount: number | null;
  columns: (updateWorklistDisplayOnTop_updateWorklistDisplayOnTop_viewer_user_worklists_columns | null)[] | null;
}

export interface updateWorklistDisplayOnTop_updateWorklistDisplayOnTop_viewer_user {
  _id: any;
  worklists: (updateWorklistDisplayOnTop_updateWorklistDisplayOnTop_viewer_user_worklists | null)[] | null;
}

export interface updateWorklistDisplayOnTop_updateWorklistDisplayOnTop_viewer {
  _id: any;
  user: updateWorklistDisplayOnTop_updateWorklistDisplayOnTop_viewer_user | null;
}

export interface updateWorklistDisplayOnTop_updateWorklistDisplayOnTop {
  viewer: updateWorklistDisplayOnTop_updateWorklistDisplayOnTop_viewer | null;
}

export interface updateWorklistDisplayOnTop {
  updateWorklistDisplayOnTop: updateWorklistDisplayOnTop_updateWorklistDisplayOnTop | null;
}

export interface updateWorklistDisplayOnTopVariables {
  worklistId: any;
  displayOnTop: boolean;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: deleteWorklist
// ====================================================

export interface deleteWorklist_deleteWorklist_viewer_user_worklists_sorting {
  columnName: string;
  order: number;
}

export interface deleteWorklist_deleteWorklist_viewer_user_worklists_columns_filter {
  type: FilterEnum;
  stringValue: string | null;
  numberValue: number | null;
  startDate: any | null;
  endDate: any | null;
  datePreset: string | null;
}

export interface deleteWorklist_deleteWorklist_viewer_user_worklists_columns {
  key: string;
  width: number;
  filter: deleteWorklist_deleteWorklist_viewer_user_worklists_columns_filter | null;
}

export interface deleteWorklist_deleteWorklist_viewer_user_worklists {
  _id: any;
  name: string;
  description: string | null;
  sorting: (deleteWorklist_deleteWorklist_viewer_user_worklists_sorting | null)[] | null;
  displayOnTop: boolean;
  totalCount: number | null;
  columns: (deleteWorklist_deleteWorklist_viewer_user_worklists_columns | null)[] | null;
}

export interface deleteWorklist_deleteWorklist_viewer_user {
  _id: any;
  worklists: (deleteWorklist_deleteWorklist_viewer_user_worklists | null)[] | null;
}

export interface deleteWorklist_deleteWorklist_viewer {
  _id: any;
  user: deleteWorklist_deleteWorklist_viewer_user | null;
}

export interface deleteWorklist_deleteWorklist {
  viewer: deleteWorklist_deleteWorklist_viewer | null;
}

export interface deleteWorklist {
  deleteWorklist: deleteWorklist_deleteWorklist | null;
}

export interface deleteWorklistVariables {
  worklistId: any;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: assignStudiesToRadiologist
// ====================================================

export interface assignStudiesToRadiologist_assignStudiesToRadiologist {
  _id: any;
}

export interface assignStudiesToRadiologist {
  assignStudiesToRadiologist: assignStudiesToRadiologist_assignStudiesToRadiologist | null;
}

export interface assignStudiesToRadiologistVariables {
  radiologistId: any;
  studyIds: any[];
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PChangeFacilityContentRoot
// ====================================================

export interface PChangeFacilityContentRoot_viewer_facilities {
  _id: any;
  institutionName: string;
}

export interface PChangeFacilityContentRoot_viewer {
  _id: any;
  facilities: (PChangeFacilityContentRoot_viewer_facilities | null)[] | null;
}

export interface PChangeFacilityContentRoot {
  viewer: PChangeFacilityContentRoot_viewer | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateStudyFacility
// ====================================================

export interface updateStudyFacility_updateStudyFacility_facility {
  _id: any;
  institutionName: string;
}

export interface updateStudyFacility_updateStudyFacility {
  _id: any;
  facility: updateStudyFacility_updateStudyFacility_facility | null;
  facilityName: string | null;
}

export interface updateStudyFacility {
  updateStudyFacility: updateStudyFacility_updateStudyFacility[];
}

export interface updateStudyFacilityVariables {
  studyIds: any[];
  facilityId: any;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: dashboardQuery
// ====================================================

export interface dashboardQuery_viewer_user_workspaces {
  _id: any;
  layout: any | null;
}

export interface dashboardQuery_viewer_user {
  _id: any;
  workspaces: (dashboardQuery_viewer_user_workspaces | null)[] | null;
}

export interface dashboardQuery_viewer {
  _id: any;
  user: dashboardQuery_viewer_user | null;
}

export interface dashboardQuery {
  viewer: dashboardQuery_viewer | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateWorkspace
// ====================================================

export interface updateWorkspace_updateWorkspace_viewer_user_workspaces {
  _id: any;
  layout: any | null;
}

export interface updateWorkspace_updateWorkspace_viewer_user {
  _id: any;
  workspaces: (updateWorkspace_updateWorkspace_viewer_user_workspaces | null)[] | null;
}

export interface updateWorkspace_updateWorkspace_viewer {
  _id: any;
  user: updateWorkspace_updateWorkspace_viewer_user | null;
}

export interface updateWorkspace_updateWorkspace {
  viewer: updateWorkspace_updateWorkspace_viewer | null;
}

export interface updateWorkspace {
  updateWorkspace: updateWorkspace_updateWorkspace | null;
}

export interface updateWorkspaceVariables {
  workspaceId: any;
  layout: any;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: login
// ====================================================

export interface login_login_viewer_user {
  _id: any;
}

export interface login_login_viewer {
  _id: any;
  user: login_login_viewer_user | null;
}

export interface login_login {
  viewer: login_login_viewer | null;
}

export interface login {
  login: login_login | null;
}

export interface loginVariables {
  email: string;
  password: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: AdminFacilities_FacilityEntry
// ====================================================

export interface AdminFacilities_FacilityEntry {
  _id: any;
  institutionName: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  websiteUrl: string | null;
  faxNumber: string | null;
  phoneNumber: string | null;
  email: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FacilityTabDicomDetailsForm_FacilityEntry
// ====================================================

export interface FacilityTabDicomDetailsForm_FacilityEntry_dicomDetails {
  AETitle: string | null;
}

export interface FacilityTabDicomDetailsForm_FacilityEntry {
  _id: any;
  dicomDetails: FacilityTabDicomDetailsForm_FacilityEntry_dicomDetails | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FacilityTabDicomDetailsForm_Facility
// ====================================================

export interface FacilityTabDicomDetailsForm_Facility_dicomDetails {
  AETitle: string | null;
}

export interface FacilityTabDicomDetailsForm_Facility {
  _id: any;
  dicomDetails: FacilityTabDicomDetailsForm_Facility_dicomDetails | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FacilityTabGeneralForm_Facility
// ====================================================

export interface FacilityTabGeneralForm_Facility {
  _id: any;
  institutionName: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  websiteUrl: string | null;
  faxNumber: string | null;
  phoneNumber: string | null;
  email: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FacilityTabTechConfForm_FacilityEntry
// ====================================================

export interface FacilityTabTechConfForm_FacilityEntry_techConf_contrastRequirements {
  requirement: ContrastRequirementsEnum;
  modality: ModalityEnum;
}

export interface FacilityTabTechConfForm_FacilityEntry_techConf_tatLimits {
  timeSeconds: number;
  studyPriority: StudyPriorityEnum;
}

export interface FacilityTabTechConfForm_FacilityEntry_techConf {
  contrastRequirements: FacilityTabTechConfForm_FacilityEntry_techConf_contrastRequirements[];
  readType: ReadTypeEnum | null;
  tatLimits: FacilityTabTechConfForm_FacilityEntry_techConf_tatLimits[];
}

export interface FacilityTabTechConfForm_FacilityEntry {
  _id: any;
  techConf: FacilityTabTechConfForm_FacilityEntry_techConf | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FacilityTabTechConfForm_Facility
// ====================================================

export interface FacilityTabTechConfForm_Facility_techConf_contrastRequirements {
  requirement: ContrastRequirementsEnum;
  modality: ModalityEnum;
}

export interface FacilityTabTechConfForm_Facility_techConf_tatLimits {
  timeSeconds: number;
  studyPriority: StudyPriorityEnum;
}

export interface FacilityTabTechConfForm_Facility_techConf {
  contrastRequirements: FacilityTabTechConfForm_Facility_techConf_contrastRequirements[];
  readType: ReadTypeEnum | null;
  tatLimits: FacilityTabTechConfForm_Facility_techConf_tatLimits[];
}

export interface FacilityTabTechConfForm_Facility {
  _id: any;
  techConf: FacilityTabTechConfForm_Facility_techConf | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: AdminPermission_UserRoleEntry
// ====================================================

export interface AdminPermission_UserRoleEntry {
  _id: any;
  name: string;
  permissions: (PermissionEnum | null)[] | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: AdminUserRoles_UserRoleEntry
// ====================================================

export interface AdminUserRoles_UserRoleEntry {
  _id: any;
  name: string;
  description: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: AdminUsers_UserEntry
// ====================================================

export interface AdminUsers_UserEntry_userRole {
  _id: any;
  name: string;
}

export interface AdminUsers_UserEntry {
  _id: any;
  firstName: string | null;
  lastName: string | null;
  email: string;
  userRole: AdminUsers_UserEntry_userRole | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: MAdminUserAdd_userEntry
// ====================================================

export interface MAdminUserAdd_userEntry_userRole {
  _id: any;
  name: string;
}

export interface MAdminUserAdd_userEntry {
  _id: any;
  firstName: string | null;
  lastName: string | null;
  email: string;
  userRole: MAdminUserAdd_userEntry_userRole | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserTabAllowedFacilities_FacilityEntry
// ====================================================

export interface UserTabAllowedFacilities_FacilityEntry {
  _id: any;
  institutionName: string;
  address: string | null;
  city: string | null;
  state: string | null;
  email: string | null;
  phoneNumber: string | null;
  faxNumber: string | null;
  websiteUrl: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserTabAllowedFacilities_Facility
// ====================================================

export interface UserTabAllowedFacilities_Facility {
  _id: any;
  institutionName: string;
  address: string | null;
  city: string | null;
  state: string | null;
  email: string | null;
  phoneNumber: string | null;
  faxNumber: string | null;
  websiteUrl: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserTabAssignedFacilities_UserEntry
// ====================================================

export interface UserTabAssignedFacilities_UserEntry_userRole {
  _id: any;
  name: string;
}

export interface UserTabAssignedFacilities_UserEntry {
  _id: any;
  firstName: string | null;
  lastName: string | null;
  email: string;
  userRole: UserTabAssignedFacilities_UserEntry_userRole | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserTabAssignedFacilities_FacilityEntry
// ====================================================

export interface UserTabAssignedFacilities_FacilityEntry {
  _id: any;
  institutionName: string;
  address: string | null;
  city: string | null;
  state: string | null;
  email: string | null;
  phoneNumber: string | null;
  faxNumber: string | null;
  websiteUrl: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserTabAssignedFacilities_AssignedFacility
// ====================================================

export interface UserTabAssignedFacilities_AssignedFacility {
  _id: any;
  institutionName: string;
  address: string | null;
  city: string | null;
  state: string | null;
  email: string | null;
  phoneNumber: string | null;
  faxNumber: string | null;
  websiteUrl: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserTabGeneralForm_User
// ====================================================

export interface UserTabGeneralForm_User_workspaces {
  _id: any;
}

export interface UserTabGeneralForm_User_worklists {
  _id: any;
}

export interface UserTabGeneralForm_User_userRole {
  _id: any;
  name: string;
  description: string;
  permissions: (PermissionEnum | null)[] | null;
}

export interface UserTabGeneralForm_User {
  _id: any;
  firstName: string | null;
  lastName: string | null;
  email: string;
  workspaces: (UserTabGeneralForm_User_workspaces | null)[] | null;
  worklists: (UserTabGeneralForm_User_worklists | null)[] | null;
  userRole: UserTabGeneralForm_User_userRole | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserTabPriorities_AssignPriorityEntry
// ====================================================

export interface UserTabPriorities_AssignPriorityEntry {
  studyDescriptionNameRegex: string;
  studyDescriptionModalityRegex: string;
  facilityNameRegex: string;
  studyPriorityRegex: string;
  assignPriority: AssignPriorityEnum;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserTabPriorities_UserEntry
// ====================================================

export interface UserTabPriorities_UserEntry_assignPriorities {
  studyDescriptionNameRegex: string;
  studyDescriptionModalityRegex: string;
  facilityNameRegex: string;
  studyPriorityRegex: string;
  assignPriority: AssignPriorityEnum;
}

export interface UserTabPriorities_UserEntry {
  _id: any;
  assignPriorities: (UserTabPriorities_UserEntry_assignPriorities | null)[] | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserTabPriorities_AssignPriority
// ====================================================

export interface UserTabPriorities_AssignPriority {
  studyDescriptionNameRegex: string;
  studyDescriptionModalityRegex: string;
  facilityNameRegex: string;
  studyPriorityRegex: string;
  assignPriority: AssignPriorityEnum;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: DBStudyConfirm_PhysicianEntry
// ====================================================

export interface DBStudyConfirm_PhysicianEntry {
  _id: any;
  name: string;
  physicianUid: string;
  phone: string;
  email: string;
  fax: string | null;
  dicomValue: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: DBStudyConfirm_study
// ====================================================

export interface DBStudyConfirm_study_studyDescription {
  _id: any;
}

export interface DBStudyConfirm_study_referringPhysicians {
  _id: any;
}

export interface DBStudyConfirm_study {
  _id: any;
  patientName: string | null;
  patientId: string | null;
  patientDOB: any | null;
  patientSex: string | null;
  contrastPresent: ContrastPresentEnum | null;
  contrastType: string | null;
  studyPriority: StudyPriorityEnum | null;
  readType: string | null;
  laterality: StudyLateralityEnum | null;
  history: string | null;
  studyDescription: DBStudyConfirm_study_studyDescription | null;
  referringPhysicians: (DBStudyConfirm_study_referringPhysicians | null)[] | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PhysicianContent_referringPhysician
// ====================================================

export interface PhysicianContent_referringPhysician {
  _id: any;
  name: string;
  physicianUid: string;
  phone: string;
  email: string;
  fax: string | null;
  dicomValue: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PhysicianCreateForm_referringPhysician
// ====================================================

export interface PhysicianCreateForm_referringPhysician {
  name: string;
  physicianUid: string;
  phone: string;
  email: string;
  fax: string | null;
  dicomValue: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: StudyReportNotes_studyNotesEntry
// ====================================================

export interface StudyReportNotes_studyNotesEntry_messages_createdBy {
  _id: any;
  firstName: string | null;
  lastName: string | null;
}

export interface StudyReportNotes_studyNotesEntry_messages {
  createdBy: StudyReportNotes_studyNotesEntry_messages_createdBy;
  createdTime: any | null;
  text: string | null;
}

export interface StudyReportNotes_studyNotesEntry {
  _id: any;
  type: NoteTypeEnum | null;
  title: string;
  messages: (StudyReportNotes_studyNotesEntry_messages | null)[];
  resolved: boolean | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: StudyReportNotes_studyNotes
// ====================================================

export interface StudyReportNotes_studyNotes_messages_createdBy {
  _id: any;
  firstName: string | null;
  lastName: string | null;
}

export interface StudyReportNotes_studyNotes_messages {
  createdBy: StudyReportNotes_studyNotes_messages_createdBy;
  createdTime: any | null;
  text: string | null;
}

export interface StudyReportNotes_studyNotes {
  _id: any;
  type: NoteTypeEnum | null;
  title: string;
  messages: (StudyReportNotes_studyNotes_messages | null)[];
  resolved: boolean | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: StudyReportNotes_user
// ====================================================

export interface StudyReportNotes_user_userRole {
  permissions: (PermissionEnum | null)[] | null;
}

export interface StudyReportNotes_user {
  _id: any;
  userRole: StudyReportNotes_user_userRole | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: DBStudyTable_worklist
// ====================================================

export interface DBStudyTable_worklist_sorting {
  columnName: string;
  order: number;
}

export interface DBStudyTable_worklist_columns_filter {
  type: FilterEnum;
  stringValue: string | null;
  numberValue: number | null;
  startDate: any | null;
  endDate: any | null;
  datePreset: string | null;
}

export interface DBStudyTable_worklist_columns {
  key: string;
  width: number;
  filter: DBStudyTable_worklist_columns_filter | null;
}

export interface DBStudyTable_worklist {
  _id: any;
  name: string;
  description: string | null;
  sorting: (DBStudyTable_worklist_sorting | null)[] | null;
  displayOnTop: boolean;
  totalCount: number | null;
  columns: (DBStudyTable_worklist_columns | null)[] | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PAssignStudyContent_study
// ====================================================

export interface PAssignStudyContent_study_assignedTo {
  _id: any;
  firstName: string | null;
  lastName: string | null;
}

export interface PAssignStudyContent_study_canBeAssignedTo_radiologist_pendingStudies {
  _id: any;
}

export interface PAssignStudyContent_study_canBeAssignedTo_radiologist {
  _id: any;
  firstName: string | null;
  lastName: string | null;
  online: boolean;
  radiologyCapacity: number | null;
  pendingStudies: (PAssignStudyContent_study_canBeAssignedTo_radiologist_pendingStudies | null)[] | null;
}

export interface PAssignStudyContent_study_canBeAssignedTo {
  radiologist: PAssignStudyContent_study_canBeAssignedTo_radiologist;
  assignPriority: AssignPriorityEnum;
}

export interface PAssignStudyContent_study {
  _id: any;
  patientName: string | null;
  studyDescriptionString: string | null;
  assignedTo: PAssignStudyContent_study_assignedTo | null;
  canBeAssignedTo: (PAssignStudyContent_study_canBeAssignedTo | null)[] | null;
  studyStatus: StudyStatusEnum | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PChangeFacilityContent_facility
// ====================================================

export interface PChangeFacilityContent_facility {
  _id: any;
  institutionName: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: StudyTable_study
// ====================================================

export interface StudyTable_study_studies_assignedTo {
  _id: any;
  firstName: string | null;
  lastName: string | null;
}

export interface StudyTable_study_studies_canBeAssignedTo_radiologist_pendingStudies {
  _id: any;
}

export interface StudyTable_study_studies_canBeAssignedTo_radiologist {
  _id: any;
  firstName: string | null;
  lastName: string | null;
  online: boolean;
  radiologyCapacity: number | null;
  pendingStudies: (StudyTable_study_studies_canBeAssignedTo_radiologist_pendingStudies | null)[] | null;
}

export interface StudyTable_study_studies_canBeAssignedTo {
  radiologist: StudyTable_study_studies_canBeAssignedTo_radiologist;
  assignPriority: AssignPriorityEnum;
}

export interface StudyTable_study_studies {
  _id: any;
  arriveTimeStart: any | null;
  AETitle: string | null;
  patientName: string | null;
  patientDOB: any | null;
  patientSex: string | null;
  patientId: string | null;
  accessionNumber: string | null;
  studyDescriptionString: string | null;
  stationName: string | null;
  modality: string | null;
  studyStatus: StudyStatusEnum | null;
  supportRequestStatus: StudySupportRequestStatusEnum | null;
  readType: string | null;
  laterality: StudyLateralityEnum | null;
  history: string | null;
  studyDate: any | null;
  studyPriority: StudyPriorityEnum | null;
  noOfImages: number | null;
  facilityName: string | null;
  reportSignedOffDate: any | null;
  assignedRadiologistName: string | null;
  tatLimitDate: any | null;
  assignedTo: StudyTable_study_studies_assignedTo | null;
  canBeAssignedTo: (StudyTable_study_studies_canBeAssignedTo | null)[] | null;
}

export interface StudyTable_study {
  totalCount: number;
  studies: (StudyTable_study_studies | null)[] | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: StudyTable_user
// ====================================================

export interface StudyTable_user_userRole {
  permissions: (PermissionEnum | null)[] | null;
}

export interface StudyTable_user {
  userRole: StudyTable_user_userRole | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullFragment_referringPhysician
// ====================================================

export interface FullFragment_referringPhysician {
  _id: any;
  name: string;
  physicianUid: string;
  email: string;
  phone: string;
  fax: string | null;
  dicomValue: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullFragment_Facility
// ====================================================

export interface FullFragment_Facility {
  _id: any;
  institutionName: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  websiteUrl: string | null;
  faxNumber: string | null;
  phoneNumber: string | null;
  email: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullFragment_UserRole
// ====================================================

export interface FullFragment_UserRole {
  _id: any;
  name: string;
  description: string;
  permissions: (PermissionEnum | null)[] | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullFragment_User
// ====================================================

export interface FullFragment_User_workspaces {
  _id: any;
}

export interface FullFragment_User_worklists {
  _id: any;
}

export interface FullFragment_User_userRole {
  _id: any;
  name: string;
  description: string;
  permissions: (PermissionEnum | null)[] | null;
}

export interface FullFragment_User {
  _id: any;
  firstName: string | null;
  lastName: string | null;
  email: string;
  workspaces: (FullFragment_User_workspaces | null)[] | null;
  worklists: (FullFragment_User_worklists | null)[] | null;
  userRole: FullFragment_User_userRole | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullFragment_ReportTemplate
// ====================================================

export interface FullFragment_ReportTemplate {
  _id: any;
  name: string;
  description: string;
  template: any;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullFragment_StudyDescription
// ====================================================

export interface FullFragment_StudyDescription_reportTemplate {
  _id: any;
  name: string;
  description: string;
  template: any;
}

export interface FullFragment_StudyDescription {
  _id: any;
  name: string;
  modality: ModalityEnum | null;
  contrast: ContrastEnum | null;
  reportTemplate: FullFragment_StudyDescription_reportTemplate | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum ContrastRequirementsEnum {
  NEVER_SEEN = "NEVER_SEEN",
  OPTIONAL = "OPTIONAL",
  REQUIRED = "REQUIRED",
}

export enum ModalityEnum {
  CR = "CR",
  CT = "CT",
  DX = "DX",
  MG = "MG",
  MR = "MR",
  NM = "NM",
  PET = "PET",
  US = "US",
  XR = "XR",
}

export enum ReadTypeEnum {
  FINAL = "FINAL",
  PRELIM = "PRELIM",
  PRELIM_OR_FINAL = "PRELIM_OR_FINAL",
}

export enum StudyPriorityEnum {
  CRITICAL = "CRITICAL",
  ROUTINE = "ROUTINE",
  STAT = "STAT",
  STROKE = "STROKE",
  URGENT = "URGENT",
}

export enum PermissionEnum {
  ASSIGN_STUDY = "ASSIGN_STUDY",
  CONFIRM_STUDY = "CONFIRM_STUDY",
  LIST_ALLOWED_STUDIES = "LIST_ALLOWED_STUDIES",
  LIST_ALL_STUDIES = "LIST_ALL_STUDIES",
  LIST_STUDIES_ASSIGNED_TO_ME = "LIST_STUDIES_ASSIGNED_TO_ME",
  OPEN_REPORT_WINDOW = "OPEN_REPORT_WINDOW",
  RESOLVE_SUPPORT_REQUEST = "RESOLVE_SUPPORT_REQUEST",
  SIGN_OFF_STUDY = "SIGN_OFF_STUDY",
}

export enum ContrastEnum {
  NA = "NA",
  W = "W",
  WO = "WO",
  W_WO = "W_WO",
}

export enum AssignPriorityEnum {
  MINUS_ONE = "MINUS_ONE",
  MINUS_TWO = "MINUS_TWO",
  NEVER = "NEVER",
  PLUS_ONE = "PLUS_ONE",
  PLUS_TWO = "PLUS_TWO",
  ZERO = "ZERO",
}

export enum ContrastPresentEnum {
  NO = "NO",
  NOT_SELECTED = "NOT_SELECTED",
  YES = "YES",
}

export enum StudyLateralityEnum {
  LEFT = "LEFT",
  NOT_SELECTED = "NOT_SELECTED",
  RIGHT = "RIGHT",
}

export enum StudyStatusEnum {
  ASSIGNED = "ASSIGNED",
  CONFIRMED = "CONFIRMED",
  NEW = "NEW",
  SIGNED_OFF = "SIGNED_OFF",
}

export enum NoteTypeEnum {
  SUPPORT_STUDY_REQUEST = "SUPPORT_STUDY_REQUEST",
  SUPPORT_URGENCY_REQUEST = "SUPPORT_URGENCY_REQUEST",
}

export enum StudySupportRequestStatusEnum {
  NONE = "NONE",
  PENDING = "PENDING",
  RESOLVED = "RESOLVED",
}

export enum FilterEnum {
  CONTAINS_STRING = "CONTAINS_STRING",
  DATE_PRESET = "DATE_PRESET",
  DATE_RANGE = "DATE_RANGE",
  EQUAL_NUMBER = "EQUAL_NUMBER",
}

/**
 * 
 */
export interface ContrastRequirementsInput {
  modality: ModalityEnum;
  requirement: ContrastRequirementsEnum;
}

/**
 * 
 */
export interface TATLimitInput {
  timeSeconds: number;
  studyPriority: StudyPriorityEnum;
}

/**
 * 
 */
export interface UserRolePermissionsInput {
  userRoleId: any;
  permissions: (PermissionEnum | null)[];
}

/**
 * 
 */
export interface AssignPriorityInput {
  studyDescriptionNameRegex: string;
  studyDescriptionModalityRegex: string;
  facilityNameRegex: string;
  studyPriorityRegex: string;
  assignPriority: AssignPriorityEnum;
}

/**
 * 
 */
export interface SearchSortInput {
  columnName: string;
  order?: number | null;
}

/**
 * 
 */
export interface SearchFilterInput {
  columnName: string;
  type: FilterEnum;
  stringValue?: string | null;
  numberValue?: number | null;
  startDate?: any | null;
  endDate?: any | null;
  datePreset?: string | null;
}

/**
 * 
 */
export interface SortInput {
  columnName: string;
  order: number;
}

/**
 * 
 */
export interface ColumnInput {
  key: string;
  width: number;
  filter?: FilterInput | null;
}

/**
 * 
 */
export interface FilterInput {
  type: FilterEnum;
  stringValue?: string | null;
  numberValue?: number | null;
  startDate?: any | null;
  endDate?: any | null;
  datePreset?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================