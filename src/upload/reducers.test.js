import uploadReducer from './reducers';
import { FETCH_PROGRAMS } from './actions';

describe('!upload reducer', () => {
  it('returns the initial state', () => {
    expect(uploadReducer(undefined, {})).toEqual({
      loading: false,
      loaded: false,
      loadingError: null,
      authorized: true,
      data: [],
      programBanners: {},
    });
  });

  describe('#FETCH_PROGRAMS', () => {
    it('...handles the GET__FETCH_PROGRAMS__BEGIN action', () => {
      expect(uploadReducer(undefined, { type: FETCH_PROGRAMS.BEGIN })).toEqual({
        loading: true,
        loaded: false,
        loadingError: null,
        authorized: true,
        data: [],
        programBanners: {},
      });
    });

    it('...handles the GET__FETCH_PROGRAMS__SUCCESS action with displayable programs', () => {
      const fetchProgramSuccess = {
        type: FETCH_PROGRAMS.SUCCESS,
        payload: {
          data: [
            { programKey: '123', areEnrollmentsWritable: true },
            { programKey: '456', areEnrollmentsWritable: false },
          ],
        },
      };
      expect(uploadReducer(undefined, fetchProgramSuccess)).toEqual({
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

    it('...handles the GET__FETCH_PROGRAMS__SUCCESS action without displayable programs', () => {
      const fetchProgramSuccess = {
        type: FETCH_PROGRAMS.SUCCESS,
        payload: {
          data: [
            { programKey: '123', areEnrollmentsWritable: false },
          ],
        },
      };
      expect(uploadReducer(undefined, fetchProgramSuccess)).toEqual({
        loading: true,
        loaded: false,
        loadingError: null,
        authorized: false,
        data: [],
        programBanners: {},
      });
    });

    it('...handles the GET__FETCH_PROGRAMS__FAILURE action', () => {
      expect(uploadReducer(undefined, { type: FETCH_PROGRAMS.FAILURE, payload: { error: 'oops!' } })).toEqual({
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
    it('...handles the ADD_BANNER action with a program that has an empty banner array', () => {
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

      expect(uploadReducer(state, {
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

    it('...handles the ADD_BANNER action and persists old banners', () => {
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

      expect(uploadReducer(state, {
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

    it('...handles the REMOVE_BANNER action and persists all other banners', () => {
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

      expect(uploadReducer(state, {
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

  describe('#NOT_AUTHENTICATED', () => {
    it('...sets authorized to false', () => {
      expect(uploadReducer(undefined, { type: 'NOT_AUTHENTICATED' })).toEqual({
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

