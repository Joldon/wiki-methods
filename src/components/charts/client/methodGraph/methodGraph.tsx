"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  CriteriaAxis,
  MethodGraphLink,
  MethodGraphNode,
  MethodGraphProps,
} from "../../chartTypes";
import styles from "./methodGraph.module.css";
import { useRouter } from "next/navigation";
import * as d3 from "d3";

// Hue encodes a design-criteria *axis* (or a category), so the palette carries
// meaning. Legend swatches read the same map, so colors always agree.
const GROUP_COLORS: Record<string, string> = {
  method: "#2563eb",
  normativity: "#7c3aed",
  other: "#64748b",
  type: "#0891b2",
  reasoning: "#d97706",
  level: "#16a34a",
  time: "#dc2626",
};

const DEFAULT_COLOR = "#94a3b8";
const colorFor = (group: string | number): string =>
  GROUP_COLORS[String(group)] ?? DEFAULT_COLOR;

const AXIS_LABELS: Record<CriteriaAxis, string> = {
  type: "Type",
  reasoning: "Reasoning",
  level: "Level",
  time: "Time",
};

const DIM_OPACITY = 0.1;
const CRITERIA_AXES: CriteriaAxis[] = ["type", "reasoning", "level", "time"];

type SimNode = MethodGraphNode & d3.SimulationNodeDatum;
// Explicit type avoids inheriting Link's [key: string]: unknown index signature,
// which would cause d.value and d.axis to resolve as `unknown` inside D3 callbacks.
type SimLink = d3.SimulationLinkDatum<SimNode> & {
  value: number;
  linkType: "category" | "criteria";
  axis?: CriteriaAxis;
};

// d3 rewrites link endpoints from id strings to node objects once the
// simulation binds; this reads an id whichever form an endpoint is in.
const endpointId = (
  endpoint: string | number | { id: string | number } | undefined,
): string =>
  typeof endpoint === "object" && endpoint !== null
    ? String(endpoint.id)
    : String(endpoint);

