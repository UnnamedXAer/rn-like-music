import { secondsToMinutesString } from './time';

test('should return seconds as time in minutes', () => {
	expect(secondsToMinutesString(0)).toBe('0:00');
	expect(secondsToMinutesString(9.123)).toBe('0:09');
	expect(secondsToMinutesString(10)).toBe('0:10');
	expect(secondsToMinutesString(10.235)).toBe('0:10');
	expect(secondsToMinutesString(10.735)).toBe('0:11');
	expect(secondsToMinutesString(310.735)).toBe('5:11');
	expect(secondsToMinutesString(629.735)).toBe('10:30');
});
