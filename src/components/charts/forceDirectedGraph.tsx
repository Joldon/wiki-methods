"use client";

import * as d3 from "d3";
import React, { useRef, useEffect, useState } from "react";
import { useFloating, FloatingPortal, offset, shift } from "@floating-ui/react";

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

  const { refs, floatingStyles, update } = useFloating({
    placement: "right",
    middleware: [offset(10), shift()],
  });

  useEffect(() => {
    if (!svgRef.current) return;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        // d3.forceLink(links).id((d: any) => d.id)
        d3
          .forceLink(links)
          .id((d) => (d as Node).id)
          .distance(120)
        // looks as better solution
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", ticked);

    const svg = d3.select(svgRef.current);

    svg.selectAll("*").remove(); // Clear previous elements
    // This cleanup prevents duplicate elements when the component re-renders

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

    // To make this more maintainable :
    const getNodeColor = (node: Node): string => {
      return color(node.group.toString()) as string;
    };

    const node = svg
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 8)
      // .attr("fill", (d: Node) => color(d.group.toString()) as string)
      .attr("fill", getNodeColor)
      .call(
        d3
          .drag<SVGCircleElement, Node>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      )
      .on("mouseover", (event, d: Node) => {
        setTooltipData({
          show: true,
          content: `${d.id} (${d.group})`,
          x: event.pageX,
          y: event.pageY,
        });
        update();
      })
      .on("mouseout", () => {
        setTooltipData((prev) => ({ ...prev, show: false }));
      });

    // node.append("title").text((d: Node) => d.id);
    // the above line shows a title(id) and group name on hover

    // Add node labels
    const labels = svg
      .append("g")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .attr("dy", -10)
      .attr("text-anchor", "middle")
      .style("fill", "#333")
      .style("font-size", "12px")
      .style("paint-order", "stroke")
      .style("stroke", "white")
      .style("stroke-width", "3px")
      .text((d) => d.id.toString());

    function ticked() {
      const getCoord = (coord: number | undefined) => coord ?? 0;
      link
        .attr("x1", (d: Link) => getCoord((d.source as Node).x)) //  tells TypeScript that x/y will definitely have values
        .attr("y1", (d: Link) => getCoord((d.source as Node).y))
        .attr("x2", (d: Link) => getCoord((d.target as Node).x))
        .attr("y2", (d: Link) => getCoord((d.target as Node).y));

      node
        .attr("cx", (d: Node) => getCoord(d.x))
        .attr("cy", (d: Node) => getCoord(d.y));
      labels
        .attr("x", (d: Node) => getCoord(d.x))
        .attr("y", (d: Node) => getCoord(d.y));
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
  }, [nodes, links, width, height, update]);

  return (
    <div style={{ position: "relative" }}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ maxWidth: "100%", height: "auto" }}
      />
      <FloatingPortal>
        {tooltipData.show && (
          <div
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              position: "absolute",
              backgroundColor: "white",
              padding: "8px",
              border: "1px solid #ddd",
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
