import React from 'react';

import css from './FacilityAddEdit.lessx';

import { Button, Input, Divider, Row, Col, Form } from 'antd';
const FormItem = Form.Item;

class FacilityTabPhysicianForm extends React.Component {
  handleFormSubmit = (e: any) => {};

  render() {
    return (
      <Form onSubmit={this.handleFormSubmit} className={css.form}>
        <div>
          <p>Content of Tab Pane 2</p>
          <p>Content of Tab Pane 2</p>
          <p>Content of Tab Pane 2</p>
        </div>

        <Divider />

        {/*<Row gutter={20}>
          <Col span={14}>
            <FormItem label="Title" required>
              <Input size="small" value={null} onChange={null} />
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem label="E-mail">
              <Input size="small" type="email" value={null} onChange={null} />
            </FormItem>
          </Col>
        </Row>*/}

        <div className={css.buttons}>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </div>
      </Form>
    );
  }
}

export default FacilityTabPhysicianForm;
