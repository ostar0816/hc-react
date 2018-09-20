import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import css from './PChangeFacilityContent.lessx';

import { Row, Col, Button, Select, Divider } from 'antd';
const Option = Select.Option;

import { PChangeFacilityContentRoot, PChangeFacilityContent_facility } from '../../gqlTypes';

const facilityFragment = gql`
  fragment PChangeFacilityContent_facility on Facility {
    _id
    institutionName
  }
`;

const pChangeFacilityContent_root = gql`
  query PChangeFacilityContentRoot {
    viewer {
      _id
      facilities {
        ...PChangeFacilityContent_facility
      }
    }
  }
  ${facilityFragment}
`;

type PChangeFacilityContentContainerProps = {
  selectedStudyIds: string[];
  onClose(): void;
  onSave(facilityId: string): void;
};
type PChangeFacilityContentProps = {
  facilities: PChangeFacilityContent_facility[];
} & PChangeFacilityContentContainerProps;
const initialState = {
  selectedFacilityId: '',
  selectedStudyIdsKey: '',
};
type PChangeFacilityContentState = Readonly<typeof initialState>;

class PChangeFacilityContent extends React.Component<
  PChangeFacilityContentProps,
  PChangeFacilityContentState
> {
  state = initialState;

  static getDerivedStateFromProps(
    nextProps: PChangeFacilityContentProps,
    prevState: PChangeFacilityContentState,
  ) {
    const currentSelectedStudyIdsKey = JSON.stringify(nextProps.selectedStudyIds);

    if (currentSelectedStudyIdsKey !== prevState.selectedStudyIdsKey) {
      return {
        selectedStudyIdsKey: currentSelectedStudyIdsKey,
        selectedFacilityId: '',
      };
    }
    return null;
  }

  handleSelectChange = (value: string) => {
    this.setState({
      selectedFacilityId: value,
    });
  };

  render() {
    const { facilities } = this.props;
    const { selectedFacilityId } = this.state;

    return (
      <div className={css.popover}>
        <Row>
          <Col>
            <Select
              size="small"
              showSearch
              style={{ width: 450 }}
              optionFilterProp="children"
              placeholder="Select Facility"
              value={selectedFacilityId}
              onChange={this.handleSelectChange}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {facilities.map(facility => (
                <Option key={facility._id}>{facility.institutionName}</Option>
              ))}
            </Select>
          </Col>
        </Row>

        <Divider />

        <Row gutter={20}>
          <Col span={12} />
          <Col span={12} className={css.buttons}>
            <Button onClick={this.props.onClose}>Cancel</Button>
            <Button
              type="primary"
              disabled={!selectedFacilityId}
              onClick={() => this.props.onSave(selectedFacilityId)}
            >
              Change
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

const PChangeFacilityContentContainer = graphql<
  PChangeFacilityContentContainerProps,
  PChangeFacilityContentRoot
>(pChangeFacilityContent_root)(({ data, ...props }) => {
  if (data.loading || !data.viewer) {
    return null;
  }

  if (data.error) return <h1>ERROR</h1>;

  return <PChangeFacilityContent facilities={data.viewer.facilities} {...props} />;
});

export default PChangeFacilityContentContainer;
