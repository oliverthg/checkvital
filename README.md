# CheckVital — Next.js + Supabase

Minimal app to store medical documents (exams, prescriptions, vaccines).

## Setup

1. Copy `.env.example` to `.env.local` and paste your Supabase values.
2. Create a **private** Storage bucket named `medical_docs` in Supabase.
3. Run the SQL in `supabase.sql` (Tables, RLS, policies).
4. Install deps and run:
```bash
npm i
npm run dev
```
Open http://localhost:3000/sign-up

## Deploy (Vercel)
- Add environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Build command: `next build` (auto).
