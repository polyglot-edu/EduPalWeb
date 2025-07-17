import { EducationLevel, LearningObjectives, PolyglotFlow, Topic } from '../';

export type PolyglotCourse = {
  _id: string;
  title: string;
  description: string;
  subjectArea: string;
  macro_subject: string;
  education_level: EducationLevel;
  language: string;
  duration: string;
  learningObjectives: LearningObjectives;
  goals: string[];
  prerequisites: string[];
  topics: string[];
  topicsAI: Topic[];
  tags: { name: string; color: string }[];
  img?: string;
  accessCode?: string;
  sourceMaterial?: string;
  classContext: string;
  flowsId: string[];
  author: {
    _id?: string;
    username?: string;
  };
  targetAudience: string;
  published: boolean;
  lastUpdate: Date;
  nSubscribed: number;
  nCompleted: number;
};

export type PolyglotCourseWithFlows = PolyglotCourse & {
  flows: PolyglotFlow[];
};
