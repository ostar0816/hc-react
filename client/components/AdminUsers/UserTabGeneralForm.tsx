import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import graphqlClient from '../../graphqlClient';

import css from './UserAddEdit.lessx';

import { Button, Form, Input, Select, Divider, message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import { FormComponentProps } from 'antd/lib/form/form';

import formItemLayout from '../../constants/formItemLayout';

import {
  FullFragment_User,
  FullFragment_UserRole,
  UserTabGeneralForm_root_viewer_userRoles,
} from '../../gqlTypes';
import { userFullFragment } from '../../fragments/fullFragments';

const updateUserQuery = gql`
  mutation updateUser(
    $userId: ObjectId!
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String
    $userRoleId: ObjectId!
  ) {
    updateUser(
      userId: $userId
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
      userRoleId: $userRoleId
    ) {
      ...FullFragment_User
    }
  }
  ${userFullFragment}
`;

const ListUserRolesQuery = gql`
  query UserTabGeneralForm_root {
    viewer {
      _id
      userRoles {
        _id
        name
      }
    }
  }
`;

const initialState = {
  confirmDirty: false,
};
type State = Readonly<typeof initialState>;
type Props = {
  isEditMode: boolean;
  user: FullFragment_User;
  userRoles: UserTabGeneralForm_root_viewer_userRoles[];
};

const UserTabGeneralForm = Form.create()(
  class extends React.Component<Props & FormComponentProps, State> {
    state = initialState;

    handleUserEdit = (e: any) => {
      e.preventDefault();

      const { form, user } = this.props;

      if (!form) {
        return;
      }

      form.validateFields((err: any, values: any) => {
        if (err) {
          return;
        }

        const { firstName, lastName, email, userRoleId, password } = values;

        graphqlClient
          .mutate({
            mutation: updateUserQuery,
            variables: {
              userId: user._id,
              firstName,
              lastName,
              email,
              password,
              userRoleId,
            },
          })
          .then(() => {
            message.success('Saved');
            form.resetFields(['password', 'confirm']);
          });
      });
    };

    handleConfirmBlur = (e: any) => {
      const value = e.target.value;

      this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };
    compareToFirstPassword = (rule: any, value: any, callback: any) => {
      const form = this.props.form;
      if (value && value !== form.getFieldValue('password')) {
        callback('Two passwords that you enter are inconsistent!');
      } else {
        callback();
      }
    };
    validateToNextPassword = (rule: any, value: any, callback: any) => {
      const form = this.props.form;
      if (value && this.state.confirmDirty) {
        form.validateFields(['confirm'], { force: true });
      }
      callback();
    };

    render() {
      const { form, user, userRoles, isEditMode } = this.props;
      const { getFieldDecorator, getFieldValue } = form;

      const isRequiredPassword =
        !isEditMode || !!getFieldValue('password') || !!getFieldValue('confirm');

      return (
        <Form className={css.form} onSubmit={isEditMode ? this.handleUserEdit : null}>
          <FormItem {...formItemLayout} label="First Name" required>
            {getFieldDecorator('firstName', {
              rules: [{ required: true, message: 'Please input the first name!' }],
              initialValue: user && user.firstName,
            })(<Input />)}
          </FormItem>

          <FormItem {...formItemLayout} label="Last Name" required>
            {getFieldDecorator('lastName', {
              rules: [{ required: true, message: 'Please input the last name!' }],
              initialValue: user && user.lastName,
            })(<Input />)}
          </FormItem>

          <FormItem {...formItemLayout} label="E-mail" required>
            {getFieldDecorator('email', {
              rules: [
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
                { required: true, message: 'Please input the E-mail!' },
              ],
              initialValue: user && user.email,
            })(<Input />)}
          </FormItem>

          <Divider />

          <FormItem {...formItemLayout} label={`${isEditMode ? 'New ' : ''}Password`}>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: isRequiredPassword,
                  message: 'Please input the password!',
                },
                { validator: this.validateToNextPassword },
              ],
            })(<Input type="password" />)}
          </FormItem>

          <FormItem {...formItemLayout} label={`Confirm ${isEditMode ? 'New ' : ''}Password`}>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: isRequiredPassword,
                  message: 'Please confirm the password!',
                },
                { validator: this.compareToFirstPassword },
              ],
            })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
          </FormItem>

          <Divider />

          <FormItem {...formItemLayout} label="Users Role" required>
            {getFieldDecorator('userRoleId', {
              rules: [{ required: true, message: 'Please input the role!' }],
              initialValue: user && user.userRole && user.userRole._id,
            })(<Select>{userRoles.map(ur => <Option key={ur._id}>{ur.name}</Option>)}</Select>)}
          </FormItem>

          {isEditMode ? (
            <div className={css.buttons}>
              <Button onClick={() => this.props.form.resetFields()}>Reset</Button>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </div>
          ) : null}
        </Form>
      );
    }
  },
);

export const UserTabGeneralFormFragments = {
  user: gql`
    fragment UserTabGeneralForm_User on User {
      ...FullFragment_User
    }
    ${userFullFragment}
  `,
};

function UserTabGeneralFormContainer(props: any) {
  return (
    <Query query={ListUserRolesQuery}>
      {({ loading, error, data }) => {
        if (loading || !data.viewer) {
          return null;
        }

        return <UserTabGeneralForm userRoles={data.viewer.userRoles} {...props} />;
      }}
    </Query>
  );
}

export default UserTabGeneralFormContainer;
