export type TeamMember = {
  name: string | null;
  role: string;
  photo: string | null;
};
export type TeamDivision = { name: string; lead: TeamMember; members: TeamMember[] };

export type Rating = "Buy" | "Hold" | "Sell";
export type ResearchReport = {
  company: string;
  ticker: string;
  exchange: string;
  sector: string;
  /** ISO date of publication, e.g. "2026-10-02". */
  date: string;
  rating: Rating;
  currency: string;
  priceAtPublication: number;
  priceTarget: number;
  /** One-line thesis, written like a report headline. */
  headline: string;
  summary: string;
  analysts: string[];
  /** Key figures shown on the featured card, label → preformatted value. */
  metrics: { label: string; value: string }[];
  /** Path under /public, e.g. "/research/acme-initiation.pdf". */
  pdf: string | null;
  /** Placeholder entries are tagged so they can never pass as real coverage. */
  sample?: boolean;
};

const content = {
  brand: {
    name: "UTDSYS",
    full: "University of Toronto Decision Systems",
  },
  // The hero is a live neural network driven by the model in lib/quoting:
  // both research desks feeding one decision. The two CTAs are the site's
  // primary paths.
  hero: {
    eyebrow: "University of Toronto",
    mission: "Using mathematics to make better decisions under uncertainty.",
    primary: { label: "Get involved", href: "/get-involved" },
    secondary: { label: "Our research", href: "/quantitative-research" },
    net: {
      description:
        "A feed-forward network combining three market signals and three company fundamentals into one quoting decision.",
      // Shown under the network, which is presented as a figure.
      caption: {
        label: "Fig. 1",
        body: "Both desks, one call. Market signals from quantitative research and company fundamentals from fundamental research feed a single model that sets the quote. Drag any input.",
        note: "Simulated data",
      },
      // Drawn top-to-bottom, one group per desk; the flattened order matches
      // the feature vector in lib/quoting.
      desks: [
        { label: "Quantitative", features: ["Order flow", "Volatility", "Inventory"] },
        { label: "Fundamental", features: ["Earnings", "Valuation", "Leverage"] },
      ],
      hint: {
        pointer: "drag an input ↕",
        keyboard: "focus an input, use ↑↓",
      },
      // Fair value is the fundamental desk's answer; bid and ask are the quote.
      readout: { fair: "Fair value", bid: "Bid", ask: "Ask" },
      // Keyed by the Action union in lib/quoting.
      actions: {
        "quote-both": "Quote both sides",
        "skew-bid": "Lean bid",
        "skew-ask": "Lean ask",
        "pull-bid": "Pull the bid",
        "pull-ask": "Pull the ask",
      },
      // Announced to screen readers whenever the call changes.
      statusPrefix: "Decision:",
      loading: "—",
      meta: {
        decisions: "decisions evaluated",
      },
    },
  },
  nav: {
    links: [
      { label: "Quantitative Research", href: "/quantitative-research" },
      { label: "Fundamental Research", href: "/fundamental-research" },
      { label: "Team", href: "/team" },
      { label: "Contact", href: "/contact" },
      // Rendered as the nav's call to action rather than a plain link.
      { label: "Get Involved", href: "/get-involved", cta: true },
    ],
  },
  getInvolved: {
    heading: "Get involved",
    intro:
      "Decision Systems is open to students across every faculty — whether you build models, design interfaces, or just like hard problems. No experience required. Send us a message and we'll be in touch.",
    form: {
      name: { label: "Name", placeholder: "Ada Lovelace" },
      email: { label: "Email", placeholder: "you@mail.utoronto.ca" },
      message: {
        label: "Message",
        placeholder: "Tell us what you're interested in…",
      },
      submit: "Send message",
      sending: "Sending…",
      success: "Thanks — your message is on its way. We'll reply soon.",
      error: "Something went wrong. Please try again or email us directly.",
      // Shown in place of the form while the contact form is disabled
      // (see CONTACT_FORM_ENABLED in lib/flags.ts).
      disabled: {
        discord: {
          label: "Join our Discord",
          href: "https://discord.gg/h2kX42dfdz",
        },
      },
    },
  },
  // The /team page. Drop headshots in public/team/ and set `photo` to
  // "/team/<file>"; members without a photo show their initials.
  // The /team page: the org chart drawn as a network. Each desk's people
  // feed their lead, and both leads converge on one decision. Drop headshots
  // in public/team/ and set `photo` to "/team/<file>". A member with
  // `name: null` renders as an open seat linking to /get-involved.
  team: {
    eyebrow: "People",
    heading: "Team",
    intro:
      "Two research desks, one call. Quantitative and fundamental research each run their own branch, and both converge on every decision we make.",
    hint: "Hover anyone to trace their path to the decision",
    output: "Decision",
    openSeat: "Open seat",
    divisions: [
      {
        name: "Quantitative",
        lead: { name: "Name", role: "Founder · Head of Quant", photo: null },
        members: [
          { name: "Name", role: "VP, Internal", photo: null },
          { name: "Name", role: "VP, External", photo: null },
          { name: "Name", role: "CTO", photo: null },
        ],
      },
      {
        name: "Fundamental",
        lead: { name: "Name", role: "Lead Fundamentals Researcher", photo: null },
        members: [
          { name: null, role: "Fundamentals Analyst", photo: null },
          { name: null, role: "Fundamentals Analyst", photo: null },
          { name: null, role: "Fundamentals Analyst", photo: null },
        ],
      },
    ] as TeamDivision[],
  },
  // /fundamental-research: an equity research hub. The newest report is
  // featured; the rest fill the coverage table. To publish, add an entry to
  // `reports` and put the PDF in public/research/. Delete the sample entries
  // once real coverage exists — the sample notice disappears with them.
  fundamentalResearch: {
    eyebrow: "Fundamental Research",
    heading: "Equity research",
    intro:
      "Bottom-up coverage of public companies. Every name is diligenced, modelled, and defended in front of the desk before a report goes out.",
    sampleNotice:
      "Sample reports shown for layout. Companies and figures are fictitious; first published coverage is in progress.",
    featuredLabel: "Latest report",
    coverageHeading: "Coverage",
    process: {
      heading: "How we cover a name",
      steps: [
        {
          title: "Screen",
          body: "Ideas start from a sector view or a mispricing we can articulate in one sentence.",
        },
        {
          title: "Diligence",
          body: "Filings, transcripts, industry data, and competitor work, until the business is understood end to end.",
        },
        {
          title: "Model",
          body: "A three-statement model and a valuation built from our own assumptions, cross-checked against comparables.",
        },
        {
          title: "Defend",
          body: "The thesis is pitched to the desk and stress-tested. Only what survives is published, then tracked.",
        },
      ],
    },
    ratings: [
      { rating: "Buy", definition: "Expected 12-month total return above 15%." },
      { rating: "Hold", definition: "Expected 12-month total return between -5% and 15%." },
      { rating: "Sell", definition: "Expected 12-month total return below -5%." },
    ] as { rating: Rating; definition: string }[],
    disclaimer:
      "Reports are produced by University of Toronto students for educational purposes only. They are not investment advice or a recommendation to buy or sell any security, and UTDSYS and its members may hold positions in the securities discussed.",
    reports: [
      {
        company: "Acme Logistics",
        ticker: "ACME",
        exchange: "TSX",
        sector: "Industrials",
        date: "2026-10-02",
        rating: "Buy",
        currency: "C$",
        priceAtPublication: 42.1,
        priceTarget: 53,
        headline: "Network density is finally showing up in margins",
        summary:
          "A decade of terminal investment has built a cost advantage the market still prices as cyclical. We see operating leverage carrying EBITDA margins 300bp higher by FY28 as volumes recover.",
        analysts: ["Analyst Name", "Analyst Name"],
        metrics: [
          { label: "Market cap", value: "C$8.4B" },
          { label: "EV / EBITDA (NTM)", value: "9.2x" },
          { label: "P / E (NTM)", value: "15.8x" },
          { label: "Dividend yield", value: "2.1%" },
        ],
        pdf: null,
        sample: true,
      },
      {
        company: "Initech Software",
        ticker: "INTK",
        exchange: "NASDAQ",
        sector: "Technology",
        date: "2026-09-18",
        rating: "Hold",
        currency: "US$",
        priceAtPublication: 118.4,
        priceTarget: 126,
        headline: "Quality franchise, full price",
        summary:
          "Net retention remains best in class, but the multiple already discounts a reacceleration we can't underwrite yet.",
        analysts: ["Analyst Name"],
        metrics: [
          { label: "Market cap", value: "US$31.0B" },
          { label: "EV / Sales (NTM)", value: "11.4x" },
          { label: "FCF margin", value: "27%" },
          { label: "Net retention", value: "118%" },
        ],
        pdf: null,
        sample: true,
      },
      {
        company: "Globex Energy",
        ticker: "GBXE",
        exchange: "NYSE",
        sector: "Energy",
        date: "2026-08-29",
        rating: "Sell",
        currency: "US$",
        priceAtPublication: 64.7,
        priceTarget: 55,
        headline: "Reserve life is shorter than the market assumes",
        summary:
          "Decline rates in the core basin are running ahead of guidance, and the buyback is being funded at the expense of reinvestment.",
        analysts: ["Analyst Name"],
        metrics: [
          { label: "Market cap", value: "US$22.6B" },
          { label: "EV / EBITDA (NTM)", value: "5.1x" },
          { label: "Net debt / EBITDA", value: "1.8x" },
          { label: "Reserve life", value: "8.3 yrs" },
        ],
        pdf: null,
        sample: true,
      },
      {
        company: "Umbrella Health",
        ticker: "UMBH",
        exchange: "TSX",
        sector: "Healthcare",
        date: "2026-08-07",
        rating: "Buy",
        currency: "C$",
        priceAtPublication: 27.3,
        priceTarget: 34.5,
        headline: "A misunderstood roll-up with real integration skill",
        summary:
          "Acquired clinics are reaching group margins within 18 months, a track record the current discount ignores.",
        analysts: ["Analyst Name", "Analyst Name"],
        metrics: [
          { label: "Market cap", value: "C$3.2B" },
          { label: "EV / EBITDA (NTM)", value: "10.6x" },
          { label: "P / E (NTM)", value: "19.4x" },
          { label: "Organic growth", value: "7%" },
        ],
        pdf: null,
        sample: true,
      },
    ] as ResearchReport[],
  },
  // /quantitative-research: a live, simulated market-making desk (the
  // engine in lib/marketMaker), the model behind it, the project pipeline,
  // and working papers. Add papers to `papers`; set `project.stage` to the
  // pipeline step the engine has actually reached.
  quantResearch: {
    eyebrow: "Quantitative Research",
    heading: "Quantitative research",
    intro:
      "We build models that make trading decisions under uncertainty. Our first is a market maker: a program that always offers to buy a little below the market price and sell a little above it, earning the gap while trying not to get stuck holding too much.",
    // Three steps that teach a visitor how to read the desk below.
    explainer: [
      {
        title: "Quote both sides",
        body: "The shaded band is our offer: the bottom edge is the price we'll buy at, the top edge the price we'll sell at.",
      },
      {
        title: "Earn the gap",
        body: "When someone trades with us (a dot), we pocket part of that gap. Do it thousands of times and it adds up.",
      },
      {
        title: "Don't get stuck",
        body: "Holding a pile of stock is risky, so the band leans away from whatever we already hold to unload it.",
      },
    ],
    desk: {
      title: "A live market maker",
      simulated: "Simulated",
      note: "Synthetic market with informed traders. No real market data or money.",
      labels: {
        ask: "We sell",
        mid: "Market",
        bid: "We buy",
        bought: "We bought",
        sold: "We sold",
        profit: "Profit",
        position: "Position",
        trades: "Trades",
        spread: "Gap we charge",
        positionChart: "Shares held",
        profitChart: "Profit over time",
        flat: "Flat",
        long: "long",
        short: "short",
      },
      controls: {
        gamma: { name: "Caution", hint: "How hard it avoids holding a position" },
        sigma: { name: "Volatility", hint: "How wildly the market moves" },
      },
      underTheHood: "Under the hood",
    },
    model: {
      heading: "The math",
      intro:
        "For the curious: the desk is the Avellaneda–Stoikov model, the standard starting point for market making. These three equations are everything it does.",
      terms: [
        {
          name: "Reservation price",
          formula: "r = S − q·γ·σ²·τ",
          body: "Where the desk is indifferent to trading. Long inventory shades it down so the desk sells more readily.",
        },
        {
          name: "Optimal spread",
          formula: "δ = γσ²τ + (2/γ)·ln(1 + γ/k)",
          body: "Wider when risk aversion or volatility rise; the second term prices how quickly fill probability decays.",
        },
        {
          name: "Order arrival",
          formula: "λ(d) = A·e^(−k·d)",
          body: "Quotes further from mid fill less often. Every fill also moves the mid against us: adverse selection.",
        },
      ],
    },
    project: {
      label: "Current project",
      name: "Quoting engine",
      summary:
        "A production-grade market maker: a quoting model, an inventory and risk layer, and a backtester on historical order-book data.",
      stages: ["Research", "Model", "Backtest", "Paper trading", "Live"],
      stage: "Model",
    },
    focus: {
      heading: "Focus areas",
      areas: [
        { name: "Market microstructure", body: "Order books, queue dynamics, and how prices actually form tick by tick." },
        { name: "Stochastic control", body: "Optimal quoting and execution as decisions under a model of uncertainty." },
        { name: "Statistical learning", body: "Short-horizon signals, fit carefully and tested out of sample." },
        { name: "Risk", body: "Inventory limits, drawdown control, and knowing when not to trade." },
      ],
    },
    papers: {
      heading: "Working papers",
      empty: "First notes are in progress.",
      items: [] as { title: string; authors: string[]; date: string; abstract: string; pdf: string | null }[],
    },
    disclaimer:
      "All desk data on this page is simulated for illustration. It is not a record of trading, backtested or live, and nothing here is investment advice.",
  },
  contact: {
    email: "info@utdsys.com",
    // Directories surfaced in the hero strip; the full set lives on /contact.
    socials: [
      { label: "Discord", href: "https://discord.gg/h2kX42dfdz" },
      { label: "GitHub", href: "https://github.com/UTDSYS" },
      { label: "LinkedIn", href: "https://www.linkedin.com/company/utdsys" },
    ],
  },
  // The /contact directory: every way to reach the team, in one place.
  contactPage: {
    heading: "Find us",
    intro:
      "Questions, ideas, or just want to say hi? Reach the team through any of these.",
    channels: [
      {
        label: "Email",
        value: "info@utdsys.com",
        href: "mailto:info@utdsys.com",
      },
      {
        label: "Discord",
        value: "Join the server",
        href: "https://discord.gg/h2kX42dfdz",
      },
      {
        label: "GitHub",
        value: "github.com/UTDSYS",
        href: "https://github.com/UTDSYS",
      },
      {
        label: "LinkedIn",
        value: "linkedin.com/company/utdsys",
        href: "https://www.linkedin.com/company/utdsys",
      },
    ],
  },
} as const;

export default content;
