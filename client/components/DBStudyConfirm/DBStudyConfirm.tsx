import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import graphqlClient from '../../graphqlClient';

import { Collapse as ReactCollapse } from 'react-collapse';
import moment from 'moment';

import {
  Col,
  Row,
  Form,
  Input,
  Button,
  Select,
  Switch,
  Icon,
  DatePicker,
  Collapse,
  message,
} from 'antd';
const FormItem = Form.Item;
const { Option } = Select;
const { Panel } = Collapse;
const { TextArea } = Input;

import css from './DBStudyConfirm.lessx';

import DashboardWindow from '../DashboardWindow/DashboardWindow';

import DestinationContent from './DestinationContent';
import PhysicianContent from './PhysicianContent';

import {
  DBStudyConfirm_root,
  DBStudyConfirm_rootVariables,
  StudyPriorityEnum,
  StudyLateralityEnum,
  PermissionEnum,
  ReadTypeEnum,
  ContrastPresentEnum,
} from '../../gqlTypes';

import { IFlowUpdateState } from '../FlowBoard/FlowBoard';

const physicianFragment = gql`
  fragment DBStudyConfirm_PhysicianEntry on ReferringPhysician {
    _id
    name
    physicianUid
    phone
    ...PhysicianContent_referringPhysician
  }

  ${PhysicianContent.fragments.referringPhysician}
`;

const studyFragment = gql`
  fragment DBStudyConfirm_study on Study {
    _id
    patientName
    patientId
    patientDOB
    patientSex
    contrastPresent
    contrastType
    studyPriority
    readType
    laterality
    history
    studyDescription {
      _id
    }
    referringPhysicians {
      _id
    }
  }
`;

const confirmStudyMutation = gql`
  mutation confirmStudy(
    $studyId: ObjectId!
    $patientName: String!
    $patientId: String!
    $patientDOB: Date!
    $patientSex: String!
    $studyDescriptionId: ObjectId!
    $contrastPresent: ContrastPresentEnum!
    $contrastType: String!
    $studyPriority: StudyPriorityEnum!
    $laterality: StudyLateralityEnum!
    $readType: ReadTypeEnum!
    $history: String!
    $referringPhysicianIds: [ObjectId!]!
  ) {
    confirmStudy(
      studyId: $studyId
      patientName: $patientName
      patientId: $patientId
      patientDOB: $patientDOB
      patientSex: $patientSex
      studyDescriptionId: $studyDescriptionId
      contrastPresent: $contrastPresent
      contrastType: $contrastType
      studyPriority: $studyPriority
      laterality: $laterality
      readType: $readType
      history: $history
      referringPhysicianIds: $referringPhysicianIds
    ) {
      ...DBStudyConfirm_study
      studyStatus
    }
  }
  ${studyFragment}
`;

const dbStudyConfirmQuery = gql`
  query DBStudyConfirm_root($studyId: ObjectId) {
    viewer {
      _id
      user {
        _id
        userRole {
          permissions
        }
      }
      searchStudy: searchStudyById(studyId: $studyId) {
        _id
        ...DBStudyConfirm_study
        facility {
          _id
          institutionName
          referringPhysicians {
            ...DBStudyConfirm_PhysicianEntry
            ...PhysicianContent_referringPhysician
          }
          techConf {
            contrastRequirements {
              modality
              requirement
            }
            readType
          }
        }
      }
      studyDescriptions {
        _id
        name
        modality
        contrast
      }
    }
  }
  ${studyFragment}
  ${physicianFragment}
  ${PhysicianContent.fragments.referringPhysician}
`;

type TClientState = {
  patientName: string;
  patientId: string;
  patientDOB: moment.Moment;
  patientSex: string;
  readType: ReadTypeEnum;
  contrastPresent: ContrastPresentEnum;
  contrastType: string;
  studyPriority: StudyPriorityEnum;
  referringPhysicianIds: string[];
  laterality: StudyLateralityEnum;
  history: string;
  studyDescriptionId: string;
  visibleAddPhysicianModal: boolean;
  vibleAddDestinationModal: boolean;
};

type TServerState = {
  selectedStudyId: string;
};

