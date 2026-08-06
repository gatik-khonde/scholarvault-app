# ScholarVault (Next.js + Redis version)

This is a real, deployable version of ScholarVault. Unlike the single-file
HTML version, this one has:

- A real database (Redis via Upstash) that persists your content, and
  actually works once deployed — not just inside Claude's preview.
- A real password check that happens **on the server**. Your passcode is
  never sent to visitors' browsers, and isn't visible by viewing page source.

## 1. Install dependencies

```bash
npm install
```

## 2. Create a Redis database (free)

1. Go to your project on [vercel.com](https://vercel.com), open the
   **Storage** tab, and click **Create Database → Redis** (powered by
   Upstash). The free tier is enough for this.
2. Once created, Vercel will offer to **connect** it to your project and
   automatically add the right environment variables
   (`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`, or the older
   `KV_REST_API_URL` / `KV_REST_API_TOKEN` naming — this app supports both).

## 3. Set your two remaining environment variables

In Vercel: **Project → Settings → Environment Variables**. Locally: create
a `.env.local` file in this folder.

```
OWNER_PASSWORD=Bapu@108
AUTH_SECRET=some-long-random-string-you-make-up
```

- `OWNER_PASSWORD` — the passcode you'll use to sign in as owner.
- `AUTH_SECRET` — any long random string (used to sign your login session so
  it can't be forged). You can generate one with:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

**Never commit `.env.local` to git.** It's already listed in `.gitignore`.

## 4. Run it locally to check everything works

```bash
npm run dev
```

Visit `http://localhost:3000`, click **Owner sign in**, and try adding a
note. If it saves and shows up, your Redis connection is working.

## 5. Deploy to Vercel

```bash
npx vercel
```

Follow the prompts (link or create a project). Once deployed, run:

```bash
npx vercel --prod
```

Double-check the two environment variables are also set on the **Production**
environment in Vercel's dashboard, not just Preview/Development — Vercel
lets you scope env vars per environment, and it's an easy thing to miss.

## Changing the owner passcode later

Just update the `OWNER_PASSWORD` environment variable in Vercel's dashboard
and redeploy (or it may pick it up automatically, depending on your Vercel
settings) — no code changes needed.

## What's different from the HTML version

| | Old single-file HTML | This version |
|---|---|---|
| Storage | `window.storage` (Claude preview only — breaks elsewhere) | Real Redis database |
| Password check | In browser JavaScript, visible in page source | On the server, never sent to the browser |
| Session | Resets on every page reload | Persists for 12 hours via a secure cookie |
