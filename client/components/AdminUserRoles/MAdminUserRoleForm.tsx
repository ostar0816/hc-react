import React from 'react';

import { Modal, Form, Input } from 'antd';
const FormItem = Form.Item;
import { FormComponentProps } from 'antd/lib/form/form';

import formItemLayout from '../../constants/formItemLayout';

import { AdminUserRoles_root_viewer_userRoles } from '../../gqlTypes';

type AdminUserRoleFormProps = {
  userRole: AdminUserRoles_root_viewer_userRoles;
};

const AdminUserRoleForm = Form.create()(
  class extends React.Component<AdminUserRoleFormProps & FormComponentProps> {
    render() {
      const { form, userRole } = this.props;
      const { getFieldDecorator } = form;

      return (
        <Form>
          <FormItem {...formItemLayout} label="Users Role" required>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: 'Please input the name!' }],
              initialValue: userRole && userRole.name,
            })(<Input />)}
          </FormItem>

          <FormItem {...formItemLayout} label="Description" required>
            {getFieldDecorator('description', {
              rules: [{ required: true, message: 'Please input the description!' }],
              initialValue: userRole && userRole.description,
            })(<Input />)}
          </FormItem>
        </Form>
      );
    }
  },
);

type MAdminUserRoleFormProps = {
  visible: boolean;
  title: string;
  okText: string;
  userRole: AdminUserRoles_root_viewer_userRoles;
  wrappedComponentRef: any;
  onCancel(): void;
  onOk(): void;
};

class MAdminUserRoleForm extends React.Component<MAdminUserRoleFormProps> {
  render() {
    const { visible, title, okText, onCancel, onOk, ...otherProps } = this.props;

    return (
      <Modal
        visible={visible}
        title={title}
        okText={okText}
        onCancel={onCancel}
        onOk={onOk}
        width={648}
        destroyOnClose
      >
        <AdminUserRoleForm {...otherProps} />
      </Modal>
    );
  }
}

export default MAdminUserRoleForm;
