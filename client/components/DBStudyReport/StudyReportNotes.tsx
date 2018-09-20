import React from 'react';
import gql from 'graphql-tag';
import graphqlClient from '../../graphqlClient';

import css from './StudyReportNotes.lessx';

import { Modal } from 'antd';

import NoteItem from './NoteItem';
import CreateStudyNoteMessageForm from './CreateStudyNoteMessageForm';

import { StudyReportNotes_studyNotes, PermissionEnum } from '../../gqlTypes';

const studyNotesEntryFragment = gql`
  fragment StudyReportNotes_studyNotesEntry on StudyNote {
    _id
    type
    title
    messages {
      createdBy {
        _id
        firstName
        lastName
      }
      createdTime
      text
    }
    resolved
  }
`;

const addStudyNoteMessageMutation = gql`
  mutation addStudyNoteMessage(
    $studyId: ObjectId!
    $noteId: ObjectId!
    $text: String!
    $resolved: Boolean
  ) {
    addStudyNoteMessage(studyId: $studyId, noteId: $noteId, text: $text, resolved: $resolved) {
      _id
      notes {
        ...StudyReportNotes_studyNotesEntry
      }
      supportRequestStatus
    }
  }
  ${studyNotesEntryFragment}
`;

type StudyReportNotesProps = {
  style: any;
  notes: StudyReportNotes_studyNotes[];
  studyId: string;
};
const initialState = {
  visibleCreateNoteMessageModal: '',
};
type StudyReportNotesState = Readonly<typeof initialState>;

class StudyReportNotes extends React.Component<StudyReportNotesProps, StudyReportNotesState> {
  formCreateMessageRef: any;

  state = initialState;

  handleMessageCreate = () => {
    const form = this.formCreateMessageRef.props.form;

    form.validateFields((err: any, values: any) => {
      if (err) {
        return;
      }

      const { studyId } = this.props;
      const { visibleCreateNoteMessageModal } = this.state;

      graphqlClient.mutate({
        mutation: addStudyNoteMessageMutation,
        variables: {
          studyId: studyId,
          noteId: visibleCreateNoteMessageModal,
          text: values.text,
          resolved: values.resolved,
        },
      });

      this.setState({
        visibleCreateNoteMessageModal: '',
      });
    });
  };

  render() {
    const { notes, user, style } = this.props;
    const { visibleCreateNoteMessageModal } = this.state;

    const isResolvedHidden = !user.userRole.permissions.includes(
      PermissionEnum.RESOLVE_SUPPORT_REQUEST,
    );

    return (
      <div style={style}>
        <div className={css.notes}>
          {notes.map(note => (
            <NoteItem
              key={note._id}
              note={note}
              onEditNote={noteId => this.setState({ visibleCreateNoteMessageModal: noteId })}
            />
          ))}
          {notes.length === 0 ? (
            <div className={css.notes__empty}>
              <div>No Notes</div>
            </div>
          ) : null}
        </div>

        <Modal
          visible={!!visibleCreateNoteMessageModal}
          title="Write Message"
          okText="Create"
          onCancel={() => this.setState({ visibleCreateNoteMessageModal: '' })}
          onOk={this.handleMessageCreate}
          width={648}
          destroyOnClose
        >
          <CreateStudyNoteMessageForm
            isResolvedHidden={isResolvedHidden}
            note={
              visibleCreateNoteMessageModal &&
              notes.find(note => note._id === visibleCreateNoteMessageModal)
            }
            wrappedComponentRef={(thisForm: any) => {
              this.formCreateMessageRef = thisForm;
            }}
          />
        </Modal>
      </div>
    );
  }

  static fragments = {
    studyNotes: gql`
      fragment StudyReportNotes_studyNotes on StudyNote {
        ...StudyReportNotes_studyNotesEntry
      }
      ${studyNotesEntryFragment}
    `,
    currentUser: gql`
      fragment StudyReportNotes_user on User {
        _id
        userRole {
          permissions
        }
      }
    `,
  };
}

export default StudyReportNotes;
