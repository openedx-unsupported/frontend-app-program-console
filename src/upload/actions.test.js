import {
  addBanner,
  downloadEnrollments,
  downloadEnrollmentsFailure,
  downloadEnrollmentsSuccess,
  fetchJobs,
  fetchJobsBegin,
  fetchJobsFailure,
  fetchJobsSuccess,
  fetchWritablePrograms,
  fetchWritableProgramsBegin,
  fetchWritableProgramsFailure,
  fetchWritableProgramsSuccess,
  notAuthenticated,
  pollJob,
  pollJobSuccess,
  pollJobFailure,
  removeBanner,
  uploadEnrollments,
  uploadEnrollmentsFailure,
  uploadEnrollmentsSuccess,
} from './actions';

describe('!Adding and removing banners', () => {
  describe('#ADD_BANNER', () => {
    const testBannerObj = {
      id: `123${Date.now()}`,
      bannerType: 'danger',
      message: 'Sorry something went wrong',
    };

    it('...is an action creator', () => {
      expect(addBanner).toBeInstanceOf(Function);
      expect(addBanner('123', testBannerObj)).toEqual({
        type: 'ADD_BANNER',
        payload: {
          programKey: '123',
          bannerObj: testBannerObj,
        },
      });
    });
  });

  describe('#REMOVE_BANNER', () => {
    const testBannerId = `123${Date.now()}`;
    it('...is an action creator', () => {
      expect(removeBanner).toBeInstanceOf(Function);
      expect(removeBanner('123', testBannerId)).toEqual({
        type: 'REMOVE_BANNER',
        payload: {
          programKey: '123',
          bannerId: testBannerId,
        },
      });
    });
  });
});

describe('#DOWNLOAD_ENROLLMENTS', () => {
  it('...has a base action creator', () => {
    expect(downloadEnrollments).toBeInstanceOf(Function);
    expect(downloadEnrollments('123', true)).toEqual({
      type: 'DOWNLOAD__DOWNLOAD_PROGRAM_ENROLLMENTS',
      payload: {
        programKey: '123',
        isCourses: true,
      },
    });
  });

  it('...has a success action creator', () => {
    const testBannerObj = {
      id: `123${Date.now()}`,
      bannerType: 'success',
      message: 'Yay! You did it!',
    };

    expect(downloadEnrollmentsSuccess).toBeInstanceOf(Function);
    expect(downloadEnrollmentsSuccess('123', testBannerObj)).toEqual({
      type: 'DOWNLOAD__DOWNLOAD_PROGRAM_ENROLLMENTS__SUCCESS',
      payload: {
        programKey: '123',
        bannerObj: testBannerObj,
      },
    });
  });

  it('...has a failure action creator', () => {
    const testBannerObj = {
      id: `123${Date.now()}`,
      bannerType: 'success',
      message: 'Yay! You did it!',
    };

    expect(downloadEnrollmentsFailure).toBeInstanceOf(Function);
    expect(downloadEnrollmentsFailure('123', testBannerObj)).toEqual({
      type: 'DOWNLOAD__DOWNLOAD_PROGRAM_ENROLLMENTS__FAILURE',
      payload: {
        programKey: '123',
        bannerObj: testBannerObj,
      },
    });
  });
});

describe('#FETCH_WRITABLE_PROGRAMS', () => {
  it('...has a base action creator', () => {
    expect(fetchWritablePrograms).toBeInstanceOf(Function);
    expect(fetchWritablePrograms()).toEqual({
      type: 'GET__FETCH_WRITABLE_PROGRAMS',
    });
  });

  it('...has a begin action creator', () => {
    expect(fetchWritableProgramsBegin).toBeInstanceOf(Function);
    expect(fetchWritableProgramsBegin()).toEqual({
      type: 'GET__FETCH_WRITABLE_PROGRAMS__BEGIN',
    });
  });

  it('...has a success action creator', () => {
    expect(fetchWritableProgramsSuccess).toBeInstanceOf(Function);
    expect(fetchWritableProgramsSuccess({ foo: 'bar' })).toEqual({
      type: 'GET__FETCH_WRITABLE_PROGRAMS__SUCCESS',
      payload: {
        data: { foo: 'bar' },
      },
    });
  });

  it('...has a failure action creator', () => {
    expect(fetchWritableProgramsFailure).toBeInstanceOf(Function);
    expect(fetchWritableProgramsFailure({ foo: 'bar' })).toEqual({
      type: 'GET__FETCH_WRITABLE_PROGRAMS__FAILURE',
      payload: {
        error: { foo: 'bar' },
      },
    });
  });
});

