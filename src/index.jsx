import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import {
  APP_INIT_ERROR,
  APP_READY,
  subscribe,
  initialize,
} from '@edx/frontend-platform';
import { sendPageEvent } from '@edx/frontend-platform/analytics';
import { AppProvider, ErrorPage } from '@edx/frontend-platform/react';

import messages from './i18n';
import configureStore from './store';

import './index.scss';
import App from './App';

subscribe(APP_READY, () => {
  const { store } = configureStore(process.env.NODE_ENV);

  ReactDOM.render(
    <AppProvider store={store}>
      <App />
    </AppProvider>,
    document.getElementById('root'),
  );

  sendPageEvent();
});

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(<ErrorPage message={error.message} />, document.getElementById('root'));
});

initialize({
  messages,
  requireAuthenticatedUser: true,
  hydrateAuthenticatedUser: true,
});
