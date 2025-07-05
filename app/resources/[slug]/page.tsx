// app/resources/guides/[slug]/page.tsx
import { notFound } from 'next/navigation';

type BlockType = 
  | 'heading'
  | 'paragraph'
  | 'video'
  | 'list'
  | 'quote'
  | 'divider';

interface IBlock {
  type: BlockType;
  label?: string;
  text?: string;
  url?: string;
  items?: string[];
}

interface Guide {
  slug: string;
  title: string;
  author: string;
  blocks: IBlock[];
}

interface PageProps {
  params: { slug: string };
}

export const dynamic = 'force-dynamic';

export default async function GuidePage(props: PageProps) {
  // 1) await params before destructuring
  const { slug } = await props.params;

  // 2) build an absolute URL (use your VERCEL_URL env in prod)
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

  // 3) fetch the guide
  console.log(baseUrl)
  const res = await fetch(
    `${baseUrl}/api/resources/${slug}`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    notFound();
  }
  const guide: Guide = await res.json();
  console.log(guide)

  // 4) render by mapping over blocks
  return (
    <article className="prose lg:prose-xl mx-auto p-6">
      <h1>{guide.title}</h1>

      {guide.blocks.map((block, i) => {
        switch (block.type) {
          case 'heading':
            return (
              <h2 key={i} className="mt-8">
                {block.label}
              </h2>
            );

          case 'paragraph':
            return (
              <p key={i} className="mt-4">
                {block.text}
              </p>
            );

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

          case 'quote':
            return (
              <blockquote key={i} className="border-l-4 pl-4 italic mt-6">
                {block.text}
                {block.label && <footer className="mt-2">— {block.label}</footer>}
              </blockquote>
            );

          case 'divider':
            return <hr key={i} className="my-8" />;

          default:
            return null;
        }
      })}
    </article>
  );
}
