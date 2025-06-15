'use client';

import { Clock, Flame, TrendingUp } from 'lucide-react';
import { useState } from 'react';

import { DecisionBody } from '@/api/decisionBody';
import {
  SearchPageAgendaItemCard,
  SearchPageCouncillorCard,
} from '@/app/labs/unified-search/AgendaItemCard';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Chip } from '@/components/ui/chip';
import { Separator } from '@/app/labs/unified-search/separator';
import { decisionBodies } from '@/constants/decisionBodies';
import { allTags } from '@/constants/tags';
import SearchBar from '@/app/labs/unified-search/SearchBar';
import sampleCouncillorPhoto from '@/app/labs/unified-search/sample_councillor_img.png';
import { PrototypeNotice } from '@/app/labs/PrototypeNotice';

// Define the Motion type
type Motion = {
  committeeSlug: string;
  motionType: string;
  motionId: string;
  voteDescription: string;
  dateTime: string;
  value: string;
  tally: string;
  resultKind: string;
  committeeName: string;
};

// Mock decision body for councillors
const mockCouncillorDecisionBody: DecisionBody = {
  decisionBodyId: 1,
  committeeCodeId: 1,
  termId: 1,
  decisionBodyName: 'City Council',
  email: 'council@toronto.ca',
  dbdyStatusCd: 'ACTIVE',
  webpostInd: 'Y',
  decisionBodyPublishLabelCd: 'CMMTTEE',
  committeeCode: {
    committeeCodeId: 1,
    committeeCode: 'CC',
  },
  decisionBodyType: {
    tier: 1,
  },
  term: {
    termId: 1,
    termType: '2022-2026',
    trmStartDate: new Date().getTime(),
    trmEndDate: new Date().getTime(),
  },
  members: [],
};

// Sample councillor data
const sampleCouncillors = [
  {
    id: 'lily-cheng',
    name: 'Lily Cheng',
    ward: 'Willowdale',
    wardNumber: 18,
    email: 'councillor_cheng@toronto.ca',
    phone: '416-392-0210',
    photoUrl: sampleCouncillorPhoto.src,
    keyIssues: ['Environment', 'Conservation', 'Trees'],
    profile:
      'Lily Cheng is the Councillor for Ward 18 Willowdale, taking office on November 15, 2022. A Willowdale resident for over a dozen years, Lily is a passionate, visionary leader in the community...',
    stats: {
      voted: 479,
      moved: 220,
      seconded: 113,
    },
  },
];

// Sample agenda items for trending and recent sections
const sampleAgendaItems = [
  {
    id: '1',
    termId: 1,
    agendaItemId: 1,
    councilAgendaItemId: 1,
    decisionBodyId: 1,
    meetingId: 1,
    itemProcessId: 1,
    decisionBodyName: 'City Council',
    meetingDate: new Date('2024-12-14').getTime(),
    reference: '2024.MM23.1',
    termYear: '2024',
    agendaCd: 'MM',
    meetingNumber: '23',
    itemStatus: 'Active',
    agendaItemTitle:
      'Application to Remove a Tree in a Protected Ravine, 124 Sandringham Dr.',
    agendaItemSummary:
      'Allow the tree at 124 Sandringham Drive to be cut down, it must replace it with six new trees, either by planting them nearby or giving money to help plant trees elsewhere.',
    agendaItemRecommendation:
      'Urban Forestry determined that the tree is healthy and maintainable. The North York Community Council denied an appeal to remove a healthy honey locust tree.',
    decisionRecommendations: null,
    decisionAdvice: null,
    subjectTerms: 'Environment, Conservation, Trees',
    wardId: null,
    backgroundAttachmentId: null,
    agendaItemAddress: [],
    address: null,
    geoLocation: null,
    planningApplicationNumber: null,
    neighbourhoodId: null,
  },
];

