import pick from 'lodash.pick';

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

export async function getWritablePrograms() {
  const { data } = await apiClient.get(`${config.REGISTRAR_API_BASE_URL}/v1/programs/?user_has_perm=write`, {});
  return data;
}
