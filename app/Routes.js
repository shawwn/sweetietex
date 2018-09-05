/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route, withRouter } from 'react-router';
import routes from './constants/routes.json';
import App from './containers/App';
import Layout from './containers/Layout';

import { Nav } from './modules/core/components';

import { Editor } from './modules/latex/components';

const NavWithRouter = withRouter(Nav);

export default () => (
  <App>
    <NavWithRouter />

    <Layout>
      <Switch>
        <Route path={routes.HOME} component={Editor} />
      </Switch>
    </Layout>
  </App>
);
