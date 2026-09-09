import type { Metadata } from 'next';

import { LegalPage } from '@/components/legal-page';

export const metadata: Metadata = {
  title: 'Terms of Use',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      updated="5 September 2026"
      introduction="By using this website, you agree to these terms. The website provides general Malaysian real estate information and a way to contact Satiaya Selvan."
      sections={[
        {
          title: 'Property information',
          paragraphs: [
            'Listings, prices, availability, measurements and descriptions may change and should be independently verified before you make a decision. Website content is not legal, financial or valuation advice.',
          ],
        },
        {
          title: 'Enquiries and transactions',
          paragraphs: [
            'Submitting an enquiry does not create an agency agreement, reservation or binding property transaction. Any transaction remains subject to verification, negotiation and signed documentation.',
          ],
        },
        {
          title: 'Acceptable use',
          paragraphs: [
            'You must not misuse the website, attempt unauthorised access, interfere with its operation or submit unlawful, misleading or harmful content.',
          ],
        },
        {
          title: 'Liability and changes',
          paragraphs: [
            'Reasonable care is taken with website information, but uninterrupted availability or complete accuracy cannot be guaranteed. These terms and website content may be updated when needed.',
          ],
        },
      ]}
    />
  );
}
