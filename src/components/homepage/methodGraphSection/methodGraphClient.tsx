"use client";

import dynamic from "next/dynamic";
import type { MethodGraphProps } from "@/components/charts/chartTypes";

// ssr: false must live in a Client Component — keeps D3 out of the server render.
// The simulation starts once the section hydrates in the browser.
const MethodGraph = dynamic(
  () => import("@/components/charts/client/methodGraph/methodGraph"),
  { ssr: false },
);

const MethodGraphClient = (props: MethodGraphProps) => {
  return <MethodGraph {...props} />;
};

export default MethodGraphClient;
