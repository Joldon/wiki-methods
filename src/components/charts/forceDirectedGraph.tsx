"use client";

import * as d3 from "d3";
import React, { useRef, useEffect } from "react";

export type Node = {
  id: string | number;
  group: number | string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
};

export type Link = {
  source: string | Node;
  target: string | Node;
  value: number;
};

type ForceDirectedGraphProps = {
  nodes: Node[];
  links: Link[];
  width?: number;
  height?: number;
};

const ForceDirectedGraph: React.FC<ForceDirectedGraphProps> = ({
  nodes,
  links,
  width = 928,
  height = 600,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(links).id((d: unknown) => d.id)
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", ticked);

    const svg = d3.select(svgRef.current);

    svg.selectAll("*").remove(); // Clear previous elements

    // Add links
    const link = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke-width", (d: Link) => Math.sqrt(d.value));

    // Add nodes
    const node = svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("fill", (d: Node) => color(d.group.toString()) as string)
      .call(
        d3
          .drag<SVGCircleElement, Node>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    node.append("title").text((d: Node) => d.id);

    function ticked() {
      link
        .attr("x1", (d: Link) => (d.source as Node).x!) // .x! - The x property access with a ! non-null assertion operator tells TypeScript that even though x might be considered potentially undefined, we're certain it will have a value at runtime.
        .attr("y1", (d: Link) => (d.source as Node).y!)
        .attr("x2", (d: Link) => (d.target as Node).x!)
        .attr("y2", (d: Link) => (d.target as Node).y!);

      node.attr("cx", (d: Node) => d.x!).attr("cy", (d: Node) => d.y!);
    }

    function dragstarted(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [nodes, links, width, height]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{ maxWidth: "100%", height: "auto" }}
    />
  );
};

export default ForceDirectedGraph;
