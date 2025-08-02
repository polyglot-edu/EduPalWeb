import { EducationLevel, LearningObjectives } from '..';

type SyllabusTopic = {
  macro_topic: string;
  details: string;
  learning_objectives: LearningObjectives;
};
export type PolyglotSyllabus = {
  _id: string;
  educational_level: EducationLevel;
  additional_information: string;
  title: string;
  description: string;
  goals: string[];
  topics: SyllabusTopic[];
  prerequisites: string[];
  language: string;
  author: {
    _id?: string;
    username?: string;
  };
  lastUpdate: Date;

  subjectArea: string;
  courseYear: string;
  studyRegulation: string;
  curriculumPath: string;
  studentPartition: string;
  integratedCourseUnit: string;
  courseType: string;
  department: string;
  academicYear: string;
  courseCode: string;
  courseOfStudy: string;
  semester: string;
  credits: number;
  teachingHours: number;
  disciplinarySector: string;
  teachingMethods: string[];
  assessmentMethods: string[];
  referenceMaterials: string[];
};
