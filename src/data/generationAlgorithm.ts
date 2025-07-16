import { MarkerType } from 'reactflow';
import { v4 as UUIDv4 } from 'uuid';
import {
  AIExerciseGenerated,
  AIExerciseType,
  AIMaterialGenerated,
  AIPlanLessonResponse,
  AnalyzedMaterial,
  EducationLevel,
  LearningObjectives,
  LearningOutcome,
  MaterialType,
  PlanLessonNode,
  PolyglotEdge,
  PolyglotFlow,
  PolyglotNode,
  QuestionTypeMap,
} from '../types/polyglotElements';
import { API } from './api';

function shuffleArray<T>(array: T[]) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const dataFactory: Record<string, (values: AIExerciseGenerated) => any> = {
  OpenQuestionNode: (values) => ({
    question: values.assignment,
    material: values.material,
    aiQuestion: false,
    possibleAnswer: values.solutions[0],
  }),
  closeEndedQuestionNode: (values) => ({
    question: values.assignment + ' ' + values.plus,
    correctAnswers: values.solutions,
    isAnswerCorrect: [],
  }),
  TrueFalseNode: (values) => {
    const solutions = values.solutions.map((s) => {
      const splitIndex = s.indexOf('. ');
      return splitIndex !== -1 ? s.slice(splitIndex + 2) : s;
    });
    const answers = [
      ...solutions,
      ...values.distractors,
      ...values.easily_discardable_distractors,
    ].filter((statement) => statement !== 'empty');
    const shuffleAnswers = shuffleArray(answers);

    const isAnswerCorrect = new Array(shuffleAnswers.length).fill(false);
    shuffleAnswers.forEach((value, index) => {
      if (values.solutions.includes(value)) isAnswerCorrect[index] = true;
    });
    return {
      instructions: values.assignment,
      questions: shuffleAnswers,
      isQuestionCorrect: isAnswerCorrect,
    };
  },
  multipleChoiceQuestionNode: (values) => {
    const answers = [
      ...values.solutions,
      ...values.distractors,
      ...values.easily_discardable_distractors,
    ].filter((statement) => statement !== 'empty');
    const shuffleAnswers = shuffleArray(answers);

    const isAnswerCorrect = new Array(shuffleAnswers.length).fill(false);
    shuffleAnswers.forEach((value, index) => {
      if (values.solutions.includes(value)) isAnswerCorrect[index] = true;
    });
    return {
      question: values.assignment,
      choices: shuffleAnswers,
      isChoiceCorrect: isAnswerCorrect,
    };
  },
};

