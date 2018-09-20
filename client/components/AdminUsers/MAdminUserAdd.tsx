import React from 'react';

import { Modal } from 'antd';

import UserTabGeneralForm from './UserTabGeneralForm';
import gql from 'graphql-tag';
import graphqlClient from '../../graphqlClient';
import { AdminUsers_UserEntry } from '../../gqlTypes';

const userEntryFragment = gql`
  fragment MAdminUserAdd_userEntry on User {
    _id
    firstName
    lastName
    email
    userRole {
      _id
      name
    }
  }
`;

const addUserQuery = gql`
  mutation addUser(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $userRoleId: ObjectId!
  ) {
    addUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
      userRoleId: $userRoleId
    ) {
      viewer {
        _id
        users {
          ...MAdminUserAdd_userEntry
        }
      }
    }
  }
  ${userEntryFragment}
`;

type MAdminUserAddProps = {
  isEditMode: boolean;
  visible: boolean;
  title: string;
  okText: string;
  user: AdminUsers_UserEntry;
  onCancel(): void;
};

class MAdminUserAdd extends React.Component<MAdminUserAddProps> {
  formRef: any;

  handleUserCreate = () => {
    const form = this.formRef && this.formRef.props.form;

    if (!form) {
      return;
    }

    form.validateFields((err: any, values: any) => {
      if (err) {
        return;
      }

      const { firstName, lastName, email, userRoleId, password } = values;

      graphqlClient.mutate({
        mutation: addUserQuery,
        variables: {
          firstName,
          lastName,
          email,
          userRoleId,
          password,
        },
      });

      this.props.onCancel();
    });
  };

  render() {
    const { visible, title, okText, onCancel, ...otherProps } = this.props;

    return (
      <Modal
        visible={visible}
        title={title}
        okText={okText}
        onCancel={onCancel}
        onOk={this.handleUserCreate}
        width={648}
        destroyOnClose
      >
        <UserTabGeneralForm
          wrappedComponentRef={(thisForm: any) => {
            this.formRef = thisForm;
          }}
          {...otherProps}
        />
      </Modal>
    );
  }
}

export default MAdminUserAdd;
