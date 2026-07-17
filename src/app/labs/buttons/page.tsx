import { ArrowRightIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Page } from '@/components/ui/page';
import { Section } from '@/components/ui/section';
import { Text } from '@/components/ui/text-items';

export const metadata: Metadata = {
  title: 'Buttons Lab',
  description: 'Reference page showing every shared Button variant and size.',
};

type ButtonVariant = NonNullable<ButtonProps['variant']>;

const buttonVariants: Array<{
  name: ButtonVariant;
  usage: string;
}> = [
  { name: 'default', usage: 'Primary action.' },
  { name: 'outline', usage: 'Secondary action with a stronger boundary.' },
  { name: 'ghost', usage: 'Tertiary action with minimal visual weight.' },
];

function VariantCard({
  variant,
}: {
  variant: (typeof buttonVariants)[number];
}) {
  return (
    <Card>
      <CardHeader className="border-b border-gray-light flex-col md:grid md:grid-cols-4 gap-1">
        <Text preset="Heading3" className="mb-0 text-lg">
          {variant.name}
        </Text>
        <div>
          <Text preset="Small" className="font-bold">
            Prop value
          </Text>
          <Text preset="Body">{`variant="${variant.name}"`}</Text>
        </div>
        <div className="col-span-2">
          <Text preset="Small" className="font-bold">
            Usage
          </Text>
          <Text preset="Body">{variant.usage}</Text>
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-4">
        <Button variant={variant.name}>Button label</Button>
        <Button variant={variant.name} disabled>
          Disabled
        </Button>
      </CardContent>
    </Card>
  );
}

export default function ButtonsLabPage() {
  return (
    <Page>
      <Section>
        <Text preset="Heading1">Buttons</Text>
      </Section>

      <Section>
        <Text preset="Heading2">{`<Button>`}</Text>
        <div className="grid gap-6">
          {buttonVariants.map((variant) => (
            <VariantCard key={variant.name} variant={variant} />
          ))}
        </div>
      </Section>

      <Section>
        <Text preset="Heading2">Sizes</Text>
        <Card className="border border-gray-light">
          <CardHeader className="border-b border-gray-light bg-gray-lightest">
            <CardTitle className="mb-0">`size` examples</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-4">
            <Button>Default</Button>
            <Button size="lg">
              Large with icon
              <ArrowRightIcon />
            </Button>
            <Button size="icon" aria-label="Continue">
              <ArrowRightIcon />
            </Button>
          </CardContent>
        </Card>
      </Section>
    </Page>
  );
}