type DBStudyConfirmProps = {
  splitDirection: string;
  serverState: TServerState;
  clientState: TClientState;
  onServerStateUpdate: IFlowUpdateState<TServerState>;
  onClientStateUpdate: IFlowUpdateState<TClientState>;
  onSplitVertical(): void;
  onSplitHorizontal(): void;
  onSwapWindows(): void;
  onMaximize(): void;
  onClose(): void;
} & DBStudyConfirm_root;

type DBStudyConfirmState = {
  patientName: string;
  patientId: string;
  patientDOB: moment.Moment;
  patientSex: string;
  readType: string;
  studyDescriptionId: string;
  referringPhysicianIds: string[];
  visibleAddPhysicianModal: boolean;
  visibleAddDestinationModal: boolean;
  contrastPresent: string;
  contrastType: string;
  studyPriority: string;
  laterality: string;
  history: string;
};

class DBStudyConfirm extends React.Component<DBStudyConfirmProps, DBStudyConfirmState> {
  componentDidMount() {
    const props = this.props;
    if (!props.clientState) {
      const study = props.viewer.searchStudy;

      const readType =
        study.facility.techConf.readType === 'PRELIM_OR_FINAL'
          ? ReadTypeEnum.FINAL
          : study.facility.techConf.readType;

      this.props.onClientStateUpdate(() => ({
        patientName: study.patientName,
        patientId: study.patientId,
        patientDOB: moment.utc(study.patientDOB, 'YYYY-MM-DD'),
        patientSex: study.patientSex,
        readType,
        studyDescriptionId: study.studyDescription && study.studyDescription._id,
        referringPhysicianIds: study.referringPhysicians.map(rp => rp._id),
        visibleAddPhysicianModal: false,
        visibleAddDestinationModal: false,
        contrastPresent: study.contrastPresent,
        contrastType: study.contrastType || '',
        studyPriority: study.studyPriority,
        laterality: study.laterality,
        history: study.history,
      }));
    }
    // To disabled submit button at the beginning.
    // this.props.form.validateFields();
  }

  handleContrastStatusToggle = (value: ContrastPresentEnum) => {
    this.props.onClientStateUpdate({
      contrastPresent: value,
    });
  };
  handleInputChange = (key: Extract<keyof DBStudyConfirmState, string>, value: string) => {
    this.props.onClientStateUpdate(prevState => ({ ...prevState, [key]: value }));
  };
  handleSelectChange = (key: Extract<keyof DBStudyConfirmState, string>, value: string) => {
    this.props.onClientStateUpdate(prevState => ({ ...prevState, [key]: value }));
  };
  getContrastDetails = () => {
    const { studyDescriptionId } = this.props.clientState;
    const { viewer } = this.props;
    const study = viewer.searchStudy;
    const { facility } = study;
    const { contrastRequirements } = facility.techConf;
    const { studyDescriptions } = viewer;

    const selectedStudyDescription = studyDescriptions.find(sd => sd._id === studyDescriptionId);

    let showContrast = false;
    let isRequired = false;
    if (selectedStudyDescription) {
      const cr = contrastRequirements.find(cr => cr.modality === selectedStudyDescription.modality);
      if (cr && (cr.requirement === 'OPTIONAL' || cr.requirement === 'REQUIRED')) {
        showContrast = true;
        isRequired = cr.requirement === 'REQUIRED';
      }
    }

    return { showContrast, isRequired };
  };

  handleSubmit = (e: any) => {
    e.preventDefault();

    const studyId = this.props.viewer.searchStudy._id;
    const {
      patientName,
      patientId,
      patientDOB,
      patientSex,
      studyDescriptionId,
      studyPriority,
      readType,
      laterality,
      history,
      contrastPresent,
      contrastType,
      referringPhysicianIds,
    } = this.props.clientState;

    graphqlClient
      .mutate({
        mutation: confirmStudyMutation,
        variables: {
          studyId,
          patientName,
          patientId,
          patientDOB: patientDOB.format('YYYY-MM-DD'),
          patientSex,
          studyDescriptionId,
          studyPriority,
          readType,
          laterality,
          history,
          contrastPresent,
          contrastType,
          referringPhysicianIds,
        },
      })
      .then(() => {
        message.success('Study confirmed.');
        this.props.onClose();
      });

    // this.props.form.validateFields((err, values) => {
    //   if (!err) {
    console.log('Received values of form: ', e);
    console.log(e.target.value);
    // }
    // });
  };

