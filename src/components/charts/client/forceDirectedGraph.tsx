"use client";

import * as d3 from "d3";
import React, { useRef, useEffect, useState } from "react";
import {
  useFloating,
  FloatingPortal,
  offset,
  shift,
  flip,
} from "@floating-ui/react";
import type { Node, Link, ForceDirectedGraphProps } from "../chartTypes";

const NODE_RADIUS = 8;
const MARGIN = { top: 70, right: 70, bottom: 70, left: 70 };

const ForceDirectedGraph: React.FC<ForceDirectedGraphProps> = ({
  nodes,
  links,
  width = 928,
  height = 600,
}) => {
  //adjust the dimensions to account for margins
  const innerWidth = width - MARGIN.left - MARGIN.right;
  const innerHeight = height - MARGIN.top - MARGIN.bottom;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [tooltipData, setTooltipData] = useState<{
    show: boolean;
    content: string;
    x: number;
    y: number;
  }>({
    show: false,
    content: "",
    x: 0,
    y: 0,
  });

  const { refs, floatingStyles } = useFloating({
    placement: "right",
    middleware: [offset(10), flip(), shift()],
  });

  // Remove client-side detection that causes hydration errors
  useEffect(() => {
    if (!svgRef.current) return;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const svg = d3.select(svgRef.current);

    svg.selectAll("*").remove(); // Clear previous elements
    // This cleanup prevents duplicate elements when the component re-renders

    // Create a container group that respects the margins
    const g = svg
      .append("g")
      .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`);

    // FIX #2 (boundaryForce did nothing):
    // The old version defined a function that returned another function but
    // never called either of them. This version directly clamps node positions.
    const applyBoundaryForce = () => {
      // for (const node of nodes) {
      //   node.x = Math.max(
      //     NODE_RADIUS,
      //     Math.min(innerWidth - NODE_RADIUS, node.x as number),
      //   );
      //   node.y = Math.max(
      //     NODE_RADIUS,
      //     Math.min(innerHeight - NODE_RADIUS, node.y as number),
      //   );
      // }
      nodes.forEach((node) => {
        if (node.x == null || node.y == null) return;
        node.x = Math.max(
          NODE_RADIUS,
          Math.min(innerWidth - NODE_RADIUS, node.x),
        );
        node.y = Math.max(
          NODE_RADIUS,
          Math.min(innerHeight - NODE_RADIUS, node.y),
        );
      });
    };

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        // d3.forceLink(links).id((d: any) => d.id)
        d3
          .forceLink<Node, Link>(links)
          .id((d) => d.id.toString())
          .distance(120),
        // looks as better solution
      )
      // .force("charge", d3.forceManyBody().strength(-300))
      // .force("center", d3.forceCenter(innerWidth / 2, innerHeight / 2))
      // .force("boundary", d3.forceX(innerWidth / 2).strength(0.1))
      // .force("boundary", d3.forceY(innerHeight / 2).strength(0.1))
      // .on("tick", ticked);

      // Add boundary force strength for better node distribution
      .force("charge", d3.forceManyBody().strength(-300))
      .force(
        "center",
        d3.forceCenter(innerWidth / 2, innerHeight / 2).strength(0.1),
      )
      // add forces to push toward the center more strongly
      .force("x", d3.forceX(innerWidth / 2).strength(0.1))
      .force("y", d3.forceY(innerHeight / 2).strength(0.1))
      // add collision detection to prevent nodes from overlapping
      .force("collision", d3.forceCollide().radius(NODE_RADIUS * 1.5))
      .on("tick", () => {
        applyBoundaryForce();
        ticked();
      });
    // Add links
    // FIX #3 (used old .enter().append() API):
    // Replaced with .join() — the modern D3 v5+ equivalent that handles
    // enter, update, and exit in a single call, matching directedTree.tsx.
    const link = g
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", (d: Link) => Math.sqrt(d.value as number));

    // To make this more maintainable :
    const getNodeColor = (node: Node): string =>
      color(node.group.toString()) as string;
    // FIX #3 continued — drag now uses proper D3 generics, no `any`:
    const dragBehavior = d3
      .drag<SVGCircleElement, Node>()
      .on("start", (event: d3.D3DragEvent<SVGCircleElement, Node, Node>) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      })
      .on("drag", (event: d3.D3DragEvent<SVGCircleElement, Node, Node>) => {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      })
      .on("end", (event: d3.D3DragEvent<SVGCircleElement, Node, Node>) => {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      });

    const node = g
      .append("g")
      .selectAll<SVGCircleElement, Node>("circle")
      .data(nodes)
      .join("circle")
      .attr("r", NODE_RADIUS)
      // .attr("fill", (d: Node) => color(d.group.toString()) as string)
      .attr("fill", getNodeColor)
      .call(dragBehavior)
      .on("mouseover", (event: MouseEvent, d: Node) => {
        setTooltipData({
          show: true,
          content: `${d.id} (${d.group})`,
          x: event.pageX,
          y: event.pageY,
        });
      })
      .on("mouseout", () => {
        setTooltipData((prev) => ({ ...prev, show: false }));
      });

    // node.append("title").text((d: Node) => d.id);
    // the above line shows a title(id) and group name on hover

    // Add node labels
    const labels = g
      .append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .attr("dy", -10)
      .attr("text-anchor", "middle")
      .style("fill", "var(--color-text-primary)")
      .style("font-size", "12px")
      .style("font-weight", "500")
      .style("pointer-events", "none") // labels don't interfere with node mouse events

      .text((d) => d.id.toString());

    function ticked() {
      const clamp = (coord: number | undefined, max: number) =>
        Math.max(
          NODE_RADIUS,
          Math.min(max - NODE_RADIUS, coord ?? NODE_RADIUS),
        );
      link
        .attr("x1", (d: Link) => clamp((d.source as Node).x, innerWidth)) //  tells TypeScript that x/y will definitely have values
        .attr("y1", (d: Link) => clamp((d.source as Node).y, innerHeight))
        .attr("x2", (d: Link) => clamp((d.target as Node).x, innerWidth))
        .attr("y2", (d: Link) => clamp((d.target as Node).y, innerHeight));

      node
        .attr("cx", (d: Node) => clamp(d.x, innerWidth))
        .attr("cy", (d: Node) => clamp(d.y, innerHeight));
      labels
        .attr("x", (d: Node) => clamp(d.x, innerWidth))
        .attr("y", (d: Node) => clamp(d.y, innerHeight));
    }

    return () => {
      simulation.stop();
    };
  }, [nodes, links, width, height, innerWidth, innerHeight]);

  return (
    <div style={{ position: "relative" }}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{
          maxWidth: "100%",
          height: "auto",
          border: "1px solid var(--color-border)",
          overflow: "visible",
        }}
      />
      <FloatingPortal>
        {tooltipData.show && (
          <div
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              position: "absolute",
              backgroundColor: "var(--color-surface)",
              color: "var(--color-text-primary)",
              padding: "8px",
              border: "1px solid var(--color-border)",
              borderRadius: "4px",
              fontSize: "12px",

              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              zIndex: 1000,
              top: tooltipData.y,
              left: tooltipData.x,
            }}
          >
            {tooltipData.content}
          </div>
        )}
      </FloatingPortal>
    </div>
  );
};

export default ForceDirectedGraph;
