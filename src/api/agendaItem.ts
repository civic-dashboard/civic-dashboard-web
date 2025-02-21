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

type AgendaItemFetchOptions = {
  start: Date;
  end: Date;
};

const fetchItemPage = async (
  page: number,
  { start, end }: AgendaItemFetchOptions,
) => {
  const body = JSON.stringify({
    includeTitle: true,
    includeSummary: true,
    includeRecommendations: true,
    includeDecisions: true,
    meetingFromDate: start.toISOString(),
    meetingToDate: end.toISOString(),
  });

  const response = await cityCouncilXSRFPost({
    url: `https://secure.toronto.ca/council/api/multiple/agenda-items.json?pageNumber=${page}&pageSize=200&sortOrder=meetingDate%20asc,referenceSort`,
    body,
  });

  return (await response.json()) as ApiResponse;
};

const deduplicateAgendaItems = (items: AgendaItem[]) => {
  const seen = new Map<string, AgendaItem>();

  items.forEach((item) => {
    const key = `${item.reference}-${item.meetingId}`;
    const prev = seen.get(key);
    if (prev === undefined || item.agendaItemId >= prev.agendaItemId) {
      seen.set(key, item);
      if (prev !== undefined) {
        console.log(
          `ignoring ${prev.agendaItemId} in favor of ${item.agendaItemId}`,
        );
      }
    } else {
      console.log(
        `ignoring ${item.agendaItemId} in favor of ${prev.agendaItemId}`,
      );
    }
  });

  return [...seen.values()];
};

export const fetchAgendaItems = async (opts: AgendaItemFetchOptions) => {
  let pageNumber = 0;
  let totalPages = 1;
  const records: AgendaItem[] = [];

  while (pageNumber < totalPages) {
    const page = await fetchItemPage(pageNumber, opts);
    records.push(...page.Records);
    totalPages = page.TotalPages;
    pageNumber++;
    if (pageNumber < totalPages) {
      // wait a second before fetching again to avoid overloading the TMMIS API
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return deduplicateAgendaItems(records);
};
