import { consoleSelector } from './selectors';

describe('ConsoleSelector', () => {
  it('is a function that returns just the state from the `console` namespace from our store', () => {
    const state = {
      console: { foo: 'bar' },
      otherThing: { fizz: 'bazz' },
    };
    expect(consoleSelector).toBeInstanceOf(Function);
    expect(consoleSelector(state)).toEqual({ foo: 'bar' });
  });
});
