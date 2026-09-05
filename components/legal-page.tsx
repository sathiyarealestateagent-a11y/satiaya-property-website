import Link from 'next/link';

import { siteConfig } from '@/src/config/site';

type LegalSection = {
  title: string;
  paragraphs: readonly string[];
};

export function LegalPage({
  title,
  updated,
  introduction,
  sections,
}: {
  title: string;
  updated: string;
  introduction: string;
  sections: readonly LegalSection[];
}) {
  return (
    <main className="min-h-screen bg-[#f3f1e9] px-5 py-12 text-[#263d34] sm:py-20">
      <article className="mx-auto max-w-3xl rounded-[2rem] bg-white p-7 shadow-[0_24px_70px_rgba(25,56,45,.09)] ring-1 ring-black/5 sm:p-12">
        <Link href="/" className="text-sm font-bold text-[#b97738] hover:text-[#19382d]">
          ← Return to website
        </Link>
        <p className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-[#b97738]">
          {siteConfig.agent.name} · {siteConfig.agent.agency}
        </p>
        <h1 className="mt-3 font-heading text-4xl font-bold text-[#19382d] sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-[#6c7d75]">Last updated: {updated}</p>
        <p className="mt-8 text-base leading-8 text-[#496158]">{introduction}</p>

        <div className="mt-10 grid gap-9">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-heading text-2xl font-bold text-[#19382d]">
                {section.title}
              </h2>
              <div className="mt-3 grid gap-3 text-sm leading-7 text-[#53675f] sm:text-base">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-12 border-t border-black/10 pt-7 text-sm leading-6 text-[#6c7d75]">
          Questions may be sent to{' '}
          <a className="font-bold text-[#19382d]" href={`mailto:${siteConfig.contact.email}`}>
            {siteConfig.contact.email}
          </a>
          .
        </p>
      </article>
    </main>
  );
}
