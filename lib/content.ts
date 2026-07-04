const content = {
  brand: {
    name: "UTDSYS",
    full: "University of Toronto Decision Systems",
  },
  // The hero: a neural network builds itself on load and converges into the
  // wordmark; the two CTAs are the site's primary paths.
  hero: {
    mission: "A student design team building intelligent decision systems.",
    primary: { label: "Get involved", href: "/get-involved" },
    secondary: { label: "Project gallery", href: "/projects" },
  },
  nav: {
    links: [
      { label: "Projects", href: "/projects" },
      { label: "Team", href: "/team" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
      { label: "Get Involved", href: "/get-involved" },
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
          href: "https://discord.gg/FAA2fUpNnT",
        },
      },
    },
  },
  // The /projects gallery. Projects are commented out for now — the page
  // shows a "coming soon" state (see pages.projects). Restore these items
  // (and the gallery in app/projects/page.tsx) when the work is ready.
  projects: {
    eyebrow: "Selected work",
    heading: "Projects",
    intro:
      "What the team builds: decision systems that turn messy, uncertain inputs into one confident call. A sample of current and past work.",
    items: [
      // {
      //   name: "Aegis",
      //   status: "Active",
      //   summary:
      //     "A Bayesian risk engine that scores live sensor streams and flags anomalies before they cascade.",
      //   tags: ["Bayesian inference", "Streaming", "Rust"],
      // },
      // {
      //   name: "Compass",
      //   status: "Prototype",
      //   summary:
      //     "A planning agent that weighs cost, time, and uncertainty to recommend a single, explainable route.",
      //   tags: ["Reinforcement learning", "Optimization"],
      // },
      // {
      //   name: "Ledger",
      //   status: "Research",
      //   summary:
      //     "An interpretable decision model that attaches a plain-language reason code to every outcome.",
      //   tags: ["Interpretability", "Python"],
      // },
      // {
      //   name: "Atlas",
      //   status: "Archived",
      //   summary:
      //     "A simulation sandbox for stress-testing policies against thousands of synthetic futures.",
      //   tags: ["Monte Carlo", "Simulation"],
      // },
    ],
  },
  // "Coming soon" placeholder pages.
  pages: {
    projects: {
      title: "Projects",
      body: "Case studies and project write-ups are on the way. We're heads-down building decision systems — check back soon.",
    },
    team: {
      title: "Team",
      body: "Meet the people behind Decision Systems. Profiles are on the way — check back soon.",
    },
    blog: {
      title: "Blog",
      body: "Notes, write-ups, and project deep-dives from the team. Our first posts are coming soon.",
    },
  },
  contact: {
    email: "info@utdsys.com",
    // Directories surfaced in the hero strip; the full set lives on /contact.
    socials: [
      { label: "Discord", href: "https://discord.gg/FAA2fUpNnT" },
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
        href: "https://discord.gg/FAA2fUpNnT",
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
