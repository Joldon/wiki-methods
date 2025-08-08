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

// types moved into types.ts file here in this folder

const ForceDirectedGraph: React.FC<ForceDirectedGraphProps> = ({
  nodes,
  links,
  width = 928,
  height = 600,
}) => {
  // add margin to prevent nodes from going off-screen
  const margin = { top: 70, right: 70, bottom: 70, left: 70 };
  //adjust the dimensions to account for margins
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

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

  // const [isClient, setIsClient] = useState(false);

  const { refs, floatingStyles } = useFloating({
    placement: "right",
    middleware: [offset(10), flip(), shift()],
  });

  // Remove client-side detection that causes hydration errors
  useEffect(() => {
    // if (!svgRef.current || !isClient) return;
    if (!svgRef.current) return;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const svg = d3.select(svgRef.current);

    svg.selectAll("*").remove(); // Clear previous elements
    // This cleanup prevents duplicate elements when the component re-renders

    // Create a container group that respects the margins
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Custom force to keep nodes within bounds
    const boundaryForce = () => {
      const force = () => {
        for (const node of nodes) {
          node.x = Math.max(0, Math.min(innerWidth, node.x as number));
          node.y = Math.max(0, Math.min(innerHeight, node.y as number));
        }
      };
    };

    const nodeRadius = 8; // Match the radius used for node circles
    // const boundaryForce = () => {
    //   for (const node of nodes) {
    //     if (!node.x || !node.y) continue;
    //     const minX = nodeRadius;
    //     const maxX = innerWidth - nodeRadius;
    //     const minY = nodeRadius;
    //     const maxY = innerHeight - nodeRadius;

    //     if (node.x < minX) node.x = minX;
    //     if (node.x > maxX) node.x = maxX;
    //     if (node.y < minY) node.y = minY;
    //     if (node.y > maxY) node.y = maxY;
    //   }
    // };

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
      // .force("charge", d3.forceManyBody().strength(-300))
      // .force("center", d3.forceCenter(innerWidth / 2, innerHeight / 2))
      // .force("boundary", d3.forceX(innerWidth / 2).strength(0.1))
      // .force("boundary", d3.forceY(innerHeight / 2).strength(0.1))
      // .on("tick", ticked);

      // Add boundary force strength for better node distribution
      .force("charge", d3.forceManyBody().strength(-300))
      .force(
        "center",
        d3.forceCenter(innerWidth / 2, innerHeight / 2).strength(0.1)
      )
      // add forces to push toward the center more strongly
      .force("x", d3.forceX(innerWidth / 2).strength(0.1))
      .force("y", d3.forceY(innerHeight / 2).strength(0.1))
      // add collision detection to prevent nodes from overlapping
      .force("collision", d3.forceCollide().radius(nodeRadius * 1.5))
      .on("tick", () => {
        boundaryForce();
        ticked();
      });
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
      const getCoord = (coord: number | undefined, max: number) => {
        const val = coord ?? 0;
        return Math.max(0, Math.min(max, val));
      };
      link
        .attr("x1", (d: Link) => getCoord((d.source as Node).x, innerWidth)) //  tells TypeScript that x/y will definitely have values
        .attr("y1", (d: Link) => getCoord((d.source as Node).y, innerHeight))
        .attr("x2", (d: Link) => getCoord((d.target as Node).x, innerWidth))
        .attr("y2", (d: Link) => getCoord((d.target as Node).y, innerHeight));

      node
        .attr("cx", (d: Node) => getCoord(d.x, innerWidth))
        .attr("cy", (d: Node) => getCoord(d.y, innerHeight));
      labels
        .attr("x", (d: Node) => getCoord(d.x, innerWidth))
        .attr("y", (d: Node) => getCoord(d.y, innerHeight));
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
  }, [
    nodes,
    links,
    width,
    height,
    margin.left,
    margin.top,
    innerWidth,
    innerHeight,
    // isClient,
  ]);

  // if (!isClient) {
  //   return null;
  // }

  return (
    <div style={{ position: "relative" }}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{
          maxWidth: "100%",
          height: "auto",
          border: "1px solid #ddd",
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
