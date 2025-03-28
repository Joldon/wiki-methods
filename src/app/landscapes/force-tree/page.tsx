import DirectedTree from "@/components/charts/directedTree";
import tree from "@/components/charts/tree.json";
import { TreeNode } from "@/components/charts/directedTree";

const EthnographyTreePage = async () => {
  // Properly cast the imported JSON to our TreeNode type
  const data = tree as TreeNode<{ name: string }>;

  return (
    <div style={{ width: "100%", height: "800px" }}>
      <h1>Force-Directed Tree</h1>
      <DirectedTree data={data} />
    </div>
  );
};

export default EthnographyTreePage;
