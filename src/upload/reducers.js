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
  const { programBanners } = state;
  switch (action.type) {
    case FETCH_WRITABLE_PROGRAMS.BEGIN:
      return {
        ...state,
        loading: true,
        loaded: false,
        loadingError: null,
      };
      break;
    case FETCH_WRITABLE_PROGRAMS.SUCCESS:
      return {
        ...state,
        authorized: true,
        data: action.payload.data,
        programBanners: action.payload.data.reduce((acc, curVal) => {
          acc[curVal.programKey] = [];
          return acc;
        }, {}),
        loading: false,
        loaded: true,
        loadingError: null,
      };
      break;
    case FETCH_WRITABLE_PROGRAMS.FAILURE:
      return {
        ...state,
        authorized: false,
        loading: false,
        loaded: false,
        loadingError: action.payload.error,
      };
      break;
    case FETCH_WRITABLE_PROGRAMS.RESET:
      return {
        ...state,
        loading: false,
        loaded: false,
        loadingError: null,
      };
      break;
    case UPLOAD_PROGRAM_ENROLLMENTS.SUCCESS:
      return {
        ...state,
        programBanners: {
          ...programBanners,
          [action.payload.programKey]: [
            ...programBanners[action.payload.programKey],
            {
              bannerType: action.payload.bannerType,
              message: 'You have achieved success!',
            },
          ],
        },
      };
      break;
    case UPLOAD_PROGRAM_ENROLLMENTS.FAILURE:
      return {
        ...state,
        programBanners: {
          ...programBanners,
          [action.payload.programKey]: [
            ...programBanners[action.payload.programKey],
            {
              bannerType: action.payload.bannerType,
              message: 'faaaaaaaaaaaaiiiiiiiiiiillllll!',
            },
          ],
        },
      };
      break;
    case 'NOT_AUTHENTICATED':
      return {
        ...state,
        authorized: false,
      };
      break;
    default:
      return state;
  }
};

export default example;
