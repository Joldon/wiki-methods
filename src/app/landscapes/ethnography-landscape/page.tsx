import ChartWrapper from "@/components/charts/chartWrapper";
import ethno from "@/components/charts/data/ethno.json";

import type { Node, Link } from "@/components/charts/chartTypes";
// console.log("Rendered on", typeof window !== "undefined" ? "client" : "server");
const EthnographyPage = async () => {
  // console.log(
  //   "Rendered on",
  //   typeof window !== "undefined" ? "client" : "server"
  // );
  const nodes = ethno.nodes as Node[];
  const links = ethno.links as Link[];

  return (
    <div>
      <h1>Force-Directed Graph</h1>
      <ChartWrapper nodes={nodes} links={links} />
    </div>
  );
};

export default EthnographyPage;
