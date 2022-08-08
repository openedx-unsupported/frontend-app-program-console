import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { messages as headerMessages } from '@edx/frontend-component-header';
import { messages as footerMessages } from '@edx/frontend-component-footer';
import {
  APP_INIT_ERROR,
  APP_READY,
  subscribe,
  initialize,
} from '@edx/frontend-platform';
import { sendPageEvent } from '@edx/frontend-platform/analytics';
import { AppProvider, ErrorPage } from '@edx/frontend-platform/react';

import appMessages from './i18n';
import configureStore from './store';

import App from './App';

subscribe(APP_READY, () => {
  const { store, history } = configureStore(process.env.NODE_ENV);

  ReactDOM.render(
    <AppProvider store={store}>
      <App history={history} />
    </AppProvider>,
    document.getElementById('root'),
  );

  sendPageEvent();
});

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(<ErrorPage message={error.message} />, document.getElementById('root'));
});

initialize({
  messages: [
    appMessages,
    headerMessages,
    footerMessages,
  ],
  requireAuthenticatedUser: true,
  hydrateAuthenticatedUser: true,
});
