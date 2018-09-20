import React from 'react';

import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { RouteComponentProps, withRouter } from 'react-router-dom';

import css from './AdminUsers.lessx';

import { Button, Input, Icon } from 'antd';
const Search = Input.Search;

import TableCustom from '../TableCustom/TableCustom';
import ActionButtonsCommon from '../ActionButtonsCommon/ActionButtonsCommon';

import MAdminUserAdd from './MAdminUserAdd';

import { AdminUsers_root } from '../../gqlTypes';

import PAGINATION from '../../constants/pagination';

const userEntryFragment = gql`
  fragment AdminUsers_UserEntry on User {
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

const ListUsersQuery = gql`
  query AdminUsers_root {
    viewer {
      _id
      users {
        ...AdminUsers_UserEntry
      }
    }
  }
  ${userEntryFragment}
`;

class RootQuery extends Query<AdminUsers_root> {}

const initialState = {
  visibleModal: false,
  editUserId: '',
  searchUser: '',
  pageCurrent: 1,
};
type AdminUsersState = Readonly<typeof initialState>;
type AdminUsersProps = RouteComponentProps<{}>;
class AdminUsers extends React.Component<AdminUsersProps, AdminUsersState> {
  state = initialState;

  handleModalClose = () => {
    this.setState({
      visibleModal: false,
      editUserId: '',
    });
  };

  handlePaginationChange = (page: number) => {
    this.setState({
      pageCurrent: page,
    });
  };

  searchUsers = users => {
    // const searchUser = this.state.searchUser.trim();
    const searchUserWords = this.state.searchUser
      .trim()
      .toLowerCase()
      .split(' ');

    const searchUser = searchUserWords.map(word => '(?=.*\\b' + word + ')').join('');

    const searchedUsers = users.filter(user => {
      const userText = `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase();

      const searchExp = new RegExp(searchUser, 'g');
      return searchExp.test(userText);
    });

    return searchedUsers;
  };

  render() {
    const { searchUser, pageCurrent } = this.state;
    const columns = [
      {
        title: 'First Name',
        dataIndex: 'firstName',
      },
      {
        title: 'Last Name',
        dataIndex: 'lastName',
        width: 300,
      },
      {
        title: 'E-mail',
        dataIndex: 'email',
        width: 300,
      },
      {
        title: 'User Role',
        dataIndex: 'userRole',
        width: 250,
        render: (data: any) => (data && data.name ? <span>{data.name}</span> : null),
      },
      // { title: 'Created', dataIndex: 'created', width: 200, },
      {
        title: '',
        dataIndex: '__ACTIONS__',
        width: 60,
        render: (data: any) => (
          <ActionButtonsCommon
            onEdit={() => this.props.history.push(`/administration/user/${data.userId}`)}
          />
        ),
      },
    ];

    return (
      <RootQuery query={ListUsersQuery}>
        {({ loading, error, data }) => {
          if (!data.viewer) {
            return null;
          }

          const usersData = data.viewer.users.map(user => ({
            ...user,
            __ACTIONS__: { userId: user._id },
          }));
          const searchedUsersData = searchUser ? this.searchUsers(usersData) : usersData;

          const { visibleModal, editUserId } = this.state;

          return (
            <div className={css.facilities}>
              <div className={css.header}>
                <div>
                  <Button onClick={() => this.setState({ visibleModal: true })}>
                    Create New User
                  </Button>
                  <MAdminUserAdd
                    visible={visibleModal || !!editUserId}
                    title={editUserId ? 'Edit user' : 'Create new user'}
                    okText={editUserId ? 'Save' : 'Create'}
                    isEditMode={!!editUserId}
                    user={editUserId ? usersData.find(u => u._id === editUserId) : null}
                    onCancel={this.handleModalClose}
                  />
                </div>
                <div>
                  <Search
                    placeholder="Search user"
                    value={searchUser}
                    onChange={e => this.setState({ searchUser: e.target.value, pageCurrent: 1 })}
                    style={{ width: 300 }}
                    addonAfter={
                      <Icon
                        type="close-circle-o"
                        onClick={() => this.setState({ searchUser: '' })}
                      />
                    }
                  />
                </div>
              </div>

              <TableCustom
                className={css.table}
                rowKey="_id"
                antdSize="small"
                pagination={{
                  ...PAGINATION,
                  onChange: this.handlePaginationChange,
                  current: pageCurrent,
                }}
                columns={columns}
                dataSource={searchedUsersData}
                scroll={{ y: 'CustomAutoHeight' }}
              />
            </div>
          );
        }}
      </RootQuery>
    );
  }
}

export default withRouter(AdminUsers);