type GenerateLessonActivitiesProp = {
  material: string;
  generatedLesson: AIPlanLessonResponse;
  setFlowNodes: React.Dispatch<React.SetStateAction<PolyglotNode[]>>;
  lessonNodes: PlanLessonNode[];
  analysedMaterial: AnalyzedMaterial;
  language: string;
};
export const generateLessonActivities = async ({
  material,
  generatedLesson,
  setFlowNodes,
  lessonNodes,
  analysedMaterial,
  language,
}: GenerateLessonActivitiesProp): Promise<PolyglotNode[]> => {
  const handleResponseNewExercise = (response: any, x: number, y: number) => {
    const exerciseResponse: AIExerciseGenerated = response.data;
    const _id = UUIDv4();
    const typeNode =
      QuestionTypeMap.find((type) => type.key == exerciseResponse.type)
        ?.nodeType || 'OpenQuestionNode';
    const data = dataFactory[typeNode]?.(exerciseResponse) || null;
    generatedNodes.push({
      _id: _id,
      type: typeNode,
      title: exerciseResponse.topic,
      description: exerciseResponse.topic_explanation,
      platform: 'WebApp',
      difficulty: 1,
      data: data,
      reactFlow: {
        id: _id,
        type: typeNode,
        position: { x, y },
        width: 88,
        height: 46,
        selected: false,
        dragging: false,
        positionAbsolute: { x, y },
        data: {},
      },
    });
    setFlowNodes((prev) => [
      ...prev,
      {
        _id: _id,
        type: typeNode,
        title: exerciseResponse.topic,
        description: exerciseResponse.topic_explanation,
        platform: 'WebApp',
        difficulty: 1,
        data: data,
        reactFlow: {
          id: _id,
          type: typeNode,
          position: { x, y },
          width: 88,
          height: 46,
          selected: false,
          dragging: false,
          positionAbsolute: { x, y },
          data: {},
        },
      },
    ]);
    console.log('exercise generation');
    console.log({
      _id: _id,
      type: typeNode,
      title: exerciseResponse.topic,
      description: exerciseResponse.topic_explanation,
      platform: 'WebApp',
      difficulty: 1,
      data: data,
      reactFlow: {
        id: _id,
        type: typeNode,
        position: { x, y },
        width: 88,
        height: 46,
        selected: false,
        dragging: false,
        positionAbsolute: { x, y },
        data: {},
      },
    });
    console.log('________________________');
  };

  const generatedNodes: PolyglotNode[] = [];
  let x = -195;
  let y = -210;
  const doneTopics: { topic: string; explanation: string }[] = [];

  // Usa for...of per aspettare correttamente
  for (const lNode of lessonNodes) {
    const currentTopic = lNode.topic;
    const explanation =
      analysedMaterial.topics.find((t) => t.topic == currentTopic)
        ?.explanation || '';
    const learning_outcome =
      lNode.learning_outcome || generatedLesson.learning_outcome;

    if (!doneTopics.find((t) => t.topic == currentTopic)) {
      doneTopics.push({ topic: currentTopic, explanation: explanation });
      let toDoTopics: { topic: string; explanation: string }[] = [];

      for (const t of analysedMaterial.topics) {
        toDoTopics.push({
          topic: t.topic,
          explanation: t.explanation,
        });
        if (t.topic === currentTopic) break;
      }

      toDoTopics = toDoTopics.filter(
        (topicObj) =>
          !doneTopics.some((doneObj) => doneObj.topic === topicObj.topic)
      );

      try {
        const response = await API.generateMaterial({
          title: generatedLesson.title,
          macro_subject: generatedLesson.macro_subject,
          topics: [
            {
              topics: toDoTopics,
              title: '',
              learning_outcome: learning_outcome,
            },
          ],
          education_level: generatedLesson.education_level,
          learning_outcome: lNode.learning_outcome,
          duration: lNode.duration,
          language: language,
          model: 'Gemini',
        } as MaterialType);

        const readMaterialGen: AIMaterialGenerated = response.data;
        const _id = UUIDv4();
        setFlowNodes((prev) => [
          ...prev,
          {
            _id,
            type: 'ReadMaterialNode',
            title: readMaterialGen.title,
            description: readMaterialGen.macro_subject,
            difficulty: 1,
            platform: 'WebApp',
            data: {
              text: readMaterialGen.material,
              link: '',
            },
            reactFlow: {
              id: _id,
              type: 'ReadMaterialNode',
              position: { x, y },
              width: 88,
              height: 46,
              selected: false,
              dragging: false,
              positionAbsolute: { x, y },
              data: {},
            },
          },
        ]);
        generatedNodes.push({
          _id,
          type: 'ReadMaterialNode',
          title: readMaterialGen.title,
          description: readMaterialGen.macro_subject,
          difficulty: 1,
          platform: 'WebApp',
          data: {
            text: readMaterialGen.material,
            link: '',
          },
          reactFlow: {
            id: _id,
            type: 'ReadMaterialNode',
            position: { x, y },
            width: 88,
            height: 46,
            selected: false,
            dragging: false,
            positionAbsolute: { x, y },
            data: {},
          },
        });
      } catch (error) {
        console.error('Error on material generation:', error);
      }
    }
    console.log('generating');
    try {
      const typeExercise =
        lNode.type !== 'multiple choice'
          ? lNode.type
          : lNode.data.solutions_number > 1
          ? 'multiple select'
          : 'multiple choice';

      const response = await API.generateNewExercise({
        macro_subject: generatedLesson.macro_subject,
        topic: currentTopic,
        topic_explanation: explanation,
        education_level: generatedLesson.education_level,
        learning_outcome,
        material: material,
        solutions_number: lNode.data.solutions_number || 1,
        distractors_number: lNode.data.distractors_number || 2,
        easily_discardable_distractors_number:
          lNode.data.easily_discardable_distractors_number || 1,
        type: typeExercise,
        language: generatedLesson.language,
        model: 'Gemini',
      } as AIExerciseType);

      handleResponseNewExercise(response, x, y);
    } catch (error) {
      console.error('Error on exercise generation:', error);
    }

    x += 450;
    if (x > 1605) {
      x = -195;
      y += 195;
    }

    console.log(lNode);
  }

  // aggiungi nodo finale
  const idEnd = UUIDv4();
  generatedNodes.push({
    _id: idEnd,
    type: 'ReadMaterialNode',
    title: 'End',
    description: 'End of the learning path',
    difficulty: 1,
    platform: 'WebApp',
    data: {
      text:
        'You have completed this learning path on ' +
        analysedMaterial.macro_subject +
        ', congratulation!',
      link: '',
    },
    reactFlow: {
      id: idEnd,
      type: 'ReadMaterialNode',
      position: { x, y },
      width: 88,
      height: 46,
      selected: false,
      dragging: false,
      positionAbsolute: { x, y },
      data: {},
    },
  });

  return generatedNodes;
};

