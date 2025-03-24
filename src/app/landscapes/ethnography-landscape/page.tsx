import ForceDirectedGraph from "@/components/charts/forceDirectedGraph";

import ethno from "@/components/charts/ethno.json";

import type { Node, Link } from "@/components/charts/forceDirectedGraph";

const EthnographyPage = async () => {
  const nodes = ethno.nodes as Node[];
  const links = ethno.links as Link[];

  return (
    <div>
      <h1>Force-Directed Graph</h1>
      <ForceDirectedGraph nodes={nodes} links={links} />
    </div>
  );
};

export default EthnographyPage;
