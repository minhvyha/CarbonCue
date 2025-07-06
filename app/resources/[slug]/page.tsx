// app/resources/guides/[slug]/page.tsx
import { notFound } from 'next/navigation';

type BlockType = 'heading' | 'paragraph' | 'video' | 'list' | 'quote' | 'divider';

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
  playlistUrl: string;
  sections: RawSection[];
  conclusion: string;
  contents: RawContentItem[];
}

interface PageProps {
  params: { slug: string };
}

export const dynamic = 'force-dynamic';

// helper to convert raw guide object into an array of IBlock
function mapGuideToBlocks(guide: RawGuide): IBlock[] {
  const blocks: IBlock[] = [];

  // Intro paragraph
  blocks.push({ type: 'paragraph', text: guide.intro });

  // Playlist embed as video block
  blocks.push({
    type: 'video',
    label: 'CrashCourse Climate & Energy Playlist',
    url: guide.playlistUrl.replace('watch?v=', 'embed/'),
  });

  // Iterate contents in order
  guide.contents
    .sort((a, b) => Number(a.order.$numberInt) - Number(b.order.$numberInt))
    .forEach((item, idx) => {
      // Section heading
      blocks.push({ type: 'heading', label: item.title });

      // Description paragraph
      blocks.push({ type: 'paragraph', text: item.description });

      // If video link exists, embed
      if (item.youtubeUrl) {
        blocks.push({
          type: 'video',
          label: item.title,
          url: item.youtubeUrl.replace('watch?v=', 'embed/'),
        });
      }

      // List of takeaways
      blocks.push({ type: 'list', items: item.takeaways });

      // Divider between sections
      blocks.push({ type: 'divider' });
    });

  // Further static sections from guide.sections
  guide.sections.forEach(sec => {
    blocks.push({ type: 'heading', label: sec.heading });
    blocks.push({ type: 'list', items: sec.items });
  });

  // Conclusion
  blocks.push({ type: 'paragraph', text: guide.conclusion });

  return blocks;
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;

  // Determine base URL
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

  const res = await fetch(
    `${baseUrl}/api/resources/${slug}`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    notFound();
  }

  const guide: RawGuide = await res.json();
  const blocks = mapGuideToBlocks(guide);

  return (
    <article className="prose lg:prose-xl mx-auto p-6">
      <h1>{guide.title}</h1>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'heading':
            return <h2 key={i} className="mt-8">{block.label}</h2>;
          case 'paragraph':
            return <p key={i} className="mt-4">{block.text}</p>;
          case 'video':
            return (
              <div key={i} className="mt-6">
                <iframe
                  src={block.url}
                  title={block.label}
                  width="560"
                  height="315"
                  allowFullScreen
                />
                {block.label && <p className="italic mt-2">{block.label}</p>}
              </div>
            );
          case 'list':
            return (
              <ul key={i} className="list-disc list-inside mt-4">
                {block.items?.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );
          case 'divider':
            return <hr key={i} className="my-8" />;
          case 'quote':
            return (
              <blockquote key={i} className="border-l-4 pl-4 italic mt-6">
                {block.text}
                {block.label && <footer className="mt-2">— {block.label}</footer>}
              </blockquote>
            );
          default:
            return null;
        }
      })}
    </article>
  );
}