type GenerateLessonFlowProp = {
  material: string;
  generatedLesson: AIPlanLessonResponse;
  lessonNodes: PlanLessonNode[];
  setFlowNodes: React.Dispatch<React.SetStateAction<PolyglotNode[]>>;
  analysedMaterial: AnalyzedMaterial | undefined;
  context: string;
  language: string;
};
export const generateLessonFlow = async ({
  material,
  generatedLesson,
  lessonNodes,
  setFlowNodes,
  analysedMaterial,
  context,
  language,
}: GenerateLessonFlowProp): Promise<PolyglotFlow> => {
  if (!analysedMaterial) throw 'AnalyzedMaterial not Found';
  const generatedNodes: PolyglotNode[] = await generateLessonActivities({
    material,
    lessonNodes,
    generatedLesson,
    analysedMaterial,
    setFlowNodes,
    language,
  });
  const generatedEdges: PolyglotEdge[] = [];

  //edges generation
  const length = generatedNodes.length;
  const toDoTopics: {
    topic: string;
    explanation: string;
    learning_outcome: LearningOutcome;
  }[] = [];

  for (const t of analysedMaterial.topics) {
    toDoTopics.push({
      topic: t.topic,
      explanation: t.explanation,
      learning_outcome: analysedMaterial.learning_outcome,
    });
  }
  for (let i = 0; i < length; i++) {
    const node = generatedNodes[i];
    const nextNode = generatedNodes[i + 1];

    if (node.title != 'End')
      if (node.type == 'ReadMaterialNode') {
        const id = UUIDv4();
        generatedEdges.push({
          _id: id,
          type: 'unconditionalEdge',
          code: `
                    async Task<(bool, string)> validate(PolyglotValidationContext context) {
                        return (true, "Unconditional edge");
                    }
                    `,
          data: {
            conditionKind: 'pass',
          },
          reactFlow: {
            id: id,
            source: node._id,
            target: nextNode._id,
            type: 'unconditionalEdge',
            markerEnd: {
              color: 'grey',
              type: MarkerType.Arrow,
              width: 25,
              height: 25,
            },
            selected: true,
          },
          title: 'next',
        });
      } else {
        const idRecovery = UUIDv4();
        const x = node.reactFlow.position.x;
        const y = node.reactFlow.position.y + 100;

        generatedNodes.push({
          _id: idRecovery,
          type: 'abstractNode',
          title: 'Recovery Activity',
          description: 'Recovery activity',
          platform: 'Library',
          difficulty: 1,
          data: {
            useFlowData: true,
            sourceMaterial: material,
            learning_outcome: analysedMaterial.learning_outcome,
            education_level: analysedMaterial.education_level,
            topicsAI: toDoTopics,
            language: analysedMaterial.language,
            macro_subject: analysedMaterial.macro_subject,
            title: analysedMaterial.title,
            context: context,
          },
          reactFlow: {
            id: idRecovery,
            type: 'abstractNode',
            position: {
              x: x,
              y: y,
            },
            width: 88,
            height: 46,
            selected: false,
            dragging: false,
            positionAbsolute: {
              x: x,
              y: y,
            },
            data: {},
          },
        });
        const id1 = UUIDv4();
        generatedEdges.push({
          _id: id1,
          type: 'passFailEdge',
          code: `\nasync Task<(bool, string)> validate(PolyglotValidationContext context) {\n    var getMultipleChoiceAnswer = () => {\n        var submitted = context.JourneyContext.EventsProduced.OfType<ReturnValueProduced>().FirstOrDefault()?.Value as HashSet<string>;\n        var answersCorrect = ((List<object>)context.Exercise.Data.isChoiceCorrect).Select((c, i) => (c, i))\n                                                                                .Where(c => bool.Parse(c.c.ToString()))\n                                                                                .Select(c => (c.i + 1).ToString())\n                                                                                .ToHashSet();\n        return submitted.SetEquals(answersCorrect);\n    };\n\n    var isSubmissionCorrect = context.Exercise.NodeType switch\n    {\n        \"multipleChoiceQuestionNode\" => getMultipleChoiceAnswer(),\n        _ => context.Exercise.Data.correctAnswers.Contains(context.JourneyContext.SubmittedCode),\n    };\n\n    var conditionKind = context.Condition.Data.conditionKind switch\n    {\n        \"pass\" => true,\n        \"fail\" => false,\n        _ => throw new Exception(\"Unknown condition kind\")\n    };\n    return (conditionKind == isSubmissionCorrect, \"Pass/Fail edge\");\n}    \n
                    `,
          data: {
            conditionKind: 'pass',
          },
          reactFlow: {
            id: id1,
            source: node._id,
            target: nextNode._id,
            type: 'passFailEdge',
            markerEnd: {
              color: 'green',
              type: MarkerType.Arrow,
              width: 25,
              height: 25,
            },
            selected: true,
          },
          title: 'pass',
        });
        const id2 = UUIDv4();
        generatedEdges.push({
          _id: id2,
          type: 'passFailEdge',
          code: `\nasync Task<(bool, string)> validate(PolyglotValidationContext context) {\n    var getMultipleChoiceAnswer = () => {\n        var submitted = context.JourneyContext.EventsProduced.OfType<ReturnValueProduced>().FirstOrDefault()?.Value as HashSet<string>;\n        var answersCorrect = ((List<object>)context.Exercise.Data.isChoiceCorrect).Select((c, i) => (c, i))\n                                                                                .Where(c => bool.Parse(c.c.ToString()))\n                                                                                .Select(c => (c.i + 1).ToString())\n                                                                                .ToHashSet();\n        return submitted.SetEquals(answersCorrect);\n    };\n\n    var isSubmissionCorrect = context.Exercise.NodeType switch\n    {\n        \"multipleChoiceQuestionNode\" => getMultipleChoiceAnswer(),\n        _ => context.Exercise.Data.correctAnswers.Contains(context.JourneyContext.SubmittedCode),\n    };\n\n    var conditionKind = context.Condition.Data.conditionKind switch\n    {\n        \"pass\" => true,\n        \"fail\" => false,\n        _ => throw new Exception(\"Unknown condition kind\")\n    };\n    return (conditionKind == isSubmissionCorrect, \"Pass/Fail edge\");\n}    \n
                    `,
          data: {
            conditionKind: 'fail',
          },
          reactFlow: {
            id: id2,
            source: node._id,
            target: idRecovery,
            type: 'passFailEdge',
            markerEnd: {
              color: 'red',
              type: MarkerType.Arrow,
              width: 25,
              height: 25,
            },
            selected: true,
          },
          title: 'fail',
        });
        const id3 = UUIDv4();
        generatedEdges.push({
          _id: id3,
          type: 'passFailEdge',
          code: `\nasync Task<(bool, string)> validate(PolyglotValidationContext context) {\n    var getMultipleChoiceAnswer = () => {\n        var submitted = context.JourneyContext.EventsProduced.OfType<ReturnValueProduced>().FirstOrDefault()?.Value as HashSet<string>;\n        var answersCorrect = ((List<object>)context.Exercise.Data.isChoiceCorrect).Select((c, i) => (c, i))\n                                                                                .Where(c => bool.Parse(c.c.ToString()))\n                                                                                .Select(c => (c.i + 1).ToString())\n                                                                                .ToHashSet();\n        return submitted.SetEquals(answersCorrect);\n    };\n\n    var isSubmissionCorrect = context.Exercise.NodeType switch\n    {\n        \"multipleChoiceQuestionNode\" => getMultipleChoiceAnswer(),\n        _ => context.Exercise.Data.correctAnswers.Contains(context.JourneyContext.SubmittedCode),\n    };\n\n    var conditionKind = context.Condition.Data.conditionKind switch\n    {\n        \"pass\" => true,\n        \"fail\" => false,\n        _ => throw new Exception(\"Unknown condition kind\")\n    };\n    return (conditionKind == isSubmissionCorrect, \"Pass/Fail edge\");\n}    \n
                    `,
          data: {
            conditionKind: 'pass',
          },
          reactFlow: {
            id: id3,
            source: idRecovery,
            target: nextNode._id,
            type: 'passFailEdge',
            markerEnd: {
              color: 'green',
              type: MarkerType.Arrow,
              width: 25,
              height: 25,
            },
            selected: true,
          },
          title: 'pass',
        });
      }
  }
  const tags: { name: string; color: string }[] = [
    { name: analysedMaterial.keywords[0], color: 'green' },
    { name: analysedMaterial.keywords[1], color: 'red' },
    { name: analysedMaterial.keywords[2], color: 'purple' },
    { name: analysedMaterial.keywords[3], color: 'blue' },
  ];
  const topics = analysedMaterial.topics.map((t) => t.topic);
  const flow: PolyglotFlow = {
    _id: UUIDv4(),
    title: generatedLesson.title,
    description: generatedLesson.macro_subject,
    tags: tags,
    education_level: generatedLesson.education_level,
    learning_outcome: generatedLesson.learning_outcome,
    nodes: generatedNodes,
    edges: generatedEdges,
    context: context,
    language: language,
    learningContext: generatedLesson.context,
    topics: topics,
    publish: false,
    topicsAI: toDoTopics,
    duration: analysedMaterial.estimated_duration.toString(),
  };
  const newFlow = (await API.createNewFlowJson(flow)).data as PolyglotFlow;

  return newFlow;
};

