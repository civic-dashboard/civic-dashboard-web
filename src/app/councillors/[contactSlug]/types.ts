export interface Councillor {
  contactSlug: string;
  contactName: string;
  photoUrl: string | null;
  wardName: string;
  // Add additional fields as needed
}

export interface AgendaItem {
  agendaItemNumber: string;
  agendaItemTitle: string;
  motionType: string;
  motionId: string;
  voteDescription: string;
  dateTime: string;
  committeeSlug: string;
  value: string;
  result: string;
  resultKind: string;
}
