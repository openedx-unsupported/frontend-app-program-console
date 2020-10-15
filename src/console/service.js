import pick from 'lodash.pick';
import { put } from 'redux-saga/effects';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { notAuthenticated } from './actions';
import { PERMISSIONS } from './constants';

let config = {
  REGISTRAR_API_BASE_URL: null,
};

let apiClient = null; // eslint-disable-line

function validateConfiguration(newConfig) {
  Object.keys(config).forEach((key) => {
    if (newConfig[key] === undefined) {
      throw new Error(`Service configuration error: ${key} is required.`);
    }
  });
}

export function configureApiService(newConfig, newApiClient) {
  validateConfiguration(newConfig);
  config = pick(newConfig, Object.keys(config));
  apiClient = newApiClient;
}

export async function getAccessiblePrograms(programTitle = '') {
  const { data } = await getAuthenticatedHttpClient().get(
    `${process.env.REGISTRAR_API_BASE_URL}/v1/programs/?user_has_perm=${PERMISSIONS.readMetadata}&program_title=${programTitle}`,
    {},
  );
  return data;
}

export async function getJobs() {
  const { data } = await getAuthenticatedHttpClient().get(`${process.env.REGISTRAR_API_BASE_URL}/v1/jobs/`, {});
  return data;
}

export async function getJob(jobId) {
  const { data } = await getAuthenticatedHttpClient().get(`${process.env.REGISTRAR_API_BASE_URL}/v1/jobs/${jobId}`, {});
  return data;
}

function handleErrorResponses(error) {
  const response = error && error.response;
  const errorStatus = response && response.status;

  switch (errorStatus) { // eslint-disable-line default-case
    case 401:
    case 403:
      put(notAuthenticated());
      break;
  }

  return Promise.reject(error);
}

export async function uploadEnrollments(programKey, isCourseEnrollments, file) {
  const headers = {
    'Content-Type': 'multipart/form-data ',
  };
  const formData = new FormData();
  formData.append('file', file);

  getAuthenticatedHttpClient().interceptors.response.use(
    response => response,
    handleErrorResponses,
  );

  const enrollmentType = isCourseEnrollments ? 'course_enrollments' : 'enrollments';
  const { data } = await getAuthenticatedHttpClient().post(
    `${process.env.REGISTRAR_API_BASE_URL}/v1/programs/${programKey}/${enrollmentType}/upload/`,
    formData,
    { headers },
  );
  return data;
}

export async function downloadEnrollments(programKey, isCourseEnrollments) {
  const headers = {
    'Content-Type': 'multipart/form-data ',
  };

  getAuthenticatedHttpClient().interceptors.response.use(
    response => response,
    handleErrorResponses,
  );

  const enrollmentType = isCourseEnrollments ? 'course_enrollments' : 'enrollments';
  const { data } = await getAuthenticatedHttpClient().get(
    `${process.env.REGISTRAR_API_BASE_URL}/v1/programs/${programKey}/${enrollmentType}/?fmt=csv`,
    { headers },
  );
  return data;
}

export async function get(url) {
  const { data } = await getAuthenticatedHttpClient().get(url);
  return data;
}
