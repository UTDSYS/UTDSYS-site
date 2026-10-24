# UofT Decision Systems

Marketing site for UofT Decision Systems (DSys) — a team using mathematics to
make better decisions under uncertainty.
Built with Next.js App Router and Tailwind CSS v4. The landing screen renders
a lightweight SVG neural network that builds on load, then runs a throttled
interactive quoting simulation.

## Develop

```bash
npm install
cp .env.local.example .env.local   # then add your RESEND_API_KEY
npm run dev      # http://localhost:3000, uses webpack dev mode
npm test         # Vitest unit + component tests
npm run build    # production build
```

`npm run dev` intentionally runs `next dev --webpack`. Turbopack dev mode was
creating large `.next/dev` snapshots and could crash the laptop while compiling
routes such as `/quantitative-research`.

## Pages

- `/` — the DSys landing with an interactive neural-network hero.
- `/get-involved` — email + a name/email/message form that sends a message.
- `/quantitative-research` — live simulated market-making desk (`lib/marketMaker.ts`), the model, project pipeline, working papers.
- `/fundamental-research` — equity research hub: featured report, coverage table, process, disclaimer.
- `/team` — the org chart drawn as a network.
- `/contact` — contact/social directory.

## Contact form / email

The Get Involved form posts to `/api/contact` (`app/api/contact/route.ts`),
which validates the input (`lib/contact.ts`) and sends the message with
[Resend](https://resend.com).

1. Create a free API key at https://resend.com/api-keys.
2. Put it in `.env.local` as `RESEND_API_KEY=...`.
3. The route sends from Resend's test address `onboarding@resend.dev` to the
   address in `lib/content.ts` (`contact.email`). For production, verify your
   own domain in Resend and change the `from` address in the route.

Without a key the form still validates and shows a friendly "email isn't
configured yet" message.

## Editing content

All user-facing copy — intro, nav links, form labels/messages, placeholder
page text, contact details — lives in `lib/content.ts`. Edit that one file.

## How it works

- `lib/quoting.ts` — pure, unit-tested quoting model for the hero network.
- `components/NeuralNet.tsx` — SVG structure for the network.
- `hooks/useIntroSequence.ts` — one-shot load choreography.
- `hooks/useQuotingNet.ts` — throttled DOM updates for the live quote/readout.

Accessibility: respects `prefers-reduced-motion`, supports keyboard adjustment
for the hero inputs, and pauses live updates when the tab is hidden.
