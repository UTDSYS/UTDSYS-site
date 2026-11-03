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
  /** The financial model behind the call: the spreadsheet under /public, and
   *  the inputs and per-method prices a visitor sees without opening it. */
  model?: {
    file: string;
    assumptions: { label: string; value: string }[];
    methods: { label: string; price: number; weight: number }[];
  };
  /** Placeholder entries are tagged so they can never pass as real coverage. */
  sample?: boolean;
};

const content = {
  brand: {
    name: "UTDSYS",
    full: "University of Toronto Decision Systems",
  },
  // The hero: the group crest on a navy panel, and the wordmark beside it,
  // whose two i-dots in "Decision" are lit blue. `desks` are the two
  // research desks, each linking to its page.
  hero: {
    eyebrow: "University of Toronto",
    desks: [
      {
        name: "Quantitative research",
        body: "Portfolio research, tested on past data and in paper trading.",
        href: "/quantitative-research",
      },
      {
        name: "Fundamental research",
        body: "Bottom-up research on public companies.",
        href: "/fundamental-research",
      },
    ],
    primary: { label: "Get involved", href: "/get-involved" },
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
    heading: "Meet the team",
    intro: "The people behind UTDSYS.",
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
    heading: "Fundamental research",
    reportsHeading: "Published reports",
    // the two tabs under Fundamental Research: who we are, then the reports
    tabs: [
      { label: "Who we are", href: "/fundamental-research" },
      { label: "Published reports", href: "/fundamental-research/reports" },
    ],
    // /fundamental-research: the division's landing page, from the
    // Investment Philosophy & Research Process summary (October 2026)
    about: {
      hero: {
        eyebrow: "Fundamental Research",
        title: "Quality businesses, researched until we can defend the call.",
        body: "A student-run team that combines bottom-up company research with a top-down view of the economy. We cover equities and commodities directly, with macro as the lens that ties the two together.",
        primary: { label: "Read our research", href: "/fundamental-research/reports" },
        secondary: { label: "Join the team", href: "/get-involved" },
        // the hero's figure: a small Q-value grid with the target lit
        figure: "The Q-value grid: business quality on one axis, valuation on the other, with the high-quality, cheap quadrant highlighted as the target.",
      },
      who: {
        heading: "Who we are",
        body: [
          "University of Toronto Decision Systems (DSYS) uses mathematics to make better decisions under uncertainty. The club runs two research divisions: Quantitative Research and Fundamental Research.",
          "We work alongside the Quantitative Research division. Their screens can surface names for us to dig into, and our work in turn can inform their models. Our portfolio is long-only equities, with occasional trades in energy and metals.",
        ],
      },
      coverage: {
        heading: "Coverage",
        items: [
          {
            title: "Equities",
            body: "Companies and ADRs traded on the NYSE, NASDAQ, and TSX.",
          },
          {
            title: "Macro environment",
            body: "We don't trade macro, but we use it to inform our equity and commodity trades. We watch the macro environment in Canada and the United States.",
          },
          {
            title: "Commodities",
            body: "Energy and metals, focusing on the commodity drivers that matter most for the companies we cover, such as oil and silver.",
          },
        ],
      },
      philosophy: {
        heading: "Investment philosophy",
        items: [
          {
            title: "Focus",
            body: "We focus on two types of companies: quality compounders with irreplaceable moats, high compounding free cash flow, and structurally superior margins; and growth businesses driving genuine innovation, where we underwrite the path ahead of current profitability. Both are held to the same standard of valuation discipline.",
          },
          {
            title: "Mispricing",
            body: "We look for companies where price and business have come apart. A moat is still intact, but the stock sold off on short-term sentiment, or the market hasn't caught up to durable growth yet. Mispricing is the main setup and opportunity.",
          },
          {
            title: "Variant view",
            body: "Not every pitch needs to disagree with the market. A quality compounder at a fair price is still worth owning. But when the thesis is a mispriced business, it's only strong if we can say exactly where we disagree with the market and why we think we're right.",
          },
        ],
      },
      process: {
        heading: "Research process",
        intro:
          "Every idea goes through the same six steps. We choose companies bottom-up, on their own merits, then look at them from the economy down. A strong business is worth researching in any macro environment, but the macro view shapes when we make the call and how we frame it.",
        steps: [
          {
            title: "Idea screening",
            body: "The Q-value screen, earnings results, news flow, macro themes, and screens from the Quantitative Research division.",
          },
          {
            title: "Research, top-down",
            body: "From the economy, to the industry, to the company.",
            // the three layers, shown as a small chain under this step
            layers: [
              {
                title: "Macro",
                body: "Which macro forces matter for the company (rates, FX, commodity prices, the cycle) and which way they are moving.",
              },
              {
                title: "Industry",
                body: "How the industry is structured, who competes, and how those macro forces hit the sector.",
              },
              {
                title: "Company",
                body: "Qualitative and quantitative analysis, catalysts, and risks: why this business wins or loses.",
              },
            ],
          },
          {
            title: "Valuation",
            body: "A discounted cash flow model and comparable company analysis, plus precedent transactions where M&A is relevant. Bull, base, and bear cases are summarized in a football field.",
          },
          {
            title: "Thesis",
            body: "A written report in the DSYS template, including a Q-value scorecard.",
          },
          {
            title: "Review & publish",
            body: "The analyst pitches the idea to the team, and it is approved, sent back for more work, or dropped. Published calls are dated and include the entry price, price target, benchmark, and horizon.",
          },
          {
            title: "Monitor",
            body: "Each call is tracked on our website, and we review it after any significant catalyst to the core operations of the business.",
          },
        ],
      },
      qvalue: {
        heading: "The Q-value framework",
        intro:
          "Q-value is our main tool for screening ideas (step 1) and scoring them in every thesis (step 4). It is a guideline rather than a strict rule. It places every company on two axes, business quality and valuation, and we look for the top-right quadrant: high-quality businesses at cheap valuations.",
        axes: { cheap: "Cheap", expensive: "Expensive", lower: "Lower quality", higher: "Higher quality" },
        // read row by row: cheap first, lower quality on the left
        quadrants: [
          { title: "Value trap risk", body: "Weak business at a cheap price: ask why it is cheap.", tone: "warn" },
          { title: "Target", body: "High-quality business at a cheap price.", tone: "target" },
          { title: "Avoid", body: "Weak business at a high price.", tone: "avoid" },
          { title: "Watchlist", body: "Great business, already fully priced.", tone: "watch" },
        ],
        trapCheck: {
          title: "The value-trap check",
          body: "The data looks backward, but the market looks forward. When a company scores well on quality and still trades cheaply, we ask what the market sees that the numbers don't. If the discount reflects a real structural threat, it is a value trap and we pass. If the threat is overstated, that becomes our variant view.",
        },
        measures: [
          {
            title: "Measuring cheapness",
            body: "The easier half. We compare EV/EBIT, FCF yield, and P/E with sector peers and with the company's own history.",
          },
          {
            title: "Measuring quality",
            body: "The harder half, because two analysts can judge the same business differently. To keep that in check, most quality scores come from data: profitability, durability, growth, balance sheet strength, and earnings quality, plus an analyst-rated moat score. Each metric is ranked against the company's sector, then weighted.",
          },
        ],
      },
      accountability: {
        heading: "Accountability",
        items: [
          "We keep a public record of every call we publish, including the ones that don't work out.",
          "Each call on our website lists its publish date, entry price, price target, and time horizon.",
          "Portfolio returns are benchmarked annually against the S&P/TSX Composite (for Canadian-listed names) and the S&P 500 (for US-listed names), rather than reported in absolute terms.",
          "Any edits made to a report after publication are disclosed publicly.",
        ],
      },
      standards: {
        heading: "Research standards",
        items: [
          "We source every figure and list the source in the report. Facts are kept separate from opinion, and all estimates are labelled as estimates.",
          "We start with primary sources: company filings, earnings calls, and official economic data. News and other analysts' research can point us to questions, but never provide a number in our reports. All market data is dated.",
          "We show our assumptions. Every valuation sets out the inputs that drive it, including a sensitivity analysis.",
          "Before publishing, at least one other analyst reviews the report: testing the thesis, checking the numbers, and confirming it meets these standards.",
          "If we find an error after publishing, we correct it openly, with a dated note explaining what changed.",
        ],
      },
      join: {
        text: "See the calls we've published.",
        label: "Published reports",
        href: "/fundamental-research/reports",
      },
    },
    sampleNotice:
      "Sample reports shown for layout. Companies and figures are fictitious; first published coverage is in progress.",
    backLabel: "All reports",
    reportHeading: "Full report",
    reportPending: "The full write-up is being finalised and will be published here.",
    // shown when a call is published as its financial model rather than a write-up
    model: {
      title: "Full financial model",
      body: "The complete DCF in Excel: income statement, balance sheet and cash flow projections, cost of capital, and the valuation.",
      assumptionsHeading: "Key assumptions",
      methodsHeading: "How the target is set",
      blendLabel: "Blended DCF value",
      download: "Download the model (.xlsx)",
    },
    coverageHeading: "Coverage",
    // the small-card list of every report, under the carousel
    allHeading: "All reports",
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
      {
        slug: "rubrik",
        company: "Rubrik",
        ticker: "RBRK",
        exchange: "NYSE",
        sector: "Software / Cybersecurity",
        date: "2026-05-12",
        rating: "Buy",
        currency: "US$",
        priceAtPublication: 60.47,
        priceTarget: 78,
        horizon: "1-year",
        quoteSymbol: "RBRK",
        headline: "More AI, more data, more to protect",
        summary:
          "JPMorgan CEO Jamie Dimon says AI-driven cyber risk has “gone up 10-fold” since Anthropic’s Mythos, a model that can find software flaws faster than almost any human hacker and that reportedly breached real companies’ systems during safety testing. As these capabilities spread, breaches become a question of when, not if. Rubrik sells the recovery layer that brings companies back when defenses fail, and it trades ~23% below our DCF value.",
        analysts: ["Bosco Yu"],
        metrics: [
          { label: "Valuation", value: "DCF, 50/50 perpetuity / exit multiple" },
          { label: "Implied EV / FY27E revenue", value: "9.9x (market 7.6x)" },
          { label: "Expected IRR", value: "29%" },
          { label: "Holding period", value: "1 year" },
        ],
        pdf: null,
        // read off the model's Cover, WACC and DCF tabs
        model: {
          file: "/research/rubrik-dcf.xlsx",
          assumptions: [
            { label: "Cost of capital (WACC)", value: "9.7%" },
            { label: "Long-term growth after FY2040", value: "2.5%" },
            { label: "Exit multiple", value: "11x EBITDA" },
            { label: "Revenue growth, FY2026–FY2040", value: "13.9% a year" },
            { label: "Value from beyond FY2040", value: "49%" },
            { label: "Diluted shares", value: "228.4M" },
          ],
          methods: [
            { label: "DCF, long-term growth", price: 79.6297, weight: 0.5 },
            { label: "DCF, exit multiple", price: 76.8188, weight: 0.5 },
          ],
        },
      },
    ] as ResearchReport[],
  },
  // /quantitative-research: the desk's portfolio research, tested on past
  // data and then in paper trading. Kept deliberately short: the studies
  // (robust portfolios is the first; more may follow), each with its own
  // paper-trading setup, then the method and the reading list. References are numbered in the
  // order listed; a study's `reading` points at those numbers.
  quantResearch: {
    heading: "Quantitative research",
    // The page's opening story, for a visitor who has never heard of the desk,
    // beside a live figure: five years of daily sector-ETF returns, turned onto their principal components and whitened.
    story: {
      lede: "We build mathematical models that turn market data into portfolio decisions.",
      body: "Each study starts from a question raised in the academic literature. We test our answer on decades of historical data, after trading costs and against simple benchmarks, and then move it into paper trading, where it runs forward on markets it has never seen.",
      // read to screen readers only; the figure itself carries no text
      figure:
        "Five years of daily returns of Energy, Financials and Technology sector ETFs as a point cloud, rotated onto its principal components and whitened from an ellipsoid into a sphere.",
    },
    studies: {
      heading: "Studies",
      label: "Study",
      readLabel: "Read the study",
      backLabel: "Quantitative research",
      sections: {
        overview: "Overview",
        findings: "What the backtests found",
        results: "Backtest results by market",
        paper: "Paper trading",
        references: "References",
      },
      resultsColumns: ["Strategy", "Volatility", "Largest drawdown", "Sharpe ratio"],
      // labels the report's headline numbers as historical, not paper trading
      backtestLabel: "Backtest",
      // Each study is a report: what was asked, what was found, and how it
      // was tested. The method itself stays internal.
      items: [
        {
          slug: "robust-portfolios",
          name: "Robust portfolios",
          status: "Paper trading on Alpaca",
          question:
            "Robust portfolios are designed to account for errors in their forecasts. Can they lower risk without giving up risk-adjusted return?",
          finding:
            "In backtests, 10 to 13% less volatility than equal weighting in every market tested, with similar risk-adjusted returns.",
          overview: [
            "A portfolio optimiser relies on forecasts of how assets will behave, and those forecasts are always partly wrong. Standard optimisers treat them as exact, which tends to produce concentrated portfolios that perform poorly once the forecasts miss.",
            "A robust portfolio is built to remain sound when its forecasts are wrong. This study asks whether that design delivers a measurable benefit over two simple alternatives: holding every asset in equal weight, and holding the mix with the lowest forecast volatility.",
          ],
          figures: [
            { value: "53", unit: "years of data", label: "" },
            { value: "3", unit: "markets", label: "" },
            { value: "10–13%", unit: "", label: "less volatility than equal weighting" },
            { value: "0.1%", unit: "", label: "trading cost on every dollar traded" },
          ],
          findings: [
            "The robust portfolio was less volatile than equal weighting in all three markets, by 10 to 13%. The difference is statistically significant in each market (p < 0.001).",
            "Its largest loss was smaller in every market, by 6 to 7 percentage points.",
            "Its Sharpe ratio was slightly higher than equal weighting in all three markets. These differences are not statistically significant.",
            "The lowest-volatility portfolio reduced volatility further, by 17 to 26%, but held fewer assets: in sector ETFs its weight was spread across the equivalent of 3.4 funds, against 6.3 for the robust portfolio.",
          ],
          // From the research repo (results/phase2/risk_vol.json and the base
          // tables), net of 10 bp trading costs. `ratio` is volatility
          // relative to equal weighting, with its 95% interval.
          markets: [
            {
              name: "10 U.S. industries",
              period: "Jul 1973 – Aug 2026",
              rows: [
                { name: "Robust", vol: "13.6%", maxdd: "41.2%", sharpe: "0.57", ratio: 0.904, ci: [0.88, 0.93] },
                { name: "Lowest volatility", vol: "12.4%", maxdd: "34.4%", sharpe: "0.59", ratio: 0.827, ci: [0.79, 0.866] },
                { name: "Equal weighting", vol: "15.0%", maxdd: "48.1%", sharpe: "0.55", ratio: 1, ci: null },
              ],
            },
            {
              name: "48 U.S. industries",
              period: "Jul 1973 – Aug 2026",
              rows: [
                { name: "Robust", vol: "14.9%", maxdd: "46.5%", sharpe: "0.52", ratio: 0.882, ci: [0.852, 0.913] },
                { name: "Lowest volatility", vol: "12.6%", maxdd: "38.3%", sharpe: "0.56", ratio: 0.743, ci: [0.705, 0.783] },
                { name: "Equal weighting", vol: "16.9%", maxdd: "52.7%", sharpe: "0.51", ratio: 1, ci: null },
              ],
            },
            {
              name: "9 U.S. sector ETFs",
              period: "Jan 2004 – Aug 2026",
              rows: [
                { name: "Robust", vol: "12.4%", maxdd: "42.1%", sharpe: "0.73", ratio: 0.871, ci: [0.829, 0.921] },
                { name: "Lowest volatility", vol: "11.5%", maxdd: "37.2%", sharpe: "0.71", ratio: 0.808, ci: [0.752, 0.883] },
                { name: "Equal weighting", vol: "14.3%", maxdd: "49.2%", sharpe: "0.66", ratio: 1, ci: null },
              ],
            },
          ] as { name: string; period: string; rows: { name: string; vol: string; maxdd: string; sharpe: string; ratio: number; ci: number[] | null }[] }[],
          charts: {
            ratio: {
              title: "Backtested volatility relative to equal weighting",
              caption: "Lines show 95% confidence intervals. Below 100% means less volatile than equal weighting.",
            },
            growth: {
              title: "Backtested growth of $10,000 in nine U.S. sector ETFs",
              caption:
                "Equal weighting finished slightly ahead. The robust portfolio fell less in 2008 (42% against 49%) and in 2020 (18% against 24%), and more in 2022 (20% against 16%).",
              drawdownLabel: "Decline from previous high",
            },
          },
          paper: {
            intro: "Following historical testing, the study is now forward testing in an Alpaca paper trading account. The first monthly rebalance was placed on 2 November 2026.",
            broker: "Alpaca",
            start: "2 November 2026",
            terms: [
              { label: "Broker", value: "Alpaca paper trading" },
              { label: "Assets", value: "Nine U.S. sector ETFs" },
              { label: "Capital", value: "$100,000 simulated per strategy" },
              { label: "Rebalancing", value: "Monthly" },
            ],
            status: "Live since 2 November 2026",
          },
          reading: [9, 4, 7],
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
