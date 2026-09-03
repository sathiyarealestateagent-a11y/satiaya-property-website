import { ShieldAlert } from 'lucide-react';

import { requireChatGPTUser } from '@/app/chatgpt-auth';
import { ensureAdmin, getSiteContent } from '@/db/content';

import AdminDashboard from './admin-dashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await requireChatGPTUser('/admin');
  let authorized = false;
  try {
    authorized = await ensureAdmin(user.userId, user.email);
  } catch {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f4f1e9] p-6">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
          <ShieldAlert className="mx-auto size-10 text-[#b97738]" />
          <h1 className="mt-4 font-heading text-2xl font-bold">Dashboard storage is starting</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            The editing database is not ready in this preview yet. Refresh after the
            dashboard deployment finishes.
          </p>
        </div>
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f4f1e9] p-6">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
          <ShieldAlert className="mx-auto size-10 text-destructive" />
          <h1 className="mt-4 font-heading text-2xl font-bold">Owner access required</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            This dashboard is already connected to another administrator account.
          </p>
        </div>
      </main>
    );
  }

  return <AdminDashboard initialContent={await getSiteContent()} userEmail={user.email} />;
}
