// @flow
import * as React from 'react';

import styles from './layout.css';

type LayoutProps = {
  children: React.Node
};

export default class Layout extends React.Component<LayoutProps> {
  props: LayoutProps;

  render() {
    const { children } = this.props;
    return (
      <div className={styles.main}>{children}</div>
    );
  }
}
