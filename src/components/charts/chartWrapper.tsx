"use client";

import dynamic from "next/dynamic";
import { ComponentType, ReactNode } from "react";
import styles from "./chartWrapper.module.css";
import type {
  ChartWrapperProps,
  ForceDirectedGraphProps,
  ForceDirectedTreeProps,
  Node,
  Link,
  TreeNode,
} from "./chartTypes";

/**
 * A generic wrapper for chart components that handles dynamic imports and SSR
 * This prevents hydration mismatches for D3.js-based charts
 *
 *  * Supports two usage patterns:
 * 1. Generic pattern: <ChartWrapper Component={MyComponent} props={{...}} />
 * 2. Specific patterns: <ChartWrapper nodes={...} links={...} /> or <ChartWrapper data={...} />
 */
function ChartWrapper<T extends object>({
  Component,
  props,
  loading,
  width = 928,
  height = 600,
  title,
  // Support for direct data props (legacy API)
  nodes,
  links,
  data,
  ...rest
}: ChartWrapperProps<T> & {
  // Legacy API support
  nodes?: Node[];
  links?: Link[];
  data?: TreeNode<{ name: string }>;
}) {
  const defaultLoading = (
    <div
      className={styles.chartLoadingBox}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <div
        className={styles.chartLoadingWrapper}
        role="status"
        aria-label="Loading visualization"
      >
        <svg
          className={styles.chartSpinner}
          aria-hidden="true"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="10"
            fill="none"
            strokeOpacity="0.2"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentColor"
          />
        </svg>
        <span style={{ fontSize: "14px", color: "inherit" }}>
          Loading {title || "visualization"}...
        </span>
      </div>
    </div>
  );

  // Handle legacy API: if nodes/links provided, use ForceDirectedGraph
  if (nodes && links && !Component) {
    const ForceDirectedGraph = dynamic(
      () => import("./client/forceDirectedGraph").then((mod) => mod.default),
      {
        ssr: false,
        loading: () => loading || defaultLoading,
      }
    );
    return (
      <ForceDirectedGraph
        nodes={nodes}
        links={links}
        width={width}
        height={height}
        {...rest}
      />
    );
  }

  // Handle legacy API: if data provided, use DirectedTree
  if (data && !Component) {
    const DirectedTree = dynamic(
      () => import("./client/directedTree").then((mod) => mod.default),
      {
        ssr: false,
        loading: () => loading || defaultLoading,
      }
    );
    return <DirectedTree data={data} width={width} height={height} {...rest} />;
  }

  // Handle generic API: Component and props provided
  if (Component && props) {
    // Dynamic import with SSR disabled - CRUCIAL for preventing hydration errors
    const DynamicChart = dynamic(() => Promise.resolve(Component), {
      ssr: false,
      loading: () => loading || defaultLoading,
    });

    return <DynamicChart {...props} />;
  }
  // Fallback: show error message
  return (
    <div className={styles.chartLoadingBox}>
      <div className={styles.chartLoadingWrapper}>
        <span>Error: Chart component configuration is invalid</span>
      </div>
    </div>
  );
}

export default ChartWrapper;
