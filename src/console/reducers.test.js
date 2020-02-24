import consoleReducer from './reducers';
import { FETCH_PROGRAMS } from './actions';
import { FETCH_REPORTS } from '../report/actions';

describe('upload reducer', () => {
  it('returns the initial state', () => {
    expect(consoleReducer(undefined, {})).toEqual({
      loading: false,
      loaded: false,
      loadingError: null,
      authorized: true,
      data: [],
      programBanners: {},
    });
  });

  describe('FETCH_PROGRAMS', () => {
    it('handles the GET__FETCH_PROGRAMS__BEGIN action', () => {
      expect(consoleReducer(undefined, { type: FETCH_PROGRAMS.BEGIN })).toEqual({
        loading: true,
        loaded: false,
        loadingError: null,
        authorized: true,
        data: [],
        programBanners: {},
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
        authorized: true,
        data: [
          { programKey: '123', areEnrollmentsWritable: true },
        ],
        programBanners: { 123: [] },
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
        authorized: false,
        data: [],
        programBanners: {},
      });
    });

    it('handles the GET__FETCH_PROGRAMS__FAILURE action', () => {
      expect(consoleReducer(undefined, { type: FETCH_PROGRAMS.FAILURE, payload: { error: 'oops!' } })).toEqual({
        loading: false,
        loaded: false,
        loadingError: 'oops!',
        authorized: false,
        data: [],
        programBanners: {},
      });
    });
  });

  describe('#Adding and removing banners', () => {
    it('handles the ADD_BANNER action with a program that has an empty banner array', () => {
      const state = {
        loading: true,
        loaded: false,
        loadingError: null,
        authorized: true,
        data: [{ programKey: '123' }],
        programBanners: { 123: [] },
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
        authorized: true,
        data: [{ programKey: '123' }],
        programBanners: { 123: [bannerObj] },
      });
    });

    it('handles the ADD_BANNER action and persists old banners', () => {
      const state = {
        loading: true,
        loaded: false,
        loadingError: null,
        authorized: true,
        data: [{ programKey: '123' }],
        programBanners: {
          123: [{
            id: '1231564081852097',
            bannerType: 'success',
            message: 'Woohoo!',
          }],
        },
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
      };

      expect(consoleReducer(state, {
        type: 'REMOVE_BANNER',
        payload: { bannerId: bannerToRemoveId, programKey },
      })).toEqual({
        loading: true,
        loaded: false,
        loadingError: null,
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
      });
    });
  });

  describe('NOT_AUTHENTICATED', () => {
    it('sets authorized to false', () => {
      expect(consoleReducer(undefined, { type: 'NOT_AUTHENTICATED' })).toEqual({
        loading: false,
        loaded: false,
        loadingError: null,
        authorized: false,
        data: [],
        programBanners: {},
      });
    });
  });
});

describe('report reducer', () => {
  it('handles the GET__FETCH_REPORTS__SUCCESS action with report data', () => {
    const action = {
      type: FETCH_REPORTS.SUCCESS,
      payload: {
        programKey: 'test-program',
        reportData: [
          {
            name: 'first-report',
            download_url: 'example.com/first-report',
          },
          {
            name: 'second-report',
            download_url: 'example.com/second-report',
          },
        ],
      },
    };

    expect(consoleReducer(defaultState, action)).toEqual({
      loadingError: null,
      reportData: {
        'test-program': [
          {
            name: 'first-report',
            downloadUrl: 'example.com/first-report',
          },
          {
            name: 'second-report',
            downloadUrl: 'example.com/second-report',
          },
        ],
      },
    });
  });

  it('handles the GET__FETCH_REPORTS__SUCCESS action without report data', () => {
    const action = {
      type: FETCH_REPORTS.SUCCESS,
      payload: {
        programKey: 'test-program',
        reportData: [],
      },
    };

    expect(consoleReducer(defaultState, action)).toEqual({
      loadingError: null,
      reportData: {
        'test-program': [],
      },
    });
  });

  it('handles the GET__FETCH_REPORTS__FAILURE action', () => {
    const action = {
      type: FETCH_REPORTS.FAILURE,
      payload: {
        error: 'error',
      },
    };

    expect(consoleReducer(defaultState, action)).toEqual({
      loadingError: action.payload.error,
      reportData: {},
    });
  });

  it('handles the default case', () => {
    expect(consoleReducer(undefined, {})).toEqual({
      loadingError: null,
      reportData: {},
    });
  });
});
