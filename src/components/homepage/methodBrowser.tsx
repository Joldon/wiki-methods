import prisma from "@/lib/db";
import MethodBrowserClient, { BrowseMethod } from "./methodBrowserClient";

const MethodBrowser = async () => {
  let methods: BrowseMethod[] = [];
  let dataFallback = false;

  try {
    const articles = await prisma.methodArticle.findMany({
      where: { articleType: "METHOD" },
      select: {
        pageid: true,
        title: true,
        description: true,
        quantitative: true,
        qualitative: true,
        deductive: true,
        inductive: true,
        individual: true,
        system: true,
        global: true,
        past: true,
        present: true,
        future: true,
      },
    });
    // Shuffle into random order on each render
    methods = [...articles].sort(() => Math.random() - 0.5);
  } catch (error) {
    console.error("Failed to fetch from database", error);

    dataFallback = true;
  }
  return <MethodBrowserClient methods={methods} dataFallback={dataFallback} />;
};

export default MethodBrowser;
