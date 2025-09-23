// Type declarations for JSON imports
declare module "*.json" {
  const value: any;
  export default value;
}

// Specific type declarations for chart data
declare module "@/components/charts/data/ethno.json" {
  interface EthnoData {
    nodes: Array<{
      id: string | number;
      group: number | string;
      [key: string]: unknown;
    }>;
    links: Array<{
      source: string | number;
      target: string | number;
      value: number;
      [key: string]: unknown;
    }>;
  }
  const data: EthnoData;
  export default data;
}

declare module "@/components/charts/data/tree.json" {
  interface TreeData {
    name: string;
    children?: TreeData[];
    [key: string]: unknown;
  }
  const data: TreeData;
  export default data;
}
