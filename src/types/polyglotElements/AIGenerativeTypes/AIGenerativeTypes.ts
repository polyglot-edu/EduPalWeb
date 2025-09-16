export enum EducationLevel {
  ElementarySchool = 'elementary school',
  MiddleSchool = 'middle school',
  HighSchool = 'high school',
  College = 'college',
  Graduate = 'graduate',
  Professional = 'professional',
}

export enum LearningOutcome {
  RecallRecognize = 'the ability to recall or recognize simple facts and definitions',
  ExplainRelate = 'the ability to explain concepts and principles, and recognize how different ideas are related',
  ApplyKnowledge = 'the ability to apply knowledge and perform operations in practical contexts',
  SelfAssess = 'the ability to assess your own understanding, identify gaps in knowledge, and strategize ways to close those gaps',
  SynthesizeOrganize = 'the ability to synthesize and organize concepts into a framework that allows for advanced problem-solving and prediction',
  GenerateContribute = 'the ability to generate new knowledge, challenge existing paradigms, and make significant contributions to the field',
}

export const QuestionTypeMap = [
  {
    key: 'open question',
    text: 'Open Question',
    nodeType: 'OpenQuestionNode',
    integrated: true,
    defaultData: {
      solutions_number: 1,
      distractors_number: 2,
      easily_discardable_distractors_number: 1,
    },
  },
  {
    key: 'short answer question',
    text: 'Short Answer Question',
    nodeType: 'closeEndedQuestionNode',
    integrated: true,
    defaultData: {
      solutions_number: 1,
      distractors_number: 2,
      easily_discardable_distractors_number: 1,
    },
  },
  {
    key: 'true or false',
    text: 'True or False',
    nodeType: 'TrueFalseNode',
    integrated: true,
    defaultData: {
      solutions_number: 1,
      distractors_number: 2,
      easily_discardable_distractors_number: 1,
    },
  },
  {
    key: 'fill in the blanks',
    text: 'Fill in the Blanks',
    nodeType: 'activity',
    integrated: false,
    defaultData: {},
  },
  {
    key: 'matching',
    text: 'Matching',
    nodeType: 'activity',
    integrated: false,
    defaultData: {},
  },
  {
    key: 'ordering',
    text: 'Ordering',
    nodeType: 'activity',
    integrated: false,
    defaultData: {},
  },
  {
    key: 'multiple choice',
    text: 'Multiple Choice',
    nodeType: 'multipleChoiceQuestionNode',
    integrated: true,
    defaultData: {
      solutions_number: 1,
      distractors_number: 2,
      easily_discardable_distractors_number: 1,
    },
  },
  {
    key: 'multiple select',
    text: 'Multiple Select',
    nodeType: 'multipleChoiceQuestionNode',
    integrated: false,
    defaultData: {},
  },
  {
    key: 'coding',
    text: 'Coding',
    nodeType: 'codingQuestionNode', //da capire se si può usare per il tool che ha fatto riccardo
    integrated: false,
    defaultData: {},
  },
  {
    key: 'essay',
    text: 'Essay',
    nodeType: 'activity',
    integrated: false,
    defaultData: {},
  },
  {
    key: 'knowledge exposition',
    text: 'Knowledge Exposition',
    nodeType: 'InnovationPitchNode', //forse si può cambiare in un generale "PitchNode"
    integrated: false,
    defaultData: {},
  },
  {
    key: 'debate',
    text: 'Debate',
    nodeType: 'activity',
    integrated: false,
    defaultData: {},
  },
  {
    key: 'brainstorming',
    text: 'Brainstorming',
    nodeType: 'BrainstormingNode',
    integrated: false,
    defaultData: {},
  },
  {
    key: 'group discussion',
    text: 'Group Discussion',
    nodeType: 'activity',
    integrated: false,
    defaultData: {},
  },
  {
    key: 'simulation',
    text: 'Simulation',
    nodeType: 'SimulationNode',
    integrated: false,
    defaultData: {},
  },
  {
    key: 'inquiry based learning',
    text: 'Inquiry-Based Learning',
    nodeType: 'activity',
    integrated: false,
    defaultData: {},
  },
  {
    key: 'non written material analysis',
    text: 'Non-Written Material Analysis',
    nodeType: 'activity',
    integrated: false,
    defaultData: {},
  },
  {
    key: 'non written material production',
    text: 'Non-Written Material Production',
    nodeType: 'ImageEvaluationNode', //oppure c'è anche AnalyzingPlottingDataNode
    integrated: false,
    defaultData: {},
  },
  {
    key: 'case study analysis',
    text: 'Case Study Analysis',
    nodeType: 'CasesEvaluationNode',
    integrated: false,
    defaultData: {},
  },
  {
    key: 'project based learning',
    text: 'Project-Based Learning',
    nodeType: 'activity',
    integrated: false,
    defaultData: {},
  },
  {
    key: 'problem solving activity',
    text: 'Problem Solving Activity',
    nodeType: 'ProblemSolvingNode', //oppure c'è anche FindSolutionNode
    integrated: false,
    defaultData: {},
  },
];

