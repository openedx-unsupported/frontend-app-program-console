import { FETCH_PROGRAMS } from './actions';
import { shouldProgramBeDisplayed } from './utils';

export const defaultState = {
  loading: false,
  loaded: false,
  loadingError: null,
  authorized: true,
  data: [],
  programBanners: {},
};

const upload = (state = defaultState, action) => {
  const { programBanners } = state;
  switch (action.type) {
    case FETCH_PROGRAMS.BEGIN:
      return {
        ...state,
        loading: true,
        loaded: false,
        loadingError: null,
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
    default:
      return state;
  }
};

export default upload;