  render() {
    const { clientState, viewer, children } = this.props;

    if (!clientState) {
      return null;
    }
    const {
      patientName,
      patientId,
      patientDOB,
      patientSex,
      studyDescriptionId,
      studyPriority,
      readType,
      laterality,
      history,
      contrastPresent,
      contrastType,
    } = clientState;

    const { searchStudy: study, studyDescriptions, user } = viewer;
    const { facility } = study;
    const { referringPhysicians } = facility;
    const selectedStudyDescription = studyDescriptions.find(sd => sd._id === studyDescriptionId);

    const { showContrast, isRequired: isContrastRequired } = this.getContrastDetails();

    const readTypeOptions =
      facility.techConf.readType === 'PRELIM_OR_FINAL'
        ? [{ value: 'PRELIM', label: 'Preliminary' }, { value: 'FINAL', label: 'Final' }]
        : facility.techConf.readType === 'PRELIM'
          ? [{ value: 'PRELIM', label: 'Preliminary' }]
          : [{ value: 'FINAL', label: 'Final' }];

    const requiredContrastFilled = isContrastRequired ? contrastPresent !== 'NOT_SELECTED' : true;
    const requiredFieldsFilled =
      patientSex && studyDescriptionId && studyPriority && readType && requiredContrastFilled;

    const studyLateralityList = Object.keys(StudyLateralityEnum).filter(
      sl => sl !== 'NOT_SELECTED',
    );
    return (
      <DashboardWindow
        title="Confirm Study"
        onMaximize={this.props.onMaximize}
        onClose={this.props.onClose}
        onSplitHorizontal={this.props.onSplitHorizontal}
        onSplitVertical={this.props.onSplitVertical}
        onSwapWindows={this.props.onSwapWindows}
        splitDirection={this.props.splitDirection}
      >
        <div className={css.studyEdit}>
          <Form layout="vertical" onSubmit={this.handleSubmit}>
            <Row gutter={20}>
              <Col span={13}>
                <Row gutter={20}>
                  <Col span={16}>
                    <FormItem label="Patient Name" required>
                      <Input
                        id="patientName"
                        type="text"
                        size="small"
                        value={patientName}
                        onPressEnter={null}
                        onChange={e => this.handleInputChange('patientName', e.target.value)}
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="Patient ID">
                      <Input
                        type="text"
                        size="small"
                        value={patientId}
                        onChange={e => this.handleInputChange('patientDOB', e.target.value)}
                      />
                    </FormItem>
                  </Col>
                </Row>

                <Row gutter={20}>
                  <Col span={9}>
                    <FormItem label="Date of Bird">
                      <DatePicker
                        size="small"
                        showToday={false}
                        value={patientDOB}
                        onChange={date => {
                          this.props.onClientStateUpdate({ patientDOB: date });
                        }}
                      />
                    </FormItem>
                  </Col>
                  <Col span={7}>
                    <FormItem label="Gender" required>
                      <Select
                        size="small"
                        defaultValue={patientSex}
                        onChange={(value: string) => this.handleSelectChange('patientSex', value)}
                      >
                        <Option value="M">Male</Option>
                        <Option value="F">Female</Option>
                      </Select>
                    </FormItem>
                  </Col>
                </Row>

                <Row gutter={20}>
                  <Col span={24}>
                    <FormItem label="Study Description" required>
                      <Select
                        size="small"
                        showSearch
                        placeholder="Select a description"
                        filterOption={(inputValue, option) => {
                          const inputValues = inputValue.split(' ');

                          const optionText = option.props.children.toString().toLowerCase();
                          return inputValues.every(v => optionText.includes(v.toLowerCase()));
                        }}
                        optionFilterProp="children"
                        value={studyDescriptionId}
                        onChange={(value: string) =>
                          this.handleSelectChange('studyDescriptionId', value)
                        }
                      >
                        {studyDescriptions.map(sDesc => (
                          <Option key={sDesc._id} value={sDesc._id}>
                            {`${sDesc.modality} ${sDesc.name}`}
                          </Option>
                        ))}
                      </Select>
                    </FormItem>
                  </Col>
                </Row>

                <Row gutter={20}>
                  <Col span={6}>
                    <FormItem label="Modality">
                      <Input
                        size="small"
                        disabled
                        value={selectedStudyDescription ? selectedStudyDescription.modality : ''}
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="Study Date">
                      <DatePicker
                        size="small"
                        disabled
                        // showToday={false}
                        defaultValue={moment('2001-01-01')}
                      />
                    </FormItem>
                  </Col>
                  <Col span={10}>
                    <FormItem label="Study Priority" required>
                      <Select
                        size="small"
                        placeholder="Select a priority"
                        value={studyPriority}
                        onChange={(value: string) =>
                          this.handleSelectChange('studyPriority', value)
                        }
                      >
                        {Object.keys(StudyPriorityEnum).map(sp => (
                          <Option key={sp}>{sp}</Option>
                        ))}
                      </Select>
                    </FormItem>
                  </Col>
                </Row>

                <Row gutter={20}>
                  <Col span={24}>
                    <FormItem label="Facility">
                      <Input type="text" size="small" value={facility.institutionName} disabled />
                    </FormItem>
                  </Col>
                </Row>

                <Row gutter={20}>
                  <Col span={12}>
                    <FormItem label="Read Type" required>
                      <Select
                        size="small"
                        // defaultValue="preliminary"
                        placeholder="Select a type"
                        disabled={!readTypeOptions.length}
                        value={readType}
                        onChange={(value: string) => this.handleSelectChange('readType', value)}
                      >
                        {readTypeOptions.map(rt => (
                          <Option key={rt.value}>{rt.label}</Option>
                        ))}
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="Laterality">
                      <Select
                        size="small"
                        placeholder="Laterality"
                        value={laterality}
                        onChange={(value: string) => this.handleSelectChange('laterality', value)}
                      >
                        {studyLateralityList.map(sl => (
                          <Option key={sl}>{sl}</Option>
                        ))}
                      </Select>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
              <Col span={11}>
                <Row>
                  <Col>
                    <FormItem label="History">
                      <TextArea
                        rows={4}
                        style={{ resize: 'none' }}
                        value={history}
                        onChange={e => this.handleInputChange('history', e.target.value)}
                      />
                    </FormItem>
                  </Col>
                </Row>
                {!showContrast ? null : (
                  <>
                    <Row>
                      <Col span={12}>
                        <FormItem label="Contrast" required={isContrastRequired} />
                      </Col>
                      <Col span={12}>
                        <Select
                          size="small"
                          placeholder="Select contrast"
                          value={contrastPresent}
                          onChange={this.handleContrastStatusToggle}
                        >
                          <Option key="NOT_SELECTED" value="NOT_SELECTED">
                            Select
                          </Option>
                          <Option key="YES" value="YES">
                            Yes
                          </Option>
                          <Option key="NO" value="NO">
                            No
                          </Option>
                        </Select>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormItem>
                          <ReactCollapse isOpened={contrastPresent === 'YES'}>
                            <TextArea
                              rows={4}
                              style={{ resize: 'none' }}
                              value={contrastType}
                              onChange={e => this.handleInputChange('contrastType', e.target.value)}
                            />
                          </ReactCollapse>
                        </FormItem>
                      </Col>
                    </Row>
                  </>
                )}
                <Row>
                  <Col>
                    <PhysicianContent
                      facilityId={facility._id}
                      referringPhysicians={referringPhysicians}
                      selectedPhysicianIds={study.referringPhysicians.map(p => p._id)}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <DestinationContent destinationList={[]} />
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col span={24}>
                    <FormItem>
                      <Button onClick={this.props.onClose}>Cancel</Button>

                      <Button
                        type="primary"
                        htmlType="submit"
                        disabled={
                          !requiredFieldsFilled ||
                          !user.userRole.permissions.find(
                            userPerm => userPerm === PermissionEnum.CONFIRM_STUDY,
                          )
                        }
                      >
                        Confirm
                      </Button>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>

          <div className={css.buttons}>{children}</div>
        </div>
      </DashboardWindow>
    );
  }
}

const DBStudyConfirmContainer = graphql<
  DBStudyConfirmProps,
  DBStudyConfirm_root,
  DBStudyConfirm_rootVariables
>(dbStudyConfirmQuery, {
  options: props => ({
    variables: { studyId: props.serverState.selectedStudyId },
  }),
});

export default DBStudyConfirmContainer(({ data, ...props }) => {
  const { loading, viewer } = data;

  if (loading || !data.viewer || !data.viewer.searchStudy) {
    return null;
  }

  const { serverState } = props;
  return <DBStudyConfirm key={serverState.selectedStudyId} viewer={data.viewer} {...props} />;
});
