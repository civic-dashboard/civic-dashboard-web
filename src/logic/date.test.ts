import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getStartOfToday } from '@/logic/date';

describe('getStartOfToday', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const startOfTodayAt = (now: string) => {
    vi.setSystemTime(new Date(now));
    return getStartOfToday().toISOString();
  };

  it('returns Toronto midnight in winter (EST, UTC-5)', () => {
    expect(startOfTodayAt('2026-01-15T15:00:00Z')).toBe(
      '2026-01-15T05:00:00.000Z',
    );
  });

  it('returns Toronto midnight in summer (EDT, UTC-4)', () => {
    expect(startOfTodayAt('2026-07-15T15:00:00Z')).toBe(
      '2026-07-15T04:00:00.000Z',
    );
  });

  it('uses the Toronto date when UTC has already rolled over to tomorrow', () => {
    // 10pm Jan 15 in Toronto is 3am Jan 16 in UTC
    expect(startOfTodayAt('2026-01-16T03:00:00Z')).toBe(
      '2026-01-15T05:00:00.000Z',
    );
  });

  it('works just after midnight in Toronto', () => {
    expect(startOfTodayAt('2026-01-15T05:30:00Z')).toBe(
      '2026-01-15T05:00:00.000Z',
    );
  });

  it('uses the pre-change offset on the day clocks spring forward', () => {
    // DST starts at 2am on Mar 8, 2026, so midnight that day was still EST
    expect(startOfTodayAt('2026-03-08T15:00:00Z')).toBe(
      '2026-03-08T05:00:00.000Z',
    );
  });

  it('uses the pre-change offset on the day clocks fall back', () => {
    // DST ends at 2am on Nov 1, 2026, so midnight that day was still EDT
    expect(startOfTodayAt('2026-11-01T15:00:00Z')).toBe(
      '2026-11-01T04:00:00.000Z',
    );
  });
});
