import { cityCouncilGet } from '@/api/cityCouncilRequest';

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

export const fetchPublicConsultations = async () => {
  const response = await cityCouncilGet(url);
  return (await response.json()) as EventData[];
};
