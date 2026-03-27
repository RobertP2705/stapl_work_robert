"use client";

import { useState } from "react";
import { researchPapers } from "@/lib/stapl-data";
import { FileText, Calendar, Users, Tag, ExternalLink, Filter } from "lucide-react";

const allTags = [...new Set(researchPapers.flatMap((p) => p.tags))];

export default function PapersPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"year" | "title">("year");

  const filteredPapers = researchPapers
    .filter((paper) =>
      selectedTags.length === 0 ||
      selectedTags.some((tag) => paper.tags.includes(tag))
    )
    .sort((a, b) => {
      if (sortBy === "year") return b.year - a.year;
      return a.title.localeCompare(b.title);
    });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Research Papers</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Academic publications on STAPL from leading parallel computing conferences
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filter by topic:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                selectedTags.includes(tag)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        {selectedTags.length > 0 && (
          <button
            onClick={() => setSelectedTags([])}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Sort */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {filteredPapers.length} paper{filteredPapers.length !== 1 ? "s" : ""}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort:</span>
          <div className="flex rounded-lg border border-border bg-card p-1">
            <button
              onClick={() => setSortBy("year")}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                sortBy === "year"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Year
            </button>
            <button
              onClick={() => setSortBy("title")}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                sortBy === "title"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Title
            </button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative space-y-6">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 h-full w-0.5 bg-border lg:left-1/2 lg:-ml-0.5" />

        {filteredPapers.map((paper, index) => (
          <div
            key={paper.id}
            className={`relative flex flex-col lg:flex-row ${
              index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
            }`}
          >
            {/* Timeline dot */}
            <div className="absolute left-4 -ml-2 h-4 w-4 rounded-full border-2 border-primary bg-background lg:left-1/2" />

            {/* Content */}
            <div className={`ml-12 lg:ml-0 lg:w-1/2 ${index % 2 === 0 ? "lg:pr-12" : "lg:pl-12"}`}>
              <div className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg">
                {/* Year badge */}
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    <Calendar className="h-3 w-3" />
                    {paper.year}
                  </span>
                  <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {paper.venue}
                  </span>
                </div>

                {/* Title */}
                <h3 className="flex items-start gap-2 font-semibold text-foreground">
                  <FileText className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  {paper.title}
                </h3>

                {/* Authors */}
                <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-3 w-3" />
                  {paper.authors.join(", ")}
                </div>

                {/* Abstract */}
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {paper.abstract}
                </p>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Tag className="h-3 w-3 text-muted-foreground" />
                  {paper.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Link */}
                {paper.link && (
                  <a
                    href={paper.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    Read Paper
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No results */}
      {filteredPapers.length === 0 && (
        <div className="py-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-muted-foreground">
            No papers match your selected filters
          </p>
          <button
            onClick={() => setSelectedTags([])}
            className="mt-2 text-sm text-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
