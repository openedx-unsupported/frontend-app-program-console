import { FETCH_WRITABLE_PROGRAMS, UPLOAD_ENROLLMENTS, DOWNLOAD_ENROLLMENTS, POLL_JOB, FETCH_JOBS } from './actions';

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
    case FETCH_WRITABLE_PROGRAMS.SUCCESS:
      return {
        ...state,
        authorized: true,
        data: action.payload.data,
        programBanners: action.payload.data.reduce((acc, curVal) => {
          acc[curVal.programKey] = [];
          return acc;
        }, {}),
        loading: true,
        loaded: false,
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
    case FETCH_JOBS.BEGIN:
      return {
        ...state,
        loading: true,
        loaded: false,
      };
    case FETCH_JOBS.SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
      };
    case FETCH_JOBS.FAILURE:
      return {
        ...state,
        loading: false,
        loaded: false,
        loadingError: action.payload.error,
      };
    case FETCH_JOBS.RESET:
      return {
        ...state,
        loading: false,
        loaded: false,
        loadingError: null,
      };
    case 'ADD_BANNER':
      return {
        ...state,
        programBanners: {
          ...programBanners,
          [action.payload.programKey]: [
            ...programBanners[action.payload.programKey],
            action.payload.bannerObj,
          ],
        },
      };
    case 'REMOVE_BANNER':
      return {
        ...state,
        programBanners: {
          ...programBanners,
          [action.payload.programKey]:
            programBanners[action.payload.programKey]
              .filter(banner => banner.id !== action.payload.bannerId),
        },
      };
    case UPLOAD_ENROLLMENTS.SUCCESS:
      return {
        ...state,
        programBanners: {
          ...programBanners,
          [action.payload.programKey]: [
            ...programBanners[action.payload.programKey],
            action.payload.bannerObj,
          ],
        },
      };
    case UPLOAD_ENROLLMENTS.FAILURE:
      return {
        ...state,
        programBanners: {
          ...programBanners,
          [action.payload.programKey]: [
            ...programBanners[action.payload.programKey],
            action.payload.bannerObj,
          ],
        },
      };
    case DOWNLOAD_ENROLLMENTS.SUCCESS:
      return {
        ...state,
        programBanners: {
          ...programBanners,
          [action.payload.programKey]: [
            ...programBanners[action.payload.programKey],
            action.payload.bannerObj,
          ],
        },
      };
    case DOWNLOAD_ENROLLMENTS.FAILURE:
      return {
        ...state,
        programBanners: {
          ...programBanners,
          [action.payload.programKey]: [
            ...programBanners[action.payload.programKey],
            action.payload.bannerObj,
          ],
        },
      };

    case 'NOT_AUTHENTICATED':
      return {
        ...state,
        authorized: false,
      };
    case POLL_JOB.SUCCESS:
      return {
        ...state,
        programBanners: {
          ...programBanners,
          [action.payload.programKey]: [
            ...programBanners[action.payload.programKey],
            action.payload.bannerObj,
          ],
        },
      };
    default:
      return state;
  }
};

export default example;
