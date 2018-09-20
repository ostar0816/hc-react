import React from 'react';

import css from './ActionButtonsCommon.lessx';

import { Button, Popover, Popconfirm } from 'antd';

type ActionButtonsCommonProps = {
  eventKey?: string | number;
  onEdit(eventKey: string | number): void;
  onRemove?(eventKey: string | number): void;
  onDelete?(eventKey: string | number): void;
};

class ActionButtonsCommon extends React.Component<ActionButtonsCommonProps> {
  handleCancelDeleteClick = () => {};
  handleDeleteClick = () => {
    this.props.onDelete(this.props.eventKey);
  };

  render() {
    const { onEdit, onRemove, onDelete } = this.props;

    return (
      <span className={css.actionButtons}>
        {onEdit ? (
          <Button
            shape="circle"
            size="small"
            onClick={() => {
              onEdit(this.props.eventKey);
            }}
            icon="edit"
          />
        ) : null}
        {onRemove ? (
          <Button
            shape="circle"
            size="small"
            onClick={() => {
              onRemove(this.props.eventKey);
            }}
            icon="close"
          />
        ) : null}
        {onDelete ? (
          <Popconfirm
            title="Are you sure delete this?"
            onConfirm={this.handleDeleteClick}
            onCancel={this.handleCancelDeleteClick}
            okText="Yes"
            okType="danger"
            cancelText="No"
          >
            <Button shape="circle" size="small" icon="delete" />
          </Popconfirm>
        ) : null}
      </span>
    );
  }
}

export default ActionButtonsCommon;
