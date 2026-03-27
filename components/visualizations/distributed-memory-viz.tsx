"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";

interface Node {
  id: string;
  label: string;
  type: "location" | "data";
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface Link {
  source: string | Node;
  target: string | Node;
  type: "owns" | "communicates";
}

const initialNodes: Node[] = [
  { id: "loc0", label: "Location 0", type: "location" },
  { id: "loc1", label: "Location 1", type: "location" },
  { id: "loc2", label: "Location 2", type: "location" },
  { id: "loc3", label: "Location 3", type: "location" },
  { id: "data0", label: "[0..249]", type: "data" },
  { id: "data1", label: "[250..499]", type: "data" },
  { id: "data2", label: "[500..749]", type: "data" },
  { id: "data3", label: "[750..999]", type: "data" },
];

const initialLinks: Link[] = [
  { source: "loc0", target: "data0", type: "owns" },
  { source: "loc1", target: "data1", type: "owns" },
  { source: "loc2", target: "data2", type: "owns" },
  { source: "loc3", target: "data3", type: "owns" },
  { source: "loc0", target: "loc1", type: "communicates" },
  { source: "loc1", target: "loc2", type: "communicates" },
  { source: "loc2", target: "loc3", type: "communicates" },
  { source: "loc3", target: "loc0", type: "communicates" },
];

export function DistributedMemoryViz() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showCommunication, setShowCommunication] = useState(true);

  const initGraph = useCallback(() => {
    const svg = d3.select(svgRef.current);
    const width = svgRef.current?.clientWidth || 800;
    const height = 500;

    svg.selectAll("*").remove();

    // Deep clone nodes and links
    const nodes: Node[] = initialNodes.map(n => ({ ...n }));
    const links: Link[] = initialLinks
      .filter(l => showCommunication || l.type === "owns")
      .map(l => ({ ...l }));

    // Define arrow markers
    svg.append("defs").selectAll("marker")
      .data(["communicates", "owns"])
      .join("marker")
      .attr("id", d => `arrow-${d}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", d => d === "owns" ? "#0ea5e9" : "#64748b")
      .attr("d", "M0,-5L10,0L0,5");

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: unknown) => (d as Node).id).distance(100))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(40));

    // Links
    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", d => d.type === "owns" ? "#0ea5e9" : "#64748b")
      .attr("stroke-opacity", d => d.type === "owns" ? 0.8 : 0.4)
      .attr("stroke-width", d => d.type === "owns" ? 2 : 1)
      .attr("stroke-dasharray", d => d.type === "communicates" ? "4,4" : "0")
      .attr("marker-end", d => `url(#arrow-${d.type})`);

    // Node groups
    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "grab")
      .call(d3.drag<SVGGElement, Node>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    // Node circles
    node.append("circle")
      .attr("r", d => d.type === "location" ? 28 : 22)
      .attr("fill", d => d.type === "location" ? "#1e293b" : "#0f172a")
      .attr("stroke", d => {
        if (d.type === "location") {
          const colors = ["#0ea5e9", "#22c55e", "#eab308", "#a855f7"];
          return colors[parseInt(d.id.replace("loc", "")) % 4];
        }
        return "#0ea5e9";
      })
      .attr("stroke-width", 2)
      .on("click", (_, d) => setSelectedNode(d));

    // Node labels
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", d => d.type === "location" ? "0.35em" : "0.35em")
      .attr("fill", "#e2e8f0")
      .attr("font-size", d => d.type === "location" ? "11px" : "10px")
      .attr("font-weight", d => d.type === "location" ? "600" : "400")
      .text(d => d.type === "location" ? `L${d.id.replace("loc", "")}` : d.label);

    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as Node).x!)
        .attr("y1", d => (d.source as Node).y!)
        .attr("x2", d => (d.target as Node).x!)
        .attr("y2", d => (d.target as Node).y!);

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    return () => simulation.stop();
  }, [showCommunication]);

  useEffect(() => {
    const cleanup = initGraph();
    return cleanup;
  }, [initGraph]);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Controls */}
      <div className="flex items-center justify-between border-b border-border bg-card/50 px-4 py-3">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={showCommunication}
              onChange={(e) => setShowCommunication(e.target.checked)}
              className="rounded border-border"
            />
            Show communication links
          </label>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full border-2 border-chart-1 bg-background" />
            Location
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded border border-chart-1 bg-background" />
            Data Partition
          </span>
        </div>
      </div>

      {/* Visualization */}
      <svg
        ref={svgRef}
        className="w-full"
        style={{ height: "500px" }}
      />

      {/* Selected node info */}
      {selectedNode && (
        <div className="border-t border-border bg-muted/50 px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-foreground">{selectedNode.label}</span>
              <span className="ml-2 rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">
                {selectedNode.type}
              </span>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {selectedNode.type === "location"
              ? "A processing unit that owns a data partition and executes tasks."
              : "A contiguous range of array elements owned by a single location."}
          </p>
        </div>
      )}
    </div>
  );
}
