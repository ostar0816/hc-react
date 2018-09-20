import React from 'react';
import gql from 'graphql-tag';

import classSet from 'classnames';
import moment from 'moment';

import css from './NoteItem.lessx';

import { Button, Icon } from 'antd';

import { DBStudyReportNotes_studyNotes } from '../../gqlTypes';

type NoteItemProps = {
  note: DBStudyReportNotes_studyNotes;
  readOnly?: boolean;
  onEditNote?(noteId: string): void;
};
const initialState = {};
type NoteItemState = Readonly<typeof initialState>;

class NoteItem extends React.Component<NoteItemProps, NoteItemState> {
  renderMessageFooter = message => {
    return (
      <div>
        <span>{moment(message.createdTime).format('L, h:mm a')}</span>{' '}
        <strong>{`${message.createdBy.firstName} ${message.createdBy.lastName &&
          message.createdBy.lastName.charAt(0)}.`}</strong>
      </div>
    );
  };

  render() {
    const { note, readOnly } = this.props;

    const classes = {
      [css['noteItem--resolved']]: note.resolved,
      [css['noteItem--pending']]: !note.resolved,
    };
    const messages = [...note.messages];
    const firstMessage = messages.shift();
    const firstMessageUserId = firstMessage.createdBy._id;

    return (
      <div className={classSet(css.noteItem, classes)}>
        <div className={css.noteItem__header}>
          <div>
            <h4>
              <Icon type={note.resolved ? 'check-circle-o' : 'exclamation-circle-o'} />
              {` ${note.title}`}
            </h4>
          </div>
          <div>
            {readOnly ? null : (
              <Button
                size="small"
                icon="edit"
                shape="circle-outline"
                onClick={() => this.props.onEditNote(note._id)}
              />
            )}
          </div>
        </div>

        {firstMessage.text ? <div>{firstMessage.text}</div> : null}

        <div className={css.noteItem__footer}>
          <div />
          {this.renderMessageFooter(firstMessage)}
        </div>

        {messages &&
          messages.map((message, index) => (
            <div
              className={classSet(
                css.noteItem,
                firstMessageUserId === message.createdBy._id ? classes : null,
              )}
              key={`msg_${index}`}
            >
              <div>{message.text}</div>
              <div className={css.noteItem__footer}>
                <div />
                {this.renderMessageFooter(message)}
              </div>
            </div>
          ))}
      </div>
    );
  }
}

export default NoteItem;
