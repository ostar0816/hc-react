import React from 'react';
import { Query } from 'react-apollo';
import graphqlClient from '../../graphqlClient';
import gql from 'graphql-tag';

import css from './AdminPermission.lessx';

import { Checkbox } from 'antd';

import TableCustom from '../TableCustom/TableCustom';

import { permissionDescriptions } from '../../../server/constants/permissions';
import { AdminPermission_root } from '../../gqlTypes';

const userRoleEntryFragment = gql`
  fragment AdminPermission_UserRoleEntry on UserRole {
    _id
    name
    permissions
  }
`;

const updateUserRolePermissionsQuery = gql`
  mutation updateUserRolePermissions($userRolePermissions: [UserRolePermissionsInput]!) {
    updateUserRolePermissions(userRolePermissions: $userRolePermissions) {
      viewer {
        userRoles {
          ...AdminPermission_UserRoleEntry
        }
      }
    }
  }
  ${userRoleEntryFragment}
`;

const ListUserRolesQuery = gql`
  query AdminPermission_root {
    viewer {
      _id
      userRoles {
        ...AdminPermission_UserRoleEntry
      }
    }
  }
  ${userRoleEntryFragment}
`;

class RootQuery extends Query<AdminPermission_root> {}

function TableCell(props: any) {
  return (
    <div>
      <Checkbox
        checked={props.checked}
        onChange={() => props.onCheckboxChange(props.rowKey, props.columnKey, !props.checked)}
      />
    </div>
  );
}

class AdminPermission extends React.Component {
  userRolePermissions: any[] = [];

  handleCheckboxChange = (rowKey: string, columnKey: string, checked: boolean) => {
    const userRolePermissions = this.userRolePermissions;
    const selectedUserRolePermission = userRolePermissions.find(
      urp => urp.userRoleId === columnKey,
    );

    let newPermissions = [];
    if (!checked) {
      newPermissions = selectedUserRolePermission.permissions.filter((p: string) => p !== rowKey);
    } else {
      newPermissions =
        selectedUserRolePermission && selectedUserRolePermission.permissions
          ? selectedUserRolePermission.permissions.slice()
          : [];
      newPermissions.push(rowKey);
    }

    const newUserRolePermission = { userRoleId: columnKey, permissions: newPermissions };
    // const newUserRolePermissions = userRolePermissions.filter(urp => urp.userRoleId !== columnKey);
    // newUserRolePermissions.push(newUserRolePermission);

    graphqlClient.mutate({
      mutation: updateUserRolePermissionsQuery,
      variables: {
        userRolePermissions: [newUserRolePermission],
      },
    });
  };

  render() {
    const dataSource = Object.keys(permissionDescriptions).map(key => ({
      key,
      permission: permissionDescriptions[key].label,
    }));

    const paddingVertical = 10;
    const style = {
      padding: `${paddingVertical}px 15px`,
    };

    return (
      <div className={css.permission} style={style}>
        <RootQuery query={ListUserRolesQuery} variables={{}}>
          {({ loading, error, data }) => {
            if (!data.viewer) {
              return null;
            }

            const { userRoles } = data.viewer;
            this.userRolePermissions = userRoles.map(urp => ({
              userRoleId: urp._id,
              permissions: urp.permissions,
            }));

            const columns = [
              {
                title: 'Permission',
                dataIndex: 'permission',
                width: 350,
                fixed: 'left',
              },
            ];

            userRoles.forEach(ur => {
              columns.push({
                title: ur.name,
                dataIndex: ur._id,
                width: 100,
                render: (text: string, record: any) => (
                  <TableCell
                    rowKey={record.key}
                    columnKey={ur._id}
                    checked={ur.permissions.find(urp => urp === record.key)}
                    onCheckboxChange={this.handleCheckboxChange}
                  />
                ),
              });
            });

            return (
              <TableCustom
                // rowKey="key"
                className={css.table}
                antdSize="small"
                pagination={false}
                columns={columns}
                dataSource={dataSource}
                scroll={{ y: 'CustomAutoHeight' }}
              />
            );
          }}
        </RootQuery>
      </div>
    );
  }
}

export default AdminPermission;
