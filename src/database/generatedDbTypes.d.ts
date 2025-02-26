/**
 * This file was generated by kysely-codegen.
 * Please do not edit it manually.
 */

import type { ColumnType } from 'kysely';

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;

export type Int8 = ColumnType<
  string,
  bigint | number | string,
  bigint | number | string
>;

export type Json = JsonValue;

export type JsonArray = JsonValue[];

export type JsonObject = {
  [x: string]: JsonValue | undefined;
};

export type JsonPrimitive = boolean | number | string | null;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export interface RawAgendaItemConsiderations {
  /**
   * Array of addresses as strings.
   */
  address: string[] | null;
  /**
   * Agenda committe descriptor, first half of second component of reference
   */
  agendaCd: string;
  /**
   * Array of address objects, see api/agendaItem.ts
   */
  agendaItemAddress: Json | null;
  /**
   * TMMIS ID
   */
  agendaItemId: number;
  /**
   * HTML content
   */
  agendaItemRecommendation: string | null;
  /**
   * HTML content
   */
  agendaItemSummary: string;
  /**
   * Plain text content
   */
  agendaItemTitle: string;
  /**
   * Array of TMMIS IDs
   */
  backgroundAttachmentId: number[] | null;
  /**
   * TMMIS ID
   */
  councilAgendaItemId: number;
  /**
   * HTML content
   */
  decisionAdvice: string | null;
  /**
   * TMMIS ID
   */
  decisionBodyId: number;
  /**
   * May be better to denormalize into a decision body table
   */
  decisionBodyName: string;
  /**
   * HTML content
   */
  decisionRecommendations: string | null;
  /**
   * Array of lat/lon coordinates stored as strings.
   */
  geoLocation: string[] | null;
  /**
   * auto-generated pkey, prefer using reference and meetingId to distinguish agenda items
   */
  id: Generated<string>;
  /**
   * Unknown purpose
   */
  itemProcessId: number;
  /**
   * An enumeration that we havent yet documented the full extend of
   */
  itemStatus: string;
  /**
   * Unix timestamp in millseconds
   */
  meetingDate: Int8;
  /**
   * TMMIS ID
   */
  meetingId: number;
  /**
   * Which meeting in the current year, second half of second component of reference
   */
  meetingNumber: string;
  /**
   * Array of TMMIS IDs
   */
  neighbourhoodId: number[] | null;
  /**
   * Comma separated list of text reference numbers.
   */
  planningApplicationNumber: string | null;
  /**
   * Reference number, e.g. 2024.EX19.2
   */
  reference: string;
  /**
   * Semi-colon/comma separated string
   */
  subjectTerms: string;
  /**
   * TMMIS ID
   */
  termId: number;
  /**
   * Year of term, first component of reference
   */
  termYear: string;
  /**
   * Array of TMMIS IDs
   */
  wardId: number[] | null;
}

export interface RawContacts {
  addressLine1: string | null;
  addressLine2: string | null;
  contactName: string;
  contactSlug: string;
  email: string;
  fax: string | null;
  inputRowNumber: Int8;
  locality: string | null;
  personalWebsite: string | null;
  phone: string | null;
  photoUrl: string | null;
  postalCode: string | null;
  primaryRole: string;
  province: string | null;
  term: string;
  wardId: string | null;
  wardName: string | null;
  wardSlug: string | null;
  website: string | null;
}

export interface RawVotes {
  agendaItemNumber: string;
  agendaItemTitle: string;
  committeeName: string;
  committeeSlug: string;
  contactName: string;
  contactSlug: string;
  dateTime: string;
  inputRowNumber: Int8;
  motionId: string;
  motionType: string;
  movedBy: string | null;
  result: string;
  secondedBy: string[] | null;
  term: string;
  vote: string;
  voteDescription: string;
}

export interface DB {
  RawAgendaItemConsiderations: RawAgendaItemConsiderations;
  RawContacts: RawContacts;
  RawVotes: RawVotes;
}
