// This is the one place allowed to import from generated types as here is were we re-export them
// eslint-disable-next-line no-restricted-imports
import * as generated from '@/database/generatedDbTypes';
import { Insertable } from 'kysely';

// Note that some values from this export will be overridden by exports later in this file.
// eslint-disable-next-line no-restricted-imports
export * from '@/database/generatedDbTypes';

// ── Helpers ──────────────────────────────────────────────────────────

/**
 * Asserts that types T and U have exactly the same keys.
 *
 * Resolves to `true` when keys match, or `never` when they diverge.
 * A `never` result causes a compile error on the declaration line,
 * alerting that a column was added/removed from the underlying database
 * view/table without updating the override.
 */
type AssertExactKeys<T, U> = [keyof T] extends [keyof U]
  ? [keyof U] extends [keyof T]
    ? true
    : `Extra keys in override not in generated: ${Exclude<keyof U, keyof T> & string}`
  : `Missing keys from generated not in override: ${Exclude<keyof T, keyof U> & string}`;

// ── Insertable types ──────────────────────────────────────────────────

export type InsertRawContact = Insertable<generated.RawContacts>;
export type InsertRawVote = Insertable<generated.RawVotes>;

// ── Views / Materialized Views (corrected nullability) ────────────────

/**
 * Schema overrides for views/materialized views.
 *
 * PostgreSQL's information_schema always marks view columns as nullable,
 * even when the underlying source tables enforce NOT NULL. This file
 * corrects the generated types to match the actual database constraints.
 *
 * Each overridden interface extends its generated counterpart (minus the
 * fields being overridden) so nullable fields don't have to be repeated.
 *
 * Note: `Wards.wardSlug/wardName` and `Councillors.wardSlug` are asserted
 * non-null because the ingest pipeline enforces `districtName` as a
 * mandatory CSV field (see `rawContactCsvParser`), even though the raw
 * columns are nullable.
 *
 * See https://github.com/RobinBlomberg/kysely-codegen/issues/261
 */

export interface AgendaItems extends Omit<
  generated.AgendaItems,
  'agendaItemNumber' | 'agendaItemTitle'
> {
  agendaItemNumber: string;
  agendaItemTitle: string;
}
const _assertAgendaItemsKeys: AssertExactKeys<
  generated.AgendaItems,
  AgendaItems
> = true;

export interface Committees {
  committeeName: string;
  committeeSlug: string;
}
declare const _assertCommitteesKeys: AssertExactKeys<
  generated.Committees,
  Committees
>;

export interface Contacts extends Omit<
  generated.Contacts,
  'contactName' | 'contactSlug' | 'email'
> {
  contactName: string;
  contactSlug: string;
  email: string;
}
const _assertContactsKeys: AssertExactKeys<generated.Contacts, Contacts> = true;

export interface CouncilMembers extends Omit<
  generated.CouncilMembers,
  'contactSlug' | 'role' | 'term'
> {
  contactSlug: string;
  role: string;
  term: string;
}
const _assertCouncilMembersKeys: AssertExactKeys<
  generated.CouncilMembers,
  CouncilMembers
> = true;

export interface Councillors extends Omit<
  generated.Councillors,
  'contactSlug' | 'wardSlug' | 'term'
> {
  contactSlug: string;
  wardSlug: string;
  term: string;
}
const _assertCouncillorsKeys: AssertExactKeys<
  generated.Councillors,
  Councillors
> = true;

export interface Mayors extends Omit<generated.Mayors, 'contactSlug' | 'term'> {
  contactSlug: string;
  term: string;
}
const _assertMayorsKeys: AssertExactKeys<generated.Mayors, Mayors> = true;

export interface Motions {
  agendaItemNumber: string;
  committeeSlug: string;
  dateTime: string;
  motionId: string;
  motionType: string;
  noVotes: number;
  result: string;
  resultKind: string;
  voteDescription: string;
  yesVotes: number;
}
const _assertMotionsKeys: AssertExactKeys<generated.Motions, Motions> = true;

export interface Movers {
  agendaItemNumber: string;
  movedBy: string;
}
const _assertMoversKeys: AssertExactKeys<generated.Movers, Movers> = true;

export interface Seconders {
  agendaItemNumber: string;
  unnest: string;
}
const _assertSecondersKeys: AssertExactKeys<generated.Seconders, Seconders> =
  true;

export interface Votes {
  agendaItemNumber: string;
  contactSlug: string;
  motionId: string;
  value: string;
}
const _assertVotesKeys: AssertExactKeys<generated.Votes, Votes> = true;

export interface Wards extends Omit<
  generated.Wards,
  'wardId' | 'wardSlug' | 'wardName'
> {
  wardId: string;
  wardSlug: string;
  wardName: string;
}
const _assertWardsKeys: AssertExactKeys<generated.Wards, Wards> = true;

// ── Corrected DB type ────────────────────────────────────────────────

export type DB = Omit<
  generated.DB,
  | 'AgendaItems'
  | 'Committees'
  | 'Contacts'
  | 'CouncilMembers'
  | 'Councillors'
  | 'Mayors'
  | 'Motions'
  | 'Movers'
  | 'Seconders'
  | 'Votes'
  | 'Wards'
> & {
  AgendaItems: AgendaItems;
  Committees: Committees;
  Contacts: Contacts;
  CouncilMembers: CouncilMembers;
  Councillors: Councillors;
  Mayors: Mayors;
  Motions: Motions;
  Movers: Movers;
  Seconders: Seconders;
  Votes: Votes;
  Wards: Wards;
};
