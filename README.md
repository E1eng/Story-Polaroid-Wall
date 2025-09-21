# Fogo Wall Clone (Next.js + Tailwind + Supabase)

**What this is:** starter project that implements a shared polaroid wall. Users can upload a photo, name, and a short description — images are stored in Supabase Storage and metadata in a Supabase table. Frontend is Next.js + Tailwind.

## Quick setup

1. Create a Supabase project at https://supabase.com and enable Storage.
2. Create a table `polaroids` with columns:
   - id (bigint) PRIMARY KEY default generated (or use text UUID)
   - name text
   - message text
   - image_url text
   - x int (optional)
   - y int (optional)
   - rot int (optional)
   - z int (optional)
   - created_at timestamp with time zone default now()

3. Create a Storage bucket named `images` (public or private with signed URLs).
4. In the project root, create a `.env.local` file with:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

5. Install dependencies:
```
npm install
```

6. Run local dev:
```
npm run dev
```

7. Deploy to Vercel and add the same env vars in Vercel dashboard.

## Notes
- This is a minimal starter. For production, secure uploads, add validation, and consider server-side upload endpoints for signed uploads if using a private bucket.
