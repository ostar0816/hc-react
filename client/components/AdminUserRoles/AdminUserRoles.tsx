import React from 'react';
import { Query } from 'react-apollo';
import graphqlClient from '../../graphqlClient';
import gql from 'graphql-tag';

import css from './AdminUserRoles.lessx';

import { Button } from 'antd';

import TableCustom from '../TableCustom/TableCustom';
import ActionButtonsCommon from '../ActionButtonsCommon/ActionButtonsCommon';

import MAdminUserRoleForm from './MAdminUserRoleForm';

import { AdminUserRoles_root } from '../../gqlTypes';
import { userRoleFullFragment } from '../../fragments/fullFragments';

const userRoleEntryFragment = gql`
  fragment AdminUserRoles_UserRoleEntry on UserRole {
    _id
    name
    description
  }
`;

const addUserRoleQuery = gql`
  mutation addUserRole($name: String!, $description: String!) {
    addUserRole(name: $name, description: $description) {
      viewer {
        _id
        userRoles {
          ...FullFragment_UserRole
        }
      }
    }
  }
  ${userRoleFullFragment}
`;

const updateUserRoleQuery = gql`
  mutation updateUserRole($userRoleId: ObjectId!, $name: String!, $description: String!) {
    updateUserRole(userRoleId: $userRoleId, name: $name, description: $description) {
      ...FullFragment_UserRole
    }
  }
  ${userRoleFullFragment}
`;

const ListUserRolesQuery = gql`
  query AdminUserRoles_root {
    viewer {
      _id
      userRoles {
        ...AdminUserRoles_UserRoleEntry
      }
    }
  }
  ${userRoleEntryFragment}
`;

class RootQuery extends Query<AdminUserRoles_root> {}

type AdminUserRolesProps = {};
const initialState = {
  visibleModal: false,
  editUserRoleId: '',
};
type AdminUserRolesState = Readonly<typeof initialState>;

class AdminUserRoles extends React.Component<AdminUserRolesProps, AdminUserRolesState> {
  formRef: any;

  state = initialState;

  handleModalClose = () => {
    this.setState({
      visibleModal: false,
      editUserRoleId: null,
    });
  };
  handleUserRoleCreate = () => {
    const form = this.formRef && this.formRef.props.form;

    if (!form) {
      return;
    }

    form.validateFields((err: any, values: any) => {
      if (err) {
        return;
      }

      const { name, description } = values;

      graphqlClient.mutate({
        mutation: addUserRoleQuery,
        variables: {
          name,
          description,
        },
      });

      this.handleModalClose();
    });
  };
  handleUserRoleEdit = () => {
    const form = this.formRef && this.formRef.props.form;

    if (!form) {
      return;
    }

    form.validateFields((err: any, values: any) => {
      if (err) {
        return;
      }

      const { name, description } = values;

      graphqlClient.mutate({
        mutation: updateUserRoleQuery,
        variables: {
          userRoleId: this.state.editUserRoleId,
          name,
          description,
        },
      });

      this.handleModalClose();
    });
  };

  render() {
    const { visibleModal, editUserRoleId } = this.state;

    const columns = [
      {
        title: 'Role',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: 'Description',
        dataIndex: 'description',
      },
      {
        title: 'Created',
        dataIndex: 'created',
        width: 200,
      },
      {
        title: '',
        dataIndex: '__ACTIONS__',
        width: 120,
        render: (data: any) => (
          <ActionButtonsCommon onEdit={() => this.setState({ editUserRoleId: data.userRoleId })} />
        ),
      },
    ];

    return (
      <RootQuery query={ListUserRolesQuery}>
        {({ loading, error, data }) => {
          if (!data.viewer) {
            return null;
          }

          const userRolesData = data.viewer.userRoles.map(role => ({
            ...role,
            __ACTIONS__: { userRoleId: role._id },
          }));

          const editedUserRole = editUserRoleId
            ? userRolesData.find(ur => ur._id === editUserRoleId)
            : null;

          return (
            <div className={css.facilities}>
              <div className={css.add}>
                <Button onClick={() => this.setState({ visibleModal: true })}>
                  Create New Role
                </Button>
                <MAdminUserRoleForm
                  wrappedComponentRef={(thisForm: any) => {
                    this.formRef = thisForm;
                  }}
                  visible={visibleModal || !!editUserRoleId}
                  title={
                    editUserRoleId ? `Edit users role ${editedUserRole.name}` : 'Create users role'
                  }
                  okText={editUserRoleId ? 'Save' : 'Create'}
                  userRole={editedUserRole}
                  onOk={editUserRoleId ? this.handleUserRoleEdit : this.handleUserRoleCreate}
                  onCancel={this.handleModalClose}
                />
              </div>

              <TableCustom
                className={css.table}
                rowKey="_id"
                antdSize="small"
                pagination={{ defaultPageSize: 50 }}
                columns={columns}
                dataSource={userRolesData}
                scroll={{ y: 'CustomAutoHeight' }}
              />
            </div>
          );
        }}
      </RootQuery>
    );
  }
}

export default AdminUserRoles;
