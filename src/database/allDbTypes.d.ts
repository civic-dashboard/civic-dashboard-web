// This is the one place allowed to import from generated types as here is were we re-export them
// eslint-disable-next-line no-restricted-imports
import * as generated from '@/database/generatedDbTypes';
// Currently keysely codegen does not support materialized views.
// For now we define their type manually here

export type Councillor = {
  contactSlug: string;
  wardSlug: string;
  term: string;
};

export type Contact = {
  contactName: string;
  contactSlug: string;
  photoUrl: string | null;
  email: string;
  phone: string | null;
};

export type Ward = {
  wardSlug: string;
  wardName: string;
  wardId: string;
};

export type DB = generated.DB & {
  Councillors: Councillor;
  Contacts: Contact;
  Wards: Ward;
};

export type InsertRawContact = Insertable<generated.RawContacts>;
export type InsertRawVote = Insertable<generated.RawVotes>;