const MethodGraph = ({ nodes, links, height = 600 }: MethodGraphProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [width, setWidth] = useState(0);
  const [inView, setInView] = useState(false);
  const [activeHub, setActiveHub] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState({
    show: false,
    x: 0,
    y: 0,
    title: "",
    sub: "",
  });

  const router = useRouter();

  // Selections kept in a ref so highlighting can restyle without rebuilding.
  const selectionsRef = useRef<{
    node: d3.Selection<SVGCircleElement, SimNode, SVGGElement, unknown>;
    link: d3.Selection<SVGLineElement, SimLink, SVGGElement, unknown>;
    label: d3.Selection<SVGTextElement, SimNode, SVGGElement, unknown>;
  } | null>(null);

  // hubId → ids of articles linked to it (from pristine props, ids are strings).
  const adjacency = useMemo(() => {
    const map = new Map<string, Set<string>>();
    links.forEach((link) => {
      const target = endpointId(link.target);
      const source = endpointId(link.source);
      const set = map.get(target) ?? new Set<string>();
      set.add(source);
      map.set(target, set);
    });
    return map;
  }, [links]);

  // Legend model: categories first, then one block per populated axis.
  const legend = useMemo(() => {
    const categories = nodes
      .filter((node) => node.nodeType === "category")
      .map((node) => ({
        id: String(node.id),
        label: node.label,
        group: String(node.group),
      }));

    const axes = CRITERIA_AXES.map((axis) => ({
      axis,
      label: AXIS_LABELS[axis],
      items: nodes
        .filter((node) => node.nodeType === "criteria" && node.axis === axis)
        .map((node) => ({
          id: String(node.id),
          label: node.label,
          group: String(node.group),
        })),
    })).filter((block) => block.items.length > 0);
    return { categories, axes };
  }, [nodes]);

  // Track container width (ignoring sub-pixel jitter) for a responsive viewBox.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const next = Math.floor(entries[0]?.contentRect.width ?? 0);
      setWidth((prev) => (Math.abs(prev - next) < 8 ? prev : next));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Defer the simulation until the section scrolls into view.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || inView) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView]);

  // Reset opacity/label state for the current focus. Reads selections from the
  // ref, so it is safe to call from both the build effect and the focus effect.
  const applyHighlight = useMemo(
    () => (hubId: string | null) => {
      const selections = selectionsRef.current;
      if (!selections) return;
      const { node, link, label } = selections;

      if (!hubId) {
        node.style("opacity", null);
        link.style("opacity", null);
        label.style("display", (d) =>
          d.nodeType === "article" ? "none" : "block",
        );
        return;
      }

      const neighbors = adjacency.get(hubId) ?? new Set<string>();
      const isActive = (id: string): boolean =>
        id === hubId || neighbors.has(id);

      node.style("opacity", (d) => (isActive(String(d.id)) ? 1 : DIM_OPACITY));
      link.style("opacity", (d) =>
        endpointId(d.source) === hubId || endpointId(d.target) === hubId
          ? 0.85
          : DIM_OPACITY * 0.4,
      );
      label.style("display", (d) => {
        if (d.nodeType !== "article") return "block";
        return neighbors.has(String(d.id)) ? "block" : "none";
      });
    },
    [adjacency],
  );

  // Build / rebuild the simulation when data, size, or visibility changes.
  useEffect(() => {
    if (!svgRef.current || !inView || width === 0 || nodes.length === 0) return;

    // Clone so React's props stay immutable (d3 mutates nodes/links in place).
    const simNodes: SimNode[] = nodes.map((node) => ({ ...node }));
    const simLinks: SimLink[] = links.map((link) => ({
      source: link.source as string | number | SimNode,
      target: link.target as string | number | SimNode,
      value: link.value,
      linkType: link.linkType,
      axis: link.axis,
    }));

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const linkGroup = svg.append("g").attr("stroke-linecap", "round");
    const nodeGroup = svg.append("g");
    const labelGroup = svg.append("g");

    const simulation = d3
      .forceSimulation<SimNode>(simNodes)
      .force(
        "link",
        d3
          .forceLink<SimNode, SimLink>(simLinks)
          .id((d) => String(d.id))
          .distance((d) => (d.linkType === "category" ? 70 : 45))
          .strength(0.25),
      )
      .force(
        "charge",
        d3
          .forceManyBody<SimNode>()
          .strength((d) => (d.nodeType === "article" ? -26 : -320)),
      )
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.03))
      .force("y", d3.forceY(height / 2).strength(0.05))
      .force(
        "collide",
        d3.forceCollide<SimNode>().radius((d) => d.size + 3),
      );

    const link = linkGroup
      .selectAll<SVGLineElement, SimLink>("line")
      .data(simLinks)
      .join("line")
      .attr("stroke", (d) => (d.axis ? colorFor(d.axis) : "#cbd5e1"))
      .attr("stroke-opacity", (d) => (d.linkType === "category" ? 0.35 : 0.5))
      .attr("stroke-width", (d) => Math.sqrt(d.value));

    const label = labelGroup
      .selectAll<SVGTextElement, SimNode>("text")
      .data(simNodes)
      .join("text")
      .text((d) => d.label)
      .attr("text-anchor", "middle")
      .attr("dy", (d) => -d.size - 4)
      .style("font-size", (d) => (d.nodeType === "category" ? "13px" : "11px"))
      .style("font-weight", (d) => (d.nodeType === "article" ? 500 : 600))
      .style("fill", "var(--color-text-primary)")
      .style("paint-order", "stroke")
      .style("stroke", "var(--color-surface)")
      .style("stroke-width", "3px")
      .style("pointer-events", "none")
      .style("display", (d) => (d.nodeType === "article" ? "none" : "block"));

    let moved = false;
    const drag = d3
      .drag<SVGCircleElement, SimNode>()
      .on("start", (event, d) => {
        moved = false;
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        moved = true;
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    const node = nodeGroup
      .selectAll<SVGCircleElement, SimNode>("circle")
      .data(simNodes)
      .join("circle")
      .attr("r", (d) => d.size)
      .attr("fill", (d) => colorFor(d.group))
      .attr("stroke", "var(--color-surface)")
      .attr("stroke-width", (d) => (d.nodeType === "article" ? 1 : 1.5))
      .style("fill-opacity", (d) => (d.nodeType === "article" ? 0.9 : 1))
      .style("cursor", "pointer")
      .call(drag)
      .on("click", (_event, d) => {
        if (moved) return;
        if (d.nodeType === "article" && d.pageid !== undefined) {
          router.push(
            `/wiki/${encodeURIComponent(d.label.replace(/ /g, "_"))}`,
          );
          return;
        }
        setActiveHub((prev) => (prev === String(d.id) ? null : String(d.id)));
      })
      .on("mouseenter", (event, d) => {
        const sub =
          d.nodeType === "article"
            ? (d.description ?? "Open article")
            : d.nodeType === "category"
              ? "Category · click to focus"
              : `${AXIS_LABELS[d.axis as CriteriaAxis]} · click to focus`;
        setTooltip({
          show: true,
          x: event.clientX,
          y: event.clientY,
          title: d.label,
          sub,
        });
      })
      .on("mousemove", (event) =>
        setTooltip((prev) => ({ ...prev, x: event.clientX, y: event.clientY })),
      )
      .on("mouseleave", () => setTooltip((prev) => ({ ...prev, show: false })));

    selectionsRef.current = { node, link, label };

    const clamp = (value: number | undefined, max: number, r: number): number =>
      Math.max(r, Math.min(max - r, value ?? max / 2));

    simulation.on("tick", () => {
      node
        .attr("cx", (d) => (d.x = clamp(d.x, width, d.size)))
        .attr("cy", (d) => (d.y = clamp(d.y, height, d.size)));
      link
        .attr("x1", (d) => (d.source as SimNode).x ?? 0)
        .attr("y1", (d) => (d.source as SimNode).y ?? 0)
        .attr("x2", (d) => (d.target as SimNode).x ?? 0)
        .attr("y2", (d) => (d.target as SimNode).y ?? 0);
      label.attr("x", (d) => d.x ?? 0).attr("y", (d) => d.y ?? 0);
    });

    applyHighlight(activeHub);

    return () => {
      simulation.stop();
    };
    // activeHub is intentionally excluded: focus is applied by the effect below
    // so changing it never rebuilds the (expensive) simulation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, links, width, height, inView, applyHighlight, router]);

  // Re-apply focus styling when the active hub changes.
  useEffect(() => {
    applyHighlight(activeHub);
  }, [activeHub, applyHighlight]);

  const toggleHub = (id: string): void =>
    setActiveHub((prev) => (prev === id ? null : id));

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.legend}
        role="group"
        aria-label="Legend and filters"
      >
        <div className={styles.legendBlock}>
          <span className={styles.legendHeading}>Categories</span>
          <div className={styles.chips}>
            {legend.categories.map((item) => (
              <button
                key={item.id}
                type="button"
                className={styles.chip}
                data-active={activeHub === item.id}
                aria-pressed={activeHub === item.id}
                onClick={() => toggleHub(item.id)}
              >
                <span
                  className={styles.swatch}
                  style={{ backgroundColor: colorFor(item.group) }}
                />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {legend.axes.map((block) => (
          <div key={block.axis} className={styles.legendBlock}>
            <span className={styles.legendHeading}>{block.label}</span>
            <div className={styles.chips}>
              {block.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={styles.chip}
                  data-active={activeHub === item.id}
                  aria-pressed={activeHub === item.id}
                  onClick={() => toggleHub(item.id)}
                >
                  <span
                    className={styles.swatch}
                    style={{ backgroundColor: colorFor(item.group) }}
                  />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ))}

        {activeHub && (
          <button
            type="button"
            className={styles.reset}
            onClick={() => setActiveHub(null)}
          >
            Reset focus
          </button>
        )}
      </div>

      <div ref={containerRef} className={styles.canvas}>
        {nodes.length === 0 ? (
          <p className={styles.empty}>
            No synced articles yet — run a wiki sync to populate the graph.
          </p>
        ) : (
          <svg
            ref={svgRef}
            width={width || undefined}
            height={height}
            className={styles.svg}
            role="img"
            aria-label="Force-directed network of research methods connected by shared design criteria"
          />
        )}
      </div>

      {tooltip.show && (
        <div
          className={styles.tooltip}
          style={{ left: tooltip.x + 14, top: tooltip.y + 14 }}
        >
          <strong>{tooltip.title}</strong>
          {tooltip.sub && <span>{tooltip.sub}</span>}
        </div>
      )}
    </div>
  );
};

export default MethodGraph;
