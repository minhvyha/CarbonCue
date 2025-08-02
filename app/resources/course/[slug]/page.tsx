// app/resources/guides/[slug]/page.tsx
import { notFound } from "next/navigation";

type BlockType =
  | "heading"
  | "paragraph"
  | "video"
  | "list"
  | "quote"
  | "divider";

interface IBlock {
  type: BlockType;
  label?: string;
  text?: string;
  url?: string;
  items?: string[];
}

interface RawSection {
  heading: string;
  items: string[];
}

interface RawContentItem {
  order: { $numberInt: string };
  title: string;
  description: string;
  takeaways: string[];
  youtubeUrl: string | null;
}

interface RawGuide {
  slug: string;
  title: string;
  intro: string;
  sections: RawSection[];
  conclusion: string;
  authors: string[];
  contents: RawContentItem[];
}

interface PageProps {
  params: { slug: string };
}

export const dynamic = "force-dynamic";

// Convert raw guide data into renderable blocks
function mapGuideToBlocks(guide: RawGuide): IBlock[] {
  const blocks: IBlock[] = [];

  // Intro
  blocks.push({ type: "paragraph", text: guide.intro });


  // Main content sections
  guide.contents
    .sort((a, b) => Number(a.order.$numberInt) - Number(b.order.$numberInt))
    .forEach((item) => {
      blocks.push({ type: "heading", label: item.title });
      blocks.push({ type: "paragraph", text: item.description });
      if (item.youtubeUrl) {
        blocks.push({
          type: "video",
          label: item.title,
          url: item.youtubeUrl.replace("watch?v=", "embed/"),
        });
      }
      blocks.push({ type: "list", items: item.takeaways });
      blocks.push({ type: "divider" });
    });

  // Additional resources
  guide.sections.forEach((sec) => {
    blocks.push({ type: "heading", label: sec.heading });
    blocks.push({ type: "list", items: sec.items });
  });

  // Conclusion
  blocks.push({ type: "paragraph", text: guide.conclusion });
  return blocks;
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/resources/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) notFound();
  const guide: RawGuide = await res.json();
  const blocks = mapGuideToBlocks(guide);

  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-primary">
        {guide.title}
      </h1>
      {/* Display authors if available */}
      {guide.authors && guide.authors.length > 0 && (
        <p className=" text-center text-foreground text-lg mt-2 mb-6 font-bold">
          By: {guide.authors.join(', ')}
        </p>
      )}

      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <h2
                key={i}
                className="mt-10 text-2xl font-semibold text-secondary"
              >
                {block.label}
              </h2>
            );

          case "paragraph":
            return (
              <p
                key={i}
                className="mt-4 text-base leading-relaxed text-foreground"
              >
                {block.text}
              </p>
            );

          case "video":
            return (
              <div key={i} className="mt-6">
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    width={560}
                    height={315}
                    className=" rounded-lg shadow-lg"
                    src={block.url}
                    title={block.label}
                    allowFullScreen
                  />

                </div>
                {block.label && (
                  <p className="italic mt-2 text-muted-foreground text-sm">
                    {block.label}
                  </p>
                )}
              </div>
            );

          case "list":
            return (
              <ul
                key={i}
                className="list-disc list-inside mt-4 space-y-2 text-foreground"
              >
                {block.items?.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );

          case "quote":
            return (
              <blockquote
                key={i}
                className="border-l-4 border-secondary bg-muted pl-4 italic mt-6 p-4 rounded-md"
              >
                {block.text}
                {block.label && (
                  <footer className="mt-2">— {block.label}</footer>
                )}
              </blockquote>
            );

          case "divider":
            return <hr key={i} className="border-t border-muted my-8" />;

          default:
            return null;
        }
      })}
    </article>
  );
}
