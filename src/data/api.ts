import axiosCreate, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import Router from 'next/router';
import { GeneralMetadata, Metadata } from '../types/metadata';
import {
  AIExerciseType,
  AIPlanLesson,
  AnalyseType,
  ManualProgressInfo,
  MaterialType,
  PolyglotCourse,
  PolyglotCourseInfo,
  PolyglotFlow,
  PolyglotFlowInfo,
  ProgressInfo,
  SummerizerBody,
} from '../types/polyglotElements';
import {
  PapyAssignmentAPI,
  PapyProject,
} from '../types/polyglotElements/PapyrusTypes/PapyrusTypes';
import { User } from '../types/user';
import { createNewDefaultPolyglotFlow } from '../utils/utils';

export type aiAPIResponse = {
  Date: string;
  Question: string;
  CorrectAnswer: string;
};

const axios = axiosCreate.create({
  baseURL: process.env.BACK_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const axiosProgress = axiosCreate.create({
  baseURL: process.env.BACK_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const axiosPapyGame = axiosCreate.create({
  baseURL: 'https://papygame.tech/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

type AutocompleteOutput = string[];

export class APIV2 {
  [x: string]: any;
  axios: AxiosInstance;
  redirect401: boolean;
  redirect401URL?: string;
  error401: boolean;

  constructor(access_token: string | undefined) {
    this.redirect401 = false;
    this.error401 = true;
    this.axios = axiosCreate.create({
      baseURL: process.env.BACK_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: access_token ? 'Bearer ' + access_token : '',
      },
    });
  }

  autocomplete(query?: string): Promise<AxiosResponse<AutocompleteOutput>> {
    return this.axios.get('/api/search/autocomplete' + query);
  }
  getUserInfo(): Promise<AxiosResponse<User>> {
    return this.axios.get('/api/user/me');
  }
  logout(): Promise<AxiosResponse> {
    return this.axios.post('/api/auth/logout');
  }

  deleteFlow(flowId: string): Promise<AxiosResponse> {
    return this.axios.delete('/api/flows/' + flowId);
  }

  loadFlowElementsAsync(flowId: string): Promise<AxiosResponse<PolyglotFlow>> {
    return this.axios.get(`/api/flows/${flowId}`);
  }
  loadFlowList(query?: string): Promise<AxiosResponse<PolyglotFlow[]>> {
    return this.axios.get(`/api/flows` + (query ? query : ''));
  }
  createNewFlowAsync(): Promise<AxiosResponse> {
    return this.axios.post<{}, AxiosResponse, PolyglotFlow>(
      `/api/flows`,
      createNewDefaultPolyglotFlow()
    );
  }
  /*saveFlowAsync(flow: PolyglotFlow): Promise<AxiosResponse> {
    flow.nodes = flow.nodes?.map((e) =>
      polyglotNodeComponentMapping.applyTransformFunction(e)
    );
    flow.edges = flow.edges.filter((edge) => {
      const source = edge.reactFlow.source;
      const target = edge.reactFlow.target;
      return (
        flow.nodes.filter((node) => node._id === source || node._id === target)
          .length === 2
      );
    });
    flow.edges = flow.edges?.map((e) =>
      polyglotEdgeComponentMapping.applyTransformFunction(e)
    );
    return this.axios.put<{}, AxiosResponse, PolyglotFlow>(
      `/api/flows/${flow._id}`,
      flow
    );
  }*/
  createNewFlow(flow: PolyglotFlowInfo): Promise<AxiosResponse> {
    return this.axios.post<{}, AxiosResponse, {}>(`/api/flows`, flow);
  }
  createNewFlowJson(flow: PolyglotFlow): Promise<AxiosResponse> {
    return this.axios.post<{}, AxiosResponse, {}>(`/api/flows/json`, flow);
  }

  loadCourses(query?: string): Promise<AxiosResponse<PolyglotCourse[]>> {
    return this.axios.get('/api/course' + (query ? query : ''));
  }

  createNewCourse(course: PolyglotCourseInfo): Promise<AxiosResponse> {
    return this.axios.post('/api/course', course);
  }

  deleteCourse(courseId: string): Promise<AxiosResponse> {
    return this.axios.delete('/api/course/' + courseId);
  }
}

export const API = {
  autocomplete: (
    query?: string
  ): Promise<AxiosResponse<AutocompleteOutput>> => {
    return axios.get('/api/search/autocomplete?q=' + query);
  },
  getUserInfo: (): Promise<AxiosResponse<User>> => {
    return axios.get('/api/user/me');
  },

  loadFlowElementsAsync: (
    flowId: string
  ): Promise<AxiosResponse<PolyglotFlow>> => {
    return axios.get<PolyglotFlow>(`/api/flows/${flowId}`);
  },
  loadFlowList: (query?: string): Promise<AxiosResponse<PolyglotFlow[]>> => {
    const queryParams = query ? '?q=' + query : '';
    return axios.get(`/api/flows` + queryParams);
  },
  createNewFlowAsync: (): Promise<AxiosResponse> => {
    return axios.post<{}, AxiosResponse, PolyglotFlow>(
      `/api/flows`,
      createNewDefaultPolyglotFlow()
    );
  },
  createNewFlowJson(flow: PolyglotFlow): Promise<AxiosResponse> {
    return axios.post<{}, AxiosResponse, {}>(`/api/flows/json`, flow);
  },
  /*saveFlowAsync: (flow: PolyglotFlow): Promise<AxiosResponse> => {
    flow.nodes = flow.nodes?.map((e) =>
      polyglotNodeComponentMapping.applyTransformFunction(e)
    );
    flow.edges = flow.edges?.map((e) =>
      polyglotEdgeComponentMapping.applyTransformFunction(e)
    );
    return axios.put<{}, AxiosResponse, PolyglotFlow>(
      `/api/flows/${flow._id}`,
      flow
    );
  },*/
  createNewFlow: (flow: PolyglotFlow): Promise<AxiosResponse> => {
    return axios.post<{}, AxiosResponse, {}>(`/api/flows`, flow);
  },

  progressInfo: (body: ProgressInfo): Promise<AxiosResponse> => {
    return axiosProgress.post<{}, AxiosResponse, {}>(
      `/api/execution/progressInfo`,
      body
    );
  },

  manualProgress: (body: ManualProgressInfo): Promise<AxiosResponse> => {
    return axiosProgress.post<{}, AxiosResponse, {}>(
      `/api/execution/progressAction`,
      body
    );
  },

  resetProgress: (body: ManualProgressInfo): Promise<AxiosResponse> => {
    return axiosProgress.post<{}, AxiosResponse, {}>(
      `/api/execution/resetProgress`,
      body
    );
  },

  getActualNodeInfo: (body: { ctxId: string }): Promise<AxiosResponse> => {
    return axiosProgress.post<{}, AxiosResponse, {}>(
      `/api/execution/actual`,
      body
    );
  },

  //API for upload and download into database
  uploadFile: (body: {
    nodeId: string;
    file: FormData;
  }): Promise<AxiosResponse> => {
    return axiosProgress.post('/api/file/upload/' + body.nodeId, body.file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  downloadFile: (body: { nodeId: string }): Promise<AxiosResponse> => {
    return axiosProgress.get<AxiosResponse>(
      `/api/file/download/${body.nodeId}`,
      {
        responseType: 'blob',
      }
    );
  },

  analyseMaterial: (body: AnalyseType): Promise<AxiosResponse> => {
    return axios.post<{}, AxiosResponse, {}>(
      `/api/openai/MaterialAnalyser`,
      body
    );
  },

  generateMaterial: (body: MaterialType): Promise<AxiosResponse> => {
    return axios.post<{}, AxiosResponse, {}>(
      `/api/openai/MaterialGenerator`,
      body
    );
  },

  summarize: (body: SummerizerBody): Promise<AxiosResponse> => {
    return axios.post<{}, AxiosResponse, {}>(`/api/openai/Summarizer`, body);
  },

  generateNewExercise: (body: AIExerciseType): Promise<AxiosResponse> => {
    return axios.post<{}, AxiosResponse, {}>(
      `/api/openai/ActivityGenerator`,
      body
    );
  },

  planLesson: (body: AIPlanLesson): Promise<AxiosResponse> => {
    return axios.post<{}, AxiosResponse, {}>(`/api/openai/PlanLesson`, body);
  },

  getAssignmentProjects: (): Promise<AxiosResponse> => {
    return axiosPapyGame.get<{}, AxiosResponse, {}>(`/assignmentProjects`);
  },

  generateNewProject: (body: PapyProject): Promise<AxiosResponse> => {
    return axiosPapyGame.post<{}, AxiosResponse, {}>(
      `/newAssignmentProject`,
      body
    );
  },

  generateNewAssignment: (body: PapyAssignmentAPI): Promise<AxiosResponse> => {
    return axiosPapyGame.post<{}, AxiosResponse, {}>(`/newAssignment`, body);
  },
};
