import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import graphqlClient from '../../graphqlClient';
import { graphql } from 'react-apollo';

import css from './DBStudyTable.lessx';

import { Button, Tooltip, Dropdown, Icon, Menu, Popover } from 'antd';

import 'react-resizable/css/styles.css';
import sizeMe from 'react-sizeme';

import DashboardWindow from '../DashboardWindow/DashboardWindow';
import DBWindowToolbar from '../DBWindowToolbar/DBWindowToolbar';

import PWorklistContent from './PWorklistContent';
import PColumnListContent from './PColumnListContent';
import PAssignStudyContent from './PAssignStudyContent';
import Worklist from './Worklist';
import PUploadFileContent from './PUploadFileContent';
import StudyTable, { studyTableStudyFragment } from './StudyTable';
import { ApolloQueryResult } from 'apollo-client';
import StudyTableColumns from '../../../server/constants/studyTableColumns';
import {
  DBStudyTableRoot,
  DBStudyTableSearchStudies,
  DBStudyTableSearchStudiesVariables,
  DBStudyTableSearchStudies_viewer,
  DBStudyTable_worklist,
  assignStudiesToRadiologistVariables,
  PermissionEnum,
  FilterEnum,
  DBStudyTable_worklist_columns,
  DBStudyTable_worklist_sorting,
} from '../../gqlTypes';
import { IFlowUpdateState } from '../FlowBoard/FlowBoard';

const ToolbarButton = (props: any) => {
  const { isToolbarButtonOnlyWithIcon, children, ...otherProps } = props;

  if (isToolbarButtonOnlyWithIcon) {
    return (
      <Tooltip title={children}>
        <Button shape="circle" {...otherProps} />
      </Tooltip>
    );
  }

  return <Button {...otherProps}>{children}</Button>;
};

const worklistFragment = gql`
  fragment DBStudyTable_worklist on Worklist {
    _id
    name
    description
    sorting {
      columnName
      order
    }
    displayOnTop
    totalCount
    columns {
      key
      width
      filter {
        type
        stringValue
        numberValue
        startDate
        endDate
        datePreset
      }
    }
  }
`;

const dbStudyTableQuery_root = gql`
  query DBStudyTableRoot {
    viewer {
      _id
      user {
        _id
        worklists {
          ...DBStudyTable_worklist
        }
        userRole {
          permissions
        }
        ...StudyTable_user
      }
    }
  }
  ${worklistFragment}
  ${StudyTable.fragments.user}
`;

const dbStudyTableQuery_searchStudies = gql`
  query DBStudyTableSearchStudies(
    $skip: Int!
    $limit: Int!
    $sorting: [SearchSortInput]!
    $filters: [SearchFilterInput]
  ) {
    viewer {
      _id
      searchStudies(skip: $skip, limit: $limit, sorting: $sorting, filters: $filters) {
        studies {
          _id
          ...PAssignStudyContent_study
        }
        ...StudyTable_study
      }
    }
  }
  ${PAssignStudyContent.fragments.study}
  ${studyTableStudyFragment}
`;

const addWorklistQuery = gql`
  mutation addWorklist(
    $name: String!
    $description: String!
    $sorting: [SortInput]!
    $columns: [ColumnInput]!
  ) {
    addWorklist(name: $name, description: $description, sorting: $sorting, columns: $columns) {
      viewer {
        _id
        user {
          _id
          worklists {
            ...DBStudyTable_worklist
          }
        }
      }
    }
  }
  ${worklistFragment}
`;

const updateWorklistQuery = gql`
  mutation updateWorklist(
    $worklistId: ObjectId!
    $sorting: [SortInput]!
    $columns: [ColumnInput]!
  ) {
    updateWorklist(worklistId: $worklistId, sorting: $sorting, columns: $columns) {
      viewer {
        _id
        user {
          _id
          worklists {
            ...DBStudyTable_worklist
          }
        }
      }
    }
  }
  ${worklistFragment}
`;

const updateWorklistDisplayOnTopQuery = gql`
  mutation updateWorklistDisplayOnTop($worklistId: ObjectId!, $displayOnTop: Boolean!) {
    updateWorklistDisplayOnTop(worklistId: $worklistId, displayOnTop: $displayOnTop) {
      viewer {
        _id
        user {
          _id
          worklists {
            ...DBStudyTable_worklist
          }
        }
      }
    }
  }
  ${worklistFragment}
`;

