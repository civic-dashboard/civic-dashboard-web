import { AgendaItem } from '@/database/allDbTypes';

type Assert<_T extends true> = never;
type Equivalent<A extends string, B extends string> = A extends B
  ? B extends A
    ? true
    : `${A} does not match ${B}`
  : `${B} does not match ${A}`;
type ColumnsMatch<A extends object, B extends readonly string[]> = Equivalent<
  keyof A & string,
  B[number]
>;

export const agendaItemColumns = [
  'address',
  'agendaCd',
  'agendaItemAddress',
  'agendaItemId',
  'agendaItemRecommendation',
  'agendaItemSummary',
  'agendaItemTitle',
  'backgroundAttachmentId',
  'councilAgendaItemId',
  'decisionAdvice',
  'decisionBodyId',
  'decisionBodyName',
  'decisionRecommendations',
  'geoLocation',
  'id',
  'itemProcessId',
  'itemStatus',
  'meetingDate',
  'meetingId',
  'meetingNumber',
  'neighbourhoodId',
  'planningApplicationNumber',
  'reference',
  'subjectTerms',
  'termId',
  'termYear',
  'wardId',
] as const;

type _AssertAgendaItemColumnsComplete = Assert<
  ColumnsMatch<AgendaItem, typeof agendaItemColumns>
>;
