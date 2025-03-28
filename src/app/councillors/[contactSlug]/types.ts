export interface AgendaItem {
  agendaItemNumber: string;
  agendaItemTitle: string;
  agendaItemSummary: string | null;
  motions: Array<Motion>;
}

export interface Motion {
  committeeSlug: string;
  motionType: string;
  motionId: string;
  voteDescription: string;
  dateTime: string;
  value: string;
  tally: string;
  resultKind: string;
  committeeName: string;
}
