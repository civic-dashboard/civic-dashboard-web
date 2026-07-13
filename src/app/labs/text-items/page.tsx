import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Page } from '@/components/ui/page';
import { Section } from '@/components/ui/section';
import {
  BulletedList,
  TEXT_PRESETS,
  Text,
  textPresetTags,
  type TextPreset,
} from '@/components/ui/text-items';

export const metadata: Metadata = {
  title: 'Text Items Lab',
  description:
    'Reference page showing every shared Text and BulletedList variant.',
};

const presetCopy: Record<TextPreset, { sample: string; usage: string }> = {
  Heading1: {
    sample: 'Democracy should feel legible before it feels impressive.',
    usage: 'Primary page or hero heading.',
  },
  Heading2: {
    sample:
      'Use section headings to break dense civic content into readable blocks.',
    usage: 'Major section title.',
  },
  Heading3: {
    sample: 'Smaller callouts work well for supporting subsections.',
    usage: 'Subsection heading inside a larger narrative.',
  },
  Body: {
    sample:
      'Body text is the default reading style for explanatory copy, descriptions, and most page content where clarity matters more than emphasis.',
    usage: 'Default long-form paragraph style.',
  },
  Small: {
    sample:
      'Small is useful for captions, helper copy, and metadata that should stay present without overpowering the primary reading path.',
    usage: 'Secondary metadata, hints, or captions.',
  },
};

function VariantCard({ preset }: { preset: TextPreset }) {
  const copy = presetCopy[preset];

  return (
    <Card>
      <CardHeader className="border-b border-gray-light bg-gray-lightest flex-col md:grid md:grid-cols-4 gap-1">
        <Text preset="Heading3" className="mb-0 text-lg">
          {preset}
        </Text>
        <div>
          <Text preset="Small" className="font-bold">
            Default tag
          </Text>
          <Text preset="Body">{`${textPresetTags[preset]}`}</Text>
        </div>
        <div className="col-span-2">
          <Text preset="Small" className="font-bold">
            Usage
          </Text>
          <Text preset="Body">{copy.usage}</Text>
        </div>
      </CardHeader>
      <CardContent>
        <Text preset={preset}>{copy.sample}</Text>
      </CardContent>
    </Card>
  );
}

export default function TextItemsLabPage() {
  return (
    <Page>
      <Section>
        <Text preset="Heading1">Text Items</Text>
      </Section>

      <Section>
        <Text preset="Heading2">{`<Text>`}</Text>
        <div className="grid gap-6">
          {TEXT_PRESETS.map((preset) => (
            <VariantCard key={preset} preset={preset} />
          ))}
        </div>

        <Card className="border border-gray-light">
          <CardHeader className="border-b border-gray-light bg-gray-lightest">
            <CardTitle className="mb-0">`tag` examples</CardTitle>
          </CardHeader>
          <CardContent>
            <Text preset="Heading3" tag="p">
              The `tag` prop allows changing the semantic HTML tag to decouple
              style from structure for better accessibility.
            </Text>
          </CardContent>
        </Card>
      </Section>

      <Section>
        <Text preset="Heading2">{`<BulletedList>`}</Text>
        <Card className="border border-gray-light">
          <CardHeader className="border-b border-gray-light bg-gray-lightest">
            <CardTitle className="mb-0">BulletedList</CardTitle>
          </CardHeader>
          <CardContent>
            <BulletedList className="mb-0">
              <li>List item 1</li>
              <li>
                Second list item with a longer description to show how the list
                handles wrapping text and spacing between items.
              </li>
              <li>Third list item</li>
            </BulletedList>
          </CardContent>
        </Card>
      </Section>
    </Page>
  );
}
