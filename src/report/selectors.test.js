import { reportSelector } from './selectors';

describe('reportSelector', () => {
  it('is a function that returns just the state from the `report` namespace from our store', () => {
    const state = {
      report: { foo: 'bar' },
      otherThing: { fizz: 'bazz' },
    };
    expect(reportSelector(state)).toEqual({ foo: 'bar' });
  });
});
