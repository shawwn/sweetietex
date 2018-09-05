// @flow

import { Link } from 'react-router-dom';

import * as React from 'react';

import styles from './styles.css';

import Routes from '../../../../constants/routes.json';

type NavProps = {};

class Nav extends React.Component<NavProps> {
  render() {
    return (
      <div className={styles.nav}>
        <Link to={Routes.HOME} className={styles.link}>
          Editor
        </Link>
      </div>
    );
  }
}

export default Nav;
