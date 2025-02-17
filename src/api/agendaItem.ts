import { cityCouncilXSRFPost } from '@/api/cityCouncilRequest';

export interface ApiResponse {
  TotalRecordCount: number;
  TotalPages: number;
  PageSize: number;
  PageNumber: number;
  Result: string;
  Records: AgendaItem[];
}

interface Address {
  agendaItemId: number;
  addressId: number;
  streetNumber?: string;
  streetName?: string;
  streetType?: string;
  streetDirection?: string;
  firstIntersection?: string;
  firstIntStreetType?: string;
  firstIntStreetDirection?: string;
  secondIntersection?: string;
  secondIntStreetType?: string;
  secondIntStreetDirection?: string;
  city: string;
  province: string;
  country: string;
  postalCode?: string;
  latitude: number;
  longitude: number;
  fullAddress: string;
}

export interface AgendaItem {
  id: string;
  termId: number;
  agendaItemId: number;
  councilAgendaItemId: number;
  decisionBodyId: number;
  meetingId: number;
  itemProcessId: number;
  decisionBodyName: string;
  meetingDate: number; // Timestamp in milliseconds
  reference: string;
  termYear: string;
  agendaCd: string;
  meetingNumber: string;
  itemStatus: string;
  agendaItemTitle: string;
  agendaItemSummary: string; // HTML content
  agendaItemRecommendation?: string; // HTML content
  decisionRecommendations?: string; // HTML content
  decisionAdvice?: string; // HTML content
  subjectTerms: string;
  wardId: number[];
  backgroundAttachmentId?: number[];
  agendaItemAddress: Address[];
  address?: string[];
  geoLocation?: string[]; // latlons
  planningApplicationNumber?: string;
  neighbourhoodId?: number[];
}

export const fetchItems = async () => {
  const now = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const body = JSON.stringify({
    includeTitle: true,
    includeSummary: true,
    includeRecommendations: true,
    includeDecisions: true,
    meetingFromDate: now.toISOString(),
    meetingToDate: nextMonth.toISOString(),
  });

  const response = await cityCouncilXSRFPost({
    url: 'https://secure.toronto.ca/council/api/multiple/agenda-items.json?pageNumber=0&pageSize=200&sortOrder=meetingDate%20asc,referenceSort',
    body,
  });

  return ((await response.json()) as ApiResponse).Records;
};
