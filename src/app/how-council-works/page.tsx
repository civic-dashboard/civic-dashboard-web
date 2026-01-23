import { Metadata } from 'next';
import { Tooltip, Provider as TooltipProvider } from '@/components/ui/tooltip';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from '@/components/ExternalLink';
import { tooltips } from '@/constants/tooltips';
import { Heading1, Heading2 } from '@/components/ui/text-items';
import { Page } from '@/components/ui/page';
import { Section } from '@/components/ui/section';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'How Toronto City Council Works – Civic Dashboard',
  };
};

const ProcessImage = ({ src, alt }: { src: string; alt?: string }) => (
  <div className="w-full mb-6 mx-auto max-w-[600px]">
    <Image
      src={src}
      alt={alt || ''}
      width={876}
      height={540}
      className="w-full h-full object-cover"
      priority
    />
  </div>
);

const WikiLink = () => (
  <span className="italic">
    For a more in-depth explanation, visit the{' '}
    <Link href="/wiki" className="classic-link">
      Civic Dashboard Wiki
    </Link>
    .
  </span>
);

export default function HowCouncilWorks() {
  const imageData = {
    toronto: {
      src: '/toronto.jpg',
    },
    staff: {
      src: '/staff.jpg',
    },
    committee: {
      src: '/committee.jpg',
    },
    council: {
      src: '/council.jpg',
    },
  };

  return (
    <TooltipProvider>
      <Page>
        <Section>
          <Heading1>What is Toronto City Council?</Heading1>
          <p>
            Toronto{' '}
            <Tooltip
              tooltipContent={tooltips.cityCouncil.content}
              tooltipTitle={tooltips.cityCouncil.trigger}
            >
              City Council
            </Tooltip>{' '}
            is the decision-making body for the City of Toronto. It's made up of
            elected officials who vote on policies, laws, and initiatives that
            impact the city. These decisions affect everything from local parks
            to public transit and housing. The process used to make these
            decisions follows three key steps.
          </p>
          <ProcessImage src={imageData.toronto.src} />
          <p>
            Toronto is divided into 25{' '}
            <Tooltip
              tooltipContent={tooltips.ward.content}
              tooltipTitle={tooltips.ward.trigger}
            >
              wards
            </Tooltip>
            , each represented by a City Councillor. City Council is made up of
            25 elected{' '}
            <Tooltip
              tooltipContent={tooltips.councillor.content}
              tooltipTitle={tooltips.councillor.trigger}
            >
              Councillors
            </Tooltip>
            , one per ward, and the Mayor, who is elected city-wide. Together,
            they shape policies and make decisions that impact the entire city.
          </p>
          <p>
            The Toronto Public Service (TPS) has 42K+ employees working across
            dozens of divisions and offices to implement city policies and
            services.
          </p>
        </Section>

        {/* Three-Step City Council Process */}
        <Section>
          <Heading2>The Three-Step City Council Process</Heading2>
          <p>
            Before we dive into the process, let's define what City Council
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
          </p>
          <p>
            Now, let's follow how an item moves through City Council and how you
            can engage with it along the way.
          </p>
        </Section>

        {/* Staff Stage */}
        <Section>
          <Heading2>First Step: Staff Stage</Heading2>
          <ProcessImage src={imageData.staff.src} />
          <p>
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
          </p>
          <p>
            <WikiLink />
          </p>
        </Section>

        {/* Committee Stage */}
        <Section>
          <Heading2>Second Step: Committee Stage</Heading2>
          <ProcessImage src={imageData.committee.src} />
          <p>
            Next, the item moves to a{' '}
            <Tooltip
              tooltipContent={tooltips.committees.content}
              tooltipTitle={tooltips.committees.trigger}
            >
              committee
            </Tooltip>
            , a smaller group of council members. Committees review the staff's
            recommendations, provide feedback, suggest changes, and ask critical
            questions to ensure the proposals are well thought out. While
            committees don't make final decisions, they refine the item and send
            it to the full Council for voting.
          </p>
          <p>
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
          </p>
          <p>
            <WikiLink />
          </p>
        </Section>

        {/* Council Stage */}
        <Section>
          <Heading2>Third Step: Council Stage</Heading2>
          <ProcessImage src={imageData.council.src} />
          <p>
            Finally, the item reaches the full City Council, which consists of
            all elected council members. At this stage, councillors review the
            item, debate its merits, and vote on whether to approve or reject
            it. Each councilor casts a vote—green for approval, red for
            rejection. If a majority votes in favor, the item becomes a new law,
            policy, or directive for the city.
          </p>
          <p>
            The Council Stage is the culmination of the process, where the item
            is finalized, and the decisions made here directly impact Toronto
            and its residents.
          </p>
          <p>
            <WikiLink />
          </p>
        </Section>

        {/* Get Involved */}
        <Section>
          <Heading2>How Can I Get Involved?</Heading2>
          <p>
            Getting involved with Toronto City Council is easier than you might
            think! There are several ways to share your opinions and influence
            decisions that matter to you.
          </p>
          <p>
            <span className="italic">
              Specific Actions - Can Be Done One Time or Many Times!
            </span>
          </p>
          <p>
            <span className="font-bold">Call or Email Your Councillor</span>
          </p>
          <p>
            You can call or email your local councillor to discuss issues you
            care about. Councillors can advocate on your behalf and provide
            insights into ongoing city decisions.
          </p>
          <p>
            <span className="font-bold">Attend a Consultation</span>
          </p>
          <p>
            City staff often hold consultations, surveys, or community meetings
            to gather feedback on new policies and projects. These are great
            opportunities to share your thoughts early in the process.
          </p>
          <p>
            <span className="font-bold">Submit a Deputation</span>
          </p>
          <p>
            At the committee stage, you can make a deputation, which is a formal
            presentation where you share your views directly with council
            members during a public meeting. Your public comments can influence
            the proposal under review before it reaches City Council, or be
            taken into consideration for future proposals.
          </p>
          <p>
            <span className="font-bold">Submit a Comment</span>
          </p>
          <p>
            At the committee stage, you can also make a comment on each agenda
            item that is being considered. Your comments can influence the
            members of the committee as they make their decisions.
          </p>
        </Section>

        {/* Stay Informed */}
        <Section>
          <Heading2>Stay Informed, Take Action</Heading2>
          <p>
            Now that you know how City Council works, why not take the next
            step? Stay informed and make your voice heard! Check out our{' '}
            <Link href="/actions" className="classic-link">
              Actions Page
            </Link>{' '}
            to see upcoming Council items and take action in just one click.
          </p>
          <p>
            Or visit our{' '}
            <Link href="/councillors" className="classic-link">
              Councillors Page
            </Link>{' '}
            to see how your Councillor has voted and whether they align with
            your priorities. Your engagement can help shape the decisions that
            impact Toronto—get involved today!
          </p>
        </Section>

        <Section>
          <p>
            <span className="italic">
              Illustrations by Luisa Castillo Henao. View more of her work on{' '}
              <ExternalLink
                href="https://www.behance.net/luisafchenao"
                className="classic-link"
              >
                Behance
              </ExternalLink>
              .
            </span>
          </p>
        </Section>
      </Page>
    </TooltipProvider>
  );
}
