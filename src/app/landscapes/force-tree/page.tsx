import tree from "@/components/charts/data/tree.json";
import { TreeNode } from "@/components/charts/chartTypes";
import ChartWrapper from "@/components/charts/chartWrapper";

const EthnographyTreePage = async () => {
  // Properly cast the imported JSON to our TreeNode type
  const data = tree as TreeNode<{ name: string }>;

  return (
    <div style={{ width: "100%", height: "800px" }}>
      <h1>Force-Directed Tree</h1>
      <ChartWrapper data={data} />
    </div>
  );
};

export default EthnographyTreePage;
