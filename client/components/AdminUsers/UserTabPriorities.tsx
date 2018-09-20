import React from 'react';

import gql from 'graphql-tag';
import graphqlClient from '../../graphqlClient';
import { graphql } from 'react-apollo';

import { withRouter, RouteComponentProps } from 'react-router';
import classSet from 'classnames';

import css from './UserAddEdit.lessx';

import { Button, Form, Select, Input, Divider, Card, Col, Row, Modal } from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;

import TableCustom from '../TableCustom/TableCustom';
import ActionButtonsCommon from '../ActionButtonsCommon/ActionButtonsCommon';

import MAdminUserPriorityForm from './MAdminUserPriorityForm';

import { AssignPriorityEnum, UserTabPriorities_AssignPriorityEntry } from '../../gqlTypes';

const assignPrioritiesEntryFragment = gql`
  fragment UserTabPriorities_AssignPriorityEntry on AssignPriority {
    studyDescriptionNameRegex
    studyDescriptionModalityRegex
    facilityNameRegex
    studyPriorityRegex
    assignPriority
  }
`;
// firstName
// lastName
// email
const userEntryFragment = gql`
  fragment UserTabPriorities_UserEntry on User {
    _id
    assignPriorities {
      ...UserTabPriorities_AssignPriorityEntry
    }
  }
  ${assignPrioritiesEntryFragment}
`;

const updateAssignPrioritiesQuery = gql`
  mutation updateAssignPriorities($userId: ObjectId!, $assignPriorities: [AssignPriorityInput]!) {
    updateAssignPriorities(userId: $userId, assignPriorities: $assignPriorities) {
      ...UserTabPriorities_UserEntry
    }
  }
  ${userEntryFragment}
`;

type UserTabPrioritiesProps = {
  assignPriorities: UserTabPriorities_AssignPriorityEntry[];
};
type UserTabPrioritiesState = {
  assignPriorityEditId: number;
  visibleModal: boolean;
};

class UserTabPriorities extends React.Component<
  UserTabPrioritiesProps & RouteComponentProps<any>,
  UserTabPrioritiesState
> {
  constructor(props: any) {
    super(props);

    this.state = {
      assignPriorityEditId: null,
      visibleModal: false,
    };
  }

  static propTypes = {};

  handleModalClose = () => {
    this.setState({
      assignPriorityEditId: null,
      visibleModal: false,
    });
  };
  handlePrioritiesCreateAndUpdate = (values: any) => {
    const { assignPriorities } = this.props;
    const { assignPriorityEditId } = this.state;

    const userId = this.props.match.params.userId;
    const {
      studyDescriptionNameRegex,
      studyDescriptionModalityRegex,
      facilityNameRegex,
      studyPriorityRegex,
      assignPriority,
    } = values;

    const newAssignPriority = {
      studyDescriptionNameRegex: studyDescriptionNameRegex || '',
      studyDescriptionModalityRegex: studyDescriptionModalityRegex || '',
      facilityNameRegex: facilityNameRegex || '',
      studyPriorityRegex: studyPriorityRegex || '',
      assignPriority: assignPriority,
    };
    const newAssignPriorities = assignPriorities.slice();
    assignPriorityEditId === null
      ? newAssignPriorities.push(newAssignPriority)
      : newAssignPriorities.splice(assignPriorityEditId, 1, newAssignPriority);

    graphqlClient.mutate({
      mutation: updateAssignPrioritiesQuery,
      variables: {
        userId,
        assignPriorities: newAssignPriorities,
      },
    });

    this.handleModalClose();
  };
  handlePriorityEditClick = (eventKey: number) => {
    this.setState({
      assignPriorityEditId: eventKey,
    });
  };
  handlePriorityRemoveClick = (priorityId: number) => {
    const { assignPriorities } = this.props;
    const userId = this.props.match.params.userId;

    const newAssignPriorities = assignPriorities.slice();
    newAssignPriorities.splice(priorityId, 1);

    graphqlClient.mutate({
      mutation: updateAssignPrioritiesQuery,
      variables: {
        userId,
        assignPriorities: newAssignPriorities,
      },
    });
  };

  render() {
    const { assignPriorities } = this.props;
    const { visibleModal, assignPriorityEditId } = this.state;

    const priorities: any = [];
    const columns = [
      {
        dataIndex: 'studyDescriptionNameRegex',
        title: 'Study Desc. Name',
        width: 220,
      },
      { dataIndex: 'studyDescriptionModalityRegex', title: 'Study Desc. Modal', width: 220 },
      { dataIndex: 'facilityNameRegex', title: 'Facility Institution', width: 220 },
      { dataIndex: 'studyPriorityRegex', title: 'Study Priority', width: 220 },
      {
        dataIndex: 'assignPriority',
        title: 'Priority',
        render: (data: any) => {
          const priority = Object.keys(AssignPriorityEnum).find(pl => pl === data);

          return (
            <span
              className={classSet(
                css.priorityType,
                css[`priorityType--priority${priority.replace(/_/g, '')}`],
              )}
            >
              {priority.replace(/_/g, ' ')}
            </span>
          );
        },
      },
      {
        dataIndex: '__ACTIONS__',
        width: 60,
        render: (data: any) => (
          <ActionButtonsCommon
            eventKey={data.priorityId}
            onEdit={this.handlePriorityEditClick}
            onDelete={this.handlePriorityRemoveClick}
          />
        ),
      },
    ];

    const priorityData = assignPriorities.map((ap, index) => {
      const id = JSON.stringify(ap);

      return {
        ...ap,
        key: `${index}${id}`,
        __ACTIONS__: { priorityId: index },
      };
    });
    const editedPriority = assignPriorityEditId
      ? priorityData.find((p, index) => index === assignPriorityEditId)
      : null;

    return (
      <div>
        <div className={css.buttons}>
          <Button type="primary" onClick={() => this.setState({ visibleModal: true })}>
            Create user priority
          </Button>
        </div>

        <MAdminUserPriorityForm
          visible={visibleModal || !!assignPriorityEditId}
          title={assignPriorityEditId ? 'Edit priority' : 'Create new priority'}
          okText={assignPriorityEditId ? 'Save' : 'Create'}
          isEditMode={!!assignPriorityEditId}
          priority={editedPriority}
          onCancel={this.handleModalClose}
          onOk={this.handlePrioritiesCreateAndUpdate}
        />

        <TableCustom pagination={false} dataSource={priorityData} columns={columns} />
      </div>
    );
  }
}

export const UserTabPrioritiesFragments = {
  assignPriorities: gql`
    fragment UserTabPriorities_AssignPriority on AssignPriority {
      ...UserTabPriorities_AssignPriorityEntry
    }
    ${assignPrioritiesEntryFragment}
  `,
};

export default withRouter(UserTabPriorities);