const deleteWorklistQuery = gql`
  mutation deleteWorklist($worklistId: ObjectId!) {
    deleteWorklist(worklistId: $worklistId) {
      viewer {
        _id
        user {
          _id
          worklists {
            ...DBStudyTable_worklist
          }
        }
      }
    }
  }
  ${worklistFragment}
`;

const assignStudiesToRadiologist = gql`
  mutation assignStudiesToRadiologist($radiologistId: ObjectId!, $studyIds: [ObjectId!]!) {
    assignStudiesToRadiologist(radiologistId: $radiologistId, studyIds: $studyIds) {
      _id
    }
  }
`;

// type TServerStatecolumnType = {
//   label: string;
//   type: string;
//   width: number;
//   key: string;
//   filter: {

//     type: FilterEnum;
//     stringValue?: string;
//     numberValue?: string;
//   } | null;
// };
export type TPagination = {
  current: number;
  pageSize: number;
};
type TServerState = {
  columns: DBStudyTable_worklist_columns[];
  sorting: DBStudyTable_worklist_sorting[];
  fullWindowView: boolean;
  pagination: TPagination;
};

type TClientState = {};

type DBStudyTableProps = {
  size: any; // sizeMe()
  onOpenStudyConfirmWindow(studyId: string): void;
  onOpenStudyReportWindow(studyId: string): void;
  serverState: TServerState;
  onServerStateUpdate: IFlowUpdateState<TServerState>;
  onClientStateUpdate: IFlowUpdateState<TClientState>;
  onMaximize(): void;
  onClose(): void;
  onSplitHorizontal(): void;
  onSplitVertical(): void;
  onSwapWindows(): void;
  refetchStudies: (
    variables?: DBStudyTableSearchStudiesVariables,
  ) => Promise<ApolloQueryResult<any>>;
  splitDirection: string;
} & DBStudyTableRoot &
  DBStudyTableSearchStudies_viewer;
type DBStudyTableState = {
  popoverTableSettingsVisible: boolean;
  popoverUploadFileVisible: boolean;
  popoverWorklistVisible: boolean;
  popoverAssignVisible: boolean;
  selectedStudyIds: string[];
  filterInputs: any;
};

class DBStudyTable extends React.Component<DBStudyTableProps, DBStudyTableState> {
  components: any;
  worklists: DBStudyTable_worklist[];

  constructor(props: DBStudyTableProps) {
    super(props);

    this.state = {
      popoverTableSettingsVisible: false,
      popoverUploadFileVisible: false,
      popoverWorklistVisible: false,
      popoverAssignVisible: false,
      selectedStudyIds: [],
      filterInputs: this._getFilterInputsFromColumns(props.serverState.columns),
    };
  }

  static getDerivedStateFromProps(nextProps: DBStudyTableProps, prevState: DBStudyTableState) {
    if (!nextProps.searchStudies) {
      return null;
    }

    const currentStudyIds = nextProps.searchStudies.studies.map(s => s._id);
    const selectedStudyIds = prevState.selectedStudyIds.filter(studyId =>
      currentStudyIds.includes(studyId),
    );

    if (selectedStudyIds.length !== prevState.selectedStudyIds.length) {
      return {
        selectedStudyIds,
      };
    }
    return null;
  }

  shouldComponentUpdate(nextProps: DBStudyTableProps, nextState: DBStudyTableState) {
    return JSON.stringify(nextProps) !== JSON.stringify(this.props) || nextState !== this.state;
  }

