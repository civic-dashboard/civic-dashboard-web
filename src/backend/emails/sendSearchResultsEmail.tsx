'use server';

import { sendEmail } from '@/backend/emails/sendEmail';
import { AgendaItem } from '@/database/queries/agendaItems';
import { SearchOptions } from '@/logic/search';
import {
  Body,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { Fragment } from 'react';

type Args = {
  to: string | string[];
  props: Props;
};
export async function sendSearchResultsEmail({ to, props }: Args) {
  return await sendEmail({
    from: 'Civic Dashboard <alerts@civicdashboard.ca>',
    subject: 'Your Search Results from Civic Dashboard',
    to,
    react: <Email {...props} />,
  });
}

type Props = {
  items: AgendaItem[];
  searchOptions: SearchOptions;
};
function Email({ items, searchOptions }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Matches for your search on Civic Dashboard.</Preview>
      <Body style={main}>
        <Heading>Your Search Results from Civic Dashboard</Heading>
        <Section>
          {searchOptions.query && (
            <SearchOption label="Query" content={searchOptions.query} />
          )}
          {searchOptions.tags.length > 0 && (
            <SearchOption
              label="Tags"
              content={searchOptions.tags.join(', ')}
            />
          )}
          {searchOptions.decisionBodyId && (
            <SearchOption
              label="Decision Body"
              content={searchOptions.decisionBodyId}
            />
          )}
        </Section>
        {items.map((item, index) => (
          <Fragment key={item.agendaItemId}>
            {index !== 0 && <Hr style={{ borderTopColor: 'black' }} />}
            <ItemEmail item={item} />
          </Fragment>
        ))}
      </Body>
    </Html>
  );
}

type SearchOptionProps = {
  label: string;
  content: string;
};
function SearchOption({ label, content }: SearchOptionProps) {
  return (
    <Text style={{ fontSize: 16, margin: 0 }}>
      <strong>{label}: </strong> {content}
    </Text>
  );
}

function ItemEmail({ item }: { item: AgendaItem }) {
  return (
    <Section style={{ padding: '16px' }}>
      <Heading as="h2">{item.agendaItemTitle}</Heading>
      <Text
        style={{ fontSize: '16px' }}
        dangerouslySetInnerHTML={{ __html: item.agendaItemSummary }}
      ></Text>
    </Section>
  );
}

const main = {
  fontFamily: 'Arial, Helvetica, sans-serif',
  margin: '12px',
};