export const generateCourse = async ({
  title,
  subjectArea,
  educationLevel,
  language,
  description,
  learningObjectives,
  duration,
  prerequisites,
  targetAudience,
  classContext,
  accessCode,
  analysedMaterial,
  material,
  img,
  tags,
  flowsId,
}: {
  title: string;
  subjectArea: string;
  educationLevel: EducationLevel;
  language: string;
  description: string;
  learningObjectives: LearningObjectives;
  duration: string;
  prerequisites: string;
  targetAudience: string;
  classContext: string;
  accessCode?: string;
  analysedMaterial?: AnalyzedMaterial;
  material?: string;
  img?: string;
  tags: { name: string; color: string }[];
  flowsId: string[];
}) => {
  const _id = UUIDv4();
  const languageCheck =
    language != '' ? language : analysedMaterial?.language || 'english';
  const newCourse = {
    _id,
    title,
    subjectArea,
    education_level: educationLevel,
    language: languageCheck,
    description,
    learningObjectives: learningObjectives,
    duration: duration,
    prerequisites: prerequisites
      ? prerequisites.split(',').map((p) => p.trim())
      : [],
    context: classContext,
    learningContext: targetAudience,
    accessCode,
    sourceMaterial: material || '',
    img,
    tags,
    topicsAI: analysedMaterial?.topics || [],
    macro_subject: analysedMaterial?.macro_subject || subjectArea,
    flowsId,
    published: false,
    lastUpdate: new Date(),
    topics: analysedMaterial?.topics?.map((t) => t.topic) || [],
    author: {
      _id: 'guest',
      username: 'guest',
    },
    nSubscribed: 0,
    nCompleted: 0,
  };

  return (await API.createNewCourseJson(newCourse)).data;
};
