import content from "@/lib/content";

export default function Footer() {
  return (
    <footer className="relative border-t border-navy/10 bg-offwhite/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-navy">{content.brand.full}</p>
          <a
            href={`mailto:${content.contact.email}`}
            className="text-sm text-navy/70 transition hover:text-navy"
          >
            {content.contact.email}
          </a>
        </div>
        <div className="flex gap-5">
          {content.contact.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="text-sm text-navy/70 transition hover:text-navy"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