Email.PreviewProps = {
  searchOptions: {
    query: 'etobicoke',
    tags: ['bikes'],
  },
  items: [
    {
      id: 'ID_137196',
      termId: 8,
      agendaItemId: 137196,
      councilAgendaItemId: 137196,
      decisionBodyId: 2469,
      meetingId: 24598,
      itemProcessId: 3,
      decisionBodyName: 'Bid Award Panel',
      meetingDate: 1729656000000,
      reference: '2024.BA103.1',
      termYear: '2024',
      agendaCd: 'BA',
      meetingNumber: '103',
      itemStatus: 'NO_ACTN',
      agendaItemTitle:
        'Award of Toronto Transit Commission Request for Bid Number P73SQ24127 to Roy Foss Chevrolet Limited for the Supply and Delivery of Four (4) BrightDrop Battery Electric Cargo Vans for Fleet Services',
      agendaItemSummary:
        '<p>Solicitation Issued:&nbsp; March 4, 2024&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Solicitation Closed:&nbsp; April 26, 2024</p>\r\n<p>Number of Addenda Issued: One (1)</p>\r\n<p>Number of Bids: One (1)</p>',
      agendaItemRecommendation:
        '<p>The Chief Procurement Officer recommends that the Bid Award Panel grant authority to award the following contract as per the Toronto Municipal Code, Chapter 195-6.6, Procurement of same goods and services as a public body.</p>\r\n<p>&nbsp;</p>\r\n<p>Solicitation Number:</p>\r\n<p>Toronto Transit Commission Request for Bid Number P73SQ24127, WS4798497686</p>\r\n<p>&nbsp;</p>\r\n<p>Description:</p>\r\n<p>The Toronto Transit Commission issued the Request for Bid Number P73SQ24127 for Supply of BrightDrop Battery Electric Cargo Vans. The Toronto Transit Commission received only one (1) bid from the Request for Bid, from which Roy Foss Chevrolet Ltd. was awarded a contract. The effective date of the awarded Toronto Transit Commission purchase order #PU645336 to Roy Foss Chevrolet Ltd. is from May 08, 2024, and will expire on May 07, 2025, with option to renew for one (1) additional one (1)-year term under the same terms and conditions through May 07, 2026.</p>\r\n<p>&nbsp;</p>\r\n<p>After reviewing this Toronto Transit Commission Request for Bid Number P73SQ24127, Fleet Services in conjunction with Toronto Paramedic Services will piggyback on this Toronto Transit Commission Contract with Roy Foss Chevrolet Ltd., and issue a purchase order to Roy Foss Chevrolet Ltd., located at 2 Auto Park Cir, Woodbridge, ON L4L 8R1, for non-exclusive supply and delivery of four (4) BrightDrop Battery Electric Cargo Vans in 2024-25.</p>\r\n<p>&nbsp;</p>\r\n<p>Fleet Services may also purchase an additional two (2) BrightDrop Battery Electric Cargo Vans pending budget availability in 2025-26.</p>\r\n<p>&nbsp;</p>\r\n<p>Recommended Supplier:</p>\r\n<p>Roy Foss Chevrolet Ltd.</p>\r\n<p>&nbsp;</p>\r\n<p>Contract Award Value:</p>\r\n<p>$448,440 net of all applicable taxes and charges</p>\r\n<p>$506,738 including HST and all applicable charges.</p>\r\n<p>$456,333 net of HST recoveries</p>\r\n<p>&nbsp;</p>\r\n<p>Contract is expected to start on date of award and end on May 07, 2025.</p>\r\n<p>&nbsp;</p>\r\n<p>Optional Period (2 Units) (May 08, 2025, to May 07, 2026):</p>\r\n<p>$230,947 net of all applicable taxes and charges</p>\r\n<p>$260,971 including HST and all applicable charges.</p>\r\n<p>$235,012 net of HST recoveries</p>\r\n<p>&nbsp;</p>\r\n<p>Total Potential Contract value Including Option Years:</p>\r\n<p>$679,387net of all applicable taxes and charges</p>\r\n<p>$767,709 including HST and all applicable charges.</p>\r\n<p>$691,345 net of HST recoveries</p>\r\n<p>&nbsp;</p>\r\n<p>The above cost calculations reflect a three (3) percent Consumer Price Index adjustment applied annually to each year&rsquo;s cost after the initial one (1) year period.</p>',
      subjectTerms:
        'energy efficiency, quotations, vans (fleet); alternative energy; electricity usage; energy use; sustainable energy, bids; quotes; request for quotation; rfq',
      wardId: [
        45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62,
        63, 64, 65, 66, 67, 68, 69,
      ],
      backgroundAttachmentId: [249631],
      agendaItemAddress: [],
    },
    {
      id: 'ID_137112',
      termId: 8,
      agendaItemId: 137112,
      councilAgendaItemId: 137112,
      decisionBodyId: 2563,
      meetingId: 24444,
      itemProcessId: 3,
      decisionBodyName: 'Economic and Community Development Committee ',
      meetingDate: 1729656000000,
      reference: '2024.EC16.1',
      termYear: '2024',
      agendaCd: 'EC',
      meetingNumber: '16',
      itemStatus: 'NO_ACTN',
      agendaItemTitle:
        'Culture Connects: An Action Plan for Culture in Toronto (2025-2035)',
      agendaItemSummary:
        '<p><em>Culture Connects: An Action Plan for Culture in Toronto (2025-2035)</em> sets an ambitious 10-year vision for Toronto as a city for culture and creativity, where everyone, everywhere, can discover, experience, and create culture. This vision positions Toronto as an undeniable global cultural capital, celebrated for its exciting and expansive cultural and creative industry offerings as well as its accomplished talent. Culture is engrained in this city, making Toronto a better place to live, work, and visit. It drives economic growth, strengthens community bonds, and promotes social well-being, helping to create thriving, healthy communities.</p>\r\n<p>&nbsp;</p>\r\n<p>It has been over a decade since the City&rsquo;s last culture plan, Creative Capital Gains, was introduced in 2011. Since then, there have been significant economic, cultural, and societal shifts &ndash; and a devastating global pandemic. Emerging from the COVID-19 pandemic, Toronto&rsquo;s culture sector is at an inflection point and faces great instability. Challenges include access to space, affordability, equity, changing audience habits, and sponsor supports. As emphasized in public consultations, the Action Plan also has a significant focus on ensuring culture becomes more available to people across the city, wherever they live, close to their homes, and embedded in their communities. A new Action Plan is needed to address the current obstacles and seize the opportunities of the next 10 years. Inaction would threaten Toronto&rsquo;s vibrancy, liveability, and prosperity. Now is the moment to invest in culture, chart a forward path, and reinforce and reimagine culture in Toronto.</p>\r\n<p>&nbsp;</p>\r\n<p><em>Culture Connects: An Action Plan for Culture in Toronto (2025-2035)</em>, included as Attachment 1, has been shaped and guided by community input. The Action Plan includes 28 actions grouped into four priority areas: 1) Culture Everywhere; 2) Culture for All; 3) Culture for the Future; and 4) Culture Beyond our Borders. These priorities are based on input shared by more than 4,000 residents throughout the Action Plan&rsquo;s community engagement process, comprehensive research conducted by the University of Toronto, and best practices from leading cities from around the world.</p>\r\n<p>&nbsp;</p>\r\n<p>This report outlines the need for an action plan, detailing the engagement process and key results as well as the Action Plan&rsquo;s vision, priorities, and core components. This includes the Year One focus, the framework for ongoing engagement, and accountability measures, such as regular progress reporting.</p>\r\n<p>&nbsp;</p>\r\n<p>The Action Plan includes both urgent actions to immediately address critical challenges, and long-term actions to drive systemic change. The urgent need to invest and connect will be the focus of Year One of the Action Plan, including increased support for the Toronto Arts Council; funds to support stabilization and transformation for cultural organizations; and hosting the inaugural Mayor&rsquo;s Culture Summit. Throughout its implementation, the Action Plan will focus on impacts and outcomes, continued engagement, transparency, and accountability. With Culture Connects, the City presents a bold strategy to transform current realities and seize opportunities to create a vibrant and prosperous future for culture in Toronto.</p>',
      agendaItemRecommendation:
        '<p>The General Manager, Economic Development and Culture, recommends that:</p>\r\n<p>&nbsp;</p>\r\n<p>1. City Council adopt and direct the General Manager, Economic Development and Culture, to implement the actions in Culture Connects: An Action Plan for Culture in Toronto (2025-2035), as outlined in Attachment 1 to this report.</p>\r\n<p>&nbsp;</p>\r\n<p>2. City Council direct the General Manager, Economic Development and Culture, and other relevant City divisions to include the staffing and resources required for implementing Culture Connects: An Action Plan for Culture in Toronto (2025-2035) for consideration through the 2025 Budget process and subsequent years budget processes.</p>\r\n<p>&nbsp;</p>\r\n<p>3. City Council authorize the General Manager, Economic Development and Culture, to negotiate, enter into, and amend any agreements necessary to support the implementation of Culture Connects: An Action Plan for Culture in Toronto (2025-2035) and these recommendations, within the resources included in the operating or capital budget, on terms satisfactory to them, and in forms and terms satisfactory to the City Solicitor.</p>\r\n<p>&nbsp;</p>\r\n<p>4. City Council direct the General Manager, Economic Development and Culture, to develop an online dashboard to report on the impacts of Culture Connects: An Action Plan for Culture in Toronto (2025-2035).</p>\r\n<p>&nbsp;</p>\r\n<p>5. City Council direct the General Manager, Economic Development and Culture, in collaboration and consultation with other relevant City divisions, agencies and corporations to report to the Economic and Community Development Committee in 2027 on implementation progress and outcomes of the actions in Culture Connects: An Action Plan for Culture in Toronto (2025-2035).</p>\r\n<p>&nbsp;</p>\r\n<p>6. City Council forward Culture Connects: An Action Plan for Culture in Toronto (2025-2035), outlined as Attachment 1, to the following provincial ministries for their consideration: Ministry of Tourism, Culture and Gaming and Ministry of Sport; and Ministry of Economic Development, Job Creation, and Trade; and request these ministries work with the City to address the urgent need&nbsp;for actions to address funding, stability, and affordability for the cultural sector and collaborate with City staff to advance the Action Plan.</p>\r\n<p>&nbsp;</p>\r\n<p>7. City Council forward Culture Connects: An Action Plan for Culture in Toronto (2035-2035), outlined as Attachment 1, to the following federal departments for their consideration: Canadian Heritage; Federal Economic Development Agency for Southern Ontario; Innovation, Science, and Economic Development Canada; and request these departments work with the City to address the urgent need&nbsp;for actions to address funding, stability, and affordability for the cultural sector and collaborate with City staff to advance the Action Plan.</p>',
      subjectTerms: '[activities in culture], culture (sc); ',
      wardId: [
        45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62,
        63, 64, 65, 66, 67, 68, 69,
      ],
      backgroundAttachmentId: [249453, 249440, 249441, 249442, 249443, 249455],
      agendaItemAddress: [],
    },
  ],
};
