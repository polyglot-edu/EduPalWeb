export type PapyProject = {
  nomeUtente: string;
};

export type PapyTag = { name: string; color: string; _id: string };
export type PapyAssignment = {
  projectId: string;
  assignmentText: string;
  assignmentTitle: string;
  tags: PapyTag[];
};
export type PapyAssignmentAPI = {
  project_id: string;
  assignment_text: string;
  assignment_title: string;
  tags: PapyTag[];
};
