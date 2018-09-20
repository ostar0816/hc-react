import React from 'react';

import css from './PWorklistContent.lessx';

import { Input, Button, List, Tooltip } from 'antd';
import { WorklistEntry } from '../../gqlTypes';

type PWorklistContentProps = {
  worklists: WorklistEntry[];
  onSelectWorklist(id: string): void;
  onAddWorklist(name: string): void;
  onUpdateWorklistDisplayOnTop(id: string, displayOnTop: boolean): void;
  onDeleteWorklist(id: string): void;
  onUpdateWorklist(id: string): void;
};
const initialState = {
  newWorklistName: '',
};
type PWorklistContentState = Readonly<typeof initialState>;

class PWorklistContent extends React.Component<PWorklistContentProps, PWorklistContentState> {
  state = initialState;

  handleWorklistNameUpdate = (e: any) => {
    this.setState({
      newWorklistName: e.target.value,
    });
  };

  handlAddWorklist = () => {
    const { newWorklistName } = this.state;

    this.props.onAddWorklist(newWorklistName);

    this.setState({
      newWorklistName: '',
    });
  };

  render() {
    const { newWorklistName } = this.state;
    const { worklists } = this.props;

    const worklistList = worklists.map(w => ({
      name: w.name,
      key: w._id,
      displayOnTop: w.displayOnTop,
    }));

    const defaultWL = false;

    return (
      <div className={css.popover}>
        <div className={css.createWorklist}>
          <div>
            <Input
              size="small"
              value={newWorklistName}
              onPressEnter={this.handlAddWorklist}
              onChange={this.handleWorklistNameUpdate}
            />
          </div>
          <div>
            <Button size="small" disabled={!newWorklistName} onClick={this.handlAddWorklist}>
              Create Worklist
            </Button>
          </div>
        </div>

        <List
          size="small"
          itemLayout="horizontal"
          dataSource={worklistList}
          renderItem={(worklist: any) => (
            <List.Item
              actions={[
                <Tooltip title="Select worklist">
                  <Button
                    shape="circle"
                    size="small"
                    icon="select"
                    onClick={() => {
                      this.props.onSelectWorklist(worklist.key);
                    }}
                  />
                </Tooltip>,
                <Tooltip title="Display worklist">
                  <Button
                    shape="circle"
                    size="small"
                    type={worklist.displayOnTop ? 'primary' : undefined}
                    icon="plus"
                    onClick={() => {
                      this.props.onUpdateWorklistDisplayOnTop(worklist.key, !worklist.displayOnTop);
                    }}
                  />
                </Tooltip>,
                <Tooltip title="Update worklist">
                  <Button
                    shape="circle"
                    size="small"
                    icon="reload"
                    onClick={() => {
                      this.props.onUpdateWorklist(worklist.key);
                    }}
                  />
                </Tooltip>,
                <Tooltip title="Remove">
                  <Button
                    shape="circle"
                    size="small"
                    icon="delete"
                    onClick={() => {
                      this.props.onDeleteWorklist(worklist.key);
                    }}
                  />
                </Tooltip>,
              ]}
            >
              <div>{worklist.name}</div>
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default PWorklistContent;
