import {FETCH_REPORTS } from './actions';

export const defaultState = {
  loading: false,
  loaded: false,
  loadingError: null,
  authorized: true,
  data: [],
};

const upload = (state = defaultState, action) => {
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
      return {
        ...state,
        authorized: report.length > 0,
        data: state.data.concat({
          [action.payload.programKey]: report
        }),
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

export default upload;
