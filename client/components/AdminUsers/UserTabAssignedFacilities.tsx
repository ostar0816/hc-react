import React from 'react';

import gql from 'graphql-tag';
import graphqlClient from '../../graphqlClient';
import classSet from 'classnames';
import sizeMe from 'react-sizeme';

import css from './UserAddEdit.lessx';

import { Button, message, Transfer } from 'antd';
import { UserTabAssignedFacilities_FacilityEntry } from '../../gqlTypes';
import TableCustom from '../TableCustom/TableCustom';

const userEntryFragment = gql`
  fragment UserTabAssignedFacilities_UserEntry on User {
    _id
    firstName
    lastName
    email
    userRole {
      _id
      name
    }
  }
`;
const facilityEntryFragment = gql`
  fragment UserTabAssignedFacilities_FacilityEntry on Facility {
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

type UserTabAssignedFacilitiesProps = {
  facilities: UserTabAssignedFacilities_FacilityEntry[];
  assignedFacilities: UserTabAssignedFacilities_FacilityEntry[];
};

class UserTabAssignedFacilities extends React.Component<UserTabAssignedFacilitiesProps> {
  filterOption = (inputValue: string, option: any) => {
    return option.description.indexOf(inputValue) > -1;
  };
  handleChange = (targetKeys: string[] | null) => {
    // read only
  };

  render() {
    const { facilities, assignedFacilities } = this.props;

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

    return (
      <div>
        <TableCustom
          // className={css.table}
          rowKey="_id"
          antdSize="small"
          pagination={false}
          columns={columns}
          dataSource={assignedFacilities}
          // scroll={{ x: true, y: 'CustomAutoHeight' }}
          scroll={{ x: true }}
        />
      </div>
    );
  }
}

export const UserTabAssignedFacilitiesFragments = {
  assignedFacilities: gql`
    fragment UserTabAssignedFacilities_AssignedFacility on Facility {
      ...UserTabAssignedFacilities_FacilityEntry
    }
    ${facilityEntryFragment}
  `,
};

export default UserTabAssignedFacilities;
