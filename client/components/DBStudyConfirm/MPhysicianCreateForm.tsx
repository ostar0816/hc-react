import React from 'react';
import { Modal, Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form/form';

import PhysicianCreateForm from './PhysicianCreateForm';
import { PhysicianCreateForm_referringPhysician } from '../../gqlTypes';

type MPhysicianCreateFormProps = {
  isEditMode: boolean;
  referringPhysician: PhysicianCreateForm_referringPhysician;
  visible: boolean;
  okText: string;
  onCancel(): void;
  onOk(): void;
};

const MPhysicianCreateForm = Form.create()(
  class extends React.Component<MPhysicianCreateFormProps & FormComponentProps> {
    static defaultProps = {
      okText: 'Create',
    };

    render() {
      const { visible, onCancel, onOk, okText, ...otherProps } = this.props;

      return (
        <Modal
          visible={visible}
          title="Create a new physician"
          okText={okText}
          onCancel={onCancel}
          onOk={onOk}
          destroyOnClose
        >
          <PhysicianCreateForm {...otherProps} />
        </Modal>
      );
    }
  },
);

export default MPhysicianCreateForm;
