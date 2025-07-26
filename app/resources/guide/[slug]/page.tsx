import { notFound } from "next/navigation";

type BlockType =
  | "heading"
  | "paragraph"
  | "video"
  | "list"
  | "quote"
  | "divider"
  | "iframe";

interface IBlock {
  type: BlockType;
  label?: string;
  text?: string;
  url?: string;
  items?: string[];
}

interface RawGuide {
  slug: string;
  title: string;
  description: string;
  presentationLink?: string;
  contents: unknown[];
  type: string;
  createdAt: { $date: { $numberLong: string } };
  updatedAt: { $date: { $numberLong: string } };
}

interface PageProps {
  params: { slug: string };
}

export const dynamic = "force-dynamic";

// Convert raw guide data into renderable blocks
function mapGuideToBlocks(guide: RawGuide): IBlock[] {
  const blocks: IBlock[] = [];

  // Description
  blocks.push({ type: "paragraph", text: guide.description });

  // Embedded presentation
  if (guide.presentationLink) {
    blocks.push({ type: "iframe", url: guide.presentationLink });
  }

  return blocks;
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = params;
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/resources/guide/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) notFound();
  const guide: RawGuide = await res.json();
  const blocks = mapGuideToBlocks(guide);

  return (
    <article className="max-w-3xl mx-auto px-4 py-4">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-primary">
        {guide.title}
      </h1>

      {blocks.map((block, i) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p key={i} className="mt-4 text-base leading-relaxed text-foreground">
                {block.text}
              </p>
            );

          case "iframe":
            // Canva embed container
            return (
              <div
                key={i}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 0,
                  paddingTop: '56.25%',
                  boxShadow: '0 2px 8px 0 rgba(63,69,81,0.16)',
                  marginTop: '1.6em',
                  marginBottom: '0.9em',
                  overflow: 'hidden',
                  borderRadius: '8px',
                  willChange: 'transform',
                }}
              >
                <iframe
                  loading="lazy"
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    border: 'none',
                    padding: 0,
                    margin: 0,
                  }}
                  src={`${block.url}?embed`}
                  allowFullScreen
                  allow="fullscreen"
                />
              </div>
            );

          default:
            return null;
        }
      })}
    </article>
  );
}
