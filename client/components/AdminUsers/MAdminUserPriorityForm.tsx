import React from 'react';
import gql from 'graphql-tag';
import { graphql, Query } from 'react-apollo';

import { Modal, Form, Input, Row, Col, Button, Select, Divider } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import { FormComponentProps } from 'antd/lib/form/form';

import css from './MAdminUserPriorityForm.lessx';

import TableCustom from '../TableCustom/TableCustom';

import {
  UserTabPriorities_AssignPriorityEntry,
  AssignPriorityEnum,
  StudyPriorityEnum,
} from '../../gqlTypes';

const ListPrioritiessQuery = gql`
  query AdminUserPriorityForm_root {
    viewer {
      _id
      studyDescriptions {
        _id
        name
        modality
      }
      facilities {
        _id
        institutionName
      }
    }
  }
`;

class RootQuery extends Query<AdminUserPriorityForm_rootQuery> {}

type AdminUserPriorityFormProps = {
  proprity: UserTabPriorities_AssignPriorityEntry;
  okText: string;
  onCancel(): void;
  onOk(values: any): void;
};
type MAdminUserPriorityFormState = {
  studyDescriptionNameRegex: string;
  studyDescriptionModalityRegex: string;
  facilityNameRegex: string;
  studyPriorityRegex: string;
  assignPriority: string;
};

