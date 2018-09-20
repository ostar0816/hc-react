import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import css from './AdminFacilities.lessx';

import { Button, Input, Icon } from 'antd';
const Search = Input.Search;

import TableCustom from '../TableCustom/TableCustom';
import ActionButtonsCommon from '../ActionButtonsCommon/ActionButtonsCommon';

import MFacilityAdd from './MFacilityAdd';

import { AdminFacilities_root, FullFragment_Facility } from '../../gqlTypes';

import PAGINATION from '../../constants/pagination';

const facilitiesEntryFragment = gql`
  fragment AdminFacilities_FacilityEntry on Facility {
    _id
    institutionName
    address
    city
    state
    zip
    websiteUrl
    faxNumber
    phoneNumber
    email
  }
`;

const ListFacilitiesQuery = gql`
  query AdminFacilities_root {
    viewer {
      _id
      facilities {
        ...AdminFacilities_FacilityEntry
      }
    }
  }
  ${facilitiesEntryFragment}
`;

class RootQuery extends Query<AdminFacilities_root> {}

// const deleteFacilityQuery = gql`
//   mutation deleteFacility($facilityId: ObjectId!) {
//     deleteFacility(facilityId: $facilityId) {
//       viewer {
//         ...Facilities_ViewerEntry
//       }
//     }
//   }
//   ${facilitiesEntryFragment}
// `;

const initialState = { searchFacility: '', visibleModal: false, pageCurrent: 1 };
type AdminFacilitiesState = Readonly<typeof initialState>;
type AdminFacilitiesProps = RouteComponentProps<{}>;
class AdminFacilities extends React.Component<AdminFacilitiesProps, AdminFacilitiesState> {
  state = initialState;

  /*handleDeleteFacility = facilityId => {
    graphqlClient.mutate({
      mutation: deleteFacilityQuery,
      variables: {
        facilityId,
      },
    });
  };*/

  handlePaginationChange = (page: number) => {
    this.setState({
      pageCurrent: page,
    });
  };

  searchFacilities = facilities => {
    const searchFacilityWords = this.state.searchFacility
      .trim()
      .toLowerCase()
      .split(' ');
    const searchFacility = searchFacilityWords.map(word => '(?=.*\\b' + word + ')').join('');

    const searchedFacilities = facilities.filter(facility => {
      const facilityText = `${facility.institutionName} ${facility.address} ${facility.city} ${
        facility.state
      } ${facility.email} ${facility.websiteUrl}`.toLowerCase();

      const searchExp = new RegExp(searchFacility, 'g');
      return searchExp.test(facilityText);
    });

    return searchedFacilities;
  };

  render() {
    const { searchFacility, pageCurrent } = this.state;

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
      {
        title: '',
        dataIndex: '__ACTIONS__',
        width: 60,
        render: (data: any) => (
          <ActionButtonsCommon
            eventKey={data.facilityId}
            onEdit={eventKey =>
              this.props.history.push(`/administration/facility/${data.facilityId}`)
            }
            // onDelete={this.handleDeleteFacility}
          />
        ),
      },
    ];

    return (
      <RootQuery query={ListFacilitiesQuery}>
        {({ loading, error, data }) => {
          if (!data.viewer) {
            return null;
          }

          const facilitiesData = data.viewer.facilities.map((f: FullFragment_Facility) => ({
            ...f,
            __ACTIONS__: { facilityId: f._id },
          }));
          const searchedFacilitiesData = searchFacility
            ? this.searchFacilities(facilitiesData)
            : facilitiesData;

          return (
            <div className={css.facilities}>
              <div className={css.header}>
                <div>
                  <Button onClick={() => this.setState({ visibleModal: true })}>
                    Create New Facility
                  </Button>
                  <MFacilityAdd
                    visible={this.state.visibleModal}
                    title="Create a new facility"
                    okText="Create"
                    onCancel={() => this.setState({ visibleModal: false })}
                  />
                </div>
                <div>
                  <Search
                    placeholder="Search facility"
                    value={searchFacility}
                    onChange={e =>
                      this.setState({ searchFacility: e.target.value, pageCurrent: 1 })
                    }
                    style={{ width: 300 }}
                    addonAfter={
                      <Icon
                        type="close-circle-o"
                        onClick={() => this.setState({ searchFacility: '' })}
                      />
                    }
                  />
                </div>
              </div>

              <TableCustom
                className={css.table}
                rowKey="_id"
                antdSize="small"
                pagination={{
                  ...PAGINATION,
                  current: pageCurrent,
                  onChange: this.handlePaginationChange,
                }}
                columns={columns}
                dataSource={searchedFacilitiesData}
                scroll={{ y: 'CustomAutoHeight' }}
              />
            </div>
          );
        }}
      </RootQuery>
    );
  }
}

export default withRouter(AdminFacilities);
