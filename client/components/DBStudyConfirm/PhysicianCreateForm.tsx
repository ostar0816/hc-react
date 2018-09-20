import React from 'react';
import gql from 'graphql-tag';

import { Form, Input } from 'antd';
const FormItem = Form.Item;
import { FormComponentProps } from 'antd/lib/form/form';

import formItemLayout from '../../constants/formItemLayout';
import { PhysicianCreateForm_referringPhysician } from '../../gqlTypes';

type PhysicianCreateFormProps = {
  referringPhysician?: PhysicianCreateForm_referringPhysician;
};

class PhysicianCreateForm extends React.Component<PhysicianCreateFormProps & FormComponentProps> {
  render() {
    const { form, referringPhysician } = this.props;

    const { getFieldDecorator } = form;

    return (
      <Form>
        <FormItem {...formItemLayout} label="Name">
          {getFieldDecorator('name', {
            initialValue: (referringPhysician && referringPhysician.name) || null,
            rules: [{ required: true }],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Id">
          {getFieldDecorator('physicianUid', {
            initialValue: (referringPhysician && referringPhysician.physicianUid) || null,
            rules: [{ required: true }],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Phone">
          {getFieldDecorator('phone', {
            initialValue: (referringPhysician && referringPhysician.phone) || null,
            rules: [{ required: true }],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="E-mail">
          {getFieldDecorator('email', {
            initialValue: (referringPhysician && referringPhysician.email) || null,
            rules: [{ required: true }],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Fax">
          {getFieldDecorator('fax', {
            initialValue: (referringPhysician && referringPhysician.fax) || null,
            rules: [{ required: true }],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Dicom Value">
          {getFieldDecorator('dicomValue', {
            initialValue: (referringPhysician && referringPhysician.dicomValue) || null,
            rules: [{ required: true }],
          })(<Input />)}
        </FormItem>
      </Form>
    );
  }

  static fragments = {
    referringPhysician: gql`
      fragment PhysicianCreateForm_referringPhysician on ReferringPhysician {
        name
        physicianUid
        phone
        email
        fax
        dicomValue
      }
    `,
  };
}

export default PhysicianCreateForm;
