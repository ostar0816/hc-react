import React from 'react';

import classSet from 'classnames';

import { Table } from 'antd';
import { TableProps } from 'antd/lib/table';

import css from './TableCustom.lessx';

import sizeMe from 'react-sizeme';

function TableCustomFullHeight(props: any) {
  return <TableCustom {...props} />;
}

type TableCustomProps = {
  antdSize?: 'default' | 'middle' | 'small';
  headerAndFooterHeight?: number;
  size: any; // sizeMe()
};

class TableCustom extends React.Component<TableProps<any> & TableCustomProps> {
  constructor(props: any) {
    super(props);
  }

  static defaultProps = {
    antdSize: 'small',
    headerAndFooterHeight: 68,
  };

  render() {
    const { className, size, headerAndFooterHeight, ...otherProps } = this.props;

    const scroll =
      otherProps.scroll && otherProps.scroll.y === 'CustomAutoHeight'
        ? { ...otherProps.scroll, y: size.height - headerAndFooterHeight }
        : otherProps.scroll;
    const nextProps = { ...otherProps, scroll, size: otherProps.antdSize };

    return <Table className={classSet(css.table, className)} {...nextProps} />;
  }
}

export default sizeMe({ monitorHeight: true })(TableCustom);
