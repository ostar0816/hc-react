import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import graphqlClient from '../../graphqlClient';
import React from 'react';

import moment, { updateLocale } from 'moment';

import { Resizable } from 'react-resizable';
import ReactDragListView from 'react-drag-listview';
import { Button, Input, InputNumber, Dropdown, Menu, Popover, message } from 'antd';

import css from './StudyTable.lessx';

import ActionButtons from './ActionButtons';
import PAssignStudyContent from './PAssignStudyContent';
import PChangeFacilityContent from './PChangeFacilityContent';

import TableFilterHeader from '../TableFilterHeader/TableFilterHeader';
import TableCustom from '../TableCustom/TableCustom';
import DateRangePickerCustom from '../DateRangePickerCustom/DateRangePickerCustom';

import StudyTableColumns from '../../../server/constants/studyTableColumns';
import tatLimit from '../../constants/tatLimit';

import {
  StudyTable_user,
  StudyTable_study_studies,
  StudyTable_study,
  PermissionEnum,
  StudyStatusEnum,
  DBStudyTable_worklist_columns,
  DBStudyTable_worklist_sorting,
} from '../../gqlTypes';
import { TPagination } from './DBStudyTable';

import PAGINATION from '../../constants/pagination';

const updateStudyFacilityMutation = gql`
  mutation updateStudyFacility($studyIds: [ObjectId!]!, $facilityId: ObjectId!) {
    updateStudyFacility(studyIds: $studyIds, facilityId: $facilityId) {
      _id
      facility {
        _id
        institutionName
      }
      facilityName
    }
  }
`;

const ResizeableTitle = (props: any) => {
  const { onResize, width, fixed, ...restProps } = props;

  if (!width || fixed) {
    return <th {...restProps} />;
  }

  return (
    <Resizable width={width} height={0} minConstraints={[100, 100]} onResize={onResize}>
      <th className="StudyTableDraggable">{props.children}</th>
    </Resizable>
  );
};

export const studyTableStudyFragment = gql`
  fragment StudyTable_study on StudySearchResult {
    totalCount
    studies {
      _id
      arriveTimeStart
      AETitle
      patientName
      patientDOB
      patientSex
      patientId
      accessionNumber
      studyDescriptionString
      stationName
      modality
      studyStatus
      supportRequestStatus
      readType
      laterality
      history
      studyDate
      studyPriority
      noOfImages
      facilityName
      reportSignedOffDate
      assignedRadiologistName
      tatLimitDate
      ...PAssignStudyContent_study
    }
  }
  ${PAssignStudyContent.fragments.study}
`;

type StudyTableProps = {
  columns: DBStudyTable_worklist_columns[];
  pagination: TPagination;
  filterInputs: any;
  sorting: DBStudyTable_worklist_sorting[];
  fullWindowView: boolean;
  selectedStudyIds: string[];
  user: StudyTable_user;
  searchStudies: StudyTable_study;
  onOpenStudyConfirmWindow(studyId: string): void;
  onOpenStudyReportWindow(studyId: string): void;
  onOpenStudyAssignPopover(studyId: string): void;
  onSelectionChanged(studyIds: string[]): void;
  onReorderColumns(columns: any[]): void;
  onColumnResize(index: number): void;
  onUpdateSorting(columnKey: string, sortLevel: number, sortDirection: string): void;
  onUpdateDateInput(columnKey: string, type: string, values: any): void;
  onUpdateFilterInput(columnKey: string, value: string | number): void;
  onColumnSearch(): void;
  onClearSearch(): void;
  onUpdatePagination(pagination: any): void;
};
const initialState = {
  visibleDropdownMenu: false,
  visibleChangeFacilityPopover: false,
  visibleDropdownMenuYPosition: 0,
  visibleDropdownMenuXPosition: 0,
  contextMenuStudyId: '',
};
type StudyTableState = Readonly<typeof initialState>;

class StudyTable extends React.Component<StudyTableProps, StudyTableState> {
  dragProps: any;
  components: any;

  state = initialState;

