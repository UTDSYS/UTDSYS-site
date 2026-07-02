# UofT Decision Systems

Marketing site for UofT Decision Systems (DSys) — a student design team.
Built with Next.js (App Router), Tailwind CSS v4, and Framer Motion. The
landing screen renders an animated neural network (Canvas 2D) that surges and
reorganizes into the home/intro page as you scroll.

## Develop

```bash
npm install
cp .env.local.example .env.local   # then add your RESEND_API_KEY
npm run dev      # http://localhost:3000
npm test         # Vitest unit + component tests
npm run build    # production build
```

## Pages

- `/` — the DSys landing → neural-network transition → home/intro (mission +
  Get Involved CTA), with a footer.
- `/get-involved` — email + a name/email/message form that sends a message.
  The **Contact** nav link points here too.
- `/team`, `/blog` — "coming soon" placeholder pages.

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

- `lib/network/model.ts` — pure, unit-tested node/edge geometry.
- `components/NeuralNetwork.tsx` — draws the network on a fixed canvas. A
  scroll-driven "surge" (peaks mid-transition) brightens edges, multiplies and
  speeds up the signal pulses, and pulls nodes toward the center. `progress` is
  optional: sub-pages omit it and get a calm, settled backdrop.
- `app/page.tsx` — derives `progress` (0→1) from scroll via Framer Motion
  `useScroll` (offset `["start start", "end end"]`) over a 300vh sticky zone,
  cross-fading the DSys landing into the intro.
- `lib/scroll.ts` — `useScrollApply`, a hook that writes the overlays'
  opacity/transform to the DOM imperatively on each `progress` change (Framer's
  scroll-linked opacity desyncs onto its own accelerated timeline, so we drive
  it ourselves).

Accessibility: respects `prefers-reduced-motion` (static network — no drift,
pulses, surge, or animation loop; the scroll morph still applies), caps node
count, and pauses the animation when the tab is hidden.
