export interface AgendaItem {
  agendaItemNumber: string;
  agendaItemTitle: string;
  agendaItemSummary: string | null;
  motions: Array<{
    committeeSlug: string;
    motionType: string;
    motionId: string;
    voteDescription: string;
    dateTime: string;
    value: string;
    result: string;
    resultKind: string;
  }>;
}
