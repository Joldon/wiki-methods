import { WikiEntry } from "@/lib/types";
import { fetchAllEntries } from "@/lib/fetchData";
import { starterData } from "@/lib/starterData";
import MethodBrowserClient from "./methodBrowserClient";

const MethodBrowser = async () => {
  let wikiMethods: WikiEntry[] = [];
  let dataFallback = false;

  try {
    wikiMethods = await fetchAllEntries();
  } catch (error) {
    console.error("Failed to fetch wikientries, using fallback data", error);

    // Fallback to starterData if MediaWiki API fails
    wikiMethods = starterData.map((method, index) => ({
      pageid: index + 1,
      ns: 0,
      title: method.method,
    }));
    dataFallback = true;
  }
  return (
    <MethodBrowserClient methods={wikiMethods} dataFallback={dataFallback} />
  );
};

export default MethodBrowser;
