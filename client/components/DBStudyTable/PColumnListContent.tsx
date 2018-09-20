import React from 'react';

import css from './PColumnListContent.lessx';

import { Transfer } from 'antd';

import StudyTableColumns from '../../../server/constants/studyTableColumns';

const initialState = {
  data: Object.keys(StudyTableColumns).map((columnKey: keyof typeof StudyTableColumns) => {
    return {
      key: columnKey,
      title: StudyTableColumns[columnKey].label,
      chosen: false,
    };
  }),
};
type PColumnListState = Readonly<typeof initialState>;
type PColumnListProps = {
  targetKeys: string[];
  onColumnsDisplayedChange(columnKeys: string[]): void;
};

class PColumnListContent extends React.Component<PColumnListProps, PColumnListState> {
  state = initialState;

  filterOption = (inputValue: string, option: any) => {
    return option.title.indexOf(inputValue) > -1;
  };

  render() {
    return (
      <div className={css.popover}>
        <Transfer
          dataSource={this.state.data}
          titles={['Hidden', 'Displayed']}
          showSearch
          listStyle={{ height: 350, width: 200 }}
          filterOption={this.filterOption}
          targetKeys={this.props.targetKeys}
          onChange={this.props.onColumnsDisplayedChange}
          render={item => item.title}
        />
      </div>
    );
  }
}

export default PColumnListContent;
