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
    <main className="min-h-screen bg-[#F7F8FA] px-5 py-12 text-[#1F2937] sm:py-20">
      <article className="mx-auto max-w-3xl rounded-[2rem] bg-white p-7 shadow-[0_24px_70px_rgba(20,61,141,.09)] ring-1 ring-black/5 sm:p-12">
        <Link
          href="/"
          className="text-sm font-bold text-[#2B5FB8] hover:text-[#143D8D]"
        >
          ← Return to website
        </Link>
        <p className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-[#2B5FB8]">
          {siteConfig.agent.name} · {siteConfig.agent.agency}
        </p>
        <h1 className="mt-3 font-heading text-4xl font-bold text-[#143D8D] sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-[#5B6574]">Last updated: {updated}</p>
        <p className="mt-8 text-base leading-8 text-[#5B6574]">
          {introduction}
        </p>

        <div className="mt-10 grid gap-9">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-heading text-2xl font-bold text-[#143D8D]">
                {section.title}
              </h2>
              <div className="mt-3 grid gap-3 text-sm leading-7 text-[#5B6574] sm:text-base">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-12 border-t border-black/10 pt-7 text-sm leading-6 text-[#5B6574]">
          Questions may be sent to{' '}
          <a
            className="font-bold text-[#143D8D]"
            href={`mailto:${siteConfig.contact.email}`}
          >
            {siteConfig.contact.email}
          </a>
          .
        </p>
      </article>
    </main>
  );
}
