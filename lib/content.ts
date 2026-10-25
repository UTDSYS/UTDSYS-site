export type TeamMember = {
  name: string;
  role: string;
  photo: string | null;
};

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
  // The hero: the group crest on a navy panel, and the wordmark beside it,
  // whose "i" is lit by a network firing into its dot. `desks` are the two
  // research desks, each linking to its page.
  hero: {
    eyebrow: "University of Toronto",
    lede: "A student research group in quantitative and fundamental research.",
    desks: [
      {
        name: "Quantitative desk",
        body: "Models, markets and the literature behind them.",
        href: "/quantitative-research",
      },
      {
        name: "Fundamental desk",
        body: "Bottom-up research on public companies.",
        href: "/fundamental-research",
      },
    ],
    primary: { label: "Get involved", href: "/get-involved" },
    secondary: { label: "Join the Discord", href: "https://discord.gg/h2kX42dfdz" },
  },
  nav: {
    links: [
      { label: "Quantitative Research", href: "/quantitative-research" },
      { label: "Fundamental Research", href: "/fundamental-research" },
      { label: "Team", href: "/team" },
      // Rendered as the nav's call to action rather than a plain link.
      { label: "Get Involved", href: "/get-involved", cta: true },
    ],
  },
  // /get-involved: how to join (a real sequence), the two desks to pick
  // from, and the join panel (the Discord and email while the form is off;
  // see CONTACT_FORM_ENABLED in lib/flags.ts).
  getInvolved: {
    eyebrow: "University of Toronto Decision Systems",
    heading: "Get involved",
    steps: {
      heading: "How to join",
      items: [
        {
          name: "Join the Discord",
          body: "Recruiting is announced there first, so you'll know as soon as it opens.",
        },
        {
          name: "Introduce yourself",
          body: "Tell us a bit about yourself, and share your research or an interesting paper you've read.",
        },
      ],
      // A fallback, not a third step, so it sits under the list unnumbered.
      missed: { text: "We're always looking for eager people. Send us an email at", email: "info@utdsys.com" },
    },
    // Two doors, one action each: students join the Discord (announcements,
    // introductions, shared research),
    // sponsors and partners write to the team.
    doors: {
      students: {
        label: "For students",
        heading: "Join the group",
        body: "Any faculty, any year. Recruiting announcements go out on our Discord.",
        action: "Join the Discord",
      },
      partners: {
        label: "Sponsors, partners and questions",
        heading: "Work with us",
        body: "Sponsorship, a speaker, a dataset, or a problem worth studying. Write to the team and we'll reply.",
      },
    },
    desksPrompt: "Not sure where you'd fit? Read about the",
    form: {
      name: { label: "Name" },
      email: { label: "Email" },
      message: { label: "Message" },
      topic: { label: "Topic" },
      submit: "Send message",
      sending: "Sending…",
      successHeading: "Message sent",
      success: "It's in the team's inbox, and we'll reply to the address you gave.",
      another: "Send another message",
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
  // /team: one roster, everyone at the same size, in org order (the two
  // desk leads, then officers). Drop headshots in public/team/ and set
  // `photo` to "/team/<file>"; without one, a member shows their initials.
  // A "\n" in `role` starts a new line on the card.
  team: {
    eyebrow: "University of Toronto Decision Systems",
    heading: "Team",
    intro:
      "Two research desks, quantitative and fundamental. Every call the group makes goes through both.",
    members: [
      { name: "Name", role: "Founder\nLead Quantitative Researcher", photo: null },
      { name: "Name", role: "Lead Fundamentals Researcher", photo: null },
      { name: "Name", role: "VP, Internal", photo: null },
      { name: "Name", role: "VP, External", photo: null },
      { name: "Name", role: "CTO", photo: null },
    ] as TeamMember[],
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
  // /quantitative-research: the desk's projects first (the main work), then
  // how it reviews papers, the annotated reading list, and written reviews.
  // References are numbered in the order listed; a project's `reading` and a
  // review's `ref` point at those numbers. Set each project's `stage` to
  // where the work actually is.
  quantResearch: {
    heading: "Quantitative research",
    intro:
      "The quantitative desk builds projects and reads the literature behind them. Each project starts from published work, is implemented by members from scratch, and is tested against data before we trust it.",
    projects: {
      heading: "Projects",
      readingLabel: "Builds on",
      items: [
        {
          name: "Quoting engine",
          summary:
            "A market-making engine: it quotes a price to buy and a price to sell, and adjusts both for inventory and volatility so the desk isn't left holding risk. The first version implements a closed-form model from the literature exactly, so we have a baseline we fully understand before adding anything learned from data.",
          reading: [5, 6, 2],
          stages: [
            { name: "Literature review", detail: "Avellaneda–Stoikov and its extensions" },
            { name: "Model specification", detail: "Quoting rule, inventory limits, parameter estimation" },
            { name: "Backtest", detail: "Historical order-book data, with fill assumptions written down" },
            { name: "Paper trading", detail: "Live data, simulated execution" },
          ],
          stage: "Model specification",
        },
      ],
    },
    disclaimer:
      "Student research for educational purposes. Nothing here is investment advice.",
    method: {
      heading: "How we review a paper",
      // A real sequence: every paper goes through these in order.
      steps: [
        {
          name: "Read",
          body: "One member takes the paper and writes a one-page summary: the question, the method, the result, and every assumption it rests on.",
        },
        {
          name: "Present",
          body: "They walk the desk through it. The job of everyone else is to find where the argument is weakest.",
        },
        {
          name: "Replicate",
          body: "Where the data or a simulation allows, we rebuild the key result ourselves before we rely on it.",
        },
        {
          name: "Write up",
          body: "The summary, the objections raised, and any replication code go into a written review.",
        },
      ],
    },
    reading: {
      heading: "Reading list",
      groups: [
        {
          name: "Market microstructure",
          items: [
            {
              cite: "Kyle, A. S. (1985). Continuous auctions and insider trading. Econometrica 53(6), 1315–1335.",
              note: "How an informed trader hides in noise, and where price impact comes from.",
            },
            {
              cite: "Glosten, L. R. and Milgrom, P. R. (1985). Bid, ask and transaction prices in a specialist market with heterogeneously informed traders. Journal of Financial Economics 14(1), 71–100.",
              note: "The bid–ask spread as the price of trading against better-informed counterparties.",
            },
            {
              cite: "Cont, R., Kukanov, A. and Stoikov, S. (2014). The price impact of order book events. Journal of Financial Econometrics 12(1), 47–88.",
              note: "Order-flow imbalance at the top of the book explains short-horizon price moves.",
            },
          ],
        },
        {
          name: "Optimal control and execution",
          items: [
            {
              cite: "Almgren, R. and Chriss, N. (2001). Optimal execution of portfolio transactions. Journal of Risk 3(2), 5–39.",
              note: "Trading off market impact against price risk when unwinding a position.",
            },
            {
              cite: "Avellaneda, M. and Stoikov, S. (2008). High-frequency trading in a limit order book. Quantitative Finance 8(3), 217–224.",
              note: "Quoting as a stochastic control problem, solved in closed form.",
            },
            {
              cite: "Cartea, Á., Jaimungal, S. and Penalva, J. (2015). Algorithmic and High-Frequency Trading. Cambridge University Press.",
              note: "The standard textbook treatment of the whole area, from a University of Toronto author.",
            },
          ],
        },
        {
          name: "Statistical learning and testing",
          items: [
            {
              cite: "Harvey, C. R., Liu, Y. and Zhu, H. (2016). … and the cross-section of expected returns. Review of Financial Studies 29(1), 5–68.",
              note: "Why most published return factors are likely false, and how high the bar should be.",
            },
            {
              cite: "Bailey, D. H. and López de Prado, M. (2014). The deflated Sharpe ratio: correcting for selection bias, backtest overfitting, and non-normality. Journal of Portfolio Management 40(5), 94–107.",
              note: "Adjusting a backtest's Sharpe ratio for the number of strategies that were tried.",
            },
            {
              cite: "Gu, S., Kelly, B. and Xiu, D. (2020). Empirical asset pricing via machine learning. Review of Financial Studies 33(5), 2223–2273.",
              note: "A careful comparison of learning methods for predicting returns, tested out of sample.",
            },
          ],
        },
        {
          name: "Portfolios and risk",
          items: [
            {
              cite: "Markowitz, H. (1952). Portfolio selection. Journal of Finance 7(1), 77–91.",
              note: "Where mean–variance optimisation starts.",
            },
            {
              cite: "Ledoit, O. and Wolf, M. (2004). Honey, I shrunk the sample covariance matrix. Journal of Portfolio Management 30(4), 110–119.",
              note: "Why the sample covariance matrix fails in practice, and a simple estimator that holds up.",
            },
          ],
        },
      ],
    },
    reviews: {
      heading: "Reviews",
      empty: "Written reviews will be published here as they're finished.",
      items: [] as { title: string; reviewer: string; date: string; ref: number; pdf: string | null }[],
    },
    join: { text: "Want to present a paper?", label: "Get involved", href: "/get-involved" },
  },
  contact: {
    email: "info@utdsys.com",
    // The full set of channels lives in contactPage.channels.
    socials: [
      { label: "Discord", href: "https://discord.gg/h2kX42dfdz" },
      { label: "GitHub", href: "https://github.com/UTDSYS" },
      { label: "LinkedIn", href: "https://www.linkedin.com/company/utdsys" },
    ],
  },
  // Direct channels, shown in the white band at the foot of /get-involved
  // (the old /contact page now redirects there).
  contactPage: {
    eyebrow: "University of Toronto Decision Systems",
    heading: "Contact",
    intro:
      "Questions, ideas, or partnership enquiries. Reach the team through any of these.",
    joinPrompt: { text: "Want to join the group?", label: "Get involved", href: "/get-involved" },
    // The message form (lib/flags CONTACT_FORM_ENABLED); it emails info@.
    form: { heading: "Send a message" },
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
