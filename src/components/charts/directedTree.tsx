"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

interface ForceDirectedTreeProps {
  data: TreeNode;
  width?: number;
  height?: number;
}

const DirectedTree: React.FC<ForceDirectedTreeProps> = ({
  data,
  width = 928,
  height = 600,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // Create the hierarchical data structure
    const root = d3.hierarchy(data);
    const links = root.links();
    const nodes = root.descendants();

    // Create the force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
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
      .call(drag(simulation) as any);

    // Add titles (tooltips) to nodes
    node.append("title").text((d) => d.data.name);

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    });

    // Cleanup function
    return () => {
      simulation.stop();
    };
  }, [data, width, height]);

  return <svg ref={svgRef} width={width} height={height} />;
};

export default DirectedTree;

// import React, { useEffect, useRef, useState } from "react";
// import * as d3 from "d3";

// interface TreeNode {
//   name: string;
//   children?: TreeNode[];
// }

// interface Node extends d3.SimulationNodeDatum {
//   id: string;
//   name: string;
//   radius: number;
//   color: string;
// }

// interface Link extends d3.SimulationLinkDatum<Node> {
//   source: Node;
//   target: Node;
// }

// interface ForceDirectedTreeProps {
//   data: TreeNode;
//   width?: number;
//   height?: number;
// }

// const DirectedTree: React.FC<ForceDirectedTreeProps> = ({
//   data,
//   width = 928,
//   height = 600,
// }) => {
//   const svgRef = useRef<SVGSVGElement>(null);
//   const [nodes, setNodes] = useState<Node[]>([]);
//   const [links, setLinks] = useState<Link[]>([]);

//   useEffect(() => {
//     if (!svgRef.current) return;

//     // Create hierarchical data structure
//     const root = d3.hierarchy(data);

//     // Create nodes array with additional properties
//     const nodesData: Node[] = root.descendants().map((d) => ({
//       id: `node-${d.data.name}`,
//       name: d.data.name,
//       radius: d.depth === 0 ? 15 : 10,
//       color: d.depth === 0 ? "#ff4444" : "#4444ff",
//       x: width / 2 + Math.random() * 100,
//       y: height / 2 + Math.random() * 100,
//     }));

//     // Create links array
//     const linksData: Link[] = root.links().map((l) => ({
//       source: nodesData.find((n) => n.name === l.source.data.name)!,
//       target: nodesData.find((n) => n.name === l.target.data.name)!,
//     }));

//     setNodes(nodesData);
//     setLinks(linksData);

//     // Create force simulation
//     const simulation = d3
//       .forceSimulation<Node>(nodesData)
//       .force(
//         "link",
//         d3
//           .forceLink<Node, Link>(linksData)
//           .id((d) => d.id)
//           .distance(100)
//           .strength(1)
//       )
//       .force("charge", d3.forceManyBody().strength(-400))
//       .force("center", d3.forceCenter(width / 2, height / 2))
//       .force(
//         "collision",
//         d3.forceCollide().radius((d) => (d.radius || 0) + 10)
//       );

//     // Update node positions on each tick
//     simulation.on("tick", () => {
//       setNodes([...nodesData]);
//       setLinks([...linksData]);
//     });

//     return () => {
//       simulation.stop();
//     };
//   }, [data, width, height]);

//   return (
//     <svg
//       ref={svgRef}
//       width={width}
//       height={height}
//       viewBox={`0 0 ${width} ${height}`}
//       style={{ maxWidth: "100%", height: "auto" }}
//     >
//       <g>
//         {/* Draw links */}
//         {links.map((link, i) => (
//           <line
//             key={`link-${i}`}
//             x1={link.source.x}
//             y1={link.source.y}
//             x2={link.target.x}
//             y2={link.target.y}
//             stroke="#999"
//             strokeOpacity={0.6}
//             strokeWidth={1.5}
//           />
//         ))}

//         {/* Draw nodes */}
//         {nodes.map((node) => (
//           <g
//             key={node.id}
//             transform={`translate(${node.x || 0},${node.y || 0})`}
//           >
//             <circle
//               r={node.radius}
//               fill={node.color}
//               stroke="#fff"
//               strokeWidth={1.5}
//             />
//             <text
//               dy=".31em"
//               x={node.radius + 5}
//               textAnchor="start"
//               style={{
//                 fontSize: "12px",
//                 fontFamily: "sans-serif",
//               }}
//             >
//               {node.name}
//             </text>
//           </g>
//         ))}
//       </g>
//     </svg>
//   );
// };

// export default DirectedTree;
