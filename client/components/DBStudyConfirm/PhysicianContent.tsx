import React from 'react';

import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import graphqlClient from '../../graphqlClient';

import { Form, Icon, Input, Button, Select } from 'antd';
const FormItem = Form.Item;
const { Option } = Select;

import css from './DestinationPhysicianContent.lessx';

import { referringPhysicianFragment } from '../../fragments/fullFragments';
import TableCustom from '../TableCustom/TableCustom';

import MPhysicianCreateForm from './MPhysicianCreateForm';
import PhysicianCreateForm from './PhysicianCreateForm';

import ActionButtons from './ActionButtons';
import { PhysicianContent_referringPhysician } from '../../gqlTypes';

const addPhysicianQuery = gql`
  mutation addReferringPhysician(
    $facilityId: ObjectId!
    $name: String!
    $physicianUid: String!
    $email: String!
    $phone: String!
    $fax: String!
    $dicomValue: String!
  ) {
    addReferringPhysician(
      facilityId: $facilityId
      name: $name
      physicianUid: $physicianUid
      email: $email
      phone: $phone
      fax: $fax
      dicomValue: $dicomValue
    ) {
      _id
      referringPhysicians {
        ...FullFragment_referringPhysician
      }
    }
  }
  ${referringPhysicianFragment}
`;
const updatePhysicianQuery = gql`
  mutation updateReferringPhysician(
    $referringPhysicianId: ObjectId!
    $physicianUid: String!
    $name: String!
    $email: String!
    $phone: String!
    $fax: String!
    $dicomValue: String!
  ) {
    updateReferringPhysician(
      referringPhysicianId: $referringPhysicianId
      physicianUid: $physicianUid
      name: $name
      email: $email
      phone: $phone
      fax: $fax
      dicomValue: $dicomValue
    ) {
      ...FullFragment_referringPhysician
    }
  }
  ${referringPhysicianFragment}
`;
const deletePhysicianQuery = gql`
  mutation deleteReferringPhysician($referringPhysicianId: ObjectId!) {
    deleteReferringPhysician(referringPhysicianId: $referringPhysicianId) {
      _id
      referringPhysicians {
        ...FullFragment_referringPhysician
      }
    }
  }
  ${referringPhysicianFragment}
`;

type PhysicianContentProps = {
  facilityId: string;
  referringPhysicians: PhysicianContent_referringPhysician[];
  selectedPhysicianIds: string[];
};
type PhysicianContentState = {
  visibleAddPhysicianModal: boolean;
  editedPhysicianId: string;
  selectedPhysicianIds: string[];
};

class PhysicianContent extends React.Component<PhysicianContentProps, PhysicianContentState> {
  formPhysicianRef: any;

  constructor(props: any) {
    super(props);

    this.state = {
      visibleAddPhysicianModal: false,
      editedPhysicianId: '',
      selectedPhysicianIds: props.selectedPhysicianIds || [],
    };
  }

  handlePhysicianModalClose = () => {
    this.setState({
      visibleAddPhysicianModal: false,
      editedPhysicianId: null,
    });
  };
  handlePhysicianModalCreateClick = () => {
    const form = this.formPhysicianRef.props.form;
    form.validateFields((err: any, values: any) => {
      if (err) {
        return;
      }

      // form.resetFields();

      const { facilityId } = this.props;
      graphqlClient.mutate({
        mutation: addPhysicianQuery,
        variables: {
          facilityId: facilityId,
          ...values,
        },
      });

      this.handlePhysicianModalClose();
    });
  };
  handlePhysicianModalUpdate = () => {
    const form = this.formPhysicianRef.props.form;
    form.validateFields((err: any, values: any) => {
      if (err) {
        return;
      }

      const { editedPhysicianId } = this.state;
      graphqlClient.mutate({
        mutation: updatePhysicianQuery,
        variables: {
          referringPhysicianId: editedPhysicianId,
          ...values,
        },
      });

      this.handlePhysicianModalClose();
    });
  };
  handlePhysicianSelect = (selectedId: string) => {
    const selectedIds = this.state.selectedPhysicianIds;
    selectedIds.push(selectedId);

    this.setState({
      selectedPhysicianIds: selectedIds,
    });
  };
  handlePhysicianDeselect = (physicianId: string) => {
    const selectedIds = this.state.selectedPhysicianIds.filter(
      (pId: string) => pId !== physicianId,
    );

    this.setState({
      selectedPhysicianIds: selectedIds,
    });
  };
  handlePhysicianDelete = (physicianId: string) => {
    graphqlClient.mutate({
      mutation: deletePhysicianQuery,
      variables: {
        referringPhysicianId: physicianId,
      },
    });
  };
  handlePhysicianEdit = (physicianId: string) => {
    this.setState({
      visibleAddPhysicianModal: true,
      editedPhysicianId: physicianId,
    });
  };

