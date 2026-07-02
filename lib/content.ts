const content = {
  brand: {
    name: "DSys",
    full: "UofT Decision Systems",
  },
  landing: {
    tagline: "UofT · Decision Systems",
    scrollCue: "Scroll ↓",
  },
  // The single home/intro section revealed by the neural-network transition.
  intro: {
    headline:
      "A student design team at UofT building intelligent decision systems.",
    subhead:
      "We design, prototype, and ship data-driven systems that help people make better decisions — and we teach each other how along the way.",
    cta: { label: "Get Involved", href: "/get-involved" },
  },
  nav: {
    links: [
      { label: "Team", href: "/team" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/get-involved" },
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
    },
  },
  // "Coming soon" placeholder pages.
  pages: {
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
    email: "hello@utdsys.ca",
    socials: [
      { label: "Instagram", href: "#" },
      { label: "LinkedIn", href: "#" },
      { label: "GitHub", href: "#" },
    ],
  },
} as const;

export default content;
