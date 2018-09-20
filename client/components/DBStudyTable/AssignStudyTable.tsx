import React from 'react';

import css from './AssignStudyTable.lessx';

import { Badge, Progress, Icon } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { AssignPriorityEnum } from '../../gqlTypes';
import TableCustom from '../TableCustom/TableCustom';

type AssignStudyData = {
  _id: string;
  selected?: boolean;
  name: string;
  workload: number;
};
type AssignStudyProps = {
  tableTitle: string;
  tableKey: string;
  dataSource: AssignStudyData[];
  onTableRowClick(tableKey: string, userId: string): void;
};
type AssignStudyState = {
  sortOrder: string | boolean;
  sortColumn: 'name' | 'workload' | string;
};

class AssignStudyTable extends React.Component<AssignStudyProps, AssignStudyState> {
  sorting = ['ascend', 'descend', false];

  constructor(props: any) {
    super(props);

    this.state = {
      sortOrder: this.sorting[0],
      sortColumn: 'name',
    };
  }

  handleUserRowClick(userId: string) {
    const { tableKey } = this.props;

    this.props.onTableRowClick(tableKey, userId);
  }
  handleHeaderCellClick(cell: ColumnProps<AssignStudyData>) {
    const { sortOrder, sortColumn } = this.state;

    let nextSortIndex = sortColumn === cell.dataIndex ? this.sorting.indexOf(sortOrder) + 1 : 0;
    if (nextSortIndex >= this.sorting.length) {
      nextSortIndex = 0;
    }

    this.setState({
      sortOrder: this.sorting[nextSortIndex],
      sortColumn: cell.dataIndex,
    });
  }

  compareDataSource = (a, b, sortOrder: string | boolean) => {
    if (a < b) {
      return sortOrder === 'ascend' ? -1 : 1;
    }
    if (a > b) {
      return sortOrder === 'ascend' ? 1 : -1;
    }

    // names must be equal
    return 0;
  };

  renderWorloadPercent = (workload: number) => {
    return (
      <span>
        <Progress
          type="circle"
          width={20}
          showInfo={false}
          strokeWidth={20}
          // max percent 99 (if is possible :)) -> no green color
          percent={workload > 99 ? 99 : workload}
        />
        {` ${Math.round(workload)}%`}
      </span>
    );
  };
  renderName = record => {
    const badges = [];
    record.studiesAssignPriorities.forEach(studyAssignPriority => {
      let assignPriorityToDisplay: any = null;

      switch (studyAssignPriority.assignPriority) {
        case AssignPriorityEnum.PLUS_TWO:
          assignPriorityToDisplay = <Badge count={2} style={{ backgroundColor: '#52c41a' }} />;
          break;
        case AssignPriorityEnum.PLUS_ONE:
          assignPriorityToDisplay = <Badge count={1} style={{ backgroundColor: '#52c41a' }} />;
          break;
        case AssignPriorityEnum.MINUS_ONE:
          assignPriorityToDisplay = <Badge count={1} />;
          break;
        case AssignPriorityEnum.MINUS_TWO:
          assignPriorityToDisplay = <Badge count={2} />;
          break;
      }
      if (assignPriorityToDisplay) {
        badges.push(assignPriorityToDisplay);
      }
    });
    return (
      <span>
        {record.name}
        <span>{badges}</span>
      </span>
    );
  };
  render() {
    const { tableTitle } = this.props;
    const { sortColumn, sortOrder } = this.state;

    const columns: ColumnProps<AssignStudyData>[] = [
      {
        dataIndex: 'name',
        title: tableTitle,
        sorter: true,
        sortOrder: sortColumn === 'name' ? sortOrder : false,
        render: (name, record) => this.renderName(record),
        onHeaderCell: cell => {
          return {
            onClick: () => this.handleHeaderCellClick(cell),
          };
        },
      },
      {
        dataIndex: 'workload',
        title: 'Workl.',
        width: 100,
        sorter: true,
        sortOrder: sortColumn === 'workload' ? sortOrder : false,
        render: workload => this.renderWorloadPercent(workload),
        onHeaderCell: cell => {
          return {
            onClick: () => this.handleHeaderCellClick(cell),
          };
        },
      },
    ];

    const dataSource =
      sortOrder === false
        ? this.props.dataSource
        : sortColumn === 'name'
          ? this.props.dataSource.sort((a, b) =>
              this.compareDataSource(a.name.toUpperCase(), b.name.toUpperCase(), sortOrder),
            )
          : this.props.dataSource.sort((a, b) =>
              this.compareDataSource(a.workload, b.workload, sortOrder),
            );

    return (
      <TableCustom
        rowKey="_id"
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        className={css.table}
        rowClassName={css.tableRow}
        scroll={{ y: 400 }}
        onRow={(record: AssignStudyData) => {
          return {
            onClick: () => this.handleUserRowClick(record._id),
          };
        }}
      />
    );
  }
}

export default AssignStudyTable;
