import { describe, expect, it } from 'vitest';
import { formatAgendaItemStatus, sentenceCase } from '@/logic/strings';

describe('sentenceCase', () => {
  it('capitalizes the first letter and lowercases the rest', () => {
    expect(sentenceCase('HELLO World')).toBe('Hello world');
  });

  it('handles a single character', () => {
    expect(sentenceCase('a')).toBe('A');
  });

  it('returns an empty string for empty input', () => {
    expect(sentenceCase('')).toBe('');
  });
});

describe('formatAgendaItemStatus', () => {
  it.each([
    ['CONFRMED', 'Confirmed'],
    ['DEEMADPT', 'Deemed Adopted'],
    ['NO_ACTN', 'No Action is Required'],
    ['POSTPONE', 'Deferred'],
    ['WITHDRAW', 'Withdrawn'],
  ])('maps the TMMIS code %s to "%s"', (code, label) => {
    expect(formatAgendaItemStatus(code)).toBe(label);
  });

  it('falls back to sentence case for unknown codes', () => {
    expect(formatAgendaItemStatus('ADOPTED')).toBe('Adopted');
  });

  it.each([null, undefined, ''])('returns an empty string for %j', (input) => {
    expect(formatAgendaItemStatus(input)).toBe('');
  });
});
