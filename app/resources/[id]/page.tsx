// app/resources/guides/[id]/page.tsx
import { notFound } from 'next/navigation';

interface Guide {
  id: string;
  title: string;
  content: string;
}

interface PageProps {
  params: { id: string };
}

export default async function GuidePage({ params }: PageProps) {
  const { id } = params;

  // fetch your guide (use a slug rather than a space‑containing name)
  const res = await fetch(`https://.../api/guides/${id}`, {
    // by default this will cache; if you want always‑fresh, use:
    // cache: 'no-store',
  });
  if (!res.ok) {
    // return a 404 at runtime if the guide doesn’t exist
    notFound();
  }
  const guide: Guide = await res.json();

  return (
    <article className="p-6">
      <h1 className="text-3xl font-bold mb-4">{guide.title}</h1>
      <p className="text-gray-600 mb-6">ID: {guide.id}</p>
      <div dangerouslySetInnerHTML={{ __html: guide.content }} />
    </article>
  );
}
