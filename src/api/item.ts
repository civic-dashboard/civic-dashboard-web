import nodeFetch from 'node-fetch';

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
  // for some reason next's fetch does not receive the XSRF token
  const csrfResponse = await nodeFetch(
    'https://secure.toronto.ca/council/api/csrf.json'
  );

  const cookies = csrfResponse.headers.get('set-cookie');
  const xsrfToken = csrfResponse.headers
    .raw()
    ['set-cookie'].find((value) => value.startsWith('XSRF-TOKEN'))
    ?.match(/XSRF-TOKEN=([^;]+)/)
    ?.at(1);

  if (!cookies || !xsrfToken) {
    throw new Error(
      `Could not get XSRF token from council API: ${csrfResponse.headers.raw()}`
    );
  }

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

  const response = await fetch(
    'https://secure.toronto.ca/council/api/multiple/agenda-items.json?pageNumber=0&pageSize=200&sortOrder=meetingDate%20asc,referenceSort',
    {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Content-Type': 'application/json',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        Pragma: 'no-cache',
        'Cache-Control': 'no-cache',
        'X-XSRF-TOKEN': xsrfToken,
        Cookie: cookies,
      },
      body,
      method: 'POST',
      mode: 'cors',
    }
  );
  return ((await response.json()) as ApiResponse).Records;
};
