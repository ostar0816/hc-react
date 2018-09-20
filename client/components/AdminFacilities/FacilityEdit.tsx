import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import gql from 'graphql-tag';
import graphqlClient from '../../graphqlClient';
import { graphql } from 'react-apollo';

import css from './FacilityAddEdit.lessx';

import { Tabs, Button, Row, Col } from 'antd';
const TabPane = Tabs.TabPane;

import FacilityTabGeneralForm, { FacilityTabGeneralFormFragments } from './FacilityTabGeneralForm';
import FacilityTabDicomDetailsForm, {
  FacilityTabDicomDetailsFormFragments,
} from './FacilityTabDicomDetailsForm';
import FacilityTabTechConfForm, {
  FacilityTabTechConfFormFragments,
} from './FacilityTabTechConfForm';
import FacilityTabReportDetailsForm from './FacilityTabReportDetailsForm';
import FacilityTabPhysicianForm from './FacilityTabPhysicianForm';

import { FacilityEdit_root } from '../../gqlTypes';

const FacilityEditQuery_root = gql`
  query FacilityEdit_root($facilityId: ObjectId) {
    viewer {
      _id
      searchFacility: searchFacilityById(facilityId: $facilityId) {
        _id
        ...FacilityTabGeneralForm_Facility
        ...FacilityTabDicomDetailsForm_Facility
        ...FacilityTabTechConfForm_Facility
      }
    }
  }
  ${FacilityTabGeneralFormFragments.facility}
  ${FacilityTabDicomDetailsFormFragments.facility}
  ${FacilityTabTechConfFormFragments.facility}
`;

type FacilityEditProps = {
  showOnlyFirstTab?: boolean;
} & FacilityEdit_root;

class FacilityEdit extends React.Component<FacilityEditProps & RouteComponentProps<any>> {
  handleBack = () => {
    this.props.history.push('/administration/facilities');
  };
  handleTabChange = (activeKey: string) => {
    const { history, match } = this.props;

    history.push(`/administration/facility/${match.params.facilityId}/${activeKey}`);
  };

  render() {
    const { viewer, match } = this.props;
    const { searchFacility } = viewer;
    const tabList = [
      {
        key: 'general',
        title: 'General',
        content: <FacilityTabGeneralForm facility={searchFacility} />,
      },
      {
        key: 'dicom-details',
        title: 'DICOM Details',
        content: <FacilityTabDicomDetailsForm facility={searchFacility} />,
      },
      {
        key: 'tech-conf',
        title: 'Tech Conf',
        content: <FacilityTabTechConfForm facility={searchFacility} />,
      },
      {
        key: 'report-details',
        title: 'Report Details',
        content: <FacilityTabReportDetailsForm />,
      },
      {
        key: 'physician',
        title: 'Physician',
        content: <FacilityTabPhysicianForm />,
      },
    ];

    return (
      <div className={css.content}>
        <div className={css.header}>
          <div>
            <Row>
              <Col span={4}>
                <Button onClick={() => this.handleBack()}>Back to Facilities</Button>
              </Col>
              <Col span={16}>
                <h3>
                  <span>Editing facility </span>
                  <span>{searchFacility.institutionName}</span>
                </h3>
              </Col>
              <Col span={4} />
            </Row>
          </div>
        </div>

        <div>
          <div className={css.edit}>
            <Tabs
              type="card"
              defaultActiveKey={match.params.facilityTabKey || tabList[0].key}
              onChange={this.handleTabChange}
            >
              {tabList.map(tab => (
                <TabPane tab={tab.title} key={tab.key}>
                  {tab.content}
                </TabPane>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

/*function FacilityEditContainer(props: any) {
  const { match } = props;

  return (
    <Query query={FacilityEditQuery} variables={{ facilityId: match.params.facilityId }}>
      {({ loading, error, data }) => {
        if (loading || !data.viewer || !data.viewer.searchFacility) {
          return null;
        }
        return <FacilityEdit key={match.params.facilityId} viewer={data.viewer} {...props} />;
      }}
    </Query>
  );
}*/

type Response = {} & FacilityEdit_root;
type Variables = {
  facilityId: string;
};
interface routerProps {
  facilityId: string;
}
const FacilityEditContainer = graphql<RouteComponentProps<routerProps>, Response, Variables>(
  FacilityEditQuery_root,
  {
    options: ({ ...props }) => ({
      variables: { facilityId: props.match.params.facilityId },
    }),
  },
);
// const FacilityEditContainer = graphql<{}, Response, Variables>(FacilityEditQuery, {
//   options: () => ({
//     variables: { episode: 'JEDI' },
//   }),
// });

export default withRouter(
  FacilityEditContainer(({ data, ...props }) => {
    if (data.loading) return <div>Loading</div>;

    if (data.error) return <h1>ERROR</h1>;

    return <FacilityEdit key={props.match.params.facilityId} viewer={data.viewer} {...props} />;
  }),
);
