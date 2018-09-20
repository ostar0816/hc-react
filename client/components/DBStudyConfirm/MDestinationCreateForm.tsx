import React from 'react';

import { Form, Input, Modal } from 'antd';
const FormItem = Form.Item;
import { FormComponentProps } from 'antd/lib/form/form';

import formItemLayout from '../../constants/formItemLayout';

type MDestinationCreateFormProps = {
  visible: boolean;
  okText?: string;
  onCancel(): void;
  onOk(): void;
};

const MDestinationCreateForm = Form.create()(
  class extends React.Component<MDestinationCreateFormProps & FormComponentProps> {
    static defaultProps = {
      okText: 'Create',
    };

    render() {
      const { visible, onCancel, onOk, okText } = this.props;

      return (
        <Modal
          visible={visible}
          title="Create a new destination"
          okText={okText}
          onCancel={onCancel}
          onOk={onOk}
          destroyOnClose
        >
          <Form>
            <FormItem {...formItemLayout} label="Name">
              <Input />
            </FormItem>
          </Form>
        </Modal>
      );
    }
  },
);

export default MDestinationCreateForm;
