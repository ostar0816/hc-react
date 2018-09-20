import React from 'react';
import gql from 'graphql-tag';

import css from './CreateStudyNoteMessageForm.lessx';

import { Form, Input, Checkbox } from 'antd';
const FormItem = Form.Item;
const Textarea = Input.TextArea;
import { FormComponentProps } from 'antd/lib/form/form';

import NoteItem from './NoteItem';

import formItemLayout from '../../constants/formItemLayout';
import { DBStudyReportNotes_studyNotes } from '../../gqlTypes';

type CreateStudyNoteMessageFormProps = {
  isResolvedHidden: boolean;
  note: DBStudyReportNotes_studyNotes;
};

const CreateStudyNoteMessageForm = Form.create()(
  class extends React.Component<FormComponentProps & CreateStudyNoteMessageFormProps> {
    render() {
      const { form, note, isResolvedHidden } = this.props;

      const { getFieldDecorator } = form;

      return (
        <div>
          <FormItem {...formItemLayout} label="Messages">
            <div className={css.messages}>
              <NoteItem readOnly note={note} />
            </div>
          </FormItem>
          <Form>
            <FormItem {...formItemLayout} label="Note">
              {getFieldDecorator('text', {
                rules: [{ required: true }],
              })(<Textarea style={{ resize: 'none' }} rows={6} />)}
            </FormItem>

            {isResolvedHidden ? null : (
              <FormItem {...formItemLayout} label="Resolved" disabled={isResolvedHidden}>
                {getFieldDecorator('resolved', {
                  initialValue: !!note.resolved,
                  valuePropName: 'checked', // https://github.com/ant-design/ant-design/issues/7481
                })(<Checkbox />)}
              </FormItem>
            )}
          </Form>
        </div>
      );
    }
  },
);

export default CreateStudyNoteMessageForm;
