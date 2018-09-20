import React from 'react';
import gql from 'graphql-tag';

import graphqlClient from '../../graphqlClient';
import { FacilityTabDicomDetailsForm_FacilityEntry } from '../../gqlTypes';

import css from './FacilityAddEdit.lessx';

import { message, Button, Input, Divider, Row, Col, Form } from 'antd';
const FormItem = Form.Item;
import { FormComponentProps } from 'antd/lib/form/form';

const facilityEntryFragment = gql`
  fragment FacilityTabDicomDetailsForm_FacilityEntry on Facility {
    _id
    dicomDetails {
      AETitle
    }
  }
`;

const updateFacilityDicomDetailsQuery = gql`
  mutation updateFacilityDicomDetails($facilityId: ObjectId!, $AETitle: String!) {
    updateFacilityDicomDetails(facilityId: $facilityId, AETitle: $AETitle) {
      ...FacilityTabDicomDetailsForm_FacilityEntry
    }
  }
  ${facilityEntryFragment}
`;

type FacilityTabDicomDetailsFormProps = {
  facility: FacilityTabDicomDetailsForm_FacilityEntry;
};

const FacilityTabDicomDetailsForm = Form.create()(
  class extends React.Component<FacilityTabDicomDetailsFormProps & FormComponentProps> {
    handleSave = (e: any) => {
      e.preventDefault();

      const { form, facility } = this.props;
      const facilityId = facility._id;

      form.validateFields((err: any, values: any) => {
        if (err) {
          return;
        }

        const { AETitle } = values;

        graphqlClient
          .mutate({
            mutation: updateFacilityDicomDetailsQuery,
            variables: {
              facilityId,
              AETitle,
            },
          })
          .then(() => message.success('Saved'));
      });
    };

    render() {
      const { form, facility } = this.props;
      const { getFieldDecorator } = form;

      return (
        <Form onSubmit={this.handleSave} className={css.form}>
          <Divider />

          <Row gutter={20}>
            <Col span={12}>
              <FormItem label="AE Title">
                {getFieldDecorator('AETitle', {
                  initialValue:
                    (facility && facility.dicomDetails && facility.dicomDetails.AETitle) || null,
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>

          <div className={css.buttons}>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        </Form>
      );
    }
  },
);

export const FacilityTabDicomDetailsFormFragments = {
  facility: gql`
    fragment FacilityTabDicomDetailsForm_Facility on Facility {
      ...FacilityTabDicomDetailsForm_FacilityEntry
    }
    ${facilityEntryFragment}
  `,
};

export default FacilityTabDicomDetailsForm;
