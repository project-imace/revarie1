import { jest } from '@jest/globals';
import { getCurrentIST, getResearchDay, isNewDayAvailable, isDormantPeriod, IST_TIMEZONE } from './ist.js';

describe('IST Utilities', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('getCurrentIST', () => {
    it('should return the current time in IST', () => {
      // 10:00 UTC
      const mockDate = new Date('2025-05-20T10:00:00Z');
      jest.setSystemTime(mockDate);

      const result = getCurrentIST();

      // Our mock toZonedTime adds 5.5 hours for IST
      const expectedTime = mockDate.getTime() + (5.5 * 60 * 60 * 1000);
      expect(result.getTime()).toBe(expectedTime);
    });
  });

  describe('getResearchDay', () => {
    it('should return the same day if time is after 6 AM IST', () => {
      // 2025-05-20 07:00 IST
      const date = new Date('2025-05-20T01:30:00Z');
      const researchDay = getResearchDay(date);

      expect(researchDay.toISOString()).toContain('2025-05-20');
    });

    it('should return the previous day if time is before 6 AM IST', () => {
      // 2025-05-20 05:00 IST
      const date = new Date('2025-05-19T23:30:00Z');
      const researchDay = getResearchDay(date);

      expect(researchDay.toISOString()).toContain('2025-05-19');
    });

    it('should handle midnight correctly (before 6 AM)', () => {
      // 2025-05-20 00:30 IST
      const date = new Date('2025-05-19T19:00:00Z');
      const researchDay = getResearchDay(date);

      expect(researchDay.toISOString()).toContain('2025-05-19');
    });
  });

  describe('isNewDayAvailable', () => {
    it('should return true if no last login date is provided', () => {
      expect(isNewDayAvailable(null)).toBe(true);
    });

    it('should return false if last login was on the same research day', () => {
      const lastLogin = '2025-05-20T04:30:00Z'; // 10:00 IST (20th)
      const now = new Date('2025-05-20T16:30:00Z'); // 22:00 IST (20th)
      expect(isNewDayAvailable(lastLogin, now)).toBe(false);
    });

    it('should return true if last login was on a previous research day', () => {
      const lastLogin = '2025-05-19T04:30:00Z'; // 10:00 IST (19th)
      const now = new Date('2025-05-20T04:30:00Z'); // 10:00 IST (20th)
      expect(isNewDayAvailable(lastLogin, now)).toBe(true);
    });

    it('should return false if last login was early morning and now is later same day', () => {
      const lastLogin = '2025-05-19T20:30:00Z'; // 02:00 IST (20th) -> Research Day 19th
      const now = new Date('2025-05-19T23:30:00Z'); // 05:00 IST (20th) -> Research Day 19th
      expect(isNewDayAvailable(lastLogin, now)).toBe(false);
    });

    it('should return true if last login was early morning and now is after 6 AM', () => {
      const lastLogin = '2025-05-19T20:30:00Z'; // 02:00 IST (20th) -> Research Day 19th
      const now = new Date('2025-05-20T01:30:00Z'); // 07:00 IST (20th) -> Research Day 20th
      expect(isNewDayAvailable(lastLogin, now)).toBe(true);
    });
  });

  describe('isDormantPeriod', () => {
    it('should return true if time is between 1 AM and 6 AM IST', () => {
      const date = new Date('2025-05-19T21:30:00Z'); // 03:00 IST
      expect(isDormantPeriod(date)).toBe(true);
    });

    it('should return false if time is exactly 6 AM IST', () => {
      const date = new Date('2025-05-20T00:30:00Z'); // 06:00 IST
      expect(isDormantPeriod(date)).toBe(false);
    });

    it('should return true if time is exactly 1 AM IST', () => {
      const date = new Date('2025-05-19T19:30:00Z'); // 01:00 IST
      expect(isDormantPeriod(date)).toBe(true);
    });

    it('should return false if time is 12:59 AM IST', () => {
      const date = new Date('2025-05-19T19:29:00Z'); // 00:59 IST
      expect(isDormantPeriod(date)).toBe(false);
    });

    it('should return false if time is afternoon', () => {
      const date = new Date('2025-05-20T09:30:00Z'); // 15:00 IST
      expect(isDormantPeriod(date)).toBe(false);
    });
  });
});
