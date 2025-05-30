import { Metadata } from 'next';
import Image from 'next/image';
import React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import Link from 'next/link';
import elasticSearch from '@/app/labs/elastic-search/screenshot.png';
import unifiedSearch from '@/app/labs/unified-search/screenshot.png';
import interactiveTags from '@/app/labs/interactive-tags/screenshot.png';
import { ExternalLink } from '@/components/ExternalLink';

export const metadata: Metadata = {
  title: 'Civic Dashboard Labs',
  description:
    "Experimental features and explorations for improving Toronto's democracy",
};

type LabCardProps = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
} & ({ internalHref: string } | { externalHref: string });
const LabCard = ({
  title,
  description,
  imageSrc,
  imageAlt,
  ...href
}: LabCardProps) => {
  const Content = (
    <Card>
      <CardHeader>
        <h2>{title}</h2>
      </CardHeader>
      <CardContent className="relative h-48">
        <Image src={imageSrc} alt={imageAlt} layout="fill" objectFit="cover" />
      </CardContent>
      <CardFooter>{description}</CardFooter>
    </Card>
  );

  if ('internalHref' in href) {
    return <Link href={href.internalHref}>{Content}</Link>;
  } else {
    return <ExternalLink href={href.externalHref}>{Content}</ExternalLink>;
  }
};

export default function About() {
  return (
    <main className="container mx-auto px-4 py-12 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1>🔬Civic Dashboard Labs</h1>
        <section className="mb-8">
          <p>
            Not everything we do is ready for production or ends up fitting into
            the project, but that doesn't mean there isn't value in sharing it!
            This page is a collection of cool stuff that for one reason or
            another isn't incorporated into the main website right now.
          </p>
        </section>

        <section className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
          <LabCard
            title="AI Summaries"
            internalHref="/labs/elastic-search"
            description="The first version of agenda item search incorporating AI summaries and fuzzy search."
            imageSrc={elasticSearch.src}
            imageAlt="Screenshot of a search page with a search for bikes and agenda item results with AI summaries."
          />
          <LabCard
            title="Unified Search"
            internalHref="/labs/unified-search"
            description="A UI prototype exploring combining all our information on the home page."
            imageSrc={unifiedSearch.src}
            imageAlt="Screenshot of a search page with 'Hot Topics' and 'Trending Items' sections"
          />
          <LabCard
            title="Interactive Tag Categorization"
            externalHref="https://colab.research.google.com/drive/1H3Ze6olQknIbyTVpxXQ2cUltPwWyVxRR?usp=sharing"
            description="A rough and tumble visualization exploring the different categories of Toronto agenda items. (Scroll down!)"
            imageSrc={interactiveTags.src}
            imageAlt="Screenshot of a colorful visualization of tag categories."
          />
        </section>
      </div>
    </main>
  );
}
