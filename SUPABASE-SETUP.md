# Chat setup for Vercel + Supabase

The Vercel website now includes a Node API at `/api/chat/*`. Supabase stores conversations, admin sessions, typing/read status, and private images. Groq generates AI replies. No separate Node hosting account is needed.

## 1. Create your Supabase project

1. Sign in at https://supabase.com/dashboard and create a project in a Free organization.
2. Name it `neil-portfolio`. Choose a nearby region such as Singapore if available.
3. Set a strong database password and save it in your password manager.
4. Wait until the project is ready. Open **SQL Editor**, paste the contents of `supabase/chat.sql`, and click **Run**. This creates private chat tables and the private `portfolio-chat` image bucket. It does not delete existing conversations.

## 2. Configure Vercel

In your existing Vercel project, open **Settings → Environment Variables** and add these to Production (and Preview if you want preview deployments to use the same chats):

| Name | Value |
| --- | --- |
| `SUPABASE_URL` | Your Supabase Project URL, from Connect or Settings → API |
| `SUPABASE_SECRET_KEY` | A server-only secret key (`sb_secret_...`) under Supabase Settings → API Keys |
| `ADMIN_PASSWORD` | Your chosen admin password, at least 12 characters |
| `GROQ_API_KEY` | Your existing Groq API key |
| `GROQ_MODEL` | `openai/gpt-oss-20b` (must be available for your Groq account) |

Do not put the Supabase secret key or Groq key into any variable starting with `VITE_`, source code, or chat messages. The database password is different from the API key. Keep the Storage bucket private; public policies are unnecessary. An existing legacy `service_role` key is also supported through `SUPABASE_SERVICE_ROLE_KEY`.

## 3. Deploy the updated project

Deploy the complete project, including `api/`, `server/`, `src/`, `supabase/`, and `vercel.json`, using your existing Vercel deployment workflow. Uploading only `dist/` omits the backend. Vercel should use the Vite preset, `npm run build`, and `dist` output. Redeploy after adding or changing environment variables.

The profile and project images are now imported into the production build, so the new deployment also fixes their broken image paths.

## 4. Verify after deployment

1. Open the chatbot at https://neilcharlie.vercel.app/ and send an AI question.
2. Type `talk to Neil`: the directing message should appear and AI replies should pause.
3. Open https://neilcharlie.vercel.app/#admin in another browser and sign in with `ADMIN_PASSWORD`.
4. Reply from the inbox, check both typing indicators and seen status, and upload an image smaller than 5 MB. Other files must be links.
5. Close and reopen the visitor's browser tab. The conversation should return in the same browser profile while its cookie remains available.
6. After 15 minutes with no messages from either side, the assistant becomes active again. Reading and typing do not extend the timer. State is checked when the next request arrives; no scheduled job is needed.

## Local development and existing chats

`npm run dev` uses the existing local `.chat-data` store when both Supabase variables are blank. Put the Supabase values into your private `.env.local` and restart Vite to test the cloud store locally. Local chat files are preserved; they are not automatically copied to Supabase. Browser identity belongs to its website origin, so localhost cookies do not transfer to the published website.

## Limits and maintenance

Supabase Free includes usage quotas and may pause inactive projects. Check its dashboard if chats stop loading. Images upload directly to Supabase using signed URLs, avoiding Vercel's 4.5 MB function-body limit. Each image is checked again before being attached to a message; images at or above 5,000,000 bytes are rejected.

Incomplete uploads can leave unused objects in the private bucket. Review unused uploads periodically before removing any; `portfolio_uploads` records upload IDs and conversation IDs. Keep objects referenced by conversation messages. This implementation retains chat histories and loads them into the admin inbox; high-volume use will need paginated message history and storage monitoring.

References: https://supabase.com/docs/guides/storage/uploads/standard-uploads, https://supabase.com/docs/guides/api/api-keys, https://vercel.com/docs/functions/limitations.
