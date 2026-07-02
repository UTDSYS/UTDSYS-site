import ComingSoon from "@/components/ComingSoon";
import content from "@/lib/content";

export const metadata = {
  title: "Team — UofT Decision Systems",
};

export default function TeamPage() {
  return (
    <ComingSoon
      title={content.pages.team.title}
      body={content.pages.team.body}
    />
  );
}
