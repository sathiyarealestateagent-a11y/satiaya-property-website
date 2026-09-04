import { DatabaseZap, ShieldAlert } from 'lucide-react';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

import { getSiteContent, isAdmin } from '@/db/content';
import { createClient } from '@/lib/supabase/server';

import AdminDashboard from './admin-dashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = await createClient();
  if (!supabase) {
    return (
      <AdminMessage
        icon={<DatabaseZap className="mx-auto size-10 text-[#b97738]" />}
        title="Dashboard connection required"
        description="Add the Supabase environment variables to finish connecting this dashboard."
      />
    );
  }

  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect('/admin/login');

  if (!(await isAdmin(supabase, data.user.id))) {
    return (
      <AdminMessage
        icon={<ShieldAlert className="mx-auto size-10 text-destructive" />}
        title="Owner access required"
        description="This account is signed in, but it is not on the website administrator list."
      />
    );
  }

  return (
    <AdminDashboard
      initialContent={await getSiteContent()}
      userEmail={data.user.email ?? 'Administrator'}
    />
  );
}

function AdminMessage({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f4f1e9] p-6">
      <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
        {icon}
        <h1 className="mt-4 font-heading text-2xl font-bold">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
    </main>
  );
}
