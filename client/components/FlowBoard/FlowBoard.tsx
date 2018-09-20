import React from 'react';
import SplitterLayout from 'react-splitter-layout';
import DBStudyTable from '../DBStudyTable/DBStudyTable';
import DBStudyConfirm from '../DBStudyConfirm/DBStudyConfirm';
import DBStudyReport from '../DBStudyReport/DBStudyReport';
import DBComponentPicker from '../DBComponentPicker/DBComponentPicker';
import StudyTableColumns from '../../../server/constants/studyTableColumns';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import graphqlClient from '../../graphqlClient';

export interface IFlowUpdateState<T> {
  (stateDiff: Partial<T> | ((prevState: T) => T)): void;
}

const componentMapping = {
  DBStudyTable: DBStudyTable,
  DBStudyConfirm: DBStudyConfirm,
  DBStudyReport: DBStudyReport,
  DBComponentPicker: DBComponentPicker,
};

function getLevelId() {
  const number = Math.random();
  number.toString(36);
  return number.toString(36).substr(2, 9);
}

function getDBStudyTableDefaults() {
  return {
    columns: Object.keys(StudyTableColumns).map(columnKey => {
      const column = StudyTableColumns[columnKey];
      return {
        // label: col.label,
        // type: col.type,
        width: 200,
        key: columnKey,
        // filterTmpInput: null,
        filter: null,
      };
    }),
    pagination: {
      pageSize: 50,
    },
    sorting: [
      {
        columnName: 'arriveTimeStart',
        order: -1,
      },
    ],
    fullWindowView: true,
  };
}

const dashboardQuery = gql`
  query dashboardQuery {
    viewer {
      _id
      user {
        _id
        workspaces {
          _id
          layout
        }
      }
    }
  }
`;

const updateWorkspaceQuery = gql`
  mutation updateWorkspace($workspaceId: ObjectId!, $layout: JSON!) {
    updateWorkspace(workspaceId: $workspaceId, layout: $layout) {
      viewer {
        _id
        user {
          _id
          workspaces {
            _id
            layout
          }
        }
      }
    }
  }
`;

class FlowBoard extends React.Component {
  constructor(props) {
    super(props);

    this._workspaceUpdateTimer = null;

    this.state = {
      layout: null,
      maximizedLevelId: null,
    };
  }

  componentDidMount() {
    graphqlClient
      .query({
        query: dashboardQuery,
      })
      .then(({ data }) => {
        const workspace = data.viewer.user.workspaces[0];
        const layout = workspace.layout || {
          _ROOT_: {
            component: 'DBStudyTable',
            serverState: getDBStudyTableDefaults(),
          },
        };

        this.setState({
          workspaceId: workspace._id,
          layout,
        });
      });
  }

  handleUpdateWorkspace = () => {
    if (this._workspaceUpdateTimer) {
      clearTimeout(this._workspaceUpdateTimer);
      this._workspaceUpdateTimer = null;
    }

    this._workspaceUpdateTimer = setTimeout(() => {
      const { layout, workspaceId } = this.state;

      const layoutToSave = {};
      Object.keys(layout).forEach(levelId => {
        if (layout[levelId].component) {
          layoutToSave[levelId] = {
            ...layout[levelId],
            clientState: null,
          };
        } else {
          layoutToSave[levelId] = layout[levelId];
        }
      });

      graphqlClient.mutate({
        mutation: updateWorkspaceQuery,
        variables: {
          layout: layoutToSave,
          workspaceId,
        },
      });
      this._workspaceUpdateTimer = null;
    }, 500);
  };

  handleClientStateUpdate = windowId => {
    return updateFnOrStateDiff => {
      const { layout } = this.state;

      const componentName = layout[windowId].component;
      const { clientState } = layout[windowId];
      const nextClientState =
        typeof updateFnOrStateDiff === 'function'
          ? updateFnOrStateDiff(clientState)
          : { ...clientState, ...updateFnOrStateDiff };

      const nextLayout = {
        ...layout,
        [windowId]: { ...layout[windowId], clientState: nextClientState },
      };

      this.setState({
        layout: nextLayout,
      });
    };
  };

