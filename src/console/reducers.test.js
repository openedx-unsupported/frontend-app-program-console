import consoleReducer from './reducers';
import { FETCH_PROGRAMS, FILTER_PROGRAMS } from './actions';

describe('upload reducer', () => {
  it('returns the initial state', () => {
    expect(consoleReducer(undefined, {})).toEqual({
      loading: false,
      loaded: false,
      loadingError: null,
      filterError: false,
      authorized: true,
      data: [],
      programBanners: {},
      currentPage: 1,
      pageSize: 10,
    });
  });

  describe('FETCH_PROGRAMS', () => {
    it('handles the GET__FETCH_PROGRAMS__BEGIN action', () => {
      expect(consoleReducer(undefined, { type: FETCH_PROGRAMS.BEGIN })).toEqual({
        loading: true,
        loaded: false,
        loadingError: null,
        filterError: false,
        authorized: true,
        data: [],
        programBanners: {},
        currentPage: 1,
        pageSize: 10,
      });
    });

    it('handles the GET__FETCH_PROGRAMS__SUCCESS action with displayable programs', () => {
      const fetchProgramSuccess = {
        type: FETCH_PROGRAMS.SUCCESS,
        payload: {
          data: [
            { programKey: '123', areEnrollmentsWritable: true },
            { programKey: '456', areEnrollmentsWritable: false },
          ],
        },
      };
      expect(consoleReducer(undefined, fetchProgramSuccess)).toEqual({
        loading: true,
        loaded: false,
        loadingError: null,
        filterError: false,
        authorized: true,
        data: [
          { programKey: '123', areEnrollmentsWritable: true },
        ],
        programBanners: { 123: [] },
        currentPage: 1,
        pageSize: 10,
      });
    });

    it('handles the GET__FETCH_PROGRAMS__SUCCESS action without displayable programs', () => {
      const fetchProgramSuccess = {
        type: FETCH_PROGRAMS.SUCCESS,
        payload: {
          data: [
            { programKey: '123', areEnrollmentsWritable: false },
          ],
        },
      };
      expect(consoleReducer(undefined, fetchProgramSuccess)).toEqual({
        loading: true,
        loaded: false,
        loadingError: null,
        filterError: false,
        authorized: false,
        data: [],
        programBanners: {},
        currentPage: 1,
        pageSize: 10,
      });
    });

    it('handles the GET__FETCH_PROGRAMS__FAILURE action', () => {
      expect(consoleReducer(undefined, { type: FETCH_PROGRAMS.FAILURE, payload: { error: 'oops!' } })).toEqual({
        loading: false,
        loaded: false,
        loadingError: 'oops!',
        filterError: false,
        authorized: false,
        data: [],
        programBanners: {},
        currentPage: 1,
        pageSize: 10,
      });
    });
  });

  describe('Filter programs', () => {
    it('handles the GET__FILTER_PROGRAMS__BEGIN action', () => {
      expect(consoleReducer(undefined, { type: FILTER_PROGRAMS.BEGIN, payload: 'test' })).toEqual({
        loading: true,
        loaded: false,
        loadingError: null,
        filterError: false,
        authorized: true,
        data: [],
        programBanners: {},
        currentPage: 1,
        pageSize: 10,
      });
    });

    it('handles the GET__FILTER_PROGRAMS__SUCCESS action', () => {
      const filterProgramsSuccess = {
        type: FILTER_PROGRAMS.SUCCESS,
        payload: {
          data: [
            { programKey: '123', programTitle: 'Test', areEnrollmentsWritable: true },
            { programKey: '456', programTitle: 'Another Test', areEnrollmentsWritable: true },
          ],
        },
      };
      expect(consoleReducer(undefined, filterProgramsSuccess)).toEqual({
        loading: true,
        loaded: false,
        loadingError: null,
        filterError: false,
        authorized: true,
        data: [
          { programKey: '123', programTitle: 'Test', areEnrollmentsWritable: true },
          { programKey: '456', programTitle: 'Another Test', areEnrollmentsWritable: true },
        ],
        programBanners: { 123: [], 456: [] },
        currentPage: 1,
        pageSize: 10,
      });
    });

    it('handles the GET__FILTER_PROGRAMS__FAILURE action', () => {
      expect(consoleReducer(undefined, { type: FILTER_PROGRAMS.FAILURE, payload: { error: 'oops!' } })).toEqual({
        loading: false,
        loaded: false,
        loadingError: 'oops!',
        filterError: false,
        authorized: true,
        data: [],
        programBanners: {},
        currentPage: 1,
        pageSize: 10,
      });
    });

    it('handles the "INVALID_FILTER" action', () => {
      expect(consoleReducer(undefined, { type: 'INVALID_FILTER' })).toEqual({
        loading: true,
        loaded: false,
        loadingError: null,
        filterError: true,
        authorized: true,
        data: [],
        programBanners: {},
        currentPage: 1,
        pageSize: 10,
      });
    });
  });

  describe('#Adding and removing banners', () => {
    it('handles the ADD_BANNER action with a program that has an empty banner array', () => {
      const state = {
        loading: true,
        loaded: false,
        loadingError: null,
        filterError: false,
        authorized: true,
        data: [{ programKey: '123' }],
        programBanners: { 123: [] },
        currentPage: 1,
        pageSize: 10,
      };
      const programKey = '123';
      const bannerObj = {
        id: `${programKey}${Date.now()}`,
        bannerType: 'info',
        message: 'Your enrollment csv is being built. Please wait.',
      };

      expect(consoleReducer(state, {
        type: 'ADD_BANNER',
        payload: { bannerObj, programKey },
      })).toEqual({
        loading: true,
        loaded: false,
        loadingError: null,
        filterError: false,
        authorized: true,
        data: [{ programKey: '123' }],
        programBanners: { 123: [bannerObj] },
        currentPage: 1,
        pageSize: 10,
      });
    });

    it('handles the ADD_BANNER action and persists old banners', () => {
      const state = {
        loading: true,
        loaded: false,
        loadingError: null,
        filterError: false,
        authorized: true,
        data: [{ programKey: '123' }],
        programBanners: {
          123: [{
            id: '1231564081852097',
            bannerType: 'success',
            message: 'Woohoo!',
          }],
        },
        currentPage: 1,
        pageSize: 10,
      };
      const programKey = '123';
      const bannerObj = {
        id: `${programKey}${Date.now()}`,
        bannerType: 'info',
        message: 'Your enrollment csv is being built. Please wait.',
      };

      expect(consoleReducer(state, {
        type: 'ADD_BANNER',
        payload: { bannerObj, programKey },
      })).toEqual({
        loading: true,
        loaded: false,
        loadingError: null,
        filterError: false,
        authorized: true,
        data: [{ programKey: '123' }],
        programBanners: {
          123: [
            {
              id: '1231564081852097',
              bannerType: 'success',
              message: 'Woohoo!',
            },
            bannerObj,
          ],
        },
        currentPage: 1,
        pageSize: 10,
      });
    });

    it('handles the REMOVE_BANNER action and persists all other banners', () => {
      const programKey = '123';
      const bannerToRemoveId = `${programKey}${Date.now()}`;
      const bannerObj = {
        id: bannerToRemoveId,
        bannerType: 'info',
        message: 'Your enrollment csv is being built. Please wait.',
      };
      const state = {
        loading: true,
        loaded: false,
        loadingError: null,
        filterError: false,
        authorized: true,
        data: [{ programKey: '123' }],
        programBanners: {
          123: [
            {
              id: '1231564081852097',
              bannerType: 'success',
              message: 'Woohoo!',
            },
            bannerObj,
          ],
          456: [{
            id: '4561564081852097',
            bannerType: 'error',
            message: 'BOO!',
          }],
        },
        currentPage: 1,
        pageSize: 10,
      };

      expect(consoleReducer(state, {
        type: 'REMOVE_BANNER',
        payload: { bannerId: bannerToRemoveId, programKey },
      })).toEqual({
        loading: true,
        loaded: false,
        loadingError: null,
        filterError: false,
        authorized: true,
        data: [{ programKey: '123' }],
        programBanners: {
          123: [{
            id: '1231564081852097',
            bannerType: 'success',
            message: 'Woohoo!',
          }],
          456: [{
            id: '4561564081852097',
            bannerType: 'error',
            message: 'BOO!',
          }],
        },
        currentPage: 1,
        pageSize: 10,
      });
    });
  });

  describe('NOT_AUTHENTICATED', () => {
    it('sets authorized to false', () => {
      expect(consoleReducer(undefined, { type: 'NOT_AUTHENTICATED' })).toEqual({
        loading: false,
        loaded: false,
        loadingError: null,
        filterError: false,
        authorized: false,
        data: [],
        programBanners: {},
        currentPage: 1,
        pageSize: 10,
      });
    });
  });
});

describe('SWITCH_PAGE', () => {
  it('sets page number', () => {
    const state = {
      loading: true,
      loaded: false,
      loadingError: null,
      filterError: false,
      authorized: true,
      data: [{ programKey: '123' }],
      programBanners: { 123: [] },
      currentPage: 1,
      pageSize: 10,
    };
    expect(consoleReducer(state, {
      type: 'SWITCH_PAGE',
      payload: { page: 2 },
    })).toEqual({
      loading: true,
      loaded: false,
      loadingError: null,
      filterError: false,
      authorized: true,
      data: [{ programKey: '123' }],
      programBanners: { 123: [] },
      currentPage: 2,
      pageSize: 10,
    });
  });
});
