import React from 'react';

import classSet from 'classnames';

import { Button } from 'antd';

import css from './StudyReportFooter.lessx';

type StudyReportFooterProps = {
  signButton?: 'Sign Off' | 'Sign Off Addendum';
  disabled?: boolean;
  onSave?(openNextStudy: boolean): void;
  onClose(): void;
};

export class StudyReportFooter extends React.Component<StudyReportFooterProps> {
  static defaultProps = {
    signButton: 'Sign Off',
  };

  render() {
    const { disabled, signButton } = this.props;

    return (
      <div className={css.footer}>
        <div>
          <Button size="small" onClick={this.props.onClose}>
            Cancel
          </Button>

          {/*<Button size="small" onClick={() => console.log('TODO')}>
                  Save & Close
    </Button>*/}
        </div>
        <div>
          <Button type="primary" disabled={disabled} onClick={() => this.props.onSave(false)}>
            {`${signButton} & Close`}
          </Button>

          <Button
            type="primary"
            disabled={disabled}
            onClick={() => {
              this.props.onSave(true);
            }}
          >
            {`${signButton} & Next`}
          </Button>
        </div>
      </div>
    );
  }
}

export default StudyReportFooter;