// Hardcoded sample data
const sampleMotions: Motion[] = [
  {
    committeeSlug: 'city-council',
    motionType: 'To adopt',
    motionId: 'motion-1',
    voteDescription: 'Adopt the report',
    dateTime: 'Nov-14-2024 9:37 PM',
    value: 'No',
    tally: '24-10',
    resultKind: 'Carried',
    committeeName: 'City Council',
  },
  {
    committeeSlug: 'city-council',
    motionType: 'Waive referral',
    motionId: 'motion-2',
    voteDescription: 'Waive referral',
    dateTime: 'Nov-14-2024 2:47 PM',
    value: 'No',
    tally: '24-10',
    resultKind: 'Carried',
    committeeName: 'City Council',
  },
];

function SearchResults() {
  // Using hardcoded data
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Show both agenda items and councillors */}
      {sampleAgendaItems.map((item) => (
        <SearchPageAgendaItemCard
          key={item.id}
          item={item}
          decisionBody={decisionBodies[item.decisionBodyId]}
          categories={item.subjectTerms.split(', ')}
          motions={sampleMotions}
        />
      ))}
      {sampleCouncillors.map((councillor) => (
        <SearchPageCouncillorCard
          key={councillor.id}
          councillor={councillor}
          _decisionBody={mockCouncillorDecisionBody}
        />
      ))}
    </div>
  );
}

export function SearchInterface() {
  const [_isTagsOpen, _setIsTagsOpen] = useState(false);

  return (
    // Commenting out SearchProvider since we're not using real search
    // <SearchProvider>
    <div className="container mx-auto px-4">
      {/* Search Bar */}
      <div>
        <SearchBar />
      </div>

      <Separator className="mb-5.5" />

      {/* Tags Accordion */}
      <div className="flex flex-col items-end space-y-4 pt-2 pb-8">
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="tags">
            <AccordionTrigger>Open Advanced Filter</AccordionTrigger>
            <AccordionContent>whoops, nothing here yet!</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="flex flex-col gap-4 p-4">
        <header className="flex items-center justify-between gap-5 mb-3">
          <h2 className="whitespace-nowrap mb-0">Hot Topics</h2>
          <Flame className="h-5 w-5" />
        </header>
      </div>
      <div className="flex flex-wrap justify-center px-24 gap-2">
        {Object.entries(allTags).map(([key, tag]) => (
          <Chip
            key={key}
            variant="secondary"
            className="bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          >
            {tag.displayName}
          </Chip>
        ))}
      </div>

      {/* Trending Items */}
      <div className="mt-8">
        {/* Trending Items Header */}
        <div className="flex flex-col gap-4 p-4">
          <header className="flex items-center justify-between gap-5 mb-3">
            <h2 className="whitespace-nowrap mb-0">Trending Items</h2>
            <TrendingUp className="h-5 w-5" />
          </header>
        </div>
        {/* Trending Items Cards */}
        {/* <div className="grid grid-cols-1 gap-6">
          {sampleAgendaItems.map((item) => (
            <SearchPageAgendaItemCard
              key={item.id}
              item={item}
              decisionBody={decisionBodies[item.decisionBodyId]}
              categories={item.subjectTerms.split(', ')}
              motions={sampleMotions}
            />
          ))}
        </div> */}
      </div>
      <div className="mt-8">
        <SearchResults />
      </div>

      {/* Recent Items */}
      <div className="mt-4">
        {/* Recent Items Header */}
        <div className="flex flex-col gap-4 p-4">
          <header className="flex items-center justify-between gap-5 mb-3">
            <h2 className="whitespace-nowrap mb-0">Recent Items</h2>
            <Clock className="h-5 w-5" />
          </header>
        </div>
        {/* Recent Items Cards */}
        <div className="grid grid-cols-1 gap-6">
          {/* {sampleAgendaItems.map((item) => (
            <SearchPageAgendaItemCard
              key={item.id}
              item={item}
              decisionBody={decisionBodies[item.decisionBodyId]}
              categories={item.subjectTerms.split(', ')}
              motions={sampleMotions}
            />
          ))} */}
        </div>
      </div>

      {/* Search Results */}
      <div className="mt-8">
        <SearchResults />
      </div>
    </div>
    // </SearchProvider>
  );
}
