import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Choose new password',
};

export default function UpdatePasswordLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
