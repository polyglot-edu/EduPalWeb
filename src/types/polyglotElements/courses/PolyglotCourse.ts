import { EducationLevel, LearningOutcome, PolyglotFlow, Topic } from '../';

export type PolyglotCourseInfo = {
  img?: string;
  _id: string;
  title: string;
  description: string;
  flowsId?: string[];
  tags?: { name: string; color: string }[];
  author?: {
    _id?: string;
    username?: string;
  };
  published: boolean;
  lastUpdate: Date;
  nSubscribed?: number;
  nCompleted?: number;
  subjectArea?: string;
  learningContext?: string;
  duration?: number;
  topics?: string[];
  sourceMaterial?: string;
  learning_outcome?: LearningOutcome;
  topicsAI?: Topic[];
  language?: string;
  macro_subject?: string;
  education_level?: EducationLevel;
  context?: string;
};

export type PolyglotCourse = PolyglotCourseInfo & {
  flows: PolyglotFlow[];
};
