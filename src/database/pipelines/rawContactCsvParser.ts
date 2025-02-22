import { parse as createCsvParser } from 'csv-parse';
import {
  CsvRow,
  castNullishText,
  createColumnMapper,
  verifyFieldsAreNotNullish,
} from '@/database/pipelines/csvUtils';
import { toSlug } from '@/logic/toSlug';
import { Readable } from 'node:stream';
import { toContactName } from '@/database/pipelines/textParseUtils';
import { InsertRawContact } from '@/database/allDbTypes';

const ContactCsvColumns = {
  _id: 'id',
  Email: 'email',
  Website: 'website',
  Locality: 'locality',
  Province: 'province',
  Phone: 'phone',
  'District name': 'districtName',
  'District ID': 'districtId',
  'Primary role': 'primaryRole',
  'First name': 'firstName',
  'Last name': 'lastName',
  'Photo URL': 'photoUrl',
  'Address line 1': 'addressLine1',
  'Address line 2': 'addressLine2',
  'Postal code': 'postalCode',
  'Personal Website': 'personalWebsite',
  Fax: 'fax',
} as const;

const MandatoryContactFields = [
  'id',
  'firstName',
  'lastName',
  'email',
  'primaryRole',
  'districtName',
] as const;

type CsvContactRow = CsvRow<typeof ContactCsvColumns>;

export const formatContactCsvStream = (
  term: string,
  requestStream: Readable,
): AsyncIterable<InsertRawContact> =>
  requestStream
    .pipe(
      createCsvParser({
        trim: true,
        cast: castNullishText,
        columns: createColumnMapper(ContactCsvColumns),
      }),
    )
    // Vacancies appear with nullish names
    .filter((row: CsvContactRow) => Boolean(row.firstName && row.lastName))
    .map((row: CsvContactRow): InsertRawContact => {
      if (!verifyFieldsAreNotNullish(MandatoryContactFields, row)) {
        throw new Error(`Missing not-nullable field(s)`, { cause: { row } });
      }
      const contactName = toContactName(row.firstName, row.lastName);
      return {
        term,
        contactName,
        contactSlug: toSlug(contactName),
        wardSlug: toSlug(row.districtName),
        inputRowNumber: row.id,
        wardId: row.districtId,
        wardName: row.districtName,
        primaryRole: row.primaryRole,
        email: row.email,
        photoUrl: row.photoUrl,
        website: row.website,
        addressLine1: row.addressLine1,
        addressLine2: row.addressLine2,
        locality: row.locality,
        postalCode: row.postalCode,
        province: row.province,
        phone: row.phone,
        personalWebsite: row.personalWebsite,
        fax: row.fax,
      };
    });
