import React from 'react';

import gql from 'graphql-tag';
import graphqlClient from '../../graphqlClient';
import { withRouter, RouteComponentProps } from 'react-router';

import { Button, Divider } from 'antd';

import TableCustom from '../TableCustom/TableCustom';

import { UserTabAllowedFacilities_FacilityEntry } from '../../gqlTypes';

const facilityEntryFragment = gql`
  fragment UserTabAllowedFacilities_FacilityEntry on Facility {
    _id
    institutionName
    address
    city
    state
    email
    phoneNumber
    faxNumber
    websiteUrl
  }
`;

const updateAllowedFacilitiesMutation = gql`
  mutation updateAllowedFacilitiesForUser($userId: ObjectId!, $facilityIds: [ObjectId!]!) {
    updateAllowedFacilitiesForUser(userId: $userId, facilityIds: $facilityIds) {
      _id
      allowedFacilities {
        _id
        ...UserTabAllowedFacilities_FacilityEntry
      }
    }
  }
  ${facilityEntryFragment}
`;

type UserTabAllowedFacilitiesProps = {
  facilities: UserTabAllowedFacilities_FacilityEntry[];
  allowedFacilities: UserTabAllowedFacilities_FacilityEntry[];
};

class UserTabAllowedFacilities extends React.Component<
  RouteComponentProps<any> & UserTabAllowedFacilitiesProps
> {
  filterOption = (inputValue: string, option: any) => {
    return option.description.indexOf(inputValue) > -1;
  };
  handleAddFacility = (facilityId: string) => {
    const facilityIds = this.props.allowedFacilities.map(f => f._id);
    facilityIds.push(facilityId);

    this.handleUpdateAllowedFacilities(facilityIds);
  };
  handleRemoveFacility = (facilityId: string) => {
    const facilityIds = this.props.allowedFacilities.map(f => f._id);
    const indexFacilityId = facilityIds.indexOf(facilityId);

    facilityIds.splice(indexFacilityId, 1);

    this.handleUpdateAllowedFacilities(facilityIds);
  };
  handleUpdateAllowedFacilities = (facilityIds: string[]) => {
    const userId = this.props.match.params.userId;

    graphqlClient.mutate({
      mutation: updateAllowedFacilitiesMutation,
      variables: {
        userId,
        facilityIds,
      },
    });
  };

  render() {
    const facilities = this.props.facilities.map(facility => ({
      ...facility,
      __ACTION__: { facilityId: facility._id },
    }));
    const allowedFacilities = this.props.allowedFacilities.map(facility => ({
      ...facility,
      __ACTION__: { facilityId: facility._id },
    }));

    const allowedFacilitiesIds = allowedFacilities.map(af => af._id);
    const allFacilitiesData = facilities.filter(f => !allowedFacilitiesIds.includes(f._id));

    const columns = [
      {
        title: 'Institution Name',
        dataIndex: 'institutionName',
      },
      {
        title: 'Address',
        dataIndex: 'address',
        width: 120,
      },
      {
        title: 'City',
        dataIndex: 'city',
        width: 100,
      },
      {
        title: 'State',
        dataIndex: 'state',
        width: 100,
      },
      {
        title: 'E-mail',
        dataIndex: 'email',
        width: 150,
      },
      {
        title: 'Phone Number',
        dataIndex: 'phoneNumber',
        width: 180,
      },
      {
        title: 'Fax Number',
        dataIndex: 'faxNumber',
        width: 180,
      },
      {
        title: 'Website',
        dataIndex: 'websiteUrl',
        width: 150,
      },
    ];

    const allFacilititesColumns = [...columns];
    allFacilititesColumns.push({
      title: '',
      dataIndex: '__ACTION__',
      width: 50,
      render: data => (
        <span>
          <Button
            shape="circle"
            size="small"
            icon="plus"
            onClick={() => this.handleAddFacility(data.facilityId)}
          />
        </span>
      ),
    });

    const allowedFacilititesColumns = [...columns];
    allowedFacilititesColumns.push({
      title: '',
      dataIndex: '__ACTION__',
      width: 50,
      render: data => (
        <span>
          <Button
            shape="circle"
            size="small"
            icon="minus"
            onClick={() => this.handleRemoveFacility(data.facilityId)}
          />
        </span>
      ),
    });

    return (
      <div>
        <Divider orientation="left">Allowed Facilities</Divider>

        <TableCustom
          rowKey="_id"
          antdSize="small"
          pagination={false}
          columns={allowedFacilititesColumns}
          dataSource={allowedFacilities}
          scroll={{ x: true }}
        />

        <Divider orientation="left">All Facilities</Divider>

        <TableCustom
          rowKey="_id"
          antdSize="small"
          columns={allFacilititesColumns}
          dataSource={allFacilitiesData}
          pagination={{ pageSize: 50 }}
          scroll={{ x: true }}
        />
      </div>
    );
  }
}

export const UserTabAllowedFacilitiesFragments = {
  facilities: gql`
    fragment UserTabAllowedFacilities_Facility on Facility {
      ...UserTabAllowedFacilities_FacilityEntry
    }
    ${facilityEntryFragment}
  `,
};

export default withRouter(UserTabAllowedFacilities);
