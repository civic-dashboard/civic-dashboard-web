interface Image {
  fileName: string;
  binId: string;
  fileSize: number;
  fileType: string;
  url: string;
  altText?: string; // Optional, only for the image object in `calEvent`
}

interface Location {
  locationName: string;
  address: string;
  displayAddress?: string;
  locationType: Array<{ type: string }>;
  geoCoded: boolean;
  id: string;
  coords: {
    lng: number;
    lat: number;
  };
}

interface Admin {
  newsletterCategory: string[];
  updatedBy: string;
  subsetCalendar: Array<{ value: string }>;
  approvedTimestamp: string;
  includeInNewsletter: boolean;
  featuredEvent: string;
  approvedBy: string;
  newsletterSubcategory: string[];
  updateTimestamp: string;
}

interface DateInfo {
  startDateTime: string;
  endDateTime: string;
}

interface CalendarEvent {
  categoryString: string;
  accessibility: string;
  isCityEvent: boolean;
  endDate: string;
  admin: Admin;
  description: string;
  orgAddress: string;
  frequency: string;
  orgType: string;
  thumbImage: Image;
  terms: string;
  eventEmail: string;
  eventName: string;
  theme: string[];
  themeString: string;
  subsetCalendarString: string;
  image: Image;
  orgName: string;
  contactName: string;
  dates: DateInfo[];
  endDateTime: string;
  isWidgetEvent: boolean;
  orgPhone: string;
  freeEvent: string;
  startDateTime: string;
  timeInfo?: string;
  reservationsRequired: string;
  orgEmail: string;
  locations: Location[];
  partnerType: string;
  category: Array<{ name: string }>;
  eventWebsite: string;
  recId: string;
  startDate: string;
}

export interface EventData {
  calEvent: CalendarEvent;
}

const url =
  "https://secure.toronto.ca/cc_sr_v1/data/edc_eventcal_APR?limit=1000&q=calEvent_subsetCalendarString~'21*'%20and%20calEvent_subsetCalendarString~'Public*'%20and%20calEvent_subsetCalendarString~'Consultations*'";

const options = {
  method: 'GET',
  headers: {
    Accept: '*/*',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'en-US,en;q=0.5',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    Origin: 'https://www.toronto.ca',
    Pragma: 'no-cache',
    Referer: 'https://www.toronto.ca/',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
    'User-Agent':
      'Mozilla/5.0 (X11; Linux x86_64; rv:129.0) Gecko/20100101 Firefox/129.0',
    Cookie:
      'WEBTRENDS_ID=fbff293a.620c918e0c634; TS01174203=01716c468156dcb4031c2fb42b114d95da0d722250635c94a66deb718b20e187f0215b2f4938c3d1e48cdf59e63c7595e5961777cc5450ea6f37646d8f5da679fc74a167ef',
  },
};

export const fetchEvents = () =>
  fetch(url, options).then((response) => {
    return response.json() as Promise<EventData[]>;
  });
