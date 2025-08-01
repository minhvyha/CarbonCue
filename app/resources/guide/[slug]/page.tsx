import { notFound } from 'next/navigation';
import { headers } from 'next/headers';

interface IBlock {
  type: 'heading' | 'paragraph' | 'video' | 'list' | 'quote' | 'divider' | 'iframe';
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
  authors: string[];
}

export const dynamic = 'force-dynamic';

// Convert raw guide data into renderable blocks
function mapGuideToBlocks(guide: RawGuide): IBlock[] {
  const blocks: IBlock[] = [];
  blocks.push({ type: 'paragraph', text: guide.description || '' });
  if (guide.presentationLink) {
    blocks.push({ type: 'iframe', url: guide.presentationLink });
  }
  return blocks;
}

// Server Component: await params promise
export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Retrieve request host dynamically
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const apiUrl = new URL(`/api/resources/guide/${encodeURIComponent(slug)}`, `${protocol}://${host}`);

  const res = await fetch(apiUrl.toString(), { cache: 'no-store' });
  if (!res.ok) {
    notFound();
  }

  const guide: RawGuide = await res.json();
  const blocks = mapGuideToBlocks(guide);

  return (
    <article className="max-w-3xl mx-auto px-4 py-4">
      <h1 className="text-4xl font-extrabold mb-2 text-center text-primary">
        {guide.title}
      </h1>
      {/* Display authors if available */}
      {guide.authors && guide.authors.length > 0 && (
        <p className=" text-center text-foreground text-lg my-4 font-bold">
          By: {guide.authors.join(', ')}
        </p>
      )}

      {blocks.map((block, i) => {
        if (block.type === 'paragraph') {
          return (
            <p key={i} className="mt-4 text-base leading-relaxed text-foreground">
              {block.text}
            </p>
          );
        }

        if (block.type === 'iframe') {
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
        }

        return null;
      })}
    </article>
  );
}
