import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import graphqlClient from '../../graphqlClient';

import css from './AdminStudyDescription.lessx';

import { Modal, Button, Form, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import TableCustom from '../TableCustom/TableCustom';

import ActionButtonsCommon from '../ActionButtonsCommon/ActionButtonsCommon';
import MDescriptionForm from './MDescriptionForm';

import { AdminStudyDescription_root } from '../../gqlTypes';
import {
  studyDescriptionFullFragment,
  reportTemplateFullFragment,
} from '../../fragments/fullFragments';

const addStudyDescriptionQuery = gql`
  mutation addStudyDescription(
    $name: String!
    $modality: ModalityEnum!
    $contrast: ContrastEnum!
    $reportTemplateId: ObjectId
  ) {
    addStudyDescription(
      name: $name
      modality: $modality
      contrast: $contrast
      reportTemplateId: $reportTemplateId
    ) {
      viewer {
        _id
        studyDescriptions {
          ...FullFragment_StudyDescription
        }
      }
    }
  }
  ${studyDescriptionFullFragment}
`;

const updateStudyDescriptionQuery = gql`
  mutation updateStudyDescription(
    $studyDescriptionId: ObjectId!
    $name: String!
    $modality: ModalityEnum!
    $contrast: ContrastEnum!
    $reportTemplateId: ObjectId!
  ) {
    updateStudyDescription(
      studyDescriptionId: $studyDescriptionId
      name: $name
      modality: $modality
      contrast: $contrast
      reportTemplateId: $reportTemplateId
    ) {
      ...FullFragment_StudyDescription
    }
  }
  ${studyDescriptionFullFragment}
`;
const deleteStudyDescriptionQuery = gql`
  mutation deleteStudyDescription($studyDescriptionId: ObjectId!) {
    deleteStudyDescription(studyDescriptionId: $studyDescriptionId) {
      viewer {
        _id
        studyDescriptions {
          ...FullFragment_StudyDescription
        }
      }
    }
  }
  ${studyDescriptionFullFragment}
`;

const StudyDescriptionQuery = gql`
  query AdminStudyDescription_root {
    viewer {
      _id
      studyDescriptions {
        ...FullFragment_StudyDescription
      }
      reportTemplates {
        ...FullFragment_ReportTemplate
      }
    }
  }
  ${studyDescriptionFullFragment}
  ${reportTemplateFullFragment}
`;

class RootQuery extends Query<AdminStudyDescription_root> {}

const initialState = {
  visibleModal: false,
  studyDescriptionEditId: '',
};
type State = Readonly<typeof initialState>;

class AdminStudyDescription extends React.Component<{}, State> {
  formRef: any;

  state = initialState;

  handleModalClose = () => {
    this.setState({
      visibleModal: false,
      studyDescriptionEditId: '',
    });
  };
  handleEditStudyDescription = (id: string) => {
    this.setState({
      studyDescriptionEditId: id,
    });
  };
  handleDeleteStudyDescription = (studyDescriptionId: string) => {
    graphqlClient.mutate({
      mutation: deleteStudyDescriptionQuery,
      variables: {
        studyDescriptionId,
      },
    });
  };

  handleAddStudyDescription = () => {
    const form = this.formRef && this.formRef.props.form;

    if (!form) {
      return;
    }

    form.validateFields((err: any, values: any) => {
      if (err) {
        return;
      }

      const { name, contrast, modality, reportTemplateId } = values;

      graphqlClient.mutate({
        mutation: addStudyDescriptionQuery,
        variables: {
          name,
          contrast,
          modality,
          reportTemplateId,
        },
      });

      this.handleModalClose();
    });
  };
  handleUpdateStudyDescription = () => {
    const form = this.formRef && this.formRef.props.form;

    if (!form) {
      return;
    }

    form.validateFields((err: any, values: any) => {
      if (err) {
        return;
      }

      const { name, contrast, modality, reportTemplateId } = values;

      graphqlClient.mutate({
        mutation: updateStudyDescriptionQuery,
        variables: {
          studyDescriptionId: this.state.studyDescriptionEditId,
          name,
          contrast,
          modality,
          reportTemplateId,
        },
      });
    });

    this.handleModalClose();
  };

  render() {
    const { studyDescriptionEditId, visibleModal } = this.state;
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Modality',
        dataIndex: 'modality',
        key: 'modality',
        width: 150,
      },
      {
        title: 'Contrast',
        dataIndex: 'contrast',
        key: 'contrast',
        width: 120,
      },
      {
        title: 'Template',
        dataIndex: 'template',
        key: 'template',
        width: 250,
        // render: data => (data.reportTemplate ? <span>{data.reportTemplate.name}</span> : null),
      },
      {
        title: '',
        dataIndex: '__Actions__',
        key: '__Actions__',
        width: 60,
        render: (data: any) => (
          <ActionButtonsCommon
            eventKey={data.studyDescriptionId}
            onDelete={this.handleDeleteStudyDescription}
            onEdit={this.handleEditStudyDescription}
          />
        ),
      },
    ];

    return (
      <RootQuery query={StudyDescriptionQuery}>
        {({ loading, error, data }) => {
          if (!data.viewer) {
            return null;
          }

          const dataSource = data.viewer.studyDescriptions.map(sd => ({
            ...sd,
            __Actions__: { studyDescriptionId: sd._id },
            template: sd.reportTemplate && sd.reportTemplate.name,
          }));

          const editedStudyDescription = studyDescriptionEditId
            ? data.viewer.studyDescriptions.find(study => study._id === studyDescriptionEditId)
            : null;

          return (
            <div className={css.studyDescription}>
              <div className={css.add}>
                <Button onClick={() => this.setState({ visibleModal: true })}>
                  Create Study Description
                </Button>

                <MDescriptionForm
                  wrappedComponentRef={(thisForm: any) => {
                    this.formRef = thisForm;
                  }}
                  visible={visibleModal || !!studyDescriptionEditId}
                  title={
                    studyDescriptionEditId
                      ? `Edit collection ${editedStudyDescription.name}`
                      : 'Create a new collection'
                  }
                  okText={studyDescriptionEditId ? 'Save' : 'Create'}
                  onCancel={this.handleModalClose}
                  onOk={
                    studyDescriptionEditId
                      ? this.handleUpdateStudyDescription
                      : this.handleAddStudyDescription
                  }
                  reportTemplates={data.viewer.reportTemplates}
                  studyDescription={editedStudyDescription}
                />
              </div>

              <TableCustom
                className={css.table}
                antdSize="small"
                columns={columns}
                dataSource={dataSource}
                pagination={{ pageSize: 50 }}
                scroll={{ y: 'CustomAutoHeight' }}
              />
            </div>
          );
        }}
      </RootQuery>
    );
  }
}

export default AdminStudyDescription;
