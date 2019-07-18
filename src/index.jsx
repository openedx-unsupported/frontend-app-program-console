import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { identifyAuthenticatedUser, sendPageEvent, configureAnalytics, initializeSegment } from '@edx/frontend-analytics';
import LoggingService from '@edx/frontend-logging';

import { configuration } from './environment';
import { handleRtl } from './i18n/i18n-loader';
import configureStore from './store';
import { configureUserAccountApiService } from './common';
import { configureApiService as configureUploadApiService } from './upload';
import apiClient from './upload/apiClient';

import './index.scss';
import App from './components/App';


/**
 * We need to merge the application configuration with the authentication state
 * so that we can hand it all to the redux store's initializer.
 */
function createInitialState() {
  return Object.assign({}, { configuration }, apiClient.getAuthenticationState());
}

function configure() {
  const { store, history } = configureStore(createInitialState(), configuration.ENVIRONMENT);

  configureUserAccountApiService(configuration, apiClient);
  configureUploadApiService(configuration, apiClient);
  initializeSegment(configuration.SEGMENT_KEY);
  configureAnalytics({
    loggingService: LoggingService,
    authApiClient: apiClient,
    analyticsApiBaseUrl: configuration.LMS_BASE_URL,
  });

  if (configuration.ENVIRONMENT === 'production') {
    handleRtl();
  }

  return {
    store,
    history,
  };
}

apiClient.ensurePublicOrAuthenticationAndCookies(
  window.location.pathname,
  () => {
    const { store, history } = configure();

    ReactDOM.render(<App store={store} history={history} />, document.getElementById('root'));

    identifyAuthenticatedUser();
    sendPageEvent();
  },
);

