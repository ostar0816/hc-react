import React from 'react';

import css from './ActionButtons.lessx';

import { Button, Popover } from 'antd';
import ActionButtonsPopoverContent from './ActionButtonsPopoverContent';

type ActionButtonsProps = {
  studyId: string;
  onViewStudy(studyId: string): void;
  onDownload(studyId: string): void;
};
const initialState = { popoverVisible: false };
type ActionButtonsState = Readonly<typeof initialState>;

class ActionButtons extends React.Component<ActionButtonsProps, ActionButtonsState> {
  state = initialState;

  handlePopoverVisibleChange = (visible: boolean) => {
    this.setState({ popoverVisible: visible });
  };

  render() {
    const { studyId } = this.props;
    const { popoverVisible } = this.state;

    return (
      <div className={css.actionButtons}>
        <Popover
          content={
            <ActionButtonsPopoverContent
              studyId={studyId}
              onDownload={this.props.onDownload}
              onViewStudy={this.props.onViewStudy}
            />
          }
          placement="bottomRight"
          trigger="click"
          visible={popoverVisible}
          onVisibleChange={this.handlePopoverVisibleChange}
        >
          <Button shape="circle" size="small" icon="ellipsis" />
        </Popover>
      </div>
    );
  }
}

export default ActionButtons;
