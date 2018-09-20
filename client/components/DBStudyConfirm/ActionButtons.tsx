import React from 'react';

import css from './ActionButtons.lessx';

import { Button, Popover, Popconfirm } from 'antd';

const initialState = {
  popoverButtonsVisible: false,
};
type ActionButtonsState = Readonly<typeof initialState>;
type ActionButtonsProps = {
  eventKey: string;
  onDeselect(eventKey: string): void;
  onDelete(eventKey: string): void;
  onEdit(eventKey: string): void;
};

class ActionButtons extends React.Component<ActionButtonsProps, ActionButtonsState> {
  state = initialState;

  handlePopoverHide = () => {
    this.setState({
      popoverButtonsVisible: false,
    });
  };
  handleCancelDeleteClick = () => {
    // this.setState({
    //   popoverButtonsVisible: true,
    // });
  };
  handlePopoverButtonsVisibleChange = (visible: boolean) => {
    this.setState({
      popoverButtonsVisible: visible,
    });
  };
  handleEdit = () => {
    this.props.onEdit(this.props.eventKey);

    this.handlePopoverHide();
  };

  render() {
    const { popoverButtonsVisible } = this.state;
    const { eventKey } = this.props;

    return (
      <span className={css.actionButtons}>
        <Button
          shape="circle"
          size="small"
          onClick={() => {
            this.props.onDeselect(eventKey);
          }}
          icon="close"
        />
        <Popover
          content={
            <div className={css.popoverContent}>
              <div>
                <Button size="small" onClick={this.handleEdit} icon="edit">
                  Edit
                </Button>
              </div>
              <div>
                <Popconfirm
                  title="Are you sure delete this?"
                  onConfirm={() => this.props.onDelete(eventKey)}
                  onCancel={this.handleCancelDeleteClick}
                  okText="Yes"
                  okType="danger"
                  cancelText="No"
                >
                  <Button size="small" icon="delete">
                    Delete
                  </Button>
                </Popconfirm>
              </div>
              <br />
              <div>
                <a onClick={this.handlePopoverHide}>Close</a>
              </div>
            </div>
          }
          placement="bottomRight"
          trigger="click"
          visible={popoverButtonsVisible}
          onVisibleChange={this.handlePopoverButtonsVisibleChange}
        >
          <Button shape="circle" size="small" icon="ellipsis" />
        </Popover>
      </span>
    );
  }
}

export default ActionButtons;
