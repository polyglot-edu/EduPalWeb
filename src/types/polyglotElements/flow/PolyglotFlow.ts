import { EducationLevel, LearningOutcome, Topic } from '..';
import { PolyglotEdge, PolyglotNode } from '../node';

export type PolyglotFlowInfo = {
  _id: string;
  title: string;
  author?: {
    _id?: string;
    username?: string;
  };
  description: string;
  tags: { name: string; color: string }[];
  learningContext: string;
  duration: string;
  topics: string[];
  publish: boolean;
  sourceMaterial?: string;
  learning_outcome?: LearningOutcome;
  education_level?: EducationLevel;
  topicsAI: Topic[];
  language?: string;
  macro_subject?: string;
  context?: string;
};

export type PolyglotFlow = PolyglotFlowInfo & {
  nodes: PolyglotNode[];
  edges: PolyglotEdge[];
};

export type ProgressInfo = {
  flowId: string;
  userId: string;
};

export type ManualProgressInfo = {
  ctxId: string;
  satisfiedConditions?: string[];
  flowId?: string;
  authorId: string;
};

export type UserBaseInfo = {
  ctx: {
    flowId: string;
    username: string;
    currentNode: string;
    conditions: [{ edgeId: string; conditionKind: string }];
  };
  key: string;
};

export type PolyglotNodeValidation = PolyglotNode & {
  validation: {
    id: string;
    title: string;
    code: string;
    data: any;
    type: string;
  }[];
};
