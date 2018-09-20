import React from 'react';

import css from './ActionButtons.lessx';

import { Button, Popover, Icon } from 'antd';
import { StudySupportRequestStatusEnum } from '../../gqlTypes';

type ActionButtonsProps = {
  studyId: string;
  hideConfirmButton?: boolean;
  supportRequestStatus?: StudySupportRequestStatusEnum;
  hideReportButton?: boolean;
  isDisabledReportButton?: boolean;
  onOpenStudyConfirmWindow(studyId: string): void;
  onOpenStudyReportWindow(studyId: string): void;
};
const initialState = {
  popoverVisible: false,
};
type ActionButtonsState = Readonly<typeof initialState>;

class ActionButtons extends React.Component<ActionButtonsProps, ActionButtonsState> {
  state = initialState;

  handlePopoverHide = () => {
    this.setState({
      popoverVisible: false,
    });
  };
  handlePopoverVisibleChange = (visible: boolean) => {
    this.setState({ popoverVisible: visible });
  };

  render() {
    const { popoverVisible } = this.state;
    const {
      hideConfirmButton,
      hideReportButton,
      isDisabledReportButton,
      supportRequestStatus,
    } = this.props;

    return (
      <div className={css.actionButtons} onClick={event => event.stopPropagation()}>
        {hideReportButton ? null : (
          <div>
            <Button
              shape="circle"
              size="small"
              disabled={isDisabledReportButton}
              onClick={() => {
                this.props.onOpenStudyReportWindow(this.props.studyId);
              }}
              icon="file-text"
            />
          </div>
        )}
        {hideConfirmButton ? null : (
          <div>
            <Button
              shape="circle"
              size="small"
              onClick={() => {
                this.props.onOpenStudyConfirmWindow(this.props.studyId);
              }}
              icon="edit"
            />
          </div>
        )}
        <div>
          <Button shape="circle" size="small" onClick={null} icon="download" />
        </div>
        <div>
          <Popover
            content={
              <div>
                <div>
                  <Button size="small" onClick={null} icon="delete">
                    Delete
                  </Button>
                </div>
                <br />
                <div>
                  <a onClick={this.handlePopoverHide}>Close</a>
                </div>
              </div>
            }
            // title="Title"
            placement="bottomRight"
            trigger="click"
            visible={popoverVisible}
            onVisibleChange={this.handlePopoverVisibleChange}
          >
            <Button shape="circle" size="small" icon="ellipsis" />
          </Popover>
        </div>
        {supportRequestStatus === StudySupportRequestStatusEnum.NONE ? null : (
          <div title="Request Status">
            <Icon
              type={
                supportRequestStatus === StudySupportRequestStatusEnum.PENDING
                  ? 'question-circle'
                  : 'check' // check-circle - similar to question-circle
              }
            />
          </div>
        )}
      </div>
    );
  }
}

export default ActionButtons;
