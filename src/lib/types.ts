export interface WikiEntry {
  pageid: number;
  ns: number;
  title: string;
}

export interface WikiContent {
  parse: {
    text: {
      "*": string;
    };
  };
}
