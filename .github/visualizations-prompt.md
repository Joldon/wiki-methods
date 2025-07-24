# Data Visualization Guidelines

## D3.js Integration Patterns

### Basic Chart Structure
```typescript
"use client";
import * as d3 from "d3";
import { useRef, useEffect, useState } from "react";

export default function Chart({ data }: { data: ChartData[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();
    
    // D3 visualization logic
    
    // Cleanup function
    return () => {
      // Stop simulations, clear intervals, etc.
    };
  }, [data]);
  
  return <svg ref={svgRef} width={width} height={height} />;
}
```

## Existing Chart Types

### Force-Directed Graph
- **File**: `src/components/charts/forceDirectedGraph.tsx`
- **Data**: Nodes with `id` and `group`, Links with `source`, `target`, `value`
- **Features**: Drag interactions, tooltips, boundary constraints
- **Usage**: Network relationships, method connections

### Directed Tree
- **File**: `src/components/charts/directedTree.tsx`
- **Data**: Hierarchical structure with `name` and `children`
- **Features**: Force simulation, tooltips, drag interactions
- **Usage**: Method hierarchies, taxonomies

## Chart Data Flow
```typescript
// ✅ Server Component fetches and processes data
export default async function ChartPage() {
  const rawData = await fetchChartData();
  const processedData = transformDataForChart(rawData);
  return <InteractiveChart data={processedData} />;
}

// ✅ Client Component handles D3 rendering
"use client";
export function InteractiveChart({ data }: { data: ProcessedData[] }) {
  // D3 logic here
}
```

## D3 Best Practices

### Simulation Management
- Always stop simulations in cleanup
- Use proper force configurations for node distribution
- Implement boundary forces to keep nodes in view

### Responsive Design
```typescript
const margin = { top: 70, right: 70, bottom: 70, left: 70 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
```

### Tooltip Implementation
- Use React state for tooltip data
- Consider using @floating-ui/react for advanced positioning
- Implement proper show/hide logic with mouse events

## Chart Styling
- Use D3 color scales: `d3.scaleOrdinal(d3.schemeCategory10)`
- Implement hover effects and transitions
- Maintain consistent styling with project theme
- Handle responsive behavior for different screen sizes

## Data Processing
- Transform data server-side when possible
- Use TypeScript interfaces for chart data structures
- Handle missing or invalid data gracefully
- Implement proper error boundaries for chart failures