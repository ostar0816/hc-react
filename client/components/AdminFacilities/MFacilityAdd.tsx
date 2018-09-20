import React from 'react';

import gql from 'graphql-tag';
import graphqlClient from '../../graphqlClient';
import { facilityFragment } from '../../fragments/fullFragments';

import { Modal } from 'antd';

import FacilityTabGeneralForm from './FacilityTabGeneralForm';

const addFacilityQuery = gql`
  mutation addFacility(
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
    addFacility(
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
      viewer {
        _id
        facilities {
          ...FullFragment_Facility
        }
      }
    }
  }
  ${facilityFragment}
`;

type Props = {
  visible: boolean;
  title: string;
  okText: string;
  onCancel(): void;
};

class MFacilityAdd extends React.Component<Props> {
  formRef: any;

  handleFacilityCreate = () => {
    const form = this.formRef && this.formRef.props.form;

    if (!form) {
      return;
    }

    form.validateFields((errs: any, values: any) => {
      if (errs) {
        return;
      }

      form.resetFields();

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

      graphqlClient.mutate({
        mutation: addFacilityQuery,
        variables: {
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
      });

      this.props.onCancel();
    });
  };

  render() {
    const { visible, title, okText, onCancel } = this.props;

    return (
      <Modal
        visible={visible}
        title={title}
        okText={okText}
        onCancel={onCancel}
        onOk={this.handleFacilityCreate}
        width={648}
        destroyOnClose
      >
        <FacilityTabGeneralForm
          isCreateMode
          wrappedComponentRef={(thisForm: any) => {
            this.formRef = thisForm;
          }}
        />
      </Modal>
    );
  }
}

export default MFacilityAdd;
