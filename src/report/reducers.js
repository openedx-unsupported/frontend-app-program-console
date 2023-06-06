import { FETCH_REPORTS } from './actions';

export const defaultState = {
  loadingError: null,
  reportData: {},
};

// eslint-disable-next-line default-param-last
const report = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_REPORTS.SUCCESS: {
      const { programKey, reportData } = action.payload;
      const newReportData = { ...state.reportData };
      newReportData[programKey] = [];
      reportData.forEach(reportItem => newReportData[programKey].push({
        name: reportItem.name,
        downloadUrl: reportItem.download_url,
      }));
      return {
        ...state,
        reportData: newReportData,
        loadingError: null,
      };
    }
    case FETCH_REPORTS.FAILURE:
      return {
        ...state,
        loadingError: action.payload.error,
      };
    default:
      return state;
  }
};

export default report;
