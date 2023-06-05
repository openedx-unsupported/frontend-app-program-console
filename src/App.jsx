import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import PropTypes from 'prop-types';
import SiteHeader from '@edx/frontend-component-header';
import SiteFooter from '@edx/frontend-component-footer';

import ConnectedConsolePage from './console/ConsolePage';

function PageContent() {
  return (
    <div id="app" className="d-flex flex-column min-vh-100">
      <SiteHeader />
      <main className="flex-grow-1">
        <ConnectedConsolePage />
      </main>
      <SiteFooter />
    </div>
  );
}

function App({ history }) {
  return (
    <ConnectedRouter history={history}>
      <PageContent />
    </ConnectedRouter>
  );
}

App.propTypes = {
  history: PropTypes.object.isRequired, // eslint-disable-line
};

export default App;
