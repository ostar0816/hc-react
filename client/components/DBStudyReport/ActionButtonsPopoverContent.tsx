import React from 'react';

import css from './ActionButtons.lessx';

import { Button } from 'antd';

type ActionButtonsPopoverContentProps = {
  studyId: string;
  onViewStudy(studyId: string): void;
  onDownload(studyId: string): void;
};
const initialState = {};
type ActionButtonsPopoverContentState = Readonly<typeof initialState>;

class ActionButtonsPopoverContent extends React.Component<
  ActionButtonsPopoverContentProps,
  ActionButtonsPopoverContentState
> {
  render() {
    const { studyId } = this.props;

    return (
      <div className={css.actionButtonsPopoverContent}>
        <div>
          <Button
            size="small"
            onClick={() => {
              this.props.onViewStudy(studyId);
            }}
            icon="eye-o"
          >
            View
          </Button>
        </div>
        <div>
          <Button
            size="small"
            onClick={() => {
              this.props.onDownload(studyId);
            }}
            icon="download"
          >
            Download
          </Button>
        </div>
        <div>
          <Button size="small" onClick={null} icon="paper-clip">
            Attachment?
          </Button>
        </div>

        <div>
          <Button size="small" icon="clock-circle-o">
            History?
          </Button>
        </div>
      </div>
    );
  }
}

export default ActionButtonsPopoverContent;