export enum SummarizeStyle {
  TopicSynthetic = 'topic / synthetic',
  StandardDescriptive = 'standard descriptive',
  Abstractive = 'abstractive',
  Extractive = 'extractive',
  ExplanatoryEvaluative = 'explanatory and evaluative',
  Informal = 'informal',
  StructuredInformative = 'structured and informative',
}

export type LearningObjectives = {
  knowledge: string;
  skills: string;
  attitude: string;
};

export type Assignment = {
  learning_outcome: LearningOutcome;
  type: string;
  data: any;
};

export type Topic = {
  topic: string;
  explanation: string;
  learning_outcome?: LearningOutcome;
  assignments?: Assignment[];
};

export type LessonNodeAI = {
  title: string;
  learning_outcome: LearningOutcome;
  topics: Topic[];
};

export type AnalyseType = {
  file: string;
  url: string;
  model?: string;
};

export type AnalyzedMaterial = {
  title: string;
  macro_subject: string;
  education_level: EducationLevel;
  learning_outcome: LearningOutcome;
  language: string;
  topics: Topic[];
  keywords: string[];
  prerequisites: string[];
  estimated_duration: number;
};

export type ParamsExercise = {
  solutions_number: number;
  distractors_number: number;
  easily_discardable_distractors_number: number;
  type: string;
};

export type AIExerciseType = {
  macro_subject: string;
  topic: string;
  topic_explanation: string;
  education_level: EducationLevel;
  learning_outcome: LearningOutcome;
  material: string;
  params: ParamsExercise[];
  language: string;
  model: string;
};

export type GeneratedActivity = {
  assignment: string;
  plus: string;
  solutions: string[];
  distractors: string[];
  easily_discardable_distractors: string[];
};

export type AIExerciseResponse = {
  macro_subject: string;
  topic: string;
  topic_explanation: string;
  education_level: EducationLevel;
  learning_outcome: LearningOutcome;
  material: string;
  params: ParamsExercise[];
  generated_activities: GeneratedActivity[];
  language: string;
  model: string;
};

export type LOType = {
  //outdate
  Topic: string;
  Level: number;
  Context: string;
};

export type AIMaterialType = {
  title: string;
  macro_subject: string;
  topics: LessonNodeAI[];
  education_level: EducationLevel;
  learning_outcome: LearningOutcome;
  duration: number;
  language: string;
  model: string;
  type_of_file: string;
};

export type AIMaterialGenerated = { type_of_file: string; content: any };

export type SummerizerBody = {
  text: string;
  model: string;
  style: SummarizeStyle;
  education_level: EducationLevel;
  learning_outcome: LearningOutcome;
};

export type AIPlanCourse = {
  title: string;
  macro_subject: string;
  education_level: EducationLevel;
  learning_objectives: LearningObjectives;
  number_of_lessons: number;
  duration_of_lesson: number;
  language: string;
  model: string; // opzionale, default "Gemini"
};

export type AIPlanLesson = {
  topics: Topic[];
  learning_outcome: LearningOutcome;
  language: string;
  macro_subject: string;
  title: string;
  education_level: EducationLevel;
  context: string;
  model: string;
};

export type PlanLessonNode = {
  type: string;
  topic: string;
  details: string;
  learning_outcome: LearningOutcome;
  duration: number;
  data: any;
};

export type AIPlanLessonResponse = {
  title: string;
  macro_subject: string;
  education_level: EducationLevel;
  learning_outcome: LearningOutcome;
  prerequisites: string[];
  nodes: PlanLessonNode[];
  context: string;
  language: string;
  data?: any;
};

export type AIPlanCourseResponse = {
  title: string;
  macro_subject: string;
  education_level: EducationLevel;
  learning_objectives: LearningObjectives;
  number_of_lessons: number;
  duration_of_lesson: number;
  prerequisites: string[];
  nodes: LessonNodeAI[];
  language?: string; // default to "English"
};

export type SyllabusTopic = {
  macro_topic: string;
  details: string;
  learning_objectives: LearningObjectives;
};

export type AIDefineSyllabus = {
  general_subject: string;
  additional_information: string;
  education_level: EducationLevel;
  language?: string; // default to "English"
  model?: string;
};

export type AIDefineSyllabusResponse = {
  general_subject: string;
  educational_level: EducationLevel;
  additional_information: string;
  title: string;
  description: string;
  goals: string[];
  topics: SyllabusTopic[];
  prerequisites: string[];
  language: string;
};

//chat types

export type AIChatMessage = {
  role: 'user' | 'planner' | 'assistant' | 'tool' | 'grounding';
  content: string;
  timestamp: Date;
  in_memory: boolean;
  system_instructions: string;
  resources: any[];
  model?: string;
};

export type AIChatResponse = {
  content: any;
  role: 'user' | 'planner' | 'assistant' | 'tool' | 'grounding';
  timestamp: Date;
  in_memory: boolean;
  system_instructions?: string;
  resources: any[];
  toolResponse?: any;
};
