import React from 'react';
import graphqlClient from '../../graphqlClient';
import gql from 'graphql-tag';

import classSet from 'classnames';

import css from './FacilityAddEdit.lessx';

import {
  ContrastRequirementsInput,
  updateFacilityTechConfVariables,
  ContrastRequirementsEnum,
  ReadTypeEnum,
  ModalityEnum,
  FacilityTabTechConfForm_FacilityEntry,
  StudyPriorityEnum,
} from '../../gqlTypes';
import { message, Button, Select, Divider, Row, Col, Form, InputNumber } from 'antd';
import { FormComponentProps } from 'antd/lib/form/form';
const FormItem = Form.Item;
const Option = Select.Option;

import tatLimit from './../../constants/tatLimit';

const facilityEntryFragment = gql`
  fragment FacilityTabTechConfForm_FacilityEntry on Facility {
    _id
    techConf {
      contrastRequirements {
        requirement
        modality
      }
      readType
      tatLimits {
        timeSeconds
        studyPriority
      }
    }
  }
`;

const updateFacilityTechConfQuery = gql`
  mutation updateFacilityTechConf(
    $facilityId: ObjectId!
    $contrastRequirements: [ContrastRequirementsInput!]!
    $readType: ReadTypeEnum!
    $tatLimits: [TATLimitInput!]!
  ) {
    updateFacilityTechConf(
      facilityId: $facilityId
      contrastRequirements: $contrastRequirements
      readType: $readType
      tatLimits: $tatLimits
    ) {
      ...FacilityTabTechConfForm_FacilityEntry
    }
  }
  ${facilityEntryFragment}
`;

type FacilityTabTechConfFormProps = {
  facility: FacilityTabTechConfForm_FacilityEntry;
};
type FacilityTabTechConfFormState = {
  tatLimits: any[];
};