  handlePopoverWorklistVisibleChange = (visible: boolean) => {
    this.setState({
      popoverWorklistVisible: visible,
    });
  };
  handlePopoverUploadFileVisibleChange = (visible: boolean) => {
    this.setState({
      popoverUploadFileVisible: visible,
    });
  };
  handlePopoverTableSettingsVisibleChange = (visible: boolean) => {
    this.setState({
      popoverTableSettingsVisible: visible,
    });
  };
  handleColumnSearch = () => {
    const { serverState } = this.props;
    const { columns, pagination } = serverState;
    const { filterInputs } = this.state;

    const nextColumns = columns.map(c => {
      let filter = null;
      const columnType = StudyTableColumns[c.key].type;
      if ((columnType === 'Int' || columnType === 'Float') && !isNaN(filterInputs[c.key])) {
        filter = {
          type: FilterEnum.EQUAL_NUMBER,
          numberValue: parseFloat(filterInputs[c.key]),
          stringValue: null,
          startDate: null,
          endDate: null,
          datePreset: null,
        };
      } else if (filterInputs[c.key] && filterInputs[c.key].trim().length) {
        filter = {
          type: FilterEnum.CONTAINS_STRING,
          stringValue: filterInputs[c.key],
          numberValue: null,
          startDate: null,
          endDate: null,
          datePreset: null,
        };
      }

      return { ...c, filter };
    });

    this.props.onServerStateUpdate({
      columns: nextColumns,
      pagination: { ...pagination, current: 0 },
    });
  };

  _getFilterInputsFromColumns = (columns: any[]) => {
    const filterInputs: any = {};

    columns.forEach(c => {
      if (c.filter && c.filter.type === 'CONTAINS_STRING') {
        filterInputs[c.key] = c.filter.stringValue;
      }
      if (c.filter && c.filter.type === 'EQUAL_NUMBER') {
        filterInputs[c.key] = c.filter.numberValue;
      }
    });

    return filterInputs;
  };
  handleClearSearch = () => {
    const { serverState } = this.props;
    const { columns } = serverState;

    const nextColumns = columns.map((c: any) => {
      const { filter, ...rest } = c;
      return rest;
    });

    this.props.onServerStateUpdate({ columns: nextColumns });

    this.setState({
      filterInputs: {},
    });
  };

  handleUpdateFilterInput = (key: string, input: string | number) => {
    const { filterInputs } = this.state;

    const nextFilterInputs = { ...filterInputs, [key]: input };

    this.setState({
      filterInputs: nextFilterInputs,
    });
  };

  handleUpdateDateInput = (key: string, type: string, { startDate, endDate, datePreset }: any) => {
    const { serverState } = this.props;
    const { columns } = serverState;

    const columnIndex = columns.findIndex((c: any) => c.key === key);
    const nextColumns = [...columns];

    if (type === 'DATE_RANGE') {
      if (!startDate.length) {
        nextColumns[columnIndex] = {
          ...nextColumns[columnIndex],
          filter: null,
        };
      } else {
        nextColumns[columnIndex] = {
          ...nextColumns[columnIndex],
          filter: {
            type: FilterEnum.DATE_RANGE,
            startDate,
            endDate,
            stringValue: null,
            numberValue: null,
            datePreset: null,
          },
        };
      }
    } else if (type === FilterEnum.DATE_PRESET) {
      nextColumns[columnIndex] = {
        ...nextColumns[columnIndex],
        filter: {
          type: FilterEnum.DATE_PRESET,
          datePreset,
          stringValue: null,
          numberValue: null,
          startDate: null,
          endDate: null,
        },
      };
    }

    this.props.onServerStateUpdate({ columns: nextColumns });
  };

  handleColumnsDisplayedChange = (columnKeys: string[]) => {
    const { serverState } = this.props;
    const { columns } = serverState;

    const nextColumns = columns.filter((c: any) => columnKeys.includes(c.key));
    columnKeys.forEach(columnKey => {
      const column = columns.find((c: any) => c.key === columnKey);
      if (!column) {
        nextColumns.push({
          width: 200,
          key: columnKey,
          filter: null,
        });
      }
    });

    this.props.onServerStateUpdate({ columns: nextColumns });
  };

  handleUpdatePagination = (pagination: any) => {
    const { serverState } = this.props;
    const pager = { ...serverState.pagination };
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.props.onServerStateUpdate({
      pagination: pager,
    });
  };

  handleAddWorklist = (name: string) => {
    const { serverState } = this.props;
    const { sorting } = serverState;
    const columns = serverState.columns.map((c: any) => ({
      key: c.key,
      width: c.width,
      filter: c.filter,
    }));

    graphqlClient.mutate({
      mutation: addWorklistQuery,
      variables: {
        name,
        columns,
        sorting,
        description: '',
      },
    });
  };

