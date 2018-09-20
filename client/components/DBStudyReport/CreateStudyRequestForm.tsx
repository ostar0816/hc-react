import React from 'react';
import gql from 'graphql-tag';

import { Form, Input } from 'antd';
const FormItem = Form.Item;
const Textarea = Input.TextArea;
import { FormComponentProps } from 'antd/lib/form/form';

import formItemLayout from '../../constants/formItemLayout';
import { PhysicianCreateForm_referringPhysician } from '../../gqlTypes';

type CreateStudyRequestFormProps = {
  title: string;
  wrappedComponentRef: any;
};

const CreateStudyRequestForm = Form.create()(
  class extends React.Component<FormComponentProps & CreateStudyRequestFormProps> {
    render() {
      const { form, title } = this.props;

      const { getFieldDecorator } = form;

      return (
        <Form>
          <FormItem {...formItemLayout} label="Title">
            {getFieldDecorator('title', {
              initialValue: title,
              rules: [{ required: true }],
            })(<Input />)}
          </FormItem>

          <FormItem {...formItemLayout} label="Note">
            {getFieldDecorator('text', { rules: [{ required: true }] })(<Textarea rows={6} />)}
          </FormItem>
        </Form>
      );
    }
  },
);

export default CreateStudyRequestForm;
