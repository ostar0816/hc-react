import React from 'react';

import gql from 'graphql-tag';
import graphqlClient from '../../graphqlClient';
import { graphql } from 'react-apollo';

import { withRouter, RouteComponentProps } from 'react-router-dom';

import css from './UserAddEdit.lessx';

import { Tabs, Button, Row, Col } from 'antd';
const TabPane = Tabs.TabPane;

import UserTabGeneralForm, { UserTabGeneralFormFragments } from './UserTabGeneralForm';
import UserTabAssignedFacilities, {
  UserTabAssignedFacilitiesFragments,
} from './UserTabAssignedFacilities';
import UserTabAllowedFacilities, {
  UserTabAllowedFacilitiesFragments,
} from './UserTabAllowedFacilities';
import UserTabPriorities, { UserTabPrioritiesFragments } from './UserTabPriorities';
import { UserEdit_root } from '../../gqlTypes';

const UserEditQuery_root = gql`
  query UserEdit_root($userId: ObjectId) {
    viewer {
      _id
      searchUser: searchUserById(userId: $userId) {
        _id
        assignedFacilities {
          ...UserTabAssignedFacilities_AssignedFacility
        }
        assignPriorities {
          ...UserTabPriorities_AssignPriority
        }
        allowedFacilities {
          ...UserTabAllowedFacilities_Facility
        }
        ...UserTabGeneralForm_User
      }
      userRoles {
        _id
        name
      }
      facilities {
        ...UserTabAllowedFacilities_Facility
      }
    }
  }
  ${UserTabPrioritiesFragments.assignPriorities}
  ${UserTabAssignedFacilitiesFragments.assignedFacilities}
  ${UserTabAllowedFacilitiesFragments.facilities}
  ${UserTabGeneralFormFragments.user}
`;

type UserEditProps = {} & UserEdit_root;

class UserEdit extends React.Component<UserEditProps & RouteComponentProps<any>> {
  handleBack = () => {
    this.props.history.push('/administration/users');
  };
  handleTabChange = (activeKey: string) => {
    const { history, match } = this.props;

    history.push(`/administration/user/${match.params.userId}/${activeKey}`);
  };

  render() {
    const { viewer, match } = this.props;
    const userId = match.params.userId;

    const tabList = [
      {
        key: 'general',
        title: 'General',
        content: (
          <UserTabGeneralForm isEditMode user={viewer.searchUser} userRoles={viewer.userRoles} />
        ),
      },
      {
        key: 'assigned-facilities',
        title: 'Assigned Facilities',
        content: (
          <UserTabAssignedFacilities
            assignedFacilities={viewer.searchUser && viewer.searchUser.assignedFacilities}
          />
        ),
      },
      {
        key: 'allowed-facilities',
        title: 'Allowed Facilities',
        content: (
          <UserTabAllowedFacilities
            facilities={viewer.facilities}
            allowedFacilities={viewer.searchUser && viewer.searchUser.allowedFacilities}
          />
        ),
      },
      {
        key: 'priorities',
        title: 'Priorities',
        content: (
          <UserTabPriorities
            assignPriorities={viewer.searchUser && viewer.searchUser.assignPriorities}
          />
        ),
      },
    ];

    return (
      <div className={css.content}>
        <div className={css.header}>
          <div>
            <Row>
              <Col span={4}>
                <Button onClick={() => this.handleBack()}>Back to Users</Button>
              </Col>
              <Col span={16}>
                {viewer.searchUser ? (
                  <h3>
                    <span>Editing user </span>
                    <span>
                      {viewer.searchUser.firstName} {viewer.searchUser.lastName}
                    </span>
                  </h3>
                ) : null}
              </Col>
              <Col span={4} />
            </Row>
          </div>
        </div>

        <div className={css.body}>
          <div className={css.edit}>
            <Tabs
              type="card"
              defaultActiveKey={match.params.userTabKey || tabList[0].key}
              onChange={this.handleTabChange}
            >
              {tabList.map(tab => (
                <TabPane tab={tab.title} key={tab.key}>
                  {tab.content}
                </TabPane>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

type Response = {} & UserEdit_root;
type Variables = {
  userId: string;
}; // UserEdit_rootVariables
interface routerProps {
  userId: string;
}
const UserEditContainer = graphql<RouteComponentProps<routerProps>, Response, Variables>(
  UserEditQuery_root,
  {
    options: ({ ...props }) => ({
      variables: { userId: props.match.params.userId },
    }),
  },
);

export default withRouter(
  UserEditContainer(({ data, ...props }) => {
    if (data.loading) return <div>Loading</div>;

    if (data.error) return <h1>ERROR</h1>;

    return <UserEdit key={props.match.params.userId} viewer={data.viewer} {...props} />;
  }),
);
