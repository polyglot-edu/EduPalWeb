import { PolyglotFlow } from '../';

export type PolyglotCourseInfo = {
  _id?: string;
  title: string;
  description: string;
  flowsId?: string[];
  tags?: { name: string; color: string }[];
  author?: {
    _id?: string;
    username?: string;
  };
};

export type PolyglotCourse = PolyglotCourseInfo & {
  flows: PolyglotFlow[];
};
