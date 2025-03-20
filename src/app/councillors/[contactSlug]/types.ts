export interface AgendaItem {
  agendaItemNumber: string;
  agendaItemTitle: string;
  agendaItemSummary: string | null;
  motionType: string;
  motionId: string;
  voteDescription: string;
  dateTime: string;
  committeeSlug: string;
  value: string;
  result: string;
  resultKind: string;
}
