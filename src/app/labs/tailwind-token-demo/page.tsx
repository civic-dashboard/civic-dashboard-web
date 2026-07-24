import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tailwind Token Demo',
  description: 'Temporary page to verify Tailwind v3 RGB token variables.',
};

type SwatchProps = {
  name: string;
  tokenClass: string;
  opacityClass?: string;
  textClass?: string;
};

function Swatch({
  name,
  tokenClass,
  opacityClass,
  textClass = 'text-white',
}: SwatchProps) {
  return (
    <div className="space-y-2 rounded-lg border border-gray-light bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-foreground">{name}</p>
      <div className={`h-12 rounded-md ${tokenClass}`} />
      {opacityClass ? (
        <div className="relative h-12 rounded-md border border-gray-lightest bg-white">
          <div className={`absolute inset-0 rounded-md ${opacityClass}`} />
          <p
            className={`relative z-10 flex h-full items-center justify-center text-xs font-semibold ${textClass}`}
          >
            Opacity Variant
          </p>
        </div>
      ) : null}
      <p className="text-xs text-foreground/70">
        Base: <code>{tokenClass}</code>
      </p>
      {opacityClass ? (
        <p className="text-xs text-foreground/70">
          Opacity: <code>{opacityClass}</code>
        </p>
      ) : null}
    </div>
  );
}

// TODO: Remove this temporary verification page after token QA is complete.
export default function TailwindTokenDemoPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <section className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-2">
          <h1 className="mb-0">Tailwind Token Demo</h1>
          <p className="text-foreground/80">
            This temporary page validates custom Tailwind v3 color tokens backed
            by RGB CSS variables.
          </p>
          <p className="text-sm text-foreground/70">
            Includes checks for classes like <code>bg-primary</code>,{' '}
            <code>text-primary-light</code>, <code>bg-black/50</code>, and{' '}
            <code>border-gray-dark</code>.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Swatch
            name="Primary"
            tokenClass="bg-primary"
            opacityClass="bg-primary/80"
          />
          <Swatch
            name="Primary Light"
            tokenClass="bg-primary-light"
            opacityClass="bg-primary-light/60"
            textClass="text-black"
          />
          <Swatch
            name="Primary Lightest"
            tokenClass="bg-primary-lightest"
            opacityClass="bg-primary-lightest/50"
            textClass="text-black"
          />
          <Swatch
            name="Success"
            tokenClass="bg-success"
            opacityClass="bg-success/70"
          />
          <Swatch
            name="Warning"
            tokenClass="bg-warning"
            opacityClass="bg-warning/75"
          />
          <Swatch
            name="Danger"
            tokenClass="bg-danger"
            opacityClass="bg-danger/80"
          />
          <Swatch
            name="Black (custom)"
            tokenClass="bg-black"
            opacityClass="bg-black/50"
          />
          <Swatch
            name="White (custom)"
            tokenClass="bg-white"
            opacityClass="bg-white/80"
            textClass="text-black"
          />
          <Swatch
            name="Gray Dark"
            tokenClass="bg-gray-dark"
            opacityClass="bg-gray-dark/80"
          />
          <Swatch
            name="Gray Light"
            tokenClass="bg-gray-light"
            opacityClass="bg-gray-light/80"
            textClass="text-black"
          />
          <Swatch
            name="Gray Lightest"
            tokenClass="bg-gray-lightest"
            opacityClass="bg-gray-lightest/80"
            textClass="text-black"
          />
        </section>

        <section className="rounded-lg border border-gray-dark p-4">
          <h2 className="mb-3 text-xl">Utility Spot Checks</h2>
          <ul className="list-disc space-y-1 pl-6 text-sm text-foreground/80">
            <li>
              <span className="inline-block rounded bg-primary px-2 py-1 text-primary-foreground">
                bg-primary + text-primary-foreground
              </span>
            </li>
            <li>
              <span className="inline-block rounded border border-gray-dark px-2 py-1 text-primary-light">
                text-primary-light + border-gray-dark
              </span>
            </li>
            <li>
              <span className="inline-block rounded bg-warning px-2 py-1 text-danger">
                bg-warning + text-danger
              </span>
            </li>
            <li>
              <span className="inline-block rounded bg-black/50 px-2 py-1 text-white">
                bg-black/50 + text-white
              </span>
            </li>
          </ul>
        </section>
      </section>
    </main>
  );
}
