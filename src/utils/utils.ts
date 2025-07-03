import { useEffect, useState } from 'react';
import { MarkerType } from 'reactflow';
import { v4 as UUIDv4 } from 'uuid';
import { PolyglotEdge, PolyglotFlow } from '../types/polyglotElements';

// fix zust persist issue https://github.com/pmndrs/zustand/issues/324
// if an error like Extra attributes from the server appear use this hook
export const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated;
};

export const isObject = (variable: any) => {
  return (
    typeof variable === 'object' &&
    !Array.isArray(variable) &&
    variable !== null
  );
};

export const useToggleCSSVariable = (variable: string, values: string[]) => {
  if (values.length <= 0) {
    throw new Error(
      'useToggleCSSVariable: values must be an array with at least one element'
    );
  }

  const [currentIndex, setIndex] = useState<number>(0);
  document.documentElement.style.setProperty(variable, values[currentIndex]);

  function handleChange() {
    setIndex((currentIndex + 1) % values.length);
    document.documentElement.style.setProperty(variable, values[currentIndex]);
  }

  return {
    index: currentIndex,
    value: values[currentIndex],
    toggle: handleChange,
  };
};

export const zip = <T, K>(a: T[], b: K[]) =>
  a.map((k, i) => ({ first: k, second: b[i] }));

export const createNewDefaultPolyglotFlow = (): PolyglotFlow => {
  return {
    id: UUIDv4(),
    title: 'New Flow',
    description: '',
    publish: false,
    tags: [],
    topics: [],
    topicsAI: [],
    learningContext: '',
    duration: '0',
    nodes: [],
    edges: [],
  };
};

export const createNewDefaultPolyglotNode: (
  pos: { x: number; y: number },
  nodeType?: string
) => any = (pos, nodeType = 'multipleChoiceQuestionNode') => {
  const id = UUIDv4();
  return {
    _id: id,
    type: nodeType,
    title: 'New Node',
    description: '',
    difficulty: 1,
    platform: '', //polyglotNodeComponentMapping.defaultPlatformMapping[nodeType], //removed to fast fix the code
    data: {}, //polyglotNodeComponentMapping.defaultDataMapping[nodeType],//removed to fast fix the code
    reactFlow: {
      id: id,
      type: nodeType,
      position: pos,
    },
  };
};

const configUnconditionalEdge = [
  'lessonTextNode',
  'WatchVideoNode',
  'ReadMaterialNode',
  'ScanningNode',
  'MindMapNode',
  'SummaryNode',
  'ProblemSolvingNode',
  'FindSolutionNode',
  'CreateKeywordsListNode',
  'MemoriseKeywordsListNode',
  'PromptEngineeringNode',
  'ProblemSolvingNode',
  'CodingQuestionNode',
];

export const createNewDefaultPolyglotEdge = (
  sourceId: string,
  sourceType: string,
  targetId: string
): PolyglotEdge => {
  const id = UUIDv4();
  const type = configUnconditionalEdge.includes(sourceType || '')
    ? 'unconditionalEdge'
    : 'passFailEdge'; //to change into group type (learning)
  console.log(type);
  return {
    _id: id,
    reactFlow: {
      id: id,
      source: sourceId,
      target: targetId,
      type: type,
      markerEnd: {
        color: type == 'unconditionalEdge' ? 'grey' : 'green',
        type: MarkerType.Arrow,
        width: 25,
        height: 25,
      },
    },
    type: type,
    title: '',
    code: `
    async Task<(bool, string)> validate(PolyglotValidationContext context) {
        return (String.Equals(context.Condition.Data.value, context.JourneyContext.SubmittedCode), "Exact value edge");
    }`,
    data: {
      conditionKind: 'pass',
    },
  };
};
