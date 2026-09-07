/* ============================================================
   Nomadic Lab — shared header & footer
   TypeScript + Tailwind CSS v4

   Setup:
     1. Add the @theme block from `nomadic-lab-theme.css` to your
        globals.css (it defines the nl-* colors and fonts).
     2. import { NomadicLabHeader, NomadicLabFooter } from "@/components/NomadicLabChrome";

   No "use client" needed — these are static Server Components.
   Dark mode uses Tailwind's default `dark:` variant, which follows
   prefers-color-scheme in v4 unless you've defined @custom-variant.
   ============================================================ */

/* Set once when the studio site is live. Override per-instance
   with the `studioUrl` prop if you ever need to. */
const STUDIO_URL = "https://nomadic-lab.vercel.app/";

type MarkProps = { size?: number };

/* The studio mark as vector — crisp at any size, theme-aware. */
function NomadicLabMark({ size = 30 }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 82 82"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className="block shrink-0"
    >
      <circle
        cx="40.5"
        cy="40.5"
        r="38"
        strokeWidth="2.6"
        className="stroke-nl-navy dark:stroke-nl-navy-dark"
      />
      <path
        d="M40.5 2.5V20.5M40.5 60.5V78.5M2.5 40.5H20.5M60.5 40.5H78.5"
        strokeWidth="3"
        className="stroke-nl-muted dark:stroke-nl-muted-dark"
      />
      <path
        d="M32.5 47V56.5Q32.5 60.8 36.8 60.8H44.2Q48.5 60.8 48.5 56.5V47"
        strokeWidth="2.4"
        fill="none"
        className="stroke-nl-muted dark:stroke-nl-muted-dark"
      />
      <path
        d="M34.5 33.2 39 38M46.5 33.2 42 38M40.7 43.5v3"
        strokeWidth="1.6"
        className="stroke-nl-coral dark:stroke-nl-coral-dark"
      />
      <rect
        x="37.6"
        y="37.4"
        width="6.2"
        height="6.2"
        rx="1"
        className="fill-nl-navy dark:fill-nl-navy-dark"
      />
      <g className="fill-nl-coral dark:fill-nl-coral-dark">
        <circle cx="34.2" cy="32.6" r="2.3" />
        <circle cx="46.8" cy="32.6" r="2.3" />
        <circle cx="40.7" cy="46.2" r="2.3" />
      </g>
    </svg>
  );
}

function Brand({ href }: { href: string }) {
  return (
    <a
      href={href}
      aria-label="Nomadic Lab — studio home"
      className="flex shrink-0 items-center gap-[11px] no-underline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-nl-coral"
    >
      <NomadicLabMark size={30} />
      <span className="flex flex-col leading-none">
        <span className="font-nl-display text-[17px] font-black tracking-[-0.035em] text-nl-ink dark:text-nl-ink-dark">
          Nomadic Lab
        </span>
        <span className="mt-1 font-nl-mono text-[8px] font-medium tracking-[0.3em] text-nl-muted dark:text-nl-muted-dark">
          AI PROJECTS
        </span>
      </span>
    </a>
  );
}

function ArrowOut() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className="shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
    >
      <path
        d="M6 3h7v7M13 3 4 12"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------------------------------------------------------- */

type HeaderProps = {
  /** Shown beside the brand. Pass "" to hide it if your page already has an h1. */
  productName?: string;
  /** Pin the header to the top of the viewport. */
  sticky?: boolean;
  studioUrl?: string;
};

