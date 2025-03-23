'use client';

import { Tooltip, Provider as TooltipProvider } from '@/components/ui/tooltip';

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-[24px] md:text-[32px] lg:text-[40px] font-bold text-center">
    {children}
  </h2>
);

const Section = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-[78px] max-w-2xl mx-auto">{children}</div>
);

const SectionText = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[14px] md:text-[16px] lg:text-[18px] leading-7 mt-8 max-w-2xl mx-auto">
    {children}
  </div>
);

const ImagePlaceholder = () => (
  <div className="w-full h-[540px] mt-14 mx-auto border border-neutral-400 flex items-center justify-center">
    <span className="text-neutral-500">Image Placeholder</span>
  </div>
);

const WikiLink = () => (
  <span className="italic">
    For a more in-depth explanation, visit the{' '}
    <a href="/coming-soon" className="classic-link">
      City Council Wiki
    </a>
    .
  </span>
);

export default function HowCouncilWorks() {
  const tooltips = {
    cityCouncil: {
      trigger: 'City Council',
      content:
        "City Council refers to the group of Councillors, who are elected to represent each of Toronto's wards, and the Mayor, who is elected city-wide. There are 25 Councillors and one Mayor, making 26 total City Council members.",
    },
    item: {
      trigger: 'Item',
      content:
        'An item is any topic or issue listed on a City Council or committee agenda for discussion or decision.',
    },
    reports: {
      trigger: 'Reports',
      content:
        'Reports are detailed documents prepared by city staff that provide background information, analysis, and recommendations on specific items.',
    },
    committees: {
      trigger: 'Committees',
      content:
        'Committees are smaller groups of council members who review and refine items before they go to the full Council for voting.',
    },
    deputations: {
      trigger: 'Deputations',
      content:
        'A deputation is a formal presentation where residents can share their views directly with council members during a public meeting.',
    },
  };

  return (
    <TooltipProvider>
      <main className="max-w-[876px] mx-auto px-4 md:px-0 pb-[120px]">
        <h1 className="text-[32px] md:text-[48px] lg:text-[56px] font-bold mt-[104px] text-center">
          What is Toronto City Council?
        </h1>

        <Section>
          <SectionText>
            Toronto{' '}
            <Tooltip
              tooltipContent={tooltips.cityCouncil.content}
              tooltipTitle={tooltips.cityCouncil.trigger}
            >
              City Council
            </Tooltip>{' '}
            is the decision-making body for the City of Toronto. It&apos;s made
            up of elected officials who vote on policies, laws, and initiatives
            that impact the city. These decisions affect everything from local
            parks to public transit and housing. The process used to make these
            decisions follows three key steps.
          </SectionText>
          <ImagePlaceholder />
        </Section>

        {/* Three-Step City Council Process */}
        <Section>
          <SectionHeading>The Three-Step City Council Process</SectionHeading>
          <SectionText>
            Before we dive into the process, let&apos;s define what City Council
            works on. An{' '}
            <Tooltip
              tooltipContent={tooltips.item.content}
              tooltipTitle={tooltips.item.trigger}
            >
              item
            </Tooltip>{' '}
            is any topic or issue listed on a City Council or committee agenda
            for discussion or decision. Each item represents the overarching
            issue being addressed and often includes{' '}
            <Tooltip
              tooltipContent={tooltips.reports.content}
              tooltipTitle={tooltips.reports.trigger}
            >
              reports
            </Tooltip>{' '}
            prepared by city staff to provide detailed background and
            recommendations.
            <br />
            <br />
            Now, let&apos;s follow how an item moves through City Council and
            how you can engage with it along the way.
          </SectionText>
        </Section>

        {/* Staff Stage */}
        <Section>
          <SectionHeading>First Step: Staff Stage</SectionHeading>
          <ImagePlaceholder />
          <SectionText>
            City staff, working at City Hall, take the first steps in acting on
            an item by researching and developing recommendations. They gather
            data, analyze what other cities are doing, and propose specific
            actions for Toronto. This stage is the most time-intensive, as staff
            prepare detailed reports that lay the groundwork for future
            decisions. Public input can shape these recommendations through
            consultations, surveys, or community{' '}
            <Tooltip
              tooltipContent={tooltips.committees.content}
              tooltipTitle={tooltips.committees.trigger}
            >
              committees
            </Tooltip>{' '}
            organized by city departments.
            <br />
            <br />
            <WikiLink />
          </SectionText>
        </Section>

        {/* Committee Stage */}
        <Section>
          <SectionHeading>Second Step: Committee Stage</SectionHeading>
          <ImagePlaceholder />
          <SectionText>
            Next, the item moves to a{' '}
            <Tooltip
              tooltipContent={tooltips.committees.content}
              tooltipTitle={tooltips.committees.trigger}
            >
              committee
            </Tooltip>
            , a smaller group of council members appointed by the mayor.
            Committees review the staff&apos;s recommendations, provide
            feedback, suggest changes, and ask critical questions to ensure the
            proposals are well thought out. While committees don&apos;t make
            final decisions, they refine the item and send it to the full
            Council for voting.
            <br />
            <br />
            This stage also provides an opportunity for public deputations,
            where citizens can speak directly to the committee about the item.{' '}
            <Tooltip
              tooltipContent={tooltips.deputations.content}
              tooltipTitle={tooltips.deputations.trigger}
            >
              Deputations
            </Tooltip>{' '}
            allow residents to share their opinions, highlight concerns, and
            advocate for their positions. Items typically move more quickly
            through this stage compared to the staff stage.
            <br />
            <br />
            <WikiLink />
          </SectionText>
        </Section>

        {/* Council Stage */}
        <Section>
          <SectionHeading>Third Step: Council Stage</SectionHeading>
          <ImagePlaceholder />
          <SectionText>
            Finally, the item reaches the full City Council, which consists of
            all elected council members. At this stage, councilors review the
            item, debate its merits, and vote on whether to approve or reject
            it. Each councilor casts a vote—green for approval, red for
            rejection. If a majority votes in favor, the item becomes a new law,
            policy, or directive for the city.
            <br />
            <br />
            The Council Stage is the culmination of the process, where the item
            is finalized, and the decisions made here directly impact Toronto
            and its residents.
            <br />
            <br />
            <WikiLink />
          </SectionText>
        </Section>

        {/* Get Involved */}
        <Section>
          <SectionHeading>How Can I Get Involved?</SectionHeading>
          <SectionText>
            Getting involved with Toronto City Council is easier than you might
            think! There are several ways to share your opinions and influence
            decisions that matter to you.
            <br />
            <br />
            <span className="italic">
              Specific Actions - Can Be Done One Time or Many Times!
            </span>
            <br />
            <br />
            <span className="font-bold">Call or Email Your Councillor</span>
            <br />
            You can call or email your local councillor to discuss issues you
            care about. Councillors can advocate on your behalf and provide
            insights into ongoing city decisions.
            <br />
            <br />
            <span className="font-bold">Attend a Consultation</span>
            <br />
            City staff often hold consultations, surveys, or community meetings
            to gather feedback on new policies and projects. These are great
            opportunities to share your thoughts early in the process.
            <br />
            <br />
            <span className="font-bold">Submit a Deputation</span>
            <br />
            At the committee stage, you can make a deputation, which is a formal
            presentation where you share your views directly with council
            members during a public meeting. Your public comments can influence
            the proposal under review before it reaches City Council, or be
            taken into consideration for future proposals.
            <br />
            <br />
            <span className="font-bold">Submit a Comment</span>
            <br />
            At the committee stage, you can also make a comment on each agenda
            item that is being considered. Your comments can influence the
            members of the committee as they make their decisions.
            <br />
            <br />
            <span className="italic">
              Want more ways to get involved, or how to raise an unaddressed
              issue? Visit the{' '}
              <a href="/coming-soon" className="classic-link">
                City Council Wiki
              </a>
              .
            </span>
          </SectionText>
        </Section>
      </main>
    </TooltipProvider>
  );
}
