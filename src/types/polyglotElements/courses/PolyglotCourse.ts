import { PolyglotFlow } from '../';

export type PolyglotCourseInfo = {
  img?: string;
  _id?: string;
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
};

export type PolyglotCourse = PolyglotCourseInfo & {
  flows: PolyglotFlow[];
};