  handleUpdateWorklist = (worklistId: string) => {
    const { serverState } = this.props;
    const { sorting } = serverState;
    const columns = serverState.columns.map((c: any) => ({
      key: c.key,
      width: c.width,
      filter: c.filter,
    }));

    graphqlClient.mutate({
      mutation: updateWorklistQuery,
      variables: {
        worklistId,
        columns,
        sorting,
      },
    });
  };
  handleUpdateSorting = (columnName: string, sortLevel: number, sortDirection: string) => {
    const { serverState } = this.props;
    const { sorting } = serverState;
    const currentLevel = sorting.length;
    const nextSortOrder = sortDirection === 'up' ? -1 : 1;

    const nextSorting = [];

    if (currentLevel === 0) {
      nextSorting.push({ columnName, order: nextSortOrder });
    } else if (currentLevel === 1) {
      if (columnName === sorting[0].columnName) {
        if (nextSortOrder !== sorting[0].order) {
          nextSorting.push({ columnName, order: nextSortOrder });
        }
      } else {
        nextSorting.push(sorting[0]);
        nextSorting.push({ columnName, order: nextSortOrder });
      }
    } else if (currentLevel === 2) {
      if (columnName === sorting[1].columnName) {
        if (nextSortOrder === sorting[1].order) {
          nextSorting.push({ columnName, order: nextSortOrder });
        } else {
          nextSorting.push(sorting[0]);
          nextSorting.push({ columnName, order: nextSortOrder });
        }
      } else {
        nextSorting.push({ columnName, order: nextSortOrder });
      }
    }

    this.props.onServerStateUpdate({ sorting: nextSorting });
  };
  handleSwitchWindowView = () => {
    const { serverState } = this.props;

    this.props.onServerStateUpdate({
      fullWindowView: !serverState.fullWindowView,
    });
  };
  handleUpdateWorklistDisplayOnTop = (worklistId: string, displayOnTop: boolean) => {
    graphqlClient.mutate({
      mutation: updateWorklistDisplayOnTopQuery,
      variables: {
        worklistId,
        displayOnTop,
      },
    });
  };

  handleDeleteWorklist = (worklistId: string) => {
    graphqlClient.mutate({
      mutation: deleteWorklistQuery,
      variables: {
        worklistId,
      },
    });
  };
  handleSelectionChanged = (studyIds: string[]) => {
    this.setState({
      selectedStudyIds: studyIds,
    });
  };
  handleWorklistSelect = (worklistId: string) => {
    const { worklists } = this.props.viewer.user;
    const worklist = worklists.find(w => w._id === worklistId);

    const { columns: worklistColumns, sorting } = worklist;

    const columns = worklistColumns.map(column => {
      const filter: any = column.filter || {};

      return {
        key: column.key,
        // label: cDef.label,
        width: column.width,
        // type: cDef.type,
        filter: filter && filter.type && filter,
      };
    });

    this.setState({
      filterInputs: this._getFilterInputsFromColumns(columns),
    });

    this.props.onServerStateUpdate({
      columns,
      sorting,
      pagination: { ...this.props.serverState.pagination, current: 0 },
    });
  };
  handleColumnResize = (index: number) => (e: any, { size }: any) => {
    const { serverState } = this.props;
    const { columns } = serverState;

    const nextColumns = [...columns];

    nextColumns[index] = {
      ...nextColumns[index],
      width: size.width,
    };

    this.props.onServerStateUpdate({ columns: nextColumns });
  };
  handleAssignStudiesToRadiologist = (radiologistId: string, studyIds: string[]) => {
    const variables: assignStudiesToRadiologistVariables = {
      radiologistId,
      studyIds,
    };

    graphqlClient.mutate({
      mutation: assignStudiesToRadiologist,
      variables,
    });

    this.props.refetchStudies();
  };
  handleReorderColumns = (nextColumns: DBStudyTable_worklist_columns[]) => {
    this.props.onServerStateUpdate({ columns: nextColumns });
  };