  handleServerStateUpdate = windowId => {
    return updateFnOrStateDiff => {
      const { layout } = this.state;

      const componentName = layout[windowId].component;
      const { serverState } = layout[windowId];
      const nextServerState =
        typeof updateFnOrStateDiff === 'function'
          ? updateFnOrStateDiff(serverState)
          : { ...serverState, ...updateFnOrStateDiff };
      const nextLayout = {
        ...layout,
        [windowId]: { ...layout[windowId], serverState: nextServerState },
      };

      this.setState({
        layout: nextLayout,
      });

      this.handleUpdateWorkspace();
    };
  };

  handleSplit = (levelId, direction) => {
    const { layout } = this.state;
    const newLevelIdA = getLevelId();
    const newLevelIdB = getLevelId();

    const nextLayout = {
      ...layout,
      [newLevelIdA]: { ...layout[levelId] },
      [newLevelIdB]: { component: 'DBComponentPicker' },
      [levelId]: {
        split: {
          direction,
          aId: newLevelIdA,
          bId: newLevelIdB,
        },
      },
    };

    this.setState({
      layout: nextLayout,
    });

    this.handleUpdateWorkspace();
  };

  handleMaximizeWindow = levelId => {
    this.setState({
      maximizedLevelId: this.state.maximizedLevelId ? null : levelId,
    });

    this.handleUpdateWorkspace();
  };

  handleSwapWindows = levelId => {
    const { layout } = this.state;

    const levelParentId = Object.keys(layout).find(key => {
      if (
        layout[key].split &&
        (layout[key].split.aId === levelId || layout[key].split.bId === levelId)
      ) {
        return key;
      }
    });

    const levelParent = layout[levelParentId];
    const nextLayout = {
      ...layout,
      [levelParentId]: {
        split: { ...levelParent.split, aId: levelParent.split.bId, bId: levelParent.split.aId },
      },
    };

    this.setState({
      layout: nextLayout,
    });

    this.handleUpdateWorkspace();
  };

  handleComponentSelect = (levelId, componentName) => {
    const { layout } = this.state;

    const serverState = componentName === 'DBStudyTable' ? getDBStudyTableDefaults() : {};
    const nextLayout = {
      ...layout,
      [levelId]: { ...layout[levelId], component: componentName, serverState },
    };

    this.setState({
      layout: nextLayout,
    });

    this.handleUpdateWorkspace();
  };

  handleCloseWindow = levelId => {
    const { layout } = this.state;

    if (levelId === '_ROOT_') {
      const nextLayout = { _ROOT_: { component: 'DBComponentPicker' } };
      this.setState({
        layout: nextLayout,
      });
      return;
    }

    const levelParentId = Object.keys(layout).find(key => {
      if (
        layout[key].split &&
        (layout[key].split.aId === levelId || layout[key].split.bId === levelId)
      ) {
        return key;
      }
    });

    const secondaryId =
      layout[levelParentId].split.aId === levelId
        ? layout[levelParentId].split.bId
        : layout[levelParentId].split.aId;

    const nextLayout = { ...layout, [levelParentId]: layout[secondaryId] };

    delete nextLayout[levelId];
    delete nextLayout[secondaryId];

    this.setState({
      layout: nextLayout,
    });

    this.handleUpdateWorkspace();
  };

  handleUpdateSecondarySize = (levelId, size) => {
    const { layout } = this.state;

    // deep copy
    // const nextLayout = JSON.parse(JSON.stringify(layout));
    const nextLayout = {
      ...layout,
      [levelId]: { ...layout[levelId], split: { ...layout[levelId].split, secondarySize: size } },
    };
    // nextLayout[levelId].split.secondarySize = size;

    this.setState({
      layout: nextLayout,
    });

    this.handleUpdateWorkspace();
  };