export function NomadicLabHeader({
  productName = "AI Job Description Analyzer",
  sticky = false,
  studioUrl = STUDIO_URL,
}: HeaderProps) {
  return (
    <header
      className={[
        "w-full border-b border-nl-line bg-nl-ground font-nl-body",
        "dark:border-nl-line-dark dark:bg-nl-ground-dark",
        sticky ? "sticky top-0 z-50" : "",
      ].join(" ")}
    >
      <div className="mx-auto flex min-h-[68px] w-full max-w-[1140px] flex-wrap items-center gap-x-3.5 gap-y-2 px-5 py-3 sm:px-8 lg:px-12">
        <Brand href={studioUrl} />

        {productName ? (
          <>
            <span
              aria-hidden="true"
              className="hidden h-[26px] w-px shrink-0 bg-nl-line-strong sm:block dark:bg-nl-line-strong-dark"
            />
            <span className="hidden font-nl-mono text-[11.5px] font-medium uppercase leading-snug tracking-[0.14em] text-nl-muted sm:block dark:text-nl-muted-dark">
              {productName}
            </span>
          </>
        ) : null}

        <nav className="ml-auto flex items-center gap-6" aria-label="Nomadic Lab">
          <a
            href={`${studioUrl}/#products`}
            className="hidden text-[14.5px] font-medium text-nl-body no-underline transition-colors hover:text-nl-ink focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-nl-coral min-[460px]:block dark:text-nl-body-dark dark:hover:text-nl-ink-dark"
          >
            More products
          </a>

          <a
            href={`${studioUrl}/#contact`}
            className="group inline-flex items-center gap-[7px] border-b-[1.5px] border-nl-line-strong pb-[3px] font-nl-display text-[14.5px] font-bold text-nl-body no-underline transition-colors hover:border-nl-coral hover:text-nl-accent focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-nl-coral dark:border-nl-line-strong-dark dark:text-nl-body-dark dark:hover:border-nl-coral-dark dark:hover:text-nl-accent-dark"
          >
            Work with us
            <ArrowOut />
          </a>
        </nav>
      </div>
    </header>
  );
}

/* ---------------------------------------------------------- */

type FooterProps = {
  /** Replace or clear the technical/privacy line. */
  metaLine?: string;
  studioUrl?: string;
};

export function NomadicLabFooter({
  metaLine = "Built with Next.js and the Anthropic API. Nothing you paste is stored.",
  studioUrl = STUDIO_URL,
}: FooterProps) {
    const year = 2025;

  const links = [
    ["Products", "#products"],
    ["Services", "#services"],
    ["About", "#about"],
    ["Contact", "#contact"],
  ] as const;

  return (
    <footer className="mt-16 w-full border-t border-nl-line bg-nl-ground pb-8 pt-12 font-nl-body dark:border-nl-line-dark dark:bg-nl-ground-dark">
      <div className="mx-auto grid w-full max-w-[1140px] gap-8 px-5 sm:px-8 md:grid-cols-[1.4fr_1fr] md:items-start lg:px-12">
        <div className="grid justify-items-start gap-3.5">
          <Brand href={studioUrl} />

          <p className="mt-0.5 max-w-[44ch] text-[14.5px] leading-relaxed text-nl-body dark:text-nl-body-dark">
            A product of Nomadic Lab, an independent studio building practical AI-powered products.
          </p>

          {metaLine ? (
            <p className="max-w-[46ch] font-nl-mono text-[12px] leading-relaxed text-nl-muted dark:text-nl-muted-dark">
              {metaLine}
            </p>
          ) : null}
        </div>

        <nav
          className="flex flex-wrap gap-x-6 gap-y-2.5 md:justify-end"
          aria-label="Nomadic Lab links"
        >
          {links.map(([label, hash]) => (
            <a
              key={hash}
              href={`${studioUrl}/${hash}`}
              className="text-[14.5px] text-nl-body no-underline transition-colors hover:text-nl-accent focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-nl-coral dark:text-nl-body-dark dark:hover:text-nl-accent-dark"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>

      <div className="mx-auto mt-9 flex w-full max-w-[1140px] flex-wrap justify-between gap-x-6 gap-y-2 border-t border-nl-line px-5 pt-5 font-nl-mono text-[11px] uppercase tracking-[0.1em] text-nl-muted sm:px-8 lg:px-12 dark:border-nl-line-dark dark:text-nl-muted-dark">
        <span>© {year} Nomadic Lab</span>
        <span>Building. Exploring. Experimenting.</span>
      </div>
    </footer>
  );
}
