import { DistributedMemoryViz } from "@/components/visualizations/distributed-memory-viz";
import { SkeletonCompositionViz } from "@/components/visualizations/skeleton-composition-viz";
import { DataDistributionViz } from "@/components/visualizations/data-distribution-viz";

export const metadata = {
  title: "Memory Model - STAPL Framework",
  description: "Interactive visualizations of STAPL distributed memory concepts",
};

export default function MemoryModelPage() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Memory Model</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Explore how STAPL distributes data and computation across locations
        </p>
      </div>

      {/* Distributed Memory Visualization */}
      <section className="mb-12">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Distributed Ownership Model
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Drag nodes to explore. Each location owns a partition of data and can communicate with others.
          </p>
        </div>
        <DistributedMemoryViz />
      </section>

      {/* Data Distribution Strategies */}
      <section className="mb-12">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Distribution Strategies
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Compare block, cyclic, and block-cyclic distributions
          </p>
        </div>
        <DataDistributionViz />
      </section>

      {/* Skeleton Composition */}
      <section className="mb-12">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Skeleton Composition: Map then Reduce
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Step through how map and reduce skeletons compose to process distributed data
          </p>
        </div>
        <SkeletonCompositionViz />
      </section>

      {/* Concepts Summary */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground">Locations</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Abstract processing units that own data partitions. Can map to threads, 
            processes, or hybrid configurations.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground">Data Partitioning</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            pContainers automatically distribute elements across locations using 
            configurable distribution strategies.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground">Communication</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            RMI (Remote Method Invocation) enables transparent communication 
            between locations when needed.
          </p>
        </div>
      </section>
    </div>
  );
}
