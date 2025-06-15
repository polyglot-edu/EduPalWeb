export type ConceptNode = {
  _id: string;
  name: string;
};

export type ConceptEdge = {
  from: string;
  to: string;
};

export type ConceptMap = {
  _id?: string;
  nodes: ConceptNode[];
  edges: ConceptEdge[];
};
