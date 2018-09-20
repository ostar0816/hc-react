import { parseDicomDate } from '../utils/dateUtils';
// https://github.com/Microsoft/TypeScript/issues/12815#issuecomment-266250230
// reason for undefined
export type TStudyTableColumn = {
  type: string;
  label: string;
  path?: string;
};
type TStudyTableColumns = {
  [id: string]: TStudyTableColumn;
};

const columns: TStudyTableColumns = {
  arriveTimeStart: {
    type: 'DateTime',
    label: 'Arrive Time',
  },
  AETitle: {
    type: 'String',
    label: 'AETitle',
    path: 'dicomTags.ScheduledStudyLocationAETitle',
  },
  patientName: {
    type: 'String',
    label: 'Patients Name',
  },
  assignedRadiologistName: {
    type: 'String',
    label: 'Assigned Rad',
    path: '_sAssignedRadiologistName',
  },
  patientDOB: {
    type: 'Date',
    label: 'Patients DOB',
  },
  patientSex: {
    type: 'String',
    label: 'Patients sex',
  },
  patientId: {
    type: 'String',
    label: 'Patient ID',
  },
  accessionNumber: {
    type: 'String',
    label: 'Accession Number',
    path: 'dicomTags.AccessionNumber',
    // resolver: study => study.dicomTags.AccessionNumber,
  },
  studyDescriptionString: {
    type: 'String',
    label: 'Study Description',
    path: '_sStudyDescription',
  },
  stationName: {
    type: 'String',
    label: 'Station Name',
    path: 'dicomTags.StationName',
  },
  modality: {
    type: 'String',
    label: 'Modality',
    path: '_sModality',
  },
  studyStatus: {
    type: 'StudyStatusEnum',
    label: 'Study Status',
  },
  readType: {
    type: 'String',
    label: 'Read Type',
  },
  laterality: {
    type: 'StudyLateralityEnum',
    label: 'Laterality',
  },
  history: {
    type: 'String',
    label: 'History',
  },
  studyDate: {
    type: 'Date',
    label: 'Study Date',
    path: 'dicomTags.StudyDate',
  },
  studyPriority: {
    type: 'StudyPriorityEnum',
    label: 'Study Priority',
  },

  /*{
    key: 'dictateDate',
    type: 'DateTime',
    label: 'Dictate Date',
  },*/
  /*{
    key: 'arriveTimestart',
    type: 'DateTime',
    label: 'Arrive Time',
  },*/
  noOfImages: {
    type: 'Int',
    label: 'Images',
  },
  facilityName: {
    type: 'String',
    label: 'Facility',
    path: '_sFacilityName',
  },
  reportSignedOffDate: {
    type: 'DateTime',
    label: 'Signed Off',
    path: 'report.signedOffDate',
  },
  supportRequestStatus: {
    type: 'StudySupportRequestStatusEnum',
    label: 'SR status',
  },
  tatLimitDate: {
    type: 'DateTime',
    label: 'TAT Limit',
  },
};

export function getPathForColumnKey(key: string) {
  return columns[key].path ? columns[key].path : key;
}

export default columns;