  render() {
    const {
      popoverTableSettingsVisible,
      popoverUploadFileVisible,
      popoverWorklistVisible,
      popoverAssignVisible,
      selectedStudyIds,
      filterInputs,
    } = this.state;

    const { serverState, size, viewer, searchStudies } = this.props;
    const { user } = viewer;
    const { pagination, sorting, columns, fullWindowView } = serverState;

    const isToolbarButtonOnlyWithIcon = size.width < 1077;
    const displayedColumns = this.props.serverState.columns.map((c: any) => c.key);
    const menuExport = (
      <Menu onClick={null}>
        <Menu.Item key="1">PDF</Menu.Item>
        <Menu.Item key="2">CVS</Menu.Item>
      </Menu>
    );

    const { worklists } = viewer.user;

    return (
      <DashboardWindow
        title="Studies"
        onMaximize={this.props.onMaximize}
        onClose={this.props.onClose}
        onSplitHorizontal={this.props.onSplitHorizontal}
        onSplitVertical={this.props.onSplitVertical}
        onSwapWindows={this.props.onSwapWindows}
        splitDirection={this.props.splitDirection}
        rightButtons={[
          {
            title: 'Switch View',
            buttonNode: (
              <Button
                shape="circle"
                type={fullWindowView ? null : 'primary'}
                size="small"
                onClick={this.handleSwitchWindowView}
                icon="layout"
              />
            ),
          },
        ]}
      >
        <div className={css.content}>
          <div className={css.content__panels}>
            {fullWindowView ? (
              <Worklist
                currentWorklistState={serverState}
                worklists={worklists}
                onWorklistSelect={this.handleWorklistSelect}
                onDeleteWorklist={this.handleDeleteWorklist}
              />
            ) : null}
            {fullWindowView ? (
              <DBWindowToolbar onSearch={null}>
                <div className={css.tableToolbar}>
                  <div>
                    <ToolbarButton
                      isToolbarButtonOnlyWithIcon={isToolbarButtonOnlyWithIcon}
                      size="small"
                      onClick={null}
                      icon="plus"
                    >
                      Add Study
                    </ToolbarButton>

                    {viewer.user.userRole.permissions.includes(PermissionEnum.ASSIGN_STUDY) ? (
                      <Popover
                        title="Assign Study - select row"
                        placement="leftBottom"
                        trigger="click"
                        visible={popoverAssignVisible}
                        content={
                          <PAssignStudyContent
                            selectedStudyIds={selectedStudyIds}
                            studies={searchStudies && searchStudies.studies}
                            onClose={() => this.setState({ popoverAssignVisible: false })}
                            onAssignStudiesToRadiologist={this.handleAssignStudiesToRadiologist}
                          />
                        }
                        onVisibleChange={visible =>
                          this.setState({
                            popoverAssignVisible: visible,
                          })
                        }
                      >
                        <ToolbarButton
                          isToolbarButtonOnlyWithIcon={isToolbarButtonOnlyWithIcon}
                          // disabled={selectedStudyIds.length === 0}
                          size="small"
                          icon="user-add"
                          onClick={() => this.setState({ popoverAssignVisible: true })}
                        >
                          Assign Study
                        </ToolbarButton>
                      </Popover>
                    ) : null}
                    <ToolbarButton
                      isToolbarButtonOnlyWithIcon={isToolbarButtonOnlyWithIcon}
                      size="small"
                      onClick={null}
                      icon="download"
                    >
                      Download
                    </ToolbarButton>
                    <Popover
                      title="Upload File"
                      visible={popoverUploadFileVisible}
                      content={<PUploadFileContent />}
                      placement="bottom"
                      trigger="click"
                      onVisibleChange={this.handlePopoverUploadFileVisibleChange}
                    >
                      <ToolbarButton
                        isToolbarButtonOnlyWithIcon={isToolbarButtonOnlyWithIcon}
                        size="small"
                        onClick={this.handlePopoverUploadFileVisibleChange}
                        icon="upload"
                      >
                        Upload
                      </ToolbarButton>
                    </Popover>
                    <Dropdown overlay={menuExport}>
                      <ToolbarButton
                        isToolbarButtonOnlyWithIcon={isToolbarButtonOnlyWithIcon}
                        size="small"
                        icon="export"
                      >
                        Export <Icon type="down" />
                      </ToolbarButton>
                    </Dropdown>
                  </div>
                  <div>
                    <Popover
                      title="Worklists"
                      placement="left"
                      trigger="click"
                      visible={popoverWorklistVisible}
                      content={
                        <PWorklistContent
                          worklists={worklists}
                          onAddWorklist={this.handleAddWorklist}
                          onSelectWorklist={this.handleWorklistSelect}
                          onDeleteWorklist={this.handleDeleteWorklist}
                          onUpdateWorklist={this.handleUpdateWorklist}
                          onUpdateWorklistDisplayOnTop={this.handleUpdateWorklistDisplayOnTop}
                        />
                      }
                      onVisibleChange={this.handlePopoverWorklistVisibleChange}
                    >
                      <ToolbarButton
                        isToolbarButtonOnlyWithIcon={isToolbarButtonOnlyWithIcon}
                        size="small"
                        onClick={this.handlePopoverWorklistVisibleChange}
                        icon="filter"
                      >
                        Worklists
                      </ToolbarButton>
                    </Popover>
                    <Popover
                      title="Select columns to display"
                      visible={popoverTableSettingsVisible}
                      placement="left"
                      trigger="click"
                      content={
                        <PColumnListContent
                          targetKeys={displayedColumns}
                          onColumnsDisplayedChange={this.handleColumnsDisplayedChange}
                        />
                      }
                      onVisibleChange={this.handlePopoverTableSettingsVisibleChange}
                    >
                      <ToolbarButton
                        isToolbarButtonOnlyWithIcon={isToolbarButtonOnlyWithIcon}
                        size="small"
                        onClick={this.handlePopoverTableSettingsVisibleChange}
                        icon="table"
                      >
                        Columns
                      </ToolbarButton>
                    </Popover>
                  </div>
                </div>
              </DBWindowToolbar>
            ) : null}
          </div>

          <div className={css.content__table}>
            <StudyTable
              fullWindowView={fullWindowView}
              filterInputs={filterInputs}
              searchStudies={searchStudies}
              user={user}
              columns={columns}
              pagination={pagination}
              sorting={sorting}
              onUpdateSorting={this.handleUpdateSorting}
              onUpdateFilterInput={this.handleUpdateFilterInput}
              onUpdateDateInput={this.handleUpdateDateInput}
              onColumnSearch={this.handleColumnSearch}
              onClearSearch={this.handleClearSearch}
              onOpenStudyConfirmWindow={this.props.onOpenStudyConfirmWindow}
              onOpenStudyReportWindow={this.props.onOpenStudyReportWindow}
              onOpenStudyAssignPopover={() => this.setState({ popoverAssignVisible: true })}
              onUpdatePagination={this.handleUpdatePagination}
              onColumnResize={this.handleColumnResize}
              selectedStudyIds={selectedStudyIds}
              onSelectionChanged={this.handleSelectionChanged}
              onReorderColumns={this.handleReorderColumns}
            />
          </div>
        </div>
      </DashboardWindow>
    );
  }
}

