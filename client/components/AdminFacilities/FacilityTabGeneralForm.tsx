import React from 'react';

import graphqlClient from '../../graphqlClient';
import gql from 'graphql-tag';

import css from './FacilityAddEdit.lessx';

import { message, Button, Input, Divider, Row, Col, Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form/form';

const FormItem = Form.Item;

import { FullFragment_Facility } from '../../gqlTypes';
import { facilityFragment } from '../../fragments/fullFragments';

const updateFacilityQuery = gql`
  mutation updateFacility(
    $facilityId: ObjectId!
    $institutionName: String!
    $address: String!
    $city: String!
    $state: String!
    $zip: String!
    $websiteUrl: String!
    $faxNumber: String!
    $phoneNumber: String!
    $email: String!
  ) {
    updateFacility(
      facilityId: $facilityId
      institutionName: $institutionName
      address: $address
      city: $city
      state: $state
      zip: $zip
      websiteUrl: $websiteUrl
      faxNumber: $faxNumber
      phoneNumber: $phoneNumber
      email: $email
    ) {
      ...FullFragment_Facility
    }
  }
  ${facilityFragment}
`;

type FacilityTabGeneralFormProps = {
  isCreateMode?: boolean;
  facility?: FullFragment_Facility;
};

const FacilityTabGeneralForm = Form.create<FacilityTabGeneralFormProps>()(
  class extends React.Component<FacilityTabGeneralFormProps & FormComponentProps> {
    handleGeneralUpdate = (e: any) => {
      e.preventDefault();

      const { form, facility } = this.props;

      form.validateFields((err: any, values: any) => {
        if (err) {
          return;
        }

        const {
          institutionName,
          address,
          city,
          state,
          zip,
          websiteUrl,
          faxNumber,
          phoneNumber,
          email,
        } = values;

        graphqlClient
          .mutate({
            mutation: updateFacilityQuery,
            variables: {
              facilityId: facility._id,
              institutionName,
              address,
              city,
              state,
              zip,
              websiteUrl,
              faxNumber,
              phoneNumber,
              email,
            },
          })
          .then(() => message.success('Saved'));
      });
    };

    render() {
      const { form, isCreateMode, facility } = this.props;
      const { getFieldDecorator } = form;

      return (
        <Form onSubmit={isCreateMode ? null : this.handleGeneralUpdate} className={css.form}>
          <Row gutter={20}>
            <Col span={12}>
              <FormItem label="Facility title" required>
                {getFieldDecorator('institutionName', {
                  initialValue: (facility && facility.institutionName) || null,
                  rules: [{ required: true, message: 'Please input the name!' }],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="E-mail" required>
                {getFieldDecorator('email', {
                  initialValue: (facility && facility.email) || null,
                  rules: [
                    {
                      type: 'email',
                      message: 'The input is not valid E-mail!',
                    },
                    { required: true, message: 'Please input the email!' },
                  ],
                })(<Input type="email" />)}
              </FormItem>
            </Col>
          </Row>

          <Divider />

          <Row gutter={20}>
            <Col span={12}>
              <FormItem label="Address" required>
                {getFieldDecorator('address', {
                  initialValue: (facility && facility.address) || null,
                  rules: [{ required: true, message: 'Please input the address!' }],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="City" required>
                {getFieldDecorator('city', {
                  initialValue: (facility && facility.city) || null,
                  rules: [{ required: true, message: 'Please input the city!' }],
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={12}>
              <FormItem label="State" required>
                {getFieldDecorator('state', {
                  initialValue: (facility && facility.state) || null,
                  rules: [{ required: true, message: 'Please input the state!' }],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Zip" required>
                {getFieldDecorator('zip', {
                  initialValue: (facility && facility.zip) || null,
                  rules: [{ required: true, message: 'Please input the zip!' }],
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={12}>
              <FormItem label="Phone Number" required>
                {getFieldDecorator('phoneNumber', {
                  initialValue: (facility && facility.phoneNumber) || null,
                  rules: [{ required: true, message: 'Please input the phone number!' }],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Fax Number" required>
                {getFieldDecorator('faxNumber', {
                  initialValue: (facility && facility.faxNumber) || null,
                  rules: [{ required: true, message: 'Please input the fax number!' }],
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>

          <Divider />

          <Row gutter={20}>
            <Col span={12}>
              <FormItem label="Website" required>
                {getFieldDecorator('websiteUrl', {
                  initialValue: (facility && facility.websiteUrl) || null,
                  rules: [{ required: true, message: 'Please input the website!' }],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12} />
          </Row>

          {isCreateMode ? null : (
            <div className={css.buttons}>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </div>
          )}
        </Form>
      );
    }
  },
);

export const FacilityTabGeneralFormFragments = {
  facility: gql`
    fragment FacilityTabGeneralForm_Facility on Facility {
      ...FullFragment_Facility
    }
    ${facilityFragment}
  `,
};

export default FacilityTabGeneralForm;
