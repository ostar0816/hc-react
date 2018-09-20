import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import css from './Login.lessx';

import { Row, Col, Form, Input, Button, message } from 'antd';
const FormItem = Form.Item;

import formItemLayout from '../../constants/formItemLayout';
import gql from 'graphql-tag';
import graphqlClient from '../../graphqlClient';

const loginMutation = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      viewer {
        _id
        user {
          _id
        }
      }
    }
  }
`;

type LoginFormProps = {
  form: any;
  onLogin(email: string, password: string): void;
};

const LoginForm = Form.create()(
  class extends React.Component<LoginFormProps> {
    handleLoginClick = (e: any) => {
      e.preventDefault();

      const { form } = this.props;

      form.validateFields((err: any, values: any) => {
        if (err) {
          return;
        }

        form.resetFields();
        const { email, password } = values;
        this.props.onLogin(email, password);
      });
    };

    render() {
      const { form } = this.props;

      const { getFieldDecorator } = form;

      return (
        <Form onSubmit={this.handleLoginClick}>
          <FormItem {...formItemLayout} label="E-mail">
            {getFieldDecorator('email', {
              rules: [
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
                { required: true, message: 'Please input the login!' },
              ],
            })(<Input type="email" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Password">
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input the password!' }],
            })(<Input type="password" />)}
          </FormItem>

          <div>
            <Row type="flex" justify="end">
              <Col>
                <Button type="primary" htmlType="submit">
                  Login
                </Button>
              </Col>
            </Row>
          </div>
        </Form>
      );
    }
  },
);

const LoginInitialState = {
  redirectToReferrer: false,
};
type LoginState = Readonly<typeof LoginInitialState>;

class Login extends React.Component<RouteComponentProps<any>, LoginState> {
  state = LoginInitialState;

  handleLogin = (email: string, password: string) => {
    graphqlClient
      .mutate({
        mutation: loginMutation,
        variables: {
          email,
          password,
        },
      })
      .then(response => {
        if (response.data.login.viewer.user) {
          this.setState({
            redirectToReferrer: true,
          });
        } else {
          message.error('Email or password are incorrect.');
        }
      });
  };

  render() {
    const { redirectToReferrer } = this.state;
    const { from } = this.props.location.state || { from: { pathname: '/' } };

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <div className={css.login}>
        <Row type="flex" justify="space-around" align="middle">
          <Col span={6}>
            <LoginForm onLogin={this.handleLogin} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Login;
