import { FETCH_PROGRAMS, FILTER_PROGRAMS } from './actions';
import { shouldProgramBeDisplayed } from './utils';

export const defaultState = {
  loading: false,
  loaded: false,
  loadingError: null,
  filterError: false,
  authorized: true,
  data: [],
  programBanners: {},
  currentPage: 1,
  pageSize: 10,
};

// eslint-disable-next-line default-param-last
const console = (state = defaultState, action) => {
  const { programBanners } = state;
  switch (action.type) {
    case FETCH_PROGRAMS.BEGIN:
      return {
        ...state,
        loading: true,
        loaded: false,
        loadingError: null,
        filterError: false,
      };
    case FETCH_PROGRAMS.SUCCESS: {
      const filteredData = action.payload.data.filter(shouldProgramBeDisplayed);
      return {
        ...state,
        authorized: filteredData.length > 0,
        data: filteredData,
        programBanners: filteredData.reduce((acc, curVal) => {
          acc[curVal.programKey] = [];
          return acc;
        }, {}),
        loading: true,
        loaded: false,
        loadingError: null,
      };
    }
    case FETCH_PROGRAMS.FAILURE:
      return {
        ...state,
        authorized: false,
        loading: false,
        loaded: false,
        loadingError: action.payload.error,
      };
    case FILTER_PROGRAMS.BEGIN:
      return {
        ...state,
        loading: true,
        loaded: false,
        loadingError: null,
        filterError: false,
      };
    case FILTER_PROGRAMS.SUCCESS: {
      const filteredData = action.payload.data.filter(shouldProgramBeDisplayed);
      return {
        ...state,
        authorized: filteredData.length > 0,
        data: filteredData,
        programBanners: filteredData.reduce((acc, curVal) => {
          acc[curVal.programKey] = [];
          return acc;
        }, {}),
        loading: true,
        loaded: false,
        loadingError: null,
      };
    }
    case FILTER_PROGRAMS.FAILURE:
      return {
        ...state,
        loading: false,
        loaded: false,
        loadingError: action.payload.error,
      };
    case 'INVALID_FILTER':
      return {
        ...state,
        loading: true,
        loaded: false,
        filterError: true,
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
    case 'NOT_AUTHENTICATED':
      return {
        ...state,
        authorized: false,
      };
    case 'SWITCH_PAGE':
      return {
        ...state,
        currentPage: action.payload.page,
      };
    default:
      return state;
  }
};

export default console;
