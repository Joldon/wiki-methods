export type MethodType = {
  method: string;
  description: string;
  type: {
    quantitative: boolean;
    qualitative: boolean;
  };
  reasoning: {
    deductive: boolean;
    inductive: boolean;
  };
  level: {
    individual: boolean;
    system: boolean;
    global: boolean;
  };
  time: {
    past: boolean;
    present: boolean;
    future: boolean;
  };
};

export const starterData: MethodType[] = [
  {
    method: "Survey Research",
    description:
      "Surveys are highly systematized and structured forms of data gathering through written or oral questioning of humans.",
    type: {
      quantitative: true,
      qualitative: false,
    },
    reasoning: {
      deductive: true,
      inductive: false,
    },
    level: {
      individual: true,
      system: false,
      global: false,
    },
    time: {
      past: true,
      present: true,
      future: true,
    },
  },
  {
    method: "Open Interview",
    description:
      "Open Interviews are a form of qualitative data gathering through open conversations with interviewees.",
    type: {
      quantitative: false,
      qualitative: true,
    },
    reasoning: {
      deductive: false,
      inductive: true,
    },
    level: {
      individual: true,
      system: false,
      global: false,
    },
    time: {
      past: true,
      present: true,
      future: true,
    },
  },
  {
    method: "Semi-structured Interview",
    description:
      "Semi-structured Interviews are a form of qualitative data gathering through loosely pre-structured conversations with interviewees.",
    type: {
      quantitative: false,
      qualitative: true,
    },
    reasoning: {
      deductive: true,
      inductive: true,
    },
    level: {
      individual: true,
      system: false,
      global: false,
    },
    time: {
      past: true,
      present: true,
      future: true,
    },
  },
  {
    method: "Experiments",
    description:
      "Experiments describe the systematic and reproducible design to test specific hypotheses.",
    type: {
      quantitative: true,
      qualitative: false,
    },
    reasoning: {
      deductive: true,
      inductive: false,
    },
    level: {
      individual: true,
      system: true,
      global: true,
    },
    time: {
      past: false,
      present: true,
      future: false,
    },
  },
  {
    method: "Back of the envelope statistics",
    description:
      "Back of the envelope statistics revolve around rough, initial calculations that provide a first understanding of quantitative data.",
    type: {
      quantitative: true,
      qualitative: false,
    },
    reasoning: {
      deductive: true,
      inductive: false,
    },
    level: {
      individual: true,
      system: true,
      global: true,
    },
    time: {
      past: false,
      present: true,
      future: false,
    },
  },
  {
    method: "Content Analysis",
    description:
      "Content Analysis relies on the summarizing of data (most commonly text) into content categories based on pre-determined rules and the analysis of the 'coded' data.",
    type: {
      quantitative: false,
      qualitative: true,
    },
    reasoning: {
      deductive: true,
      inductive: true,
    },
    level: {
      individual: true,
      system: false,
      global: false,
    },
    time: {
      past: true,
      present: true,
      future: false,
    },
  },
  {
    method: "Ethnography",
    description:
      "Ethnography encompasses diverse methodological approaches to gathering field data on social structures and phenomena.",
    type: {
      quantitative: false,
      qualitative: true,
    },
    reasoning: {
      deductive: false,
      inductive: true,
    },
    level: {
      individual: true,
      system: true,
      global: false,
    },
    time: {
      past: false,
      present: true,
      future: false,
    },
  },
  {
    method: "Scenario Planning",
    description:
      "Scenario Planning is a systematic designation of potential futures to enable long term strategic planning.",
    type: {
      quantitative: true,
      qualitative: true,
    },
    reasoning: {
      deductive: true,
      inductive: false,
    },
    level: {
      individual: false,
      system: true,
      global: true,
    },
    time: {
      past: false,
      present: false,
      future: true,
    },
  },
  {
    method: "Life Cycle Analysis",
    description:
      "A Life Cycle Analysis attempts to analyze the (socio-)environmental impact of a product through its lifespan.",
    type: {
      quantitative: true,
      qualitative: true,
    },
    reasoning: {
      deductive: false,
      inductive: true,
    },
    level: {
      individual: true,
      system: false,
      global: false,
    },
    time: {
      past: false,
      present: true,
      future: false,
    },
  },
  {
    method: "Walking Exercise",
    description:
      "A Walking Exercise can elicit how people perceive their daily environment and how people orient themselves in it.",
    type: {
      quantitative: false,
      qualitative: true,
    },
    reasoning: {
      deductive: true,
      inductive: true,
    },
    level: {
      individual: true,
      system: false,
      global: false,
    },
    time: {
      past: true,
      present: true,
      future: false,
    },
  },
  {
    method: "Social Network Analysis",
    description:
      "Social Network Analysis visualises social interactions as a network and analyzes the quality and quantity of connections and structures within this network.",
    type: {
      quantitative: true,
      qualitative: true,
    },
    reasoning: {
      deductive: true,
      inductive: true,
    },
    level: {
      individual: true,
      system: true,
      global: true,
    },
    time: {
      past: true,
      present: true,
      future: false,
    },
  },
  {
    method: "Narrative Research",
    description:
      "Narrative Research describes qualitative field research based on narrative formats which are analyzed and/or created during the research process.",
    type: {
      quantitative: false,
      qualitative: true,
    },
    reasoning: {
      deductive: false,
      inductive: true,
    },
    level: {
      individual: true,
      system: false,
      global: false,
    },
    time: {
      past: true,
      present: true,
      future: true,
    },
  },
  {
    method: "Serious Gaming",
    description:
      "Serious Gaming involves games, i.e. interactive analoguous or digital formats, that harvest or create knowledge within a game setting with stakeholders.",
    type: {
      quantitative: false,
      qualitative: true,
    },
    reasoning: {
      deductive: true,
      inductive: false,
    },
    level: {
      individual: true,
      system: true,
      global: false,
    },
    time: {
      past: false,
      present: true,
      future: true,
    },
  },
  {
    method: "Mental Maps",
    description: "",
    type: {
      quantitative: false,
      qualitative: true,
    },
    reasoning: {
      deductive: false,
      inductive: true,
    },
    level: {
      individual: true,
      system: false,
      global: false,
    },
    time: {
      past: true,
      present: true,
      future: true,
    },
  },
  {
    method: "Geographical Information Systems",
    description:
      "Geographical information systems (GIS) subsume all approaches that serve as a data platform and analysis tools for spatial data.",
    type: {
      quantitative: true,
      qualitative: false,
    },
    reasoning: {
      deductive: true,
      inductive: true,
    },
    level: {
      individual: true,
      system: true,
      global: true,
    },
    time: {
      past: true,
      present: true,
      future: true,
    },
  },
];

export const categories = {
  type: ["quantitative", "qualitative"],
  reasoning: ["deductive", "inductive"],
  level: ["individual", "system", "global"],
  time: ["past", "present", "future"],
};

export async function filterMethods(formData: FormData) {
  // Define the categories and keys for filters

  // Dynamically construct the filters object
  const filters = Object.keys(categories).reduce((acc, category) => {
    acc[category] = categories[category as keyof typeof categories].reduce(
      (subAcc, key) => {
        subAcc[key] = formData.get(key) === "on";
        return subAcc;
      },
      {} as Record<string, boolean>
    );
    return acc;
  }, {} as Record<string, Record<string, boolean>>);

  // Filter the methods based on the constructed filters object
  const filteredMethods = starterData.filter((method: MethodType) => {
    return Object.keys(filters).every((category) => {
      return Object.keys(filters[category]).every((key) => {
        return (
          !filters[category][key] ||
          (method[category as keyof MethodType] as Record<string, boolean>)[
            key
          ] === filters[category][key]
        );
      });
    });
  });

  return filteredMethods;
}
