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
      const data = action.payload.data;
      return {
        ...state,
        authorized: data.length > 0,
        data: data,
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