const FacilityTabTechConfForm = Form.create()(
  class extends React.Component<
    FacilityTabTechConfFormProps & FormComponentProps,
    FacilityTabTechConfFormState
  > {
    constructor(props: FacilityTabTechConfFormProps & FormComponentProps) {
      super(props);

      if (props.facility.techConf && props.facility.techConf.tatLimits) {
        this.state = {
          tatLimits: props.facility.techConf.tatLimits,
        };
      } else {
        this.state = {
          tatLimits: [],
        };
      }
    }

    handleInputNumberChange = (studyPriority: string, value: number, type: 'minutes' | 'hours') => {
      const { tatLimits } = this.state;

      const oldTatLimit = tatLimits.find(limit => limit.studyPriority === studyPriority);
      const newTatLimits = tatLimits.filter(limit => limit.studyPriority !== studyPriority);

      if (value >= 0) {
        const valueHours =
          oldTatLimit && oldTatLimit.timeSeconds ? Math.floor(oldTatLimit.timeSeconds / 3600) : 0;
        const valueMinutes =
          oldTatLimit && oldTatLimit.timeSeconds
            ? (oldTatLimit.timeSeconds - valueHours * 3600) / 60
            : 0;

        const valueHoursInSeconds = type === 'hours' ? value * 3600 : valueHours * 3600;
        const valueMinutesInSeconds =
          type === 'minutes' && value <= 59 ? value * 60 : valueMinutes * 60;

        if (valueHoursInSeconds + valueMinutesInSeconds > 0) {
          newTatLimits.push({
            studyPriority,
            timeSeconds: valueHoursInSeconds + valueMinutesInSeconds,
          });
        }

        this.setState({
          tatLimits: newTatLimits,
        });
      }
    };
    handleTechConfSave = (e: any) => {
      e.preventDefault();

      const { form, facility } = this.props;
      const facilityId = facility._id;

      type Values = {
        contrastRequirement_CT: ContrastRequirementsEnum;
        contrastRequirement_MR: ContrastRequirementsEnum;
        readType: ReadTypeEnum;
      };

      form.validateFields((errs: any, values: Values) => {
        if (errs) {
          return;
        }

        const { contrastRequirement_CT, contrastRequirement_MR, readType } = values;

        const contrastRequirements: ContrastRequirementsInput[] = [];
        if (contrastRequirement_CT) {
          contrastRequirements.push({
            modality: ModalityEnum.CT,
            requirement: contrastRequirement_CT,
          });
        }

        if (contrastRequirement_MR) {
          contrastRequirements.push({
            modality: ModalityEnum.MR,
            requirement: contrastRequirement_MR,
          });
        }

        const variables: updateFacilityTechConfVariables = {
          facilityId,
          contrastRequirements,
          readType,
          tatLimits: this.state.tatLimits,
        };
        graphqlClient
          .mutate({
            mutation: updateFacilityTechConfQuery,
            variables,
          })
          .then(() => message.success('Saved'));
      });
    };

    renderStudyPriorityInputs = studyPriorityList => {
      const { tatLimits } = this.state;

      return studyPriorityList.map(spOption => {
        const tatLimit = tatLimits.find(limit => limit.studyPriority === spOption);
        const value = tatLimit && tatLimit.timeSeconds;
        let valueHours = null;
        let valueMinutes = null;
        if (value) {
          valueHours = Math.floor(value / 3600);
          valueMinutes = (value - valueHours * 3600) / 60;
        }

        return (
          <Row key={spOption}>
            <Col span={8}>{spOption}</Col>
            <Col span={8}>
              <InputNumber
                // min={0.5}
                min={0}
                step={1}
                value={valueHours}
                onChange={value => this.handleInputNumberChange(spOption, value, 'hours')}
                // style={{ width: 70 }}
              />
            </Col>
            <Col span={8}>
              <InputNumber
                max={59}
                min={0}
                step={1}
                value={valueMinutes}
                onChange={value => this.handleInputNumberChange(spOption, value, 'minutes')}
                // style={{ width: 70 }}
              />
            </Col>
          </Row>
        );
      });
    };
    render() {
      const { form, facility } = this.props;
      const { getFieldDecorator } = form;

      const contrastStatusList = [
        { key: 'REQUIRED', label: 'Required' },
        { key: 'OPTIONAL', label: 'Optional' },
        { key: 'NEVER_SEEN', label: 'Never Seen' },
      ];
      const readTypeList = [
        { key: 'PRELIM', label: 'Prelim' },
        { key: 'PRELIM_OR_FINAL', label: 'Prelim or Final' },
        { key: 'FINAL', label: 'Final' },
      ];

      const contrastRequirement_CT =
        facility.techConf &&
        facility.techConf.contrastRequirements.find(cr => cr.modality === 'CT');
      const contrastRequirement_MR =
        facility.techConf &&
        facility.techConf.contrastRequirements.find(cr => cr.modality === 'MR');

      const studyPriorityArrayLeft = Object.keys(StudyPriorityEnum);
      const studyPriorityArrayRight = studyPriorityArrayLeft.splice(
        Math.ceil(studyPriorityArrayLeft.length / 2),
      );

      return (
        <Form onSubmit={this.handleTechConfSave} className={css.form}>
          <Divider orientation="left">Contrast Status</Divider>

          {/*<h3>Contrast Status</h3>*/}

          <Row gutter={20}>
            <Col span={12}>
              <FormItem label="CT">
                {getFieldDecorator('contrastRequirement_CT', {
                  initialValue:
                    (contrastRequirement_CT && contrastRequirement_CT.requirement) || null,
                  rules: [{ required: true }],
                })(
                  <Select>
                    {contrastStatusList.map(option => (
                      <Option key={option.key}>{option.label}</Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="MR">
                {getFieldDecorator('contrastRequirement_MR', {
                  initialValue:
                    (contrastRequirement_MR && contrastRequirement_MR.requirement) || null,
                  rules: [{ required: true }],
                })(
                  <Select>
                    {contrastStatusList.map(option => (
                      <Option key={option.key}>{option.label}</Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>

          <Divider />

          <Row gutter={20}>
            <Col span={12}>
              <FormItem label="Read Type">
                {getFieldDecorator('readType', {
                  initialValue:
                    (facility && facility.techConf && facility.techConf.readType) || null,
                  rules: [{ required: true }],
                })(
                  <Select>
                    {readTypeList.map(option => (
                      <Option key={option.key}>{option.label}</Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>

          <Divider />

          <div>
            <FormItem label="TAT Limit [hh:mm]">
              <Row gutter={20}>
                <Col span={12}>{this.renderStudyPriorityInputs(studyPriorityArrayLeft)}</Col>
                <Col span={12}>
                  {this.renderStudyPriorityInputs(studyPriorityArrayRight)}
                  <Row>
                    <Col span={8}>
                      <div
                        className={classSet(
                          css.tableRowPreview,
                          css['tableRowPreview--warningLast'],
                        )}
                      >
                        {`Study < ${tatLimit.warningLast} h`}
                      </div>
                    </Col>
                    <Col span={8}>
                      <div
                        className={classSet(
                          css.tableRowPreview,
                          css['tableRowPreview--warningSecond'],
                        )}
                      >
                        {`Study < ${tatLimit.warningSecond} hrs`}
                      </div>
                    </Col>
                    <Col span={8}>
                      <div
                        className={classSet(
                          css.tableRowPreview,
                          css['tableRowPreview--warningFirst'],
                        )}
                      >
                        {'Others'}
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </FormItem>
          </div>

          <div className={css.buttons}>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        </Form>
      );
    }
  },
);

export const FacilityTabTechConfFormFragments = {
  facility: gql`
    fragment FacilityTabTechConfForm_Facility on Facility {
      ...FacilityTabTechConfForm_FacilityEntry
    }
    ${facilityEntryFragment}
  `,
};

export default FacilityTabTechConfForm;
