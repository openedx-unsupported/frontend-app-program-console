import { FETCH_WRITABLE_PROGRAMS, UPLOAD_PROGRAM_ENROLLMENTS } from './actions';

export const defaultState = {
  loading: false,
  loaded: false,
  loadingError: null,
  broken: false,
  data: [],
};

const example = (state = defaultState, action) => {
  switch (action.type) {
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
        data: action.payload.data,
        loading: false,
        loaded: true,
        loadingError: null,
      };
    case FETCH_WRITABLE_PROGRAMS.FAILURE:
      return {
        ...state,
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
    default:
      return state;
  }
};

export default example;