const DBStudyTableSearchStudiesContainer = graphql<
  DBStudyTableProps,
  DBStudyTableSearchStudies,
  DBStudyTableSearchStudiesVariables
>(dbStudyTableQuery_searchStudies, {
  options: ({ serverState }) => {
    const { pagination, sorting, columns } = serverState;

    const filters = columns
      .filter((c: any) => !!c.filter)
      .map((c: any) => ({ ...c.filter, columnName: c.key }));

    const limit = pagination.pageSize;
    const skip = pagination.current ? (pagination.current - 1) * limit : 0;

    return {
      variables: { skip, limit: pagination.pageSize, sorting, filters },
      pollInterval: 8000,
    };
  },
})(({ data, viewer, ...props }) => {
  if (!viewer) {
    return null;
  }

  const searchStudies = (data && data.viewer && data.viewer.searchStudies) || null;

  const refetchStudies = data && data.refetch;
  return (
    <DBStudyTable
      viewer={viewer}
      searchStudies={searchStudies}
      refetchStudies={refetchStudies}
      {...props}
    />
  );
});

const DBStudyTableRootContainer = graphql<DBStudyTableProps, DBStudyTableRoot, {}>(
  dbStudyTableQuery_root,
)(({ data, ...props }) => {
  return <DBStudyTableSearchStudiesContainer viewer={!data.loading && data.viewer} {...props} />;
});
export default sizeMe()(DBStudyTableRootContainer);
