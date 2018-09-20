import React from 'react';

import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import graphqlClient from '../../graphqlClient';

import { Form, Button, Select } from 'antd';
const FormItem = Form.Item;
const { Option } = Select;

import css from './DestinationPhysicianContent.lessx';

import TableCustom from '../TableCustom/TableCustom';

import MDestinationCreateForm from './MDestinationCreateForm';

type DestinationContentProps = {
  destinationList: any[];
};
type DestinationContentState = {
  visibleAddDestinationModal: boolean;
  selectedDestinationIds: string[];
};

class DestinationContent extends React.Component<DestinationContentProps, DestinationContentState> {
  formDestinationRef: any;

  constructor(props: any) {
    super(props);

    this.state = {
      visibleAddDestinationModal: false,
      selectedDestinationIds: props.selectedDestinationIds || [],
    };
  }

  handleDestinationModalCancelClick = () => {
    this.setState({
      visibleAddDestinationModal: false,
    });
  };
  handleDestinationModalCreateClick = () => {
    // this.formDestinationRef
  };
  handleDestinationSelect = (selectedId: string) => {
    const selectedIds = this.state.selectedDestinationIds;
    selectedIds.push(selectedId);

    this.setState({
      selectedDestinationIds: selectedIds,
    });
  };
  handleDestinationDeselect = (physicianId: string) => {
    const selectedIds = this.state.selectedDestinationIds.filter(
      (pId: string) => pId !== physicianId,
    );

    this.setState({
      selectedDestinationIds: selectedIds,
    });
  };
  handleDestinationEdit = (destinationId: string) => {};

  render() {
    const { selectedDestinationIds } = this.state;

    const destinations = [
      { _id: 'asd', destination: 'Name of Destination' },
      { _id: '2asd', destination: 'Name of Destination 2' },
      { _id: 'a23sd', destination: 'Name of Destination 3' },
    ];
    const destinationList = destinations.map(d => ({
      ...d,
      key: d._id,
      __ACTIONS__: { destinationId: d._id },
    }));
    const destinationSelected = destinationList.filter(d => selectedDestinationIds.includes(d._id));

    const columns = [
      {
        dataIndex: 'destination',
        key: 'destination',
      },
      {
        key: '__ACTIONS__',
        dataIndex: '__ACTIONS__',
        width: 60,
        render: (record: any) => (
          <span>
            <Button
              shape="circle"
              size="small"
              onClick={() => {
                this.handleDestinationEdit(record.destinationId);
              }}
              icon="edit"
            />
            <Button
              shape="circle"
              size="small"
              onClick={() => {
                this.handleDestinationDeselect(record.destinationId);
              }}
              icon="delete"
            />
          </span>
        ),
      },
    ];

    return (
      <FormItem label="Report Destination">
        <div className={css.tableWrapper}>
          <TableCustom
            className={css.tableWrapper__table}
            showHeader={false}
            pagination={false}
            columns={columns}
            dataSource={destinationSelected}
            locale={{
              emptyText: 'No Destination',
            }}
          />
        </div>

        <Select
          size="small"
          className={css.tableWrapper__select}
          showSearch
          value={[]}
          optionFilterProp="children"
          placeholder="Add Report Destination"
          onChange={this.handleDestinationSelect}
        >
          {destinationList.map(p => <Option key={p._id}>{p.destination}</Option>)}
        </Select>

        <div className={css.tableWrapper__addButton}>
          <Button
            size="small"
            icon="plus"
            onClick={() =>
              this.setState({
                visibleAddDestinationModal: true,
              })
            }
          >
            Create Destination
          </Button>
          <MDestinationCreateForm
            wrappedComponentRef={(formRef: any) => {
              this.formDestinationRef = formRef;
            }}
            visible={this.state.visibleAddDestinationModal}
            onCancel={this.handleDestinationModalCancelClick}
            onOk={this.handleDestinationModalCreateClick}
          />
        </div>
      </FormItem>
    );
  }
}

export default DestinationContent;
