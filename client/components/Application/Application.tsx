import React from 'react';
import { Query, graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { Route, Link, Redirect } from 'react-router-dom';
import { withRouter, RouteComponentProps } from 'react-router';
import graphqlClient from '../../graphqlClient';

// https://github.com/FortAwesome/react-fontawesome
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faMicrophone,
  faBold,
  faItalic,
  faUnderline,
  faRedo,
  faUndo,
} from '@fortawesome/free-solid-svg-icons';
library.add(faMicrophone, faBold, faItalic, faUnderline, faRedo, faUndo);

import css from './Application.lessx';

import { Layout, Menu, Row, Col, Button, Icon } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

import Login from '../Login/Login';
import FlowBoard from '../FlowBoard/FlowBoard';
import AdminFacilities from '../AdminFacilities/AdminFacilities';
import FacilityEdit from '../AdminFacilities/FacilityEdit';
import AdminStudyDescription from '../AdminStudyDescription/AdminStudyDescription';
import AdminPermission from '../AdminPermission/AdminPermission';
import AdminUsers from '../AdminUsers/AdminUsers';
import UserEdit from '../AdminUsers/UserEdit';
import AdminUserRoles from '../AdminUserRoles/AdminUserRoles';
import AdminReportTemplates from '../AdminReportTemplates/AdminReportTemplates';

import { appQuery } from '../../gqlTypes';

const appQuery_root = gql`
  query appQuery {
    viewer {
      _id
      user {
        _id
      }
    }
  }
`;

const logoutMutation = gql`
  mutation logout {
    logout {
      viewer {
        _id
        user {
          _id
        }
      }
    }
  }
`;

type ApplicationProps = {} & appQuery;

class Application extends React.Component<ApplicationProps & RouteComponentProps<any>> {
  handleUserMenuClick = ({ key }: any) => {
    if (key === 'logout') {
      graphqlClient
        .mutate({
          mutation: logoutMutation,
        })
        .then(() => {
          graphqlClient.resetStore();
        });
    }
  };
  render() {
    const mainMenu = [
      {
        key: 'worklist',
        title: 'Worklist',
        linkTo: '/',
      },
      {
        key: 'messages',
        title: 'Messages',
      },
      {
        key: 'qa',
        title: 'QA',
      },
      {
        key: 'analytics',
        title: 'Analytics',
      },
      {
        key: 'procedures',
        title: 'Procedures',
      },
      {
        key: 'administration',
        title: 'Administration',
        subMenu: [
          {
            key: 'facilities',
            title: 'Facilities',
            linkTo: '/administration/facilities',
          },
          {
            key: 'studyDescription',
            title: 'Study Description',
            linkTo: '/administration/study-description',
          },
          {
            key: 'reportTemplates',
            title: 'Report Templates',
            linkTo: '/administration/report-templates',
          },
          {
            key: 'users',
            title: 'Users',
            linkTo: '/administration/users',
          },
          {
            key: 'userRoles',
            title: 'User Roles',
            linkTo: '/administration/user-roles',
          },
          {
            key: 'permission',
            title: 'Permission',
            linkTo: '/administration/permission',
          },
        ],
      },
      {
        key: 'Reports',
        title: 'Reports',
      },
      {
        key: 'miscellaneous',
        title: 'Miscellaneous',
      },
      {
        key: 'help',
        title: 'Help',
      },
    ];

    const { location, viewer } = this.props;

    const { user } = viewer;

    return (
      <div className={css.application}>
        <Layout>
          {location.pathname === '/login' ? null : (
            <Header>
              <Row>
                <Col span={2} />
                <Col span={19}>
                  <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['flowBoard']}>
                    {mainMenu.map(
                      item =>
                        item.subMenu ? (
                          <SubMenu key={item.key} title={item.title}>
                            {item.subMenu.map(smItem => (
                              <Menu.Item key={smItem.key}>
                                {smItem.linkTo ? (
                                  <Link to={smItem.linkTo}>{smItem.title}</Link>
                                ) : (
                                  item.title
                                )}
                              </Menu.Item>
                            ))}
                          </SubMenu>
                        ) : (
                          <Menu.Item key={item.key}>
                            {item.linkTo ? <Link to={item.linkTo}>{item.title}</Link> : item.title}
                          </Menu.Item>
                        ),
                    )}
                  </Menu>
                </Col>
                <Col span={3}>
                  {/*<Button shape="circle">
                <Icon type="warning" style={{ fontSize: 20 }} />
              </Button>
              <Button shape="circle">
                <Icon type="mail" style={{ fontSize: 20 }} />
              </Button>*/}
                  <Menu
                    onClick={this.handleUserMenuClick}
                    // selectedKeys={[this.state.current]}
                    theme="dark"
                    mode="horizontal"
                  >
                    <Menu.Item key="mail">
                      <Icon type="mail" style={{ fontSize: 28, verticalAlign: 'middle' }} />
                    </Menu.Item>
                    <SubMenu
                      title={<Icon type="user" style={{ fontSize: 28, verticalAlign: 'middle' }} />}
                    >
                      <Menu.Item key="logout">Logout</Menu.Item>
                    </SubMenu>
                  </Menu>
                </Col>
              </Row>
            </Header>
          )}
          <Content>
            <Route path="/login" component={Login} />
            {!user && location.pathname !== '/login' ? (
              <Redirect
                to={{
                  pathname: '/login',
                  state: { from: location },
                }}
              />
            ) : (
              <>
                <Route exact path="/" component={FlowBoard} />
                <Route
                  path="/administration/facility/:facilityId/:facilityTabKey?"
                  component={FacilityEdit}
                />
                <Route path="/administration/facilities" component={AdminFacilities} />
                <Route path="/administration/study-description" component={AdminStudyDescription} />
                <Route path="/administration/report-templates" component={AdminReportTemplates} />
                <Route path="/administration/user/:userId/:userTabKey?" component={UserEdit} />
                <Route path="/administration/users" component={AdminUsers} />
                <Route path="/administration/user-roles" component={AdminUserRoles} />
                <Route path="/administration/permission" component={AdminPermission} />
              </>
            )}
          </Content>
          {/*<Footer>footer</Footer>*/}
        </Layout>
      </div>
    );
  }
}

type Response = {} & appQuery;
const ApplicationContainer = graphql<RouteComponentProps<any>, Response>(appQuery_root);

export default withRouter(
  ApplicationContainer(({ data, ...props }) => {
    if (data.loading) return <div>Loading</div>;

    if (data.error) return <h1>ERROR</h1>;

    return <Application viewer={data.viewer} {...props} />;
  }),
);
