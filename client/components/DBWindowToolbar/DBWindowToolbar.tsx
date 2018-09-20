import React from 'react';

import { Input, Icon } from 'antd';
const InputSearch = Input.Search;

import css from './DBWindowToolbar.lessx';

type DBWindowToolbarProps = {
  onClearInput?(): void;
  onSearch?(): void;
};

class DBWindowToolbar extends React.Component<DBWindowToolbarProps> {
  render() {
    const { children } = this.props;

    return (
      <div className={css.toolbar}>
        {/*<div className={css.search}>
          <InputSearch
            // placholder="Search..."
            onSearch={this.props.onSearch}
            size="small"
            style={{ width: 230 }}
            addonAfter={<Icon type="close-circle-o" onClick={this.props.onClearInput} />}
          />
    </div>*/}

        <div className={css.buttons}>{children}</div>
      </div>
    );
  }
}

export default DBWindowToolbar;
