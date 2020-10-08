import {
  AsyncActionType,
  modifyObjectKeys,
  camelCaseObject,
  snakeCaseObject,
  convertKeyNames,
  keepKeys,
  getTodayWithDaysOffset,
  getISODateString,
} from './utils';

describe('modifyObjectKeys', () => {
  it('should use the provided modify function to change all keys in and object and its children', () => {
    function meowKeys(key) {
      return `${key}Meow`;
    }

    const result = modifyObjectKeys(
      {
        one: undefined,
        two: null,
        three: '',
        four: 0,
        five: NaN,
        six: [1, 2, { seven: 'woof' }],
        eight: { nine: { ten: 'bark' }, eleven: true },
      },
      meowKeys,
    );

    expect(result).toEqual({
      oneMeow: undefined,
      twoMeow: null,
      threeMeow: '',
      fourMeow: 0,
      fiveMeow: NaN,
      sixMeow: [1, 2, { sevenMeow: 'woof' }],
      eightMeow: { nineMeow: { tenMeow: 'bark' }, elevenMeow: true },
    });
  });
});

describe('camelCaseObject', () => {
  it('should make everything camelCase', () => {
    const result = camelCaseObject({
      what_now: 'brown cow',
      but_who: { says_you_people: 'okay then', but_how: { will_we_even_know: 'the song is over' } },
      'dot.dot.dot': 123,
    });

    expect(result).toEqual({
      whatNow: 'brown cow',
      butWho: { saysYouPeople: 'okay then', butHow: { willWeEvenKnow: 'the song is over' } },
      dotDotDot: 123,
    });
  });
});

describe('snakeCaseObject', () => {
  it('should make everything snake_case', () => {
    const result = snakeCaseObject({
      whatNow: 'brown cow',
      butWho: { saysYouPeople: 'okay then', butHow: { willWeEvenKnow: 'the song is over' } },
      'dot.dot.dot': 123,
    });

    expect(result).toEqual({
      what_now: 'brown cow',
      but_who: { says_you_people: 'okay then', but_how: { will_we_even_know: 'the song is over' } },
      dot_dot_dot: 123,
    });
  });
});

describe('convertKeyNames', () => {
  it('should replace the specified keynames', () => {
    const result = convertKeyNames(
      {
        one: { two: { three: 'four' } },
        five: 'six',
      },
      {
        two: 'blue',
        five: 'alive',
        seven: 'heaven',
      },
    );

    expect(result).toEqual({
      one: { blue: { three: 'four' } },
      alive: 'six',
    });
  });
});

describe('keepKeys', () => {
  it('should keep the specified keys only', () => {
    const result = keepKeys({
      one: 123,
      two: { three: 'skip me' },
      four: 'five',
      six: null,
      8: 'sneaky',
    }, [
      'one', 'three', 'six', 'seven', '8', // yup, the 8 integer will be converted to a string.
    ]);

    expect(result).toEqual({
      one: 123,
      six: null,
      8: 'sneaky',
    });
  });

  describe('AsyncActionType', () => {
    it('should return well formatted action strings', () => {
      const actionType = new AsyncActionType('HOUSE_CATS', 'START_THE_RACE');

      expect(actionType.BASE).toBe('HOUSE_CATS__START_THE_RACE');
      expect(actionType.BEGIN).toBe('HOUSE_CATS__START_THE_RACE__BEGIN');
      expect(actionType.SUCCESS).toBe('HOUSE_CATS__START_THE_RACE__SUCCESS');
      expect(actionType.FAILURE).toBe('HOUSE_CATS__START_THE_RACE__FAILURE');
      expect(actionType.RESET).toBe('HOUSE_CATS__START_THE_RACE__RESET');
    });
  });

  describe('getDateWithDaysOffset', () => {
    let date;

    beforeEach(() => {
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should return a correct date object for seven days ago', () => {
      date = new Date(2020, 2, 15);
      const sevenDaysAgo = new Date(2020, 2, 9);

      jest.spyOn(global, 'Date').mockImplementationOnce(() => date);

      expect(getTodayWithDaysOffset(6)).toEqual(sevenDaysAgo);
    });

    it('should return a correct date object for zero days ago', () => {
      date = new Date(2020, 2, 15);
      jest.spyOn(global, 'Date').mockImplementationOnce(() => date);

      expect(getTodayWithDaysOffset(0)).toEqual(date);
    });

    it('should return a date with a correctly wrapped month and year', () => {
      date = new Date(2020, 0, 1);
      const sevenDaysAgo = new Date(2019, 11, 26);

      jest.spyOn(global, 'Date').mockImplementationOnce(() => date);

      expect(getTodayWithDaysOffset(6)).toEqual(sevenDaysAgo);
    });
  });

  describe('getISODateString', () => {
    it('should return an ISO Date string', () => {
      const date = new Date(2020, 3, 5);
      // months are zero-indexed
      expect(getISODateString(date)).toEqual('2020-04-05');
    });
  });
});
