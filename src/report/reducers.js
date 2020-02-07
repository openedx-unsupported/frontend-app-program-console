import {FETCH_REPORTS } from './actions';

export const defaultState = {
  loading: false,
  loaded: false,
  loadingError: null,
  authorized: true,
  reportData: {},
};

const report = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_REPORTS.BEGIN:
      return {
        ...state,
        loading: true,
        loaded: false,
        loadingError: null,
      };
    case FETCH_REPORTS.SUCCESS: {
      const report = action.payload.data;
      const programKey = action.payload.programKey;
      const newData = state.reportData;
      newData[programKey] = [];
      report.forEach(function(reportItem){
        newData[programKey].push({
         'name': reportItem.name,
         'downloadUrl': reportItem.download_url,
       });
      });
      return {
        ...state,
        authorized: report.length > 0,
        reportData: newData,
        loading: true,
        loaded: false,
        loadingError: null,
      };
    }
    case FETCH_REPORTS.FAILURE:
      return {
        ...state,
        authorized: false,
        loading: false,
        loaded: false,
        loadingError: action.payload.error,
      };
    default:
      return state;
  }
};

export default report;
