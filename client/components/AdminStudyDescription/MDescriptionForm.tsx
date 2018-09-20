import React from 'react';

import { Modal, Form, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import formItemLayout from '../../constants/formItemLayout';
import { ModalityEnum, ContrastEnum } from '../../gqlTypes';

import { FullFragment_StudyDescription, FullFragment_ReportTemplate } from '../../gqlTypes';

type DescriptionFormProps = {
  form: any;
  studyDescription: FullFragment_StudyDescription;
  reportTemplates: FullFragment_ReportTemplate[];
};

const DescriptionForm = Form.create()(
  class extends React.Component<DescriptionFormProps> {
    render() {
      const { form, studyDescription, reportTemplates } = this.props;
      const { getFieldDecorator } = form;

      const contrastList = [
        { key: 'NA', label: 'N/A' },
        { key: 'W', label: 'W' },
        { key: 'WO', label: 'WO' },
        { key: 'W_WO', label: 'W/WO' },
      ];

      return (
        <Form>
          <FormItem {...formItemLayout} label="Name" required>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: 'Please input the name!' }],
              initialValue: studyDescription && studyDescription.name,
            })(<Input />)}
          </FormItem>

          <FormItem {...formItemLayout} label="Modality" required>
            {getFieldDecorator('modality', {
              rules: [{ required: true, message: 'Please select the modality!' }],
              initialValue: studyDescription && studyDescription.modality,
            })(
              <Select>
                {Object.keys(ModalityEnum).map(modality => (
                  <Option key={modality}>{modality}</Option>
                ))}
              </Select>,
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="Contrast" required>
            {getFieldDecorator('contrast', {
              rules: [{ required: true, message: 'Please select the contrast!' }],
              initialValue: studyDescription && studyDescription.contrast,
            })(<Select>{Object.keys(ContrastEnum).map(c => <Option key={c}>{c}</Option>)}</Select>)}
          </FormItem>
          <FormItem {...formItemLayout} label="Template">
            {getFieldDecorator('reportTemplateId', {
              initialValue:
                studyDescription &&
                studyDescription.reportTemplate &&
                studyDescription.reportTemplate._id,
            })(
              <Select>
                {reportTemplates.map(template => (
                  <Option key={template._id}>{template.name}</Option>
                ))}
              </Select>,
            )}
          </FormItem>
        </Form>
      );
    }
  },
);

type MDescriptionFormProps = {
  visible: boolean;
  title: string;
  okText: string;
  wrappedComponentRef: any;
  studyDescription: FullFragment_StudyDescription;
  reportTemplates: FullFragment_ReportTemplate[];
  onOk(): void;
  onCancel(): void;
};

class MDescriptionForm extends React.Component<MDescriptionFormProps> {
  render() {
    const { visible, title, okText, onOk, onCancel, ...otherProps } = this.props;
    return (
      <Modal
        visible={visible}
        title={title}
        okText={okText}
        onCancel={onCancel}
        onOk={onOk}
        destroyOnClose
      >
        <DescriptionForm {...otherProps} />
      </Modal>
    );
  }
}

export default MDescriptionForm;
