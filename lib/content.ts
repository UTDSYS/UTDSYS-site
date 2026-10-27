export type TeamMember = {
  name: string;
  role: string;
  photo: string | null;
};

export type Rating = "Buy" | "Hold" | "Sell";
export type ResearchReport = {
  /** URL segment for the report's own page: /fundamental-research/<slug>. */
  slug: string;
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
  /** Holding period the target is set over, e.g. "2-year". Defaults to 12-month. */
  horizon?: string;
  /** Yahoo Finance symbol; when set, the live tracker charts the call. */
  quoteSymbol?: string;
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
        body: "Portfolio research, tested on past data and in paper trading.",
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
  // `photo` to "/team/<file>"; without one, a member shows a placeholder silhouette.
  // A "\n" in `role` starts a new line on the card.
  team: {
    eyebrow: "University of Toronto Decision Systems",
    heading: "Team",
    intro:
      "Two research desks, quantitative and fundamental. Every call the group makes goes through both.",
    members: [
      { name: "Sunny Zhang", role: "Founder\nLead Quantitative Researcher", photo: null },
      { name: "Bosco Yu", role: "Lead Fundamentals Researcher", photo: null },
    ] as TeamMember[],
  },
  // /fundamental-research: an equity research hub. The index shows each
  // report's summary card, newest first; the card opens its own page at
  // /fundamental-research/<slug> with the live chart and the PDF. To
  // publish, add an entry to `reports` and put the PDF in public/research/.
  // Entries marked `sample` bring back the sample notice.
  fundamentalResearch: {
    eyebrow: "Fundamental Research",
    heading: "Equity research",
    intro:
      "Bottom-up coverage of public companies. Every name is diligenced, modelled, and defended in front of the desk before a report goes out.",
    sampleNotice:
      "Sample reports shown for layout. Companies and figures are fictitious; first published coverage is in progress.",
    backLabel: "All research",
    trackerLabel: "Since the call",
    reportHeading: "Full report",
    reportPending: "The full write-up is being finalised and will be published here.",
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
      { rating: "Buy", definition: "Expected total return above 15% over the report's horizon." },
      { rating: "Hold", definition: "Expected total return between -5% and 15% over the horizon." },
      { rating: "Sell", definition: "Expected total return below -5% over the horizon." },
    ] as { rating: Rating; definition: string }[],
    disclaimer:
      "Reports are produced by University of Toronto students for educational purposes only. They are not investment advice or a recommendation to buy or sell any security, and UTDSYS and its members may hold positions in the securities discussed.",
    reports: [
      {
        slug: "futu",
        company: "Futu Holdings",
        ticker: "FUTU",
        exchange: "NASDAQ",
        sector: "Financials",
        date: "2026-07-17",
        rating: "Buy",
        currency: "US$",
        priceAtPublication: 95.1,
        priceTarget: 167.7,
        horizon: "2-year",
        quoteSymbol: "FUTU",
        headline: "A mispriced business, not a broken one",
        summary:
          "The stock is down 47% this year on a one-time, fully provisioned CSRC fine, while revenue grows 25% a year and client assets hit a record. Growth outside mainland China is already most of the business, and the market is pricing a setback as a permanent impairment.",
        analysts: ["Bosco Yu"],
        metrics: [
          { label: "Valuation", value: "15x FY27E EPS" },
          { label: "FY27E EPS", value: "US$11.18" },
          { label: "Expected IRR", value: "33%" },
          { label: "Holding period", value: "2 years" },
        ],
        pdf: null,
      },
    ] as ResearchReport[],
  },
  // /quantitative-research: the desk's portfolio research, tested on past
  // data and then in paper trading. Kept deliberately short: the studies
  // (robust portfolios is the first; more may follow), each with its own
  // paper-trading setup, then the method and the reading list. References are numbered in the
  // order listed; a study's `reading` points at those numbers.
  quantResearch: {
    eyebrow: "Quantitative desk",
    heading: "Quantitative research",
    intro: "Systematic portfolio research, evaluated against simple benchmarks and tested through paper trading.",
    studies: {
      heading: "Studies",
      label: "study",
      resultsLabel: "Since inception",
      resultsColumns: ["Strategy", "Return", "Volatility", "Sharpe ratio"],
      resultsPending: "Results are posted monthly once trading begins.",
      paperLabel: "Paper trading",
      readingLabel: "References",
      backtestLabel: "Historical testing",
      backtestColumns: ["Strategy", "Volatility", "Largest drawdown", "Sharpe ratio"],
      items: [
        {
          name: "Robust portfolios",
          question:
            "Robust portfolios are designed to account for errors in their forecasts. Can they lower risk without giving up risk-adjusted return?",
          strategies: ["Robust", "Min-variance"],
          benchmarks: ["Equal weighting"],
          reading: [9, 4, 7],
          // From the research repo (results/phase2/risk_vol.md): net of
          // 10 bp trading costs, sector ETFs Jan 2004 – Aug 2026.
          backtest: {
            headline:
              "10–26% less volatility than equal weighting in every market tested, with equal or better risk-adjusted returns.",
            summary:
              "Tested on U.S. sector and industry data back to 1973, after trading costs.",
            period: "Sector ETFs, Jan 2004 – Aug 2026",
            rows: [
              { name: "Robust", vol: "12.4%", maxdd: "42.1%", sharpe: "0.73" },
              { name: "Min-variance", vol: "11.5%", maxdd: "37.2%", sharpe: "0.71" },
              { name: "Equal weighting", vol: "14.3%", maxdd: "49.2%", sharpe: "0.66" },
            ],
          },
          paper: {
            terms: [
              { label: "Assets", value: "Nine U.S. sector ETFs" },
              { label: "Capital", value: "$100,000 simulated per strategy" },
              { label: "Rebalancing", value: "Monthly" },
            ],
            status: "Starting soon",
            // Fill in once paper trading has run; until then the table
            // shows each strategy with empty values.
            results: null as null | {
              asOf: string;
              rows: { name: string; ret: string; vol: string; sharpe: string }[];
            },
          },
        },
      ],
    },
    disclaimer:
      "Student research for educational purposes. Paper-trading results use simulated capital and do not constitute investment advice.",
    reading: {
      heading: "Reading list",
      groups: [
        {
          name: "Building portfolios",
          items: [
            "Markowitz, H. (1952). Portfolio selection. Journal of Finance 7(1), 77–91.",
            "Ledoit, O. and Wolf, M. (2004). Honey, I shrunk the sample covariance matrix. Journal of Portfolio Management 30(4), 110–119.",
            "Jorion, P. (1986). Bayes-Stein estimation for portfolio analysis. Journal of Financial and Quantitative Analysis 21(3), 279–292.",
            "DeMiguel, V., Garlappi, L. and Uppal, R. (2009). Optimal versus naive diversification: How inefficient is the 1/N portfolio strategy? Review of Financial Studies 22(5), 1915–1953.",
            "DeMiguel, V., Garlappi, L., Nogales, F. J. and Uppal, R. (2009). A generalized approach to portfolio optimization: Improving performance by constraining portfolio norms. Management Science 55(5), 798–812.",
          ],
        },
        {
          name: "Robust optimisation",
          items: [
            "Garlappi, L., Uppal, R. and Wang, T. (2007). Portfolio selection with parameter and model uncertainty: A multi-prior approach. Review of Financial Studies 20(1), 41–81.",
            "Scherer, B. (2007). Can robust portfolio optimisation help to build better portfolios? Journal of Asset Management 7(6).",
            "Kim, W. C., Kim, J. H., Ahn, S. H. and Fabozzi, F. J. (2013). What do robust equity portfolio models really do? Annals of Operations Research 205, 141–168.",
            "Gotoh, J., Kim, M. J. and Lim, A. E. B. (2020). Calibration of distributionally robust empirical optimization models. arXiv:1711.06565.",
            "Cornuéjols, G., Elçi, Ö. and Patil, V. (2024). Addressing estimation errors on expected asset returns through robust portfolio optimization. Optimization Online.",
          ],
        },
        {
          name: "Testing results",
          items: [
            "Ledoit, O. and Wolf, M. (2008). Robust performance hypothesis testing with the Sharpe ratio. Journal of Empirical Finance 15(5), 850–859.",
            "Bailey, D. H. and López de Prado, M. (2014). The deflated Sharpe ratio: correcting for selection bias, backtest overfitting, and non-normality. Journal of Portfolio Management 40(5), 94–107.",
          ],
        },
      ],
    },
    join: { text: "Interested in contributing to our research?", label: "Get involved", href: "/get-involved" },
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
