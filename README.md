# Satiaya Selvan Property Website

Premium Malaysian real-estate website and owner dashboard built with Next.js,
TypeScript, Tailwind CSS and Supabase.

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Add the Supabase project URL and publishable key.
3. Run the SQL migration in `supabase/migrations`.
4. Install dependencies with `npm install`.
5. Start the project with `npm run dev`.

The public website is available at `http://localhost:3000` and the dashboard at
`http://localhost:3000/admin`.

## Hosting

Import this repository into Vercel and add the same two environment variables to
the Production, Preview and Development environments.
