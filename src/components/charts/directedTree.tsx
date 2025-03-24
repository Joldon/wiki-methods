"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { hierarchy } from "d3";

export interface TreeNode<T extends { name: string }>
  extends d3.SimulationNodeDatum {
  name: string;
  children?: TreeNode<T>[];
  id: string;
  data: T;
}
// export interface TreeNode {
//   name: string;
//   children?: TreeNode[];
// }

type TooltipData = {
  x: number;
  y: number;
  name: string;
  show: boolean;
};

export type ForceDirectedTreeProps = {
  data: TreeNode<{ name: string }>;
  width?: number;
  height?: number;
};

const DirectedTree: React.FC<ForceDirectedTreeProps> = ({
  data,
  width = 928,
  height = 600,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData>({
    x: 0,
    y: 0,
    name: "",
    show: false,
  });

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // Create the hierarchical data structure
    const root = hierarchy(data);
    const links = root.links();
    const nodes = root.descendants();

    // Create the force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: unknown) => (d as TreeNode<{ name: string }>).id)
          .distance(10) // distance between nodes
          .strength(1)
      )
      .force("charge", d3.forceManyBody().strength(-100)) // node repulsion
      .force("x", d3.forceX())
      .force("y", d3.forceY());

    // Select the SVG and set its properties
    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    // Create drag behavior
    const drag = (simulation: d3.Simulation<any, undefined>) => {
      function dragstarted(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event: any, d: any) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      return d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    };

    // Create links
    const link = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2)
      .selectAll("line")
      .data(links)
      .join("line");

    // Create nodes
    const node = svg
      .append("g")
      .attr("fill", "#fff")
      .attr("stroke", "#000")
      .attr("stroke-width", 2) // stroke width
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("fill", (d) => (d.children ? "#69b3a2" : "#ff7f50"))
      //   .attr("stroke", (d) => (d.children ? null : "#fff")) // stroke color
      .attr("r", (d) => (d.children ? 6 : 4)) // node radius
      .call(drag(simulation) as any)

      // add mouseover event
      .on("mouseover", (event: MouseEvent, d: any) => {
        const svgBounds = svgRef.current!.getBoundingClientRect();
        const mouseX = event.clientX - svgBounds.left;
        const mouseY = event.clientY - svgBounds.top;

        setTooltip({
          x: mouseX,
          y: mouseY,
          name: d.data.name,
          show: true,
        });
      })

      // add mouseout event
      .on("mouseout", () => {
        setTooltip((prev) => ({ ...prev, show: false }));
      })
      // optional: add mousemove event
      .on("mousemove", (event: MouseEvent) => {
        if (tooltip.show) {
          const svgBounds = svgRef.current!.getBoundingClientRect();
          const mouseX = event.clientX - svgBounds.left;
          const mouseY = event.clientY - svgBounds.top;

          setTooltip((prev) => ({
            ...prev,
            x: mouseX,
            y: mouseY,
          }));
        }
      });

    // Add titles (tooltips) to nodes
    node.append("title").text((d) => d.data.name);

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source.x !== undefined ? d.source.x : 0))
        .attr("y1", (d) => (d.source.y !== undefined ? d.source.y : 0))
        .attr("x2", (d) => (d.target.x !== undefined ? d.target.x : 0))
        .attr("y2", (d) => (d.target.y !== undefined ? d.target.y : 0));

      node
        .attr("cx", (d) => (d.x !== undefined ? d.x : 0))
        .attr("cy", (d) => (d.y !== undefined ? d.y : 0));
    });

    // Cleanup function
    return () => {
      simulation.stop();
    };
  }, [data, width, height]);

  return (
    <div style={{ position: "relative" }}>
      <svg ref={svgRef} width={width} height={height} />;
      {tooltip.show && (
        <div
          style={{
            position: "absolute",
            top: tooltip.y - 40, // Offset to show above the cursor
            left: tooltip.x + 10, // Offset to show right of the cursor
            background: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "8px 12px",
            borderRadius: "4px",
            fontSize: "14px",
            pointerEvents: "none",
            zIndex: 100,
            transition: "all 0.2s ease",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          {tooltip.name}
        </div>
      )}
    </div>
  );
};

export default DirectedTree;
