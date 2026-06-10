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

export type LatestArticle = {
  logid: number;
  title: string;
  timestamp: string;
};

export type WikiSiteStats = {
  articles: number;
  users: number;
  edits: number;
  activeusers: number;
};
