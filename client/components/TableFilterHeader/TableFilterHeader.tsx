import React from 'react';

import classSet from 'classnames';

import { Icon, Button } from 'antd';

import css from './TableFilterHeader.lessx';

type TableFilterHeaderProps = {
  title: string;
  isFixedColumn?: boolean;
  isSortActive?: boolean | string;
  sortLevel?: number;
  width?: number;
  onSortClick?(sortLevel: number, sortDirection: string): void;
};

class TableFilterHeader extends React.Component<TableFilterHeaderProps> {
  render() {
    const {
      title,
      children,
      isFixedColumn,
      width,

      isSortActive,
      onSortClick,
      sortLevel,
    } = this.props;

    const classesIconUp = {
      [css['sortArrows__iconIsActive']]: isSortActive === 'up',
    };
    const classesIconDown = {
      [css['sortArrows__iconIsActive']]: isSortActive === 'down',
    };

    return (
      <span
        className={css.cell}
        style={{
          maxWidth: width !== undefined ? width - 16 : undefined, // 2*8 padding
        }}
      >
        <span title={title} className={isFixedColumn ? null : css.cell__draggable}>
          {title}
        </span>

        {children}
        {sortLevel === 2 ? (
          <span className={classSet(css.sortArrows, css['sortArrows--primary'])}>
            <span
              title="↑"
              className={classSet(classesIconUp)}
              onClick={() => onSortClick(sortLevel, 'up')}
            >
              <Icon type="backward" style={{ transform: 'rotate(90deg)' }} />
            </span>
            <span
              title="↓"
              className={classSet(classesIconDown)}
              onClick={() => onSortClick(sortLevel, 'down')}
            >
              <Icon type="backward" style={{ transform: 'rotate(-90deg)' }} />
            </span>
          </span>
        ) : sortLevel === 1 ? (
          <span className={classSet(css.sortArrows, css['sortArrows--secondary'])}>
            <span
              title="↑"
              className={classSet(classesIconUp)}
              onClick={() => onSortClick(sortLevel, 'up')}
            >
              <Icon type="caret-up" />
            </span>
            <span
              title="↓"
              className={classSet(classesIconDown)}
              onClick={() => onSortClick(sortLevel, 'down')}
            >
              <Icon type="caret-down" />
            </span>
          </span>
        ) : null}
      </span>
    );
  }
}

export default TableFilterHeader;
