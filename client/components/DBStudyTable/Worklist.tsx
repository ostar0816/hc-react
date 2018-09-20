import React from 'react';

import css from './Worklist.lessx';

import { Popover, Badge, Button } from 'antd';

type WorklistProps = {
  worklists: any[];
  currentWorklistState: any;
  onWorklistSelect(id: string): void;
  onDeleteWorklist?(id: string): void;
};

class Worklist extends React.Component<WorklistProps> {
  isWorklistSameAsCurrentState = (worklist: any) => {
    const fieldsOfInterest = ['columns', 'sortOrder', 'sortField'];
    const { currentWorklistState } = this.props;

    const worklistNormalized = {
      columns: worklist.columns.map((c: any) => ({
        width: c.width,
        key: c.key,
        filter: { ...c.filter, __typename: 'Filter' } || null,
      })),
      sorting: worklist.sorting.map((s: any) => ({ columnName: s.columnName, order: s.order })),
    };
    const currentWorklistStateNormalized = {
      columns: currentWorklistState.columns.map((c: any) => ({
        width: c.width,
        key: c.key,
        filter: { ...c.filter, __typename: 'Filter' } || null,
      })),
      sorting: currentWorklistState.sorting.map((s: any) => ({
        columnName: s.columnName,
        order: s.order,
      })),
    };

    return JSON.stringify(worklistNormalized) === JSON.stringify(currentWorklistStateNormalized);
  };

  render() {
    const { worklists } = this.props;
    const worklistList = worklists.filter(w => w.displayOnTop);

    return (
      <div className={css.worklist}>
        <div>Worklists:</div>

        <div>
          {worklistList.map(worklist => (
            <Badge key={worklist._id} count={worklist.totalCount} overflowCount={999}>
              <Button
                type={this.isWorklistSameAsCurrentState(worklist) ? 'primary' : undefined}
                size="small"
                onClick={() => {
                  this.props.onWorklistSelect(worklist._id);
                }}
              >
                {worklist.name}
              </Button>
            </Badge>
          ))}
        </div>
      </div>
    );
  }
}

export default Worklist;
{
  /*<Popover
              key={item.key}
              content={
                <div className={css.popover}>
                  <Button size="small" onClick={null} icon="reload">
                    Update
                  </Button>
                  <Button size="small" onClick={() => {

                    this.props.onDeleteWorklist(item.key)
                  }} icon="minus">
                    Remove
                  </Button>
                </div>
              }
              title={item.title}
            >
              <Badge count={item.volume} overflowCount={11}>*
                <Button size="small" onClick={() => {
                  this.props.onWorklistSelect(item.key)
                }}>{item.title}</Button>
              </Badge>
          </Popover>*/
}
