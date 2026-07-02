import ComingSoon from "@/components/ComingSoon";
import content from "@/lib/content";

export const metadata = {
  title: "Blog — UofT Decision Systems",
};

export default function BlogPage() {
  return (
    <ComingSoon
      title={content.pages.blog.title}
      body={content.pages.blog.body}
    />
  );
}
