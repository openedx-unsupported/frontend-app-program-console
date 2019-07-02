import { FETCH_WRITABLE_PROGRAMS, UPLOAD_PROGRAM_ENROLLMENTS } from './actions';

export const defaultState = {
  loading: false,
  loaded: false,
  loadingError: null,
  authorized: true,
  broken: false,
  data: [],
  programBanners: {},
};

const example = (state = defaultState, action) => {
  switch (action.type) {
    case 'BROKEN':
      return {
        ...state,
        broken: true,
      };
    case FETCH_WRITABLE_PROGRAMS.BEGIN:
      return {
        ...state,
        loading: true,
        loaded: false,
        loadingError: null,
      };
    case FETCH_WRITABLE_PROGRAMS.SUCCESS:
      return {
        ...state,
        authorized: true,
        data: action.payload.data,
        programBanners: action.payload.data.reduce((acc, curVal) => {
          acc[curVal.program_key] = [];
          return acc;
        }, {}),
        loading: false,
        loaded: true,
        loadingError: null,
      };
    case FETCH_WRITABLE_PROGRAMS.FAILURE:
      return {
        ...state,
        authorized: false,
        loading: false,
        loaded: false,
        loadingError: action.payload.error,
      };
    case FETCH_WRITABLE_PROGRAMS.RESET:
      return {
        ...state,
        loading: false,
        loaded: false,
        loadingError: null,
      };
    case UPLOAD_PROGRAM_ENROLLMENTS.SUCCESS:
      return {
        ...state,
        broken: false,
      };
    case UPLOAD_PROGRAM_ENROLLMENTS.FAILURE:
      return {
        ...state,
        broken: true,
      };
    case 'NOT_AUTHENTICATED':
      return {
        ...state,
        authorized: false,
      };
    default:
      return state;
  }
};

export default example;