describe('#FETCH_JOBS', () => {
  it('...has a base action creator', () => {
    expect(fetchJobs).toBeInstanceOf(Function);
    expect(fetchJobs()).toEqual({ type: 'GET__FETCH_JOBS' });
  });

  it('...has a begin action creator', () => {
    expect(fetchJobsBegin).toBeInstanceOf(Function);
    expect(fetchJobsBegin()).toEqual({ type: 'GET__FETCH_JOBS__BEGIN' });
  });

  it('...has a success action creator', () => {
    expect(fetchJobsSuccess).toBeInstanceOf(Function);
    expect(fetchJobsSuccess()).toEqual({ type: 'GET__FETCH_JOBS__SUCCESS' });
  });

  it('...has a failure action creator', () => {
    const testErrorObj = new Error('It failed!');
    expect(fetchJobsFailure).toBeInstanceOf(Function);
    expect(fetchJobsFailure(testErrorObj)).toEqual({
      type: 'GET__FETCH_JOBS__FAILURE',
      payload: { error: testErrorObj },
    });
  });
});

describe('#NOT_AUTHENTICATED', () => {
  it('...is an action creator', () => {
    expect(notAuthenticated).toBeInstanceOf(Function);
    expect(notAuthenticated()).toEqual({ type: 'NOT_AUTHENTICATED' });
  });
});

describe('#POLL_JOB', () => {
  it('...has a base action creator', () => {
    const testBannerId = `123${Date.now()}`;
    expect(pollJob).toBeInstanceOf(Function);
    expect(pollJob('123', 'abc', testBannerId)).toEqual({
      type: 'GET__POLL_JOB',
      payload: {
        programKey: '123',
        jobId: 'abc',
        bannerId: testBannerId,
      },
    });
  });

  it('...has a success action creator', () => {
    const testBannerObj = {
      id: `123${Date.now()}`,
      bannerType: 'success',
      message: 'Yay! You did it!',
    };
    expect(pollJobSuccess).toBeInstanceOf(Function);
    expect(pollJobSuccess('123', testBannerObj)).toEqual({
      type: 'GET__POLL_JOB__SUCCESS',
      payload: {
        programKey: '123',
        bannerObj: testBannerObj,
      },
    });
  });

  it('..has a failure action creator', () => {
    const testErrorObj = new Error('It failed!');
    expect(pollJobFailure).toBeInstanceOf(Function);
    expect(pollJobFailure(testErrorObj)).toEqual({
      type: 'GET__POLL_JOB__FAILURE',
      payload: {
        error: testErrorObj,
      },
    });
  });
});

describe('#UPLOAD_ENROLLMENTS', () => {
  it('...has a base action creator', () => {
    const testFile = new File([], 'test');
    expect(uploadEnrollments).toBeInstanceOf(Function);
    expect(uploadEnrollments('123', true, testFile)).toEqual({
      type: 'UPLOAD__UPlOAD_PROGRAM_ENROLLMENTS',
      payload: {
        programKey: '123',
        isCourses: true,
        file: testFile,
      },
    });
  });

  it('...has a success action creator', () => {
    const testBannerObj = {
      id: `123${Date.now()}`,
      bannerType: 'success',
      message: 'Yay! You did it!',
    };

    expect(uploadEnrollmentsSuccess).toBeInstanceOf(Function);
    expect(uploadEnrollmentsSuccess('123', testBannerObj)).toEqual({
      type: 'UPLOAD__UPlOAD_PROGRAM_ENROLLMENTS__SUCCESS',
      payload: {
        programKey: '123',
        bannerObj: testBannerObj,
      },
    });
  });

  it('...has a failure action creator', () => {
    const testBannerObj = {
      id: `123${Date.now()}`,
      bannerType: 'success',
      message: 'Yay! You did it!',
    };

    expect(uploadEnrollmentsFailure).toBeInstanceOf(Function);
    expect(uploadEnrollmentsFailure('123', testBannerObj)).toEqual({
      type: 'UPLOAD__UPlOAD_PROGRAM_ENROLLMENTS__FAILURE',
      payload: {
        programKey: '123',
        bannerObj: testBannerObj,
      },
    });
  });
});