  constructor(props: StudyTableProps) {
    super(props);
    this.dragProps = {
      onDragEnd: (fromIndex: number, toIndex: number) => {
        const { columns } = this.props;

        const nextColumns = [...columns];
        const item = nextColumns.splice(fromIndex - 1, 1)[0];
        nextColumns.splice(toIndex - 1, 0, item);
        this.props.onReorderColumns(nextColumns);
      },
      handleSelector: '.TableFilterHeader__cell__draggable',
      nodeSelector: '.StudyTableDraggable',
    };

    this.components = {
      header: {
        cell: ResizeableTitle,
      },
    };
  }

  handleChangeFacilityPopoverClose = () => {
    this.setState({ visibleChangeFacilityPopover: false });
  };
  handleFacilityChange = (facilityId: string) => {
    graphqlClient
      .mutate({
        mutation: updateStudyFacilityMutation,
        variables: {
          facilityId,
          studyIds: this.props.selectedStudyIds,
        },
      })
      .then(() => message.success('Facility Changed'));

    this.handleChangeFacilityPopoverClose();
  };
  handleTableRowClick(rowKey: string) {
    const { selectedStudyIds } = this.props;

    const newSelectedStudyIds = [...selectedStudyIds];

    if (newSelectedStudyIds.includes(rowKey)) {
      const rowKeyIndex = newSelectedStudyIds.findIndex(id => id === rowKey);

      newSelectedStudyIds.splice(rowKeyIndex, 1);
    } else {
      newSelectedStudyIds.push(rowKey);
    }

    this.props.onSelectionChanged(newSelectedStudyIds);
  }
  handleTableContextMenu(event: any, record: any) {
    event.preventDefault();

    const x = event.clientX || (event.touches && event.touches[0].pageX);
    const y = event.clientY || (event.touches && event.touches[0].pageY);
    const pointerOffset = {
      x: 0,
      y: -1,
    };

    const { visibleDropdownMenu } = this.state;
    const { selectedStudyIds } = this.props;

    if (!selectedStudyIds.includes(record._id)) {
      const newSelectedStudyIds = [...selectedStudyIds];
      newSelectedStudyIds.push(record._id);

      this.props.onSelectionChanged(newSelectedStudyIds);
    }

    this.setState({
      visibleDropdownMenu: !visibleDropdownMenu,
      visibleDropdownMenuXPosition: x + pointerOffset.x,
      visibleDropdownMenuYPosition: y + pointerOffset.y,
      contextMenuStudyId: record._id,
    });

    return false;
  }
  handleContextMenuItemClick(event: any, contextMenuStudyId: string) {
    switch (event.key) {
      case 'confirm':
        this.props.onOpenStudyConfirmWindow(contextMenuStudyId);
        break;
      case 'assign':
        this.setState({ visibleDropdownMenu: false });
        this.props.onOpenStudyAssignPopover(contextMenuStudyId);
        break;
      case 'changeFacility':
        this.setState({
          visibleChangeFacilityPopover: true,
          visibleDropdownMenu: false,
        });
        break;
      case 'openReport':
        this.props.onOpenStudyReportWindow(contextMenuStudyId);
    }
  }

