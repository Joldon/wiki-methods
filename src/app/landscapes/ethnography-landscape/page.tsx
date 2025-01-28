import ForceDirectedGraph from "@/components/charts/forceDirectedGraph";
import mockData from "@/components/charts/mockData.json";
import ethno from "@/components/charts/ethno.json";
import ethno2 from "@/components/charts/ethno2.json";
import miserables from "@/components/charts/miserables.json";
import type { Node, Link } from "@/components/charts/forceDirectedGraph";

const EthnographyPage = async () => {
  const nodes = ethno2.nodes as Node[];
  const links = ethno2.links as Link[];

  return (
    <div>
      <h1>Force-Directed Graph</h1>
      <ForceDirectedGraph nodes={nodes} links={links} />
    </div>
  );
};

export default EthnographyPage;
