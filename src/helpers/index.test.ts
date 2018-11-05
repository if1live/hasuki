import { secondsToDisplay } from '.';

describe('secondsToDisplay', () => {
  test('0:01', () => expect(secondsToDisplay(1)).toEqual('0:01'));
  test('0:12', () => expect(secondsToDisplay(12)).toEqual('0:12'));
  test('1:02', () => expect(secondsToDisplay(62)).toEqual('1:02'));
  test('12:34', () => expect(secondsToDisplay(60 * 12 + 34)).toEqual('12:34'));
  test('1:00:00', () => expect(secondsToDisplay(3600)).toEqual('1:00:00'));
});
