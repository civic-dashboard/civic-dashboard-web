import { parse as createCsvParser } from 'csv-parse';
import {
  CsvRow,
  castNullishText,
  createColumnMapper,
  verifyFieldsAreNotNullish,
} from '@/database/pipelines/csvUtils';
import { toSlug } from '@/logic/toSlug';
import { Readable } from 'node:stream';
import {
  extractDataFromTitle,
  toContactName,
} from '@/database/pipelines/textParseUtils';
import { InsertRawVote } from '@/database/allDbTypes';
import createHash from 'hash-sum';

const VoteCsvColumns = {
  _id: 'id',
  Term: 'term',
  Committee: 'committee',
  Vote: 'vote',
  Result: 'result',
  'First Name': 'firstName',
  'Last Name': 'lastName',
  'Date/Time': 'dateTime',
  'Agenda Item #': 'agendaItemNumber',
  'Agenda Item Title': 'agendaItemTitle',
  'Motion Type': 'motionType',
  'Vote Description': 'voteDescription',
} as const;

type ValueOf<T> = T[keyof T];
const MandatoryVoteFields: ReadonlyArray<ValueOf<typeof VoteCsvColumns>> =
  Object.values(VoteCsvColumns);

type CsvVoteRow = CsvRow<typeof VoteCsvColumns>;

export const formatVoteCsvStream = (
  term: string,
  requestStream: Readable,
): AsyncIterable<InsertRawVote> =>
  requestStream
    .pipe(
      createCsvParser({
        trim: true,
        cast: castNullishText,
        columns: createColumnMapper(VoteCsvColumns),
      }),
    )
    .map((row: CsvVoteRow): InsertRawVote => {
      if (!verifyFieldsAreNotNullish(MandatoryVoteFields, row)) {
        throw new Error(`Missing not-nullable field(s)`, { cause: { row } });
      }
      const titleData = extractDataFromTitle(row.agendaItemTitle);
      const contactName = toContactName(row.firstName, row.lastName);
      return {
        term,
        contactName,
        agendaItemTitle: titleData.title,
        inputRowNumber: row.id,
        motionId: getMotionId(row),
        contactSlug: toSlug(contactName),
        committeeName: row.committee,
        committeeSlug: toSlug(row.committee),
        movedBy: titleData.movedBy ?? null,
        secondedBy: titleData.secondedBy ?? null,
        dateTime: row.dateTime,
        agendaItemNumber: row.agendaItemNumber,
        motionType: row.motionType,
        vote: row.vote,
        result: row.result,
        voteDescription: row.voteDescription,
      };
    });

const getMotionId = (row: {
  agendaItemNumber: string;
  motionType: string;
  voteDescription: string;
  result: string;
  dateTime: string;
}) =>
  createHash({
    // We avoid passing the entire object to ensure no extra values sneak in
    agendaItemNumber: row.agendaItemNumber,
    motionType: row.motionType,
    voteDescription: row.voteDescription,
    result: row.result,
    dateTime: row.dateTime,
  });