const AdminUserPriorityForm = Form.create()(
  class extends React.Component<
    AdminUserPriorityFormProps & FormComponentProps,
    MAdminUserPriorityFormState
  > {
    constructor(props: any) {
      super(props);

      const { priority } = props;

      this.state = {
        studyDescriptionNameRegex: (priority && priority.studyDescriptionNameRegex) || '',
        studyDescriptionModalityRegex: (priority && priority.studyDescriptionModalityRegex) || '',
        facilityNameRegex: (priority && priority.facilityNameRegex) || '',
        studyPriorityRegex: (priority && priority.studyPriorityRegex) || '',
        assignPriority: (priority && priority.assignPriority) || '',
      };
    }

    handleSubmit = e => {
      e.preventDefault();

      const {
        studyDescriptionNameRegex,
        studyDescriptionModalityRegex,
        studyPriorityRegex,
        facilityNameRegex,
        assignPriority,
      } = this.state;

      const values = {
        studyDescriptionNameRegex,
        studyDescriptionModalityRegex,
        studyPriorityRegex,
        facilityNameRegex,
        assignPriority,
      };

      this.props.onOk(values);
    };
    handleFormItemChange = (eventKey: string, value: string) => {
      this.setState({
        [eventKey]: value,
      });
    };

    regexTestStudyDescription({ nameRegex, nameText }: any, { modalityRegex, modalityText }: any) {
      if (nameRegex.length && modalityRegex.length) {
        try {
          return RegExp(nameRegex).test(nameText) && RegExp(modalityRegex).test(modalityText);
        } catch (error) {
          return false;
        }
      }
      if (nameRegex.length) {
        try {
          return RegExp(nameRegex).test(nameText);
        } catch (error) {
          return false;
        }
      }

      try {
        return modalityRegex.length && RegExp(modalityRegex).test(modalityText);
      } catch (error) {
        return false;
      }
    }
    regexTest(regex: string, text: string) {
      try {
        return regex.length && RegExp(regex).test(text);
      } catch (error) {
        return false;
      }
    }

    render() {
      const { form, okText, onCancel } = this.props;
      const {
        studyDescriptionNameRegex,
        studyDescriptionModalityRegex,
        studyPriorityRegex,
        facilityNameRegex,
        assignPriority,
      } = this.state;

      const columnsStudyDescription = [
        {
          dataIndex: 'name',
          title: 'S. D. Name',
        },
        { dataIndex: 'modality', title: 'Modality' },
      ];
      const columnsFacility = [
        {
          dataIndex: 'institutionName',
          title: 'Facility',
          render: (data: any) => (
            <span title={data} style={{ fontSize: 10 }}>
              {data}
            </span>
          ),
        },
      ];

      const columnsStudyPriority = [
        {
          dataIndex: 'studyPriority',
          title: 'Study Priority',
        },
      ];
      const StudyPriorityList = Object.keys(StudyPriorityEnum).map(sp => ({
        key: sp,
        studyPriority: sp,
      }));

      return (
        <Form onSubmit={this.handleSubmit} layout="vertical">
          <div>Regular Expression</div>

          <Row gutter={16} type="flex" align="bottom">
            <Col span={4}>
              <FormItem label="Study Desc. Name">
                <Input
                  value={studyDescriptionNameRegex}
                  onChange={e =>
                    this.handleFormItemChange('studyDescriptionNameRegex', e.target.value)
                  }
                />
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem label="Study Desc. Modality">
                <Input
                  value={studyDescriptionModalityRegex}
                  onChange={e =>
                    this.handleFormItemChange('studyDescriptionModalityRegex', e.target.value)
                  }
                />
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem label="Facility institution">
                <Input
                  value={facilityNameRegex}
                  onChange={e => this.handleFormItemChange('facilityNameRegex', e.target.value)}
                />
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem label="Study Priority">
                <Input
                  value={studyPriorityRegex}
                  onChange={e => this.handleFormItemChange('studyPriorityRegex', e.target.value)}
                />
              </FormItem>
            </Col>
            <Col span={4} />
            <Col span={4}>
              <FormItem label="Priority">
                <Select
                  // defaultActiveFirstOption
                  // firstActiveValue="ZERO"
                  // defaultValue="ZERO"
                  value={assignPriority || 'ZERO'}
                  onSelect={(value: string) => this.handleFormItemChange('assignPriority', value)}
                >
                  {Object.keys(AssignPriorityEnum).map(priority => (
                    <Option key={priority} value={priority}>
                      {priority.replace(/_/g, ' ')}
                    </Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
          </Row>

          <Divider />

          <div className={css.buttons}>
            <Button onClick={this.props.onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {okText}
            </Button>
          </div>

          <Divider />

          <RootQuery query={ListPrioritiessQuery}>
            {({ loading, error, data }) => {
              if (!data.viewer) {
                return null;
              }

              const dataSourceStudyDescription = data.viewer.studyDescriptions.filter(sd =>
                this.regexTestStudyDescription(
                  { nameRegex: studyDescriptionNameRegex, nameText: sd.name },
                  {
                    modalityRegex: studyDescriptionModalityRegex,
                    modalityText: sd.modality,
                  },
                ),
              );
              const dataSourceFacility = data.viewer.facilities.filter(facility =>
                this.regexTest(facilityNameRegex, facility.institutionName),
              );
              const dataSourceStudyPriority = StudyPriorityList.filter(sp =>
                this.regexTest(studyPriorityRegex, sp.studyPriority),
              );

              return (
                <div className={css.regexPreview}>
                  <Row gutter={4}>
                    <Col span={12}>
                      <TableCustom
                        rowKey="_id"
                        pagination={false}
                        dataSource={dataSourceStudyDescription}
                        columns={columnsStudyDescription}
                      />
                    </Col>
                    <Col span={6}>
                      <TableCustom
                        rowKey="_id"
                        pagination={false}
                        dataSource={dataSourceFacility}
                        columns={columnsFacility}
                      />
                    </Col>
                    <Col span={6}>
                      <TableCustom
                        pagination={false}
                        dataSource={dataSourceStudyPriority}
                        columns={columnsStudyPriority}
                      />
                    </Col>
                  </Row>
                </div>
              );
            }}
          </RootQuery>
        </Form>
      );
    }
  },
);

type MAdminUserPriorityFormProps = {
  visible: boolean;
  isEditMode: boolean;
  title: string;
  okText: string;
  priority: UserTabPriorities_AssignPriorityEntry;
  onCancel(): void;
  onOk(values: any): void;
};

class MAdminUserPriorityForm extends React.Component<MAdminUserPriorityFormProps> {
  render() {
    const { visible, title, ...otherProps } = this.props;

    return (
      <Modal
        visible={visible}
        title={title}
        // okText={okText}
        onCancel={this.props.onCancel}
        // onOk={onOk}
        width={990}
        footer={null}
        destroyOnClose
      >
        <AdminUserPriorityForm {...otherProps} />
      </Modal>
    );
  }
}

export default MAdminUserPriorityForm;
