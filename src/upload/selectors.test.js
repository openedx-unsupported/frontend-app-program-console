import { uploadSelector } from './selectors';

describe('UploadSelector', () => {
  it('is a function that returns just the state from the `upload` namespace from our store', () => {
    const state = {
      upload: { foo: 'bar' },
      otherThing: { fizz: 'bazz' },
    };
    expect(uploadSelector).toBeInstanceOf(Function);
    expect(uploadSelector(state)).toEqual({ foo: 'bar' });
  });
});
