import pick from 'lodash.pick';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getTodayWithDaysOffset, getISODateString } from '../common/utils';
import { REPORT_DATE_OFFSET_DAYS } from '../console/constants';

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

export async function getReportsByProgram(programKey) {
  let url = `${process.env.REGISTRAR_API_BASE_URL}/v1/programs/${programKey}/reports`;

  const minCreatedDate = getISODateString(getTodayWithDaysOffset(REPORT_DATE_OFFSET_DAYS));
  url += `?min_created_date=${minCreatedDate}`;

  const { data } = await getAuthenticatedHttpClient().get(url, {});

  return data;
}

export async function get(url) {
  const { data } = await getAuthenticatedHttpClient().get(url);
  return data;
}
