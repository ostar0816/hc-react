import React from 'react';

import { Button, Row, Col, Icon } from 'antd';

import css from './DBComponentPicker.lessx';

type DBComponentPickerProps = {
  onComponentSelect(componentName: string): void;
};

class DBComponentPicker extends React.Component<DBComponentPickerProps> {
  render() {
    return (
      <div className={css.pickComponent}>
        <Row type="flex" justify="center" align="middle" style={{ height: '100%' }}>
          <Col span={5}>
            <Button
              size="large"
              onClick={() => {
                this.props.onComponentSelect('DBStudyTable');
              }}
            >
              <div>
                <Icon type="solution" style={{ fontSize: 30 }} />
              </div>
              <div>Studies</div>
            </Button>
          </Col>
          <Col span={5}>
            <Button
              size="large"
              onClick={() => {
                this.props.onComponentSelect('DBStudyConfirm');
              }}
            >
              <div>
                <Icon type="form" style={{ fontSize: 30 }} />
              </div>
              <div>Confirm Study</div>
            </Button>
          </Col>
          <Col span={5}>
            <Button
              size="large"
              onClick={() => {
                this.props.onComponentSelect('DBStudyReport');
              }}
            >
              <div>
                <Icon type="file-text" style={{ fontSize: 30 }} />
              </div>
              <div>Study Report</div>
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default DBComponentPicker;
