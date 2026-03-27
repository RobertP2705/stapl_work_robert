import { cppToStaplMapping, concepts } from "@/lib/stapl-data";
import Link from "next/link";
import { ArrowRight, Code2, Repeat } from "lucide-react";

export const metadata = {
  title: "C++ to STAPL Mapping - STAPL Framework",
  description: "See how familiar C++ STL concepts map to STAPL parallel equivalents",
};

export default function CppMappingPage() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">C++ to STAPL Mapping</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          STAPL extends familiar STL concepts to distributed parallel computing
        </p>
      </div>

      {/* Philosophy section */}
      <section className="mb-10 rounded-xl border border-border bg-gradient-to-r from-primary/5 to-transparent p-6">
        <h2 className="text-xl font-semibold text-foreground">Design Philosophy</h2>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          STAPL mirrors the structure and interface of the C++ Standard Template Library, 
          making it easier for C++ programmers to adopt parallel programming. The key 
          insight is that the same abstractions (containers, iterators/views, algorithms) 
          work at the parallel level with minimal changes to the programming model.
        </p>
      </section>

      {/* Mapping table */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Quick Reference Table
        </h2>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  C++ STL
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  STAPL Equivalent
                </th>
                <th className="hidden px-4 py-3 text-left text-sm font-semibold text-foreground md:table-cell">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {cppToStaplMapping.map((mapping, i) => (
                <tr key={i} className="bg-card transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <code className="rounded bg-muted px-2 py-1 font-mono text-sm text-foreground">
                      {mapping.cpp}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="rounded bg-primary/10 px-2 py-1 font-mono text-sm text-primary">
                      {mapping.stapl}
                    </code>
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">
                    {mapping.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Key differences */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Key Differences from STL
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-1/10">
                <Code2 className="h-4 w-4 text-chart-1" />
              </div>
              <h3 className="font-semibold text-foreground">Distributed Data</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              pContainers automatically partition data across locations. 
              You create them like STL containers, but elements are distributed transparently.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-2/10">
                <Repeat className="h-4 w-4 text-chart-2" />
              </div>
              <h3 className="font-semibold text-foreground">Views vs Iterators</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              STAPL uses pViews instead of iterators. Views provide more powerful 
              abstraction, supporting lazy evaluation and complex compositions.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-3/10">
                <ArrowRight className="h-4 w-4 text-chart-3" />
              </div>
              <h3 className="font-semibold text-foreground">Implicit Parallelism</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Calling a STAPL algorithm automatically creates a PARAGRAPH for parallel 
              execution. No explicit thread management or message passing required.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-4/10">
                <Code2 className="h-4 w-4 text-chart-4" />
              </div>
              <h3 className="font-semibold text-foreground">Serializable Functors</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Work functions must be serializable for distribution to remote locations. 
              This affects how you write lambdas and function objects.
            </p>
          </div>
        </div>
      </section>

      {/* Code comparison */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Side-by-Side Comparison
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {/* STL Code */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="border-b border-border bg-muted/50 px-4 py-2">
              <span className="text-sm font-medium text-muted-foreground">
                C++ STL (Sequential)
              </span>
            </div>
            <pre className="overflow-x-auto p-4">
              <code className="text-sm text-foreground">
{`std::vector<int> v(1000);

// Fill with sequence
std::iota(v.begin(), v.end(), 0);

// Transform (square each)
std::transform(v.begin(), v.end(), 
               v.begin(),
               [](int x) { return x * x; });

// Reduce (sum)
int sum = std::accumulate(
    v.begin(), v.end(), 0);`}
              </code>
            </pre>
          </div>

          {/* STAPL Code */}
          <div className="rounded-xl border border-primary/30 bg-card overflow-hidden">
            <div className="border-b border-primary/30 bg-primary/5 px-4 py-2">
              <span className="text-sm font-medium text-primary">
                STAPL (Parallel)
              </span>
            </div>
            <pre className="overflow-x-auto p-4">
              <code className="text-sm text-foreground">
{`stapl::array<int> arr(1000);
auto view = stapl::make_array_view(arr);

// Fill with sequence (parallel)
stapl::generate(view, 
                stapl::sequence<int>(0));

// Transform (parallel map)
stapl::transform(view, view,
                 [](int x) { return x * x; });

// Reduce (parallel reduction)
int sum = stapl::accumulate(view, 0);`}
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Learn more links */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Explore Related Concepts
        </h2>
        <div className="flex flex-wrap gap-3">
          {concepts.slice(0, 5).map((concept) => (
            <Link
              key={concept.id}
              href={`/concepts/${concept.id}`}
              className="group flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm transition-colors hover:border-primary/50 hover:bg-accent"
            >
              <span className="font-medium text-foreground">{concept.title}</span>
              <ArrowRight className="h-3 w-3 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
