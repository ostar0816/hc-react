import React from 'react';
import classSet from 'classnames';

import { Button, Tooltip, Icon } from 'antd';

import css from './DashboardWindow.lessx';

type WindowTabProps = {
  position?: string;
  title?: string;
  children: JSX.Element[];
};

function WindowTab(props: WindowTabProps) {
  const position = props.position === 'right' ? props.position : 'left';

  const classes = {
    [css[`windowTab__skewContainer--${position}`]]: position,
  };

  return (
    <div className={css.windowTab}>
      <div className={classSet(css.windowTab__skewContainer, classes)} />
      {props.title ? <div className={css.windowTab__draggableTitle}>{props.title}</div> : null}

      <div>{props.children ? props.children : null}</div>
    </div>
  );
}

type DashboardWindowProps = {
  rightButtons?: any[];
  splitDirection: string;
  title: string;
  onSplitVertical(): void;
  onSplitHorizontal(): void;
  onSwapWindows(): void;
  onMaximize(): void;
  onClose(): void;
};

class DashboardWindow extends React.Component<DashboardWindowProps> {
  render() {
    const { children, rightButtons, title, splitDirection } = this.props;

    return (
      <div className={css.window}>
        <div className={css.header}>
          <div>
            <WindowTab title={title}>
              <Button
                shape="circle"
                size="small"
                onClick={this.props.onMaximize}
                icon={true ? 'arrows-alt' : 'shrink'}
              />
              <Button shape="circle" size="small" onClick={this.props.onClose} icon="close" />
            </WindowTab>
          </div>

          <div>
            <WindowTab position="right">
              {rightButtons && rightButtons.length
                ? rightButtons.map((button, index) => (
                    <Tooltip key={`rightBtn${index}`} title={button.title}>
                      {button.buttonNode}
                    </Tooltip>
                  ))
                : null}

              <Tooltip title="Split Vertically">
                <Button
                  shape="circle"
                  size="small"
                  onClick={this.props.onSplitVertical}
                  icon="pause"
                />
              </Tooltip>
              <Tooltip title="Split Horizontally">
                <Button shape="circle" size="small" onClick={this.props.onSplitHorizontal}>
                  <Icon type="pause" style={{ transform: 'rotate(90deg) ' }} />
                </Button>
              </Tooltip>
              {splitDirection ? (
                <Tooltip title="Swap Windows">
                  <Button shape="circle" size="small" onClick={this.props.onSwapWindows}>
                    <Icon
                      type="swap"
                      style={{
                        transform: splitDirection === 'horizontal' ? 'rotate(90deg)' : undefined,
                      }}
                    />
                  </Button>
                </Tooltip>
              ) : null}
            </WindowTab>
          </div>
        </div>

        <div className={css.body}>{children}</div>
      </div>
    );
  }
}

export default DashboardWindow;
