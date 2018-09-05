// @flow

import * as React from 'react';

import { classie } from '../../../../utils';

import styles from './styles.css';

type TreeItemProps = {
  defaultCollapsed?: boolean,
  defaultChecked?: boolean,
  label: string,
  className?: string,
  itemClassName?: string,
  childrenClassName?: string,
  arrowClassName?: string,
  checkboxClassName?: string,
  onClick?: Function,
  children?: React.Children,
  arrowNode?: React.Node,
  collapsed?: boolean,
};

type TreeItemState = {
  collapsed: boolean,
  checked: boolean,
};

class TreeItem extends React.Component<TreeItemProps, TreeItemState> {
  static defaultProps = {
    defaultCollapsed: true,
    defaultChecked: true,
    className: '',
    itemClassName: '',
    childrenClassName: '',
    arrowClassName: '',
    checkboxClassName: '',
    children: null,
    arrowNode: null,
    collapsed: true,
    onClick: () => {},
  };

  constructor(props: TreeItemProps) {
    super(props);
    this.state = {
      collapsed: props.defaultCollapsed,
      checked: props.defaultChecked,
    };
  }

  handleCheck = () => {
    const { checked } = this.state;
    this.setState({ checked: !checked });
  };

  handleArrowKeyPress = (evt) => {
    const { key } = evt;
    if (key === 'ArrowRight') {
      this.setState({ collapsed: false });
    } else if (key === 'ArrowLeft') {
      this.setState({ collapsed: true });
    }
  };

  handleClick = (...args) => {
    const { onClick } = this.props;
    const { collapsed } = this.state;

    this.setState({ collapsed: !collapsed });

    onClick(...args);
  };

  render() {
    const {
      collapsed,
      checked,
    } = this.state;

    const {
      arrowClassName,
      checkboxClassName,
      className,
      itemClassName,
      label,
      children,
      arrowNode,
    } = this.props;

    const arrow = arrowNode ?
      React.cloneElement(arrowNode, {
        onClick: this.handleClick,
        onKeyDown: this.handleArrowKeyPress,
        className: classie([arrowNode.props.className], {
          [styles.expanded]: !collapsed,
        })
      }, arrowNode.props.children) :
      (
        <div
          tabIndex={0}
          role="button"
          onKeyDown={this.handleArrowKeyPress}
          onClick={this.handleClick}
          className={classie([styles.arrow, arrowClassName], {
            [styles.expanded]: !collapsed,
          })} />
      );

    return (
      <div className={classie([styles.tree, className])}>
        <div className={styles.levelItems}>
          <div className={classie([styles.checkContainer])}>
            <label
              className={styles.customContainer}>
              <input
                onChange={this.handleCheck}
                type="checkbox"
                checked={checked} />

              <span className={styles.checkmark} />
            </label>
          </div>

          <div className={classie([styles.item, itemClassName])}>
            <span className={styles.arrowContainer}>{arrow}</span>
            <span className={styles.label}>{label}</span>
          </div>
        </div>

        <div className={classie([styles.childContainer])}>
          {collapsed ? null : children}
        </div>
      </div>
    );
  }
}

export default TreeItem;
