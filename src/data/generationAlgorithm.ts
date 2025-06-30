import { AIExerciseGenerated, AIMaterialGenerated, Assignment, EducationLevel, LearningOutcome, PlanLessonNode, PolyglotNode, QuestionTypeMap } from "../types/polyglotElements";
import { API } from "./api";
import { v4 as UUIDv4 } from "uuid";

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

export const generateLessonFlow = async ({
  material,
  generatedLesson,
}: {
  material: string;
  generatedLesson: {
    title: string;
    macro_subject: string;
    education_level: EducationLevel;
    learning_outcome: LearningOutcome;
    prerequisites: string[];
    nodes: PlanLessonNode[];
    context: string;
    language: string;
    data: {
      assignment: Assignment;
      topic: {
        topic: string;
        explanation: string;
        learning_outcome?: LearningOutcome;
      }[];
    };
  };
}) => {
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
      description: exerciseResponse.macro_subject,
      platform: 'WebApp',
      difficulty: 1,
      data: data,
      reactFlow: {
        id: _id,
        type: typeNode,
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
  };

  generatedLesson.nodes.map((node) => {console.log(node);});
  
  const generatedNodes: PolyglotNode[] = [];
  let x = -195;
  let y = -210;
  let lastTopic: string | null = null;

  for (const [index, topicEntry] of generatedLesson.data.topic.entries()) {
    const currentTopic = topicEntry.topic;
    const explanation = topicEntry.explanation;
    const learning_outcome =
      topicEntry.learning_outcome || generatedLesson.learning_outcome;

    // 1. Se il topic è nuovo, genera un ReadMaterialNode
    if (currentTopic !== lastTopic) {
      lastTopic = currentTopic;

      try {
        const response = await API.generateMaterial({
          title: generatedLesson.title,
          macro_subject: generatedLesson.macro_subject,
          topics: [
            {
              topic: currentTopic,
              explanation: explanation,
              learning_outcome: learning_outcome,
            },
          ],
          education_level: generatedLesson.education_level,
          learning_outcome: generatedLesson.learning_outcome,
          duration: generatedLesson.nodes, // puoi parametrizzare se serve
          language: generatedLesson.language,
          model: 'Gemini',
        });

        const readMaterialGen: AIMaterialGenerated = response.data;
        const _id = UUIDv4();
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
        console.error('Errore nella generazione del materiale:', error);
      }
    }

    // 2. Genera l'assignement
    try {
      const assignment = generatedLesson.data.assignment;

      const typeExercise =
        assignment.type !== 'multiple choice'
          ? assignment.type
          : assignment.solutions_number > 1
          ? 'multiple select'
          : 'multiple choice';

      const response = await API.generateNewExercise({
        macro_subject: generatedLesson.macro_subject,
        topic: currentTopic,
        topic_explanation: explanation,
        education_level: generatedLesson.education_level,
        learning_outcome,
        material: material,
        solutions_number: assignment.solutions_number || 1,
        distractors_number: assignment.distractors_number || 2,
        easily_discardable_distractors_number:
          assignment.easily_discardable_distractors_number || 1,
        type: typeExercise,
        language: generatedLesson.language,
        model: 'Gemini',
      });

      handleResponseNewExercise(response, x, y, generatedNodes); // Assumendo che aggiorni i generatedNodes

    } catch (error) {
      console.error('Errore nella generazione dell’esercizio:', error);
    }

    // Avanzamento posizione
    x += 450;
    if (x > 1605) {
      x = -195;
      y += 195;
    }
  }

  return generatedNodes;
};
