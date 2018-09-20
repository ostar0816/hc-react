import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import graphqlClient from '../../graphqlClient';

import css from './AdminReportTemplates.lessx';

import { Modal, Button, Form, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import TableCustom from '../TableCustom/TableCustom';

import ActionButtonsCommon from '../ActionButtonsCommon/ActionButtonsCommon';

import MReportTemplateForm from './MReportTemplateForm';
import { AdminReportTemplate_root, FullFragment_ReportTemplate } from '../../gqlTypes';
import { reportTemplateFullFragment } from '../../fragments/fullFragments';

const addReportTemplateQuery = gql`
  mutation addReportTemplate($name: String!, $description: String!, $template: JSON!) {
    addReportTemplate(name: $name, description: $description, template: $template) {
      viewer {
        _id
        reportTemplates {
          ...FullFragment_ReportTemplate
        }
      }
    }
  }
  ${reportTemplateFullFragment}
`;

const updateReportTemplateQuery = gql`
  mutation updateReportTemplate(
    $reportTemplateId: ObjectId!
    $name: String!
    $description: String!
    $template: JSON!
  ) {
    updateReportTemplate(
      reportTemplateId: $reportTemplateId
      name: $name
      description: $description
      template: $template
    ) {
      ...FullFragment_ReportTemplate
    }
  }
  ${reportTemplateFullFragment}
`;

const deleteReportTemplateQuery = gql`
  mutation deleteReportTemplate($reportTemplateId: ObjectId!) {
    deleteReportTemplate(reportTemplateId: $reportTemplateId) {
      viewer {
        _id
        reportTemplates {
          ...FullFragment_ReportTemplate
        }
      }
    }
  }
  ${reportTemplateFullFragment}
`;

const ReportTemplateQuery = gql`
  query AdminReportTemplate_root {
    viewer {
      _id
      reportTemplates {
        ...FullFragment_ReportTemplate
      }
    }
  }
  ${reportTemplateFullFragment}
`;

class RootQuery extends Query<AdminReportTemplate_root> {}

const initialState = {
  visibleModal: false,
  reportTemplateEditId: '',
};
type State = Readonly<typeof initialState>;

class AdminReportTemplates extends React.Component<{}, State> {
  state = initialState;

  handleModalClose = () => {
    this.setState({
      visibleModal: false,
      reportTemplateEditId: '',
    });
  };
  handleEditReportTemplate = (id: string) => {
    this.setState({
      reportTemplateEditId: id,
    });
  };
  handleDeleteReportTemplate = (reportTemplateId: string) => {
    graphqlClient.mutate({
      mutation: deleteReportTemplateQuery,
      variables: {
        reportTemplateId,
      },
    });
  };
  handleAddReportTemplate = (values: FullFragment_ReportTemplate) => {
    const { name, description, template } = values;

    graphqlClient.mutate({
      mutation: addReportTemplateQuery,
      variables: {
        name,
        description,
        template,
      },
    });

    this.handleModalClose();
  };
  handleUpdateReportTemplate = (values: FullFragment_ReportTemplate) => {
    const { name, description, template } = values;

    graphqlClient.mutate({
      mutation: updateReportTemplateQuery,
      variables: {
        reportTemplateId: this.state.reportTemplateEditId,
        name,
        description,
        template,
      },
    });

    this.handleModalClose();
  };

  render() {
    const { reportTemplateEditId, visibleModal } = this.state;

    const columns = [
      {
        title: 'Template Name',
        dataIndex: 'name',
        key: 'name',
        width: 300,
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: '',
        dataIndex: '__Actions__',
        key: '__Actions__',
        width: 60,
        render: (data: any) => (
          <ActionButtonsCommon
            eventKey={data.reportTemplateId}
            onDelete={this.handleDeleteReportTemplate}
            onEdit={this.handleEditReportTemplate}
          />
        ),
      },
    ];

    return (
      <RootQuery query={ReportTemplateQuery}>
        {({ loading, error, data }) => {
          if (!data.viewer) {
            return null;
          }

          const dataSource = data.viewer.reportTemplates.map(rt => ({
            ...rt,
            __Actions__: { reportTemplateId: rt._id },
          }));

          const editedReportTemplate = reportTemplateEditId
            ? data.viewer.reportTemplates.find(template => template._id === reportTemplateEditId)
            : null;

          return (
            <div className={css.reportTemplate}>
              <div className={css.add}>
                <Button onClick={() => this.setState({ visibleModal: true })}>
                  Create Report Template
                </Button>

                <MReportTemplateForm
                  visible={visibleModal || !!reportTemplateEditId}
                  title={
                    reportTemplateEditId
                      ? `Edit template ${editedReportTemplate.name}`
                      : 'Create a new template'
                  }
                  okText={reportTemplateEditId ? 'Save' : 'Create'}
                  onCancel={this.handleModalClose}
                  onOk={dataEvent => {
                    reportTemplateEditId
                      ? this.handleUpdateReportTemplate(dataEvent)
                      : this.handleAddReportTemplate(dataEvent);
                  }}
                  reportTemplate={editedReportTemplate}
                />
              </div>

              <TableCustom
                rowKey="_id"
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

export default AdminReportTemplates;
