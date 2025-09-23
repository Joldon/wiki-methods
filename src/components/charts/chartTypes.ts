import type { SimulationNodeDatum } from "d3";
import { ComponentType, ReactNode } from "react";

export type BaseChartProps = {
  width?: number;
  height?: number;
  title?: string;
  className?: string;
};

export type Node = SimulationNodeDatum & {
  id: string | number;
  group: number | string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  [key: string]: unknown;
};

export type Link = {
  source: string | number | Node;
  target: string | number | Node;
  value: number;
  [key: string]: unknown;
};

// Tree node with hierarchical structure
export type TreeNode<T extends { name: string } = { name: string }> =
  SimulationNodeDatum & {
    name: string;
    children?: TreeNode<T>[];
    id?: string;
    data?: T;
    // Support for additional tree properties
    depth?: number;
    height?: number;
    parent?: TreeNode<T> | null;
    [key: string]: unknown;
  };

export type ForceDirectedGraphProps = BaseChartProps & {
  nodes: Node[];
  links: Link[];
};

export type ForceDirectedTreeProps = BaseChartProps & {
  data: TreeNode<{ name: string }>;
};

export type TooltipData = {
  x: number;
  y: number;
  name: string;
  show: boolean;
  // Allows for additional tooltip content
  content?: string;
  [key: string]: unknown;
};

// Union type for all chart props (for future extensibility)
export type ChartProps = ForceDirectedGraphProps | ForceDirectedTreeProps;

// Updated ChartWrapperProps to support both patterns

export type ChartWrapperProps<T extends object> = {
  Component?: ComponentType<T>;
  props?: T;
  loading?: ReactNode;
  width?: number;
  height?: number;
  title?: string;
  className?: string;
  // Legacy API support - all optional since they're alternatives to Component/props
  nodes?: Node[];
  links?: Link[];
  data?: TreeNode<{ name: string }>;
};

// Type guards for runtime type checking - simplified and more readable
export const isForceDirectedGraphProps = (
  props: unknown
): props is ForceDirectedGraphProps => {
  return (
    typeof props === "object" &&
    props !== null &&
    Array.isArray((props as ForceDirectedGraphProps).nodes) &&
    Array.isArray((props as ForceDirectedGraphProps).links)
  );
};

export const isForceDirectedTreeProps = (
  props: unknown
): props is ForceDirectedTreeProps => {
  return (
    typeof props === "object" &&
    props !== null &&
    "data" in props &&
    typeof (props as ForceDirectedTreeProps).data === "object"
  );
};

// For other types, you can create similar generic guards or extend this pattern.

// Future chart types can be added here:
// export interface NetworkGraphProps extends BaseChartProps { ... }
// export interface HeatmapProps extends BaseChartProps { ... }
// export interface SankeyDiagramProps extends BaseChartProps { ... }