  render() {
    const { selectedPhysicianIds, visibleAddPhysicianModal, editedPhysicianId } = this.state;

    const columns = [
      {
        key: 'name',
        dataIndex: 'name',
      },
      {
        key: 'phone',
        dataIndex: 'phone',
      },
      {
        key: 'lastUsed',
        dataIndex: 'lastUsed',
      },
      {
        key: '__ACTIONS__',
        dataIndex: '__ACTIONS__',
        width: 60,
        render: (record: any) => (
          <ActionButtons
            eventKey={record.physicianId}
            onEdit={this.handlePhysicianEdit}
            onDelete={this.handlePhysicianDelete}
            onDeselect={this.handlePhysicianDeselect}
          />
        ),
      },
    ];

    const referringPhysicians = this.props.referringPhysicians.map(p => ({
      ...p,
      key: p._id,
      __ACTIONS__: { physicianId: p._id },
    }));
    const physiciansSelected = referringPhysicians.filter(p =>
      selectedPhysicianIds.includes(p._id),
    );
    const editedPhysician = !!editedPhysicianId
      ? referringPhysicians.find(fp => fp._id === editedPhysicianId)
      : null;

    return (
      <FormItem label="Select an Ordering Physician">
        <div className={css.tableWrapper}>
          <TableCustom
            className={css.tableWrapper__table}
            pagination={false}
            columns={columns}
            dataSource={physiciansSelected}
            locale={{
              emptyText: 'No Referring Physician',
            }}
          />
        </div>

        <Select
          size="small"
          // mode="multiple"
          className={css.tableWrapper__select}
          showSearch
          optionFilterProp="children"
          placeholder="Add Physician"
          value={[]}
          onChange={this.handlePhysicianSelect}
          // onDeselect={this.handlePhysicianDeselect}
        >
          {referringPhysicians.map(p => <Option key={p._id}>{p.name}</Option>)}
        </Select>

        <div className={css.tableWrapper__addButton}>
          <Button
            size="small"
            icon="plus"
            onClick={() =>
              this.setState({
                visibleAddPhysicianModal: true,
              })
            }
          >
            Create Physician
          </Button>
          <MPhysicianCreateForm
            isEditMode={!!editedPhysicianId}
            referringPhysician={editedPhysician}
            wrappedComponentRef={(formRef: any) => {
              this.formPhysicianRef = formRef;
            }}
            okText={!!editedPhysicianId ? 'Save' : null}
            visible={!!visibleAddPhysicianModal}
            onCancel={this.handlePhysicianModalClose}
            onOk={
              !!editedPhysicianId
                ? this.handlePhysicianModalUpdate
                : this.handlePhysicianModalCreateClick
            }
          />
        </div>
      </FormItem>
    );
  }

  static fragments = {
    referringPhysician: gql`
      fragment PhysicianContent_referringPhysician on ReferringPhysician {
        _id
        ...PhysicianCreateForm_referringPhysician
      }

      ${PhysicianCreateForm.fragments.referringPhysician}
    `,
  };
}

export default PhysicianContent;
