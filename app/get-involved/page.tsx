import PageShell from "@/components/PageShell";
import ContactForm from "@/components/ContactForm";
import content from "@/lib/content";

export const metadata = {
  title: "Get Involved — UofT Decision Systems",
  description:
    "Join UofT Decision Systems or send us a message. Open to students across every faculty.",
};

export default function GetInvolvedPage() {
  return (
    <PageShell>
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-semibold tracking-tight text-navy">
          {content.getInvolved.heading}
        </h1>
        <p className="mt-5 text-base leading-relaxed text-navy/75">
          {content.getInvolved.intro}
        </p>
        <a
          href={`mailto:${content.contact.email}`}
          className="mt-4 inline-block text-sm font-medium text-navy underline decoration-navy/30 underline-offset-4 transition hover:decoration-navy"
        >
          {content.contact.email}
        </a>

        <div className="mt-10 rounded-3xl border border-navy/10 bg-white/50 p-6 backdrop-blur-sm md:p-8">
          <ContactForm />
        </div>
      </div>
    </PageShell>
  );
}
