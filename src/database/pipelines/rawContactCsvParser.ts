import { parse as createCsvParser } from 'csv-parse';
import {
  CsvRow,
  createColumnMapper,
  sharedCast,
  verifyFieldsAreNotNullish,
} from '@/database/pipelines/csvUtils';
import { validateUrl } from '@/logic/sanitize';
import { getMemberSitePortrait } from '@/database/pipelines/getActiveProfilePhoto';
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
): AsyncIterable<InsertRawContact> => {
  const parsedRequestStream = requestStream.pipe(
    createCsvParser({
      trim: true,
      cast: sharedCast,
      columns: createColumnMapper(ContactCsvColumns),
    }),
  );
  // Vacancies appear with nullish names
  const filteredRequestStream: AsyncIterable<CsvContactRow> =
    parsedRequestStream.filter((row: CsvContactRow) =>
      Boolean(row.firstName && row.lastName),
    );
  // TODO: Adjust this based on constraints or add logic to determine batch size dynamically
  const batchSize = 26;
  return processRowsInBatches(filteredRequestStream, batchSize, (row) =>
    processRow(row, term),
  );
};

// Process rows and validates fields
async function processRow(row: CsvContactRow, term: string): InsertRawContact {
  if (!verifyFieldsAreNotNullish(MandatoryContactFields, row)) {
    throw new Error(`Missing not-nullable field(s)`, { cause: { row } });
  }
  const contactName = toContactName(row.firstName, row.lastName);

  let imgUrl: string | null = row.photoUrl ?? null;
  if (!(await validateUrl(imgUrl))) {
    console.log(`Invalid photo URL for council member ${contactName}:`, imgUrl);
    imgUrl = await getMemberSitePortrait(
      row.districtId,
      contactName,
      row.primaryRole,
    );
  }

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
    photoUrl: imgUrl,
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
}

async function* processRowsInBatches<T>(
  iterable: AsyncIterable<T>,
  batchSize: number,
  processFunction: (item: T) => Promise<InsertRawContact>,
): AsyncIterable<InsertRawContact> {
  const batch: Array<T> = [];
  async function* processBatch() {
    if (batch.length > 0) {
      for (const row of await Promise.all(batch.map(processFunction))) {
        yield row;
      }
    }
  }
  for await (const item of iterable) {
    batch.push(item);
    if (batch.length >= batchSize) {
      yield* processBatch();
    }
  }

  // Process remaining rows, where batch length is less than batchSize
  if (batch.length > 0) {
    yield* processBatch();
  }
}
