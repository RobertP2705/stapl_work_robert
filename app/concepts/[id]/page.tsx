import { notFound } from "next/navigation";
import Link from "next/link";
import { concepts } from "@/lib/stapl-data";
import { CodeBlock } from "@/components/code-block";
import { ArrowLeft, ArrowRight, BookOpen, Code2, Link2 } from "lucide-react";

export async function generateStaticParams() {
  return concepts.map((concept) => ({
    id: concept.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const concept = concepts.find((c) => c.id === id);
  
  if (!concept) {
    return { title: "Not Found" };
  }

  return {
    title: `${concept.title} - STAPL Framework`,
    description: concept.shortDescription,
  };
}

export default async function ConceptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const concept = concepts.find((c) => c.id === id);

  if (!concept) {
    notFound();
  }

  const currentIndex = concepts.findIndex((c) => c.id === id);
  const prevConcept = currentIndex > 0 ? concepts[currentIndex - 1] : null;
  const nextConcept = currentIndex < concepts.length - 1 ? concepts[currentIndex + 1] : null;

  const relatedConcepts = concept.relatedConcepts
    .map((relId) => concepts.find((c) => c.id === relId))
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/concepts" className="hover:text-foreground">
          Concepts
        </Link>
        <span>/</span>
        <span className="text-foreground">{concept.title}</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary capitalize">
            {concept.category}
          </span>
          {concept.cppEquivalent && (
            <span className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
              <Code2 className="h-3 w-3" />
              C++: {concept.cppEquivalent}
            </span>
          )}
        </div>
        <h1 className="mt-4 text-3xl font-bold text-foreground">{concept.title}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{concept.shortDescription}</p>
      </header>

      {/* Full description */}
      <section className="mb-8">
        <div className="prose prose-invert max-w-none">
          {concept.fullDescription.split("\n\n").map((paragraph, i) => {
            if (paragraph.startsWith("-")) {
              const items = paragraph.split("\n").filter((l) => l.startsWith("-"));
              return (
                <ul key={i} className="my-4 space-y-2">
                  {items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-muted-foreground">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {item.replace(/^-\s*/, "")}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={i} className="text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>
      </section>

      {/* Code example */}
      {concept.codeExample && (
        <section className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <Code2 className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Code Example</h2>
          </div>
          <CodeBlock code={concept.codeExample} language="cpp" />
        </section>
      )}

      {/* Related concepts */}
      {relatedConcepts.length > 0 && (
        <section className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <Link2 className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Related Concepts</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {relatedConcepts.map((rel) => (
              <Link
                key={rel!.id}
                href={`/concepts/${rel!.id}`}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm transition-colors hover:border-primary/50 hover:bg-accent"
              >
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-foreground">{rel!.title}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Navigation */}
      <nav className="flex items-center justify-between border-t border-border pt-6">
        {prevConcept ? (
          <Link
            href={`/concepts/${prevConcept.id}`}
            className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>{prevConcept.title}</span>
          </Link>
        ) : (
          <div />
        )}
        {nextConcept && (
          <Link
            href={`/concepts/${nextConcept.id}`}
            className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <span>{nextConcept.title}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </nav>
    </div>
  );
}
