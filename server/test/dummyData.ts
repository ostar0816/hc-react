import {
  GQLPermissionEnum,
  GQLStudyStatusEnum,
  GQLContrastPresentEnum,
  GQLStudyLateralityEnum,
  GQLStudySupportRequestStatusEnum,
} from '../graphql/types';

export const referringPhysian = [
  {
    name: 'Kurt Hannig',
    physicianUid: 'UI2222',
    fax: '555 1452 333',
    phone: '666 1111 7777',
    email: 'kurt.hannig@gmail.com',
    dicomValue: 'KURT^HANNIG',
  },
  {
    name: 'Frank Malero',
    physicianUid: 'UI3333',
    fax: '555 4444 333',
    phone: '666 2222 8888',
    email: 'frank.malero@yahoo.co.uk',
    dicomValue: 'FRANK^MALERO',
  },
];

export const facility = [
  {
    institutionName: 'Medic institution 101',
    address: 'Angel 15',
    state: 'Utah',
    zip: '555 66',
    websiteUrl: 'http://angel.ut',
    faxNumber: '(555) 666777',
    phoneNumber: '(666) 111111',
    email: 'medic101@institute.com',
  },
];

export const reportTemplate = [
  {
    name: 'CT Head T1',
    description: 'head issues',
    template: { editorStructure: ['abc', 1, 4] },
  },
  {
    name: 'MR Bone U2',
    description: 'Proper bone scan',
    template: { editorStructure: ['def', 18] },
  },
];

export const userRole = [
  {
    name: 'Admin',
    description: 'admin guy',
    permissions: [GQLPermissionEnum.LIST_ALL_STUDIES],
  },
  {
    name: 'Radiologist',
    description: 'rad guy',
    permissions: [GQLPermissionEnum.LIST_STUDIES_ASSIGNED_TO_ME],
  },
];

export const user = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@gmail.com',
    password: 'trickypass1',
  },
  {
    firstName: 'Michael',
    lastName: 'Shiffer',
    email: 'm.s@yahoo.co.uk',
    password: 'nuggets',
  },
];

export const study = [
  {
    arriveTimeStart: new Date('2017-02-01'),
    facilityId: null,
    referringPhysicianIds: [],
    dicomTags: {},
    patientName: 'Konnan Muscle',
    patientId: 'P123456',
    patientDOB: new Date('1984-02-01'),
    patientSex: 'M',
    history: '',
    studyStatus: GQLStudyStatusEnum.NEW,
    supportRequestStatus: GQLStudySupportRequestStatusEnum.NONE,
    contrastPresent: GQLContrastPresentEnum.NOT_SELECTED,
    laterality: GQLStudyLateralityEnum.NOT_SELECTED,
    notes: [],
    _sModality: 'CT',
    _sStudyDescription: 'HEAD',
    _sAssignedRadiologistName: '',
    _sFacilityName: '',
  },
];