  handleOpenStudyReportWindow = studyId => {
    const { layout } = this.state;
    // only root window is opened

    const studyReportLevelId = Object.keys(layout).find(key => {
      return layout[key].component === 'DBStudyReport';
    });

    let nextLayout = null;
    if (studyReportLevelId) {
      const prevStudyId = layout[studyReportLevelId].serverState.selectedStudyId;
      const clientState = prevStudyId === studyId ? layout[studyReportLevelId].clientState : null;

      nextLayout = {
        ...layout,
        [studyReportLevelId]: {
          ...layout[studyReportLevelId],
          clientState,
          serverState: { selectedStudyId: studyId },
        },
      };
    } else {
      // ROOT is split
      const newLevelIdA = getLevelId();
      const newLevelIdB = getLevelId();

      nextLayout = {
        ...layout,
        [newLevelIdA]: layout['_ROOT_'],
        [newLevelIdB]: { component: 'DBStudyReport', serverState: { selectedStudyId: studyId } },
        _ROOT_: {
          split: {
            direction: 'vertical',
            secondarySize: 50,
            aId: newLevelIdA,
            bId: newLevelIdB,
          },
        },
      };
    }

    this.setState({ layout: nextLayout });

    this.handleUpdateWorkspace();
  };
  handleOpenStudyConfirmWindow = studyId => {
    const { layout } = this.state;
    // only root window is opened

    const studyConfirmLevelId = Object.keys(layout).find(key => {
      return layout[key].component === 'DBStudyConfirm';
    });

    let nextLayout = null;
    if (studyConfirmLevelId) {
      const prevStudyId = layout[studyConfirmLevelId].serverState.selectedStudyId;
      const clientState = prevStudyId === studyId ? layout[studyConfirmLevelId].clientState : null;
      nextLayout = {
        ...layout,
        [studyConfirmLevelId]: {
          ...layout[studyConfirmLevelId],
          clientState,
          serverState: { selectedStudyId: studyId },
        },
      };
    } else {
      // ROOT is split
      const newLevelIdA = getLevelId();
      const newLevelIdB = getLevelId();

      nextLayout = {
        ...layout,
        [newLevelIdA]: layout['_ROOT_'],
        [newLevelIdB]: { component: 'DBStudyConfirm', serverState: { selectedStudyId: studyId } },
        _ROOT_: {
          split: {
            direction: 'vertical',
            secondarySize: 50,
            aId: newLevelIdA,
            bId: newLevelIdB,
          },
        },
      };
    }

    this.setState({ layout: nextLayout });

    this.handleUpdateWorkspace();
  };

  renderLevel(levelId, splitDirection) {
    const { layout } = this.state;
    const level = layout[levelId];

    if (level.split) {
      return (
        <SplitterLayout
          percentage
          vertical={level.split.direction === 'horizontal'}
          horizontal={level.split.direction === 'vertical'}
          secondaryInitialSize={level.split.secondarySize}
          onSecondaryPaneSizeChange={size => {
            this.handleUpdateSecondarySize(levelId, size);
          }}
        >
          {this.renderLevel(level.split.aId, level.split.direction)}
          {this.renderLevel(level.split.bId, level.split.direction)}
        </SplitterLayout>
      );
    } else {
      const Component = componentMapping[level.component];
      const clientState = level.clientState || null;
      const serverState = level.serverState || null;

      const componentProps = {};
      if (level.component === 'DBComponentPicker') {
        componentProps.onComponentSelect = componentName => {
          this.handleComponentSelect(levelId, componentName);
        };
      } else if (level.component === 'DBStudyTable') {
        componentProps.onOpenStudyConfirmWindow = this.handleOpenStudyConfirmWindow;
        componentProps.onOpenStudyReportWindow = this.handleOpenStudyReportWindow;
      } else if (level.component === 'DBStudyReport') {
        componentProps.onOpenStudyReportWindow = this.handleOpenStudyReportWindow;
      }

      return (
        <Component
          key={levelId}
          onSplitHorizontal={() => {
            this.handleSplit(levelId, 'horizontal');
          }}
          onSplitVertical={() => {
            this.handleSplit(levelId, 'vertical');
          }}
          onMaximize={() => {
            this.handleMaximizeWindow(levelId);
          }}
          onClose={() => {
            this.handleCloseWindow(levelId);
          }}
          onSwapWindows={() => {
            this.handleSwapWindows(levelId);
          }}
          splitDirection={splitDirection}
          onClientStateUpdate={this.handleClientStateUpdate(levelId)}
          onServerStateUpdate={this.handleServerStateUpdate(levelId)}
          clientState={clientState}
          serverState={serverState}
          {...componentProps}
        />
      );
    }
  }

  render() {
    const { maximizedLevelId, layout } = this.state;

    if (!layout) {
      return null;
    }

    if (maximizedLevelId) {
      return this.renderLevel(maximizedLevelId);
    }
    return this.renderLevel('_ROOT_');
  }
}

export default FlowBoard;
