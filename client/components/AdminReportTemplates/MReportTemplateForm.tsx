import React from 'react';

import css from './MReportTemplateForm.lessx';

import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Modal, Button, Form, Input, Select, Divider } from 'antd';
const FormItem = Form.Item;

import RichEditor from '../RichEditor/RichEditor';

import formItemLayout from '../../constants/formItemLayout';

type ReportTemplateFormProps = {
  okText: string;
  reportTemplate: any;
  form: any;
  onOk(values: any | string): void;
  onCancel(): void;
};
type ReportTemplateFormState = {
  richEditorState: EditorState;
};

const ReportTemplateForm = Form.create()(
  class extends React.Component<ReportTemplateFormProps, ReportTemplateFormState> {
    constructor(props: any) {
      super(props);

      const { reportTemplate } = props;

      let newEditorState = {};
      if (reportTemplate && reportTemplate.template) {
        const contentState = convertFromRaw(reportTemplate.template);
        newEditorState = EditorState.createWithContent(contentState);
      } else {
        newEditorState = EditorState.createEmpty();
      }

      this.state = {
        richEditorState: newEditorState,
      };
    }

    handleEditorChange = (richEditorState: EditorState) => {
      this.setState({
        richEditorState,
      });
    };
    handleFormSubmit = (e: any) => {
      e.preventDefault();

      const { form } = this.props;

      form.validateFields((err: any, values: any) => {
        if (err) {
          return;
        }

        const currentContent = this.state.richEditorState.getCurrentContent();
        const currentRawContent = convertToRaw(currentContent);

        this.props.onOk({
          ...values,
          template: currentRawContent,
        });
      });
    };

    render() {
      const { okText, form, reportTemplate } = this.props;
      const { getFieldDecorator } = form;

      const editorStyle: any = {
        position: 'relative',
        width: 582,
        height: 350,
      };

      return (
        <Form onSubmit={this.handleFormSubmit}>
          <FormItem {...formItemLayout} label="Name" required>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: 'Please input the name!' }],
              initialValue: reportTemplate && reportTemplate.name,
            })(<Input />)}
          </FormItem>

          <FormItem {...formItemLayout} label="Description" required>
            {getFieldDecorator('description', {
              rules: [{ required: true, message: 'Please input the description!' }],
              initialValue: reportTemplate && reportTemplate.description,
            })(<Input />)}
          </FormItem>

          <FormItem label="Template" required>
            <div style={editorStyle}>
              <RichEditor
                editorState={this.state.richEditorState}
                onChange={this.handleEditorChange}
              />
            </div>
          </FormItem>

          <Divider />

          <div className={css.fakeFooter}>
            <Button onClick={this.props.onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {okText}
            </Button>
          </div>
        </Form>
      );
    }
  },
);

type MReportTemplateFormProps = {
  visible: boolean;
  title: string;
  okText: string;
  reportTemplate: any;
  onOk(values: any | string): void;
  onCancel(): void;
};

class MReportTemplateForm extends React.Component<MReportTemplateFormProps> {
  render() {
    const { visible, title, ...otherProps } = this.props;

    return (
      <Modal
        visible={visible}
        title={title}
        // okText={okText}
        onCancel={this.props.onCancel}
        // onOk={onOk}
        // onOk={this.handleOkClick}
        destroyOnClose
        width={630}
        footer={null}
      >
        <ReportTemplateForm {...otherProps} />
      </Modal>
    );
  }
}

export default MReportTemplateForm;