  render() {
    const {
      searchStudies,
      selectedStudyIds,
      sorting,
      filterInputs,
      user,
      fullWindowView,
    } = this.props;
    const {
      visibleChangeFacilityPopover,
      visibleDropdownMenu,
      visibleDropdownMenuXPosition,
      visibleDropdownMenuYPosition,
      contextMenuStudyId,
    } = this.state;
    let tableData = [];
    const loading = searchStudies === null;
    const pagination: TPagination & { total?: number } = Object.assign({}, this.props.pagination);
    if (!loading) {
      const { studies, totalCount } = searchStudies;
      tableData = studies.map((row: any) => ({
        ...row,
        key: row._id,
        __ACTIONS__: {
          studyId: row._id,
          studyStatus: row.studyStatus,
          supportRequestStatus: row.supportRequestStatus,
        },
      }));

      pagination.total = totalCount;
    }
    // to keep horizontal scrollbar for empty datasets
    // https://github.com/ant-design/ant-design/issues/7142

    if (!tableData.length) {
      tableData = [{ __ACTIONS__: 'SKIP_RENDER', key: 'SKIP_RENDER' }];
    }

    const isHiddenConfirmActionButton = !user.userRole.permissions.includes(
      PermissionEnum.CONFIRM_STUDY,
    );
    const isHiddenAssignActionButton = !user.userRole.permissions.includes(
      PermissionEnum.ASSIGN_STUDY,
    );
    const isHiddenReportActionButton = !user.userRole.permissions.includes(
      PermissionEnum.OPEN_REPORT_WINDOW,
    );

    const columns = this.props.columns.map((col, index: number) => {
      const sortLevel = sorting.findIndex((s: any) => s.columnName === col.key);
      const columnSorting = sorting.find((s: any) => s.columnName === col.key);
      const isSortActive = !columnSorting ? false : columnSorting.order === 1 ? 'down' : 'up';
      const columnType = StudyTableColumns[col.key].type;
      const title = (
        <TableFilterHeader
          title={StudyTableColumns[col.key].label}
          width={col.width}
          onSortClick={(sortLevel: number, sortDirection: string) =>
            this.props.onUpdateSorting(col.key, sortLevel, sortDirection)
          }
          isSortActive={isSortActive}
          sortLevel={sortLevel === -1 ? 1 : sortLevel + 1}
        >
          {/* If here is no fullWindowView, put span with 15px width for reduction text cutting, see css: max-width: calc(100% - 15px) */}
          {fullWindowView ? (
            columnType === 'DateTime' || columnType === 'Date' ? (
              <DateRangePickerCustom
                {...col.filter || {}}
                onChange={(type, values) => {
                  this.props.onUpdateDateInput(col.key, type, values);
                }}
              />
            ) : columnType === 'Int' || columnType === 'Float' ? (
              <InputNumber
                size="small"
                value={filterInputs[col.key] || ''}
                onChange={number => {
                  this.props.onUpdateFilterInput(col.key, number);
                }}
                onKeyUp={(e: any) => e.keyCode === 13 && this.handleColumnSearch()}
              />
            ) : (
              <Input
                size="small"
                placeholder="Filter..."
                value={filterInputs[col.key] || ''}
                onChange={e => {
                  this.props.onUpdateFilterInput(col.key, e.target.value);
                }}
                onPressEnter={this.props.onColumnSearch}
              />
            )
          ) : (
            <span style={{ display: 'inline-block', width: 15 }} />
          )}
        </TableFilterHeader>
      );
      return {
        ...col,
        dataIndex: col.key,
        sorter: false,
        title,
        onHeaderCell: (column: any) => ({
          width: column.width,
          fixed: column.fixed,
          onResize: this.props.onColumnResize(index),
        }),
        render:
          columnType === 'DateTime' || columnType === 'Date'
            ? (data: string) => (
                <span>
                  {!data
                    ? ''
                    : moment(data).format(`L${columnType === 'DateTime' ? ', h:mm:ss a' : ''}`)}
                </span>
              )
            : undefined,
      };
    });

    columns.push({ dataIndex: '__EMPTY__' });

    const isFilterEmpty =
      Object.keys(filterInputs).length === 0 && filterInputs.constructor === Object;

    columns.push({
      title: (
        <TableFilterHeader title="Action" isFixedColumn>
          {fullWindowView ? (
            <div>
              <Button
                type="primary"
                disabled={isFilterEmpty}
                size="small"
                onClick={this.props.onColumnSearch}
              >
                Search
              </Button>
              <Button
                // type="primary"
                size="small"
                disabled={isFilterEmpty}
                onClick={this.props.onClearSearch}
              >
                Clear
              </Button>
            </div>
          ) : null}
        </TableFilterHeader>
      ),
      dataIndex: '__ACTIONS__',
      width: 148,
      fixed: 'right',
      render: (data: any) =>
        data !== 'SKIP_RENDER' ? (
          <ActionButtons
            studyId={data.studyId}
            supportRequestStatus={data.supportRequestStatus}
            hideReportButton={isHiddenReportActionButton}
            hideConfirmButton={isHiddenConfirmActionButton}
            isDisabledReportButton={data.studyStatus === StudyStatusEnum.NEW}
            onOpenStudyConfirmWindow={this.props.onOpenStudyConfirmWindow}
            onOpenStudyReportWindow={this.props.onOpenStudyReportWindow}
          />
        ) : (
          'No Data'
        ),
    });

    const contextMenuItems = [];
    if (!isHiddenAssignActionButton) {
      contextMenuItems.push(<Menu.Item key="assign">Assign</Menu.Item>);
    }
    const isDisabledReportActionButton =
      (selectedStudyIds && selectedStudyIds.length > 1) ||
      (selectedStudyIds &&
        selectedStudyIds.length === 1 &&
        searchStudies.studies.find(study => study._id === selectedStudyIds[0]).studyStatus ===
          StudyStatusEnum.NEW);
    if (!isHiddenReportActionButton) {
      contextMenuItems.push(
        <Menu.Item key="openReport" disabled={isDisabledReportActionButton}>
          Open Report
        </Menu.Item>,
      );
    }
    if (!isHiddenConfirmActionButton) {
      contextMenuItems.push(
        <Menu.Item key="confirm" disabled={selectedStudyIds && selectedStudyIds.length > 1}>
          Confirm
        </Menu.Item>,
      );
    }
    if (!isHiddenAssignActionButton) {
      contextMenuItems.push(<Menu.Item key="changeFacility">Change Facility</Menu.Item>);
    }
    const contextMenu = (
      <Menu onClick={key => this.handleContextMenuItemClick(key, contextMenuStudyId)}>
        {contextMenuItems.length === 0 ? (
          <Menu.Item disabled key="noActions">
            No Actions
          </Menu.Item>
        ) : (
          contextMenuItems
        )}
      </Menu>
    );

    return (
      <div>
        <div
          style={{
            position: 'fixed',
            top: visibleDropdownMenuYPosition,
            left: visibleDropdownMenuXPosition,
          }}
        >
          <Dropdown
            overlay={contextMenu}
            trigger={['contextMenu']}
            visible={visibleDropdownMenu}
            onVisibleChange={visible =>
              this.setState({
                visibleDropdownMenu: visible,
                visibleDropdownMenuXPosition: visible ? visibleDropdownMenuXPosition : 0,
                visibleDropdownMenuYPosition: visible ? visibleDropdownMenuYPosition : 0,
                contextMenuStudyId: visible ? contextMenuStudyId : '',
              })
            }
          >
            <span />
          </Dropdown>
          <Popover
            trigger="click"
            title="Change Facility"
            visible={visibleChangeFacilityPopover}
            content={
              <PChangeFacilityContent
                selectedStudyIds={visibleChangeFacilityPopover && selectedStudyIds}
                onSave={this.handleFacilityChange}
                onClose={this.handleChangeFacilityPopoverClose}
              />
            }
            onVisibleChange={this.handleChangeFacilityPopoverClose}
          />
        </div>

        <ReactDragListView.DragColumn {...this.dragProps}>
          <TableCustom
            style={{ width: '100%' }}
            className={css.table}
            antdSize="small"
            components={this.components}
            rowClassName={(row: StudyTable_study_studies, index) => {
              if (row.studyStatus !== StudyStatusEnum.SIGNED_OFF && row.tatLimitDate) {
                const now = moment();
                const diff = moment(row.tatLimitDate).diff(now, 'seconds') / 3600;

                return css[
                  `tableRow--warning${
                    diff <= tatLimit.warningLast
                      ? 'Last'
                      : diff <= tatLimit.warningSecond
                        ? 'Second'
                        : 'First'
                  }`
                ];
              }
            }}
            rowSelection={{
              selectedRowKeys: selectedStudyIds,
              onChange: (selectedRowKeys: string[], selectedRows: string[]) => {
                this.props.onSelectionChanged(selectedRowKeys);
              },
            }}
            columns={columns}
            dataSource={tableData}
            scroll={{ x: true, y: 'CustomAutoHeight' }}
            headerAndFooterHeight={100}
            loading={loading}
            pagination={{ ...pagination, ...PAGINATION }}
            onChange={this.props.onUpdatePagination}
            onRow={record => ({
              onContextMenu: event => this.handleTableContextMenu(event, record),
              onClick: () => this.handleTableRowClick(record._id),
            })}
          />
        </ReactDragListView.DragColumn>
      </div>
    );
  }

  static fragments = {
    user: gql`
      fragment StudyTable_user on User {
        userRole {
          permissions
        }
      }
    `,
  };
}

export default StudyTable;
