import type { Metadata } from 'next';

import { LegalPage } from '@/components/legal-page';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="5 September 2026"
      introduction="This policy explains how information submitted through this property website may be collected and used when you contact Satiaya Selvan about real estate services."
      sections={[
        {
          title: 'Information you provide',
          paragraphs: [
            'You may provide your name, email address, telephone number, property preferences and other enquiry details through forms, WhatsApp, email or telephone.',
          ],
        },
        {
          title: 'How information is used',
          paragraphs: [
            'Information is used to respond to enquiries, arrange property viewings or consultations, provide relevant property information and improve the service offered through this website.',
          ],
        },
        {
          title: 'Sharing and retention',
          paragraphs: [
            'Personal information is not sold. It may be shared with relevant property owners, agencies, professional advisers or service providers only when reasonably necessary to handle your enquiry or comply with Malaysian law.',
            'Information is retained only for as long as reasonably required for these purposes, legal obligations and legitimate business records.',
          ],
        },
        {
          title: 'Your choices',
          paragraphs: [
            'You may request access to, correction of or deletion of your personal information, subject to applicable Malaysian law and record-keeping requirements.',
          ],
        },
      ]}
    />
  );
}
