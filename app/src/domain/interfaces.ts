import * as d3Sankey from "d3-sankey";

interface SNodeExtra {
  nodeId: number;
  name: string;
  color: string;
}

interface SLinkExtra {
  source: number;
  target: number;
  value: number;
}

type SNode = d3Sankey.SankeyNode<SNodeExtra, SLinkExtra>;
type SLink = d3Sankey.SankeyLink<SNodeExtra, SLinkExtra>;

export interface DAG {
  nodes: SNode[];
  links: SLink[];
  transactionsProcessed: number;
  totalQUIDD: number;
}
