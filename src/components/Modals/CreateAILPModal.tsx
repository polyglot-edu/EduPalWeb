import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { MarkerType } from 'reactflow';
import { v4 as UUIDv4 } from 'uuid';
import { API } from '../../data/api';
import {
  AIExerciseGenerated,
  AIMaterialGenerated,
  AIPlanLessonResponse,
  AnalyzedMaterial,
  EducationLevel,
  LearningOutcome,
  LessonNodeAI,
  PlanLessonNode,
  PolyglotEdge,
  PolyglotFlow,
  PolyglotNode,
  QuestionTypeMap,
  Topic,
} from '../../types/polyglotElements';
import PlanLessonCard from '../Card/PlanLessonCard';
import InfoButton from '../UtilityComponents/InfoButton';
import ProgressBar from '../UtilityComponents/ProgressBar';

export type ModaTemplateProps = {
  isOpen: boolean;
  onClose: () => void;
  action?: (i: boolean) => void;
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

const CreateAILPModal = ({ isOpen, onClose, action }: ModaTemplateProps) => {
  const [analysedMaterial, setAnalyzedMaterial] = useState<AnalyzedMaterial>();
  const [generatingLoading, setGeneratingLoading] = useState(false);
  const [sourceMaterial, setSourceMaterial] = useState('');
  const [context, setContext] = useState('');
  const [AINodes, setAINodes] = useState<AIPlanLessonResponse>();
  const [selectedNodes, setSelectedNodes] = useState<AIPlanLessonResponse>();
  const [learningOutcome, setLearningOutcome] = useState<LearningOutcome>();
  const [eduLevel, setEduLevel] = useState<EducationLevel>();
  const [selectedTopic, setSelectedTopic] = useState<Topic[]>([]);
  const [selectedNodeIds, setSelectedNodeIds] = useState<number[]>([]);
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);
  const [nReadMaterial, setNReadMaterial] = useState(1);
  const [stepGeneration, setStepGeneration] = useState(0);
  const [screen1, setScreen1] = useState(true);
  const [screen2, setScreen2] = useState(false);
  const [screen3, setScreen3] = useState(false);
  const generatedNodes: PolyglotNode[] = [];

  const router = useRouter();

  useEffect(() => {
    if (analysedMaterial) {
      setScreen1(false);
      setScreen2(true);
    }
  }, [analysedMaterial]);

  useEffect(() => {
    if (AINodes) {
      setScreen2(false);
      setScreen3(true);
    }
  }, [AINodes]);

  //functions for topic handler
  const toggleTopic = (topic: Topic) => {
    setSelectedTopic((prev) => {
      const exists = prev.some((t) => t.topic === topic.topic);
      return exists
        ? prev.filter((t) => t.topic !== topic.topic)
        : [...prev, topic];
    });
  };

  const isTopicSelected = (topic: Topic) =>
    selectedTopic.some((t) => t.topic === topic.topic);
  const toggleExpand = (index: number) => {
    setExpandedIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  //function for lessonNode handler
  const handleToggleNode = (id: number) => {
    setSelectedNodeIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const updateNodeAt = async (id: number, updatedNode: PlanLessonNode) => {
    if (!selectedNodes) return;
    const updatedNodes = selectedNodes.nodes.map((node, index) =>
      index === id ? updatedNode : node
    );

    await setSelectedNodes({
      ...selectedNodes,
      nodes: updatedNodes,
    });
  };

  const toast = useToast();

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

  const resetAll = () => {
    setGeneratingLoading(false);
    setSourceMaterial('');
    setContext('');
    setAINodes(undefined);
    setSelectedNodes(undefined);
    setLearningOutcome(undefined);
    setEduLevel(undefined);
    setSelectedTopic([]);
    setSelectedNodeIds([]);
    setExpandedIndexes([]);
    setNReadMaterial(1);
    setScreen1(true);
    setScreen2(false);
    setScreen3(false);
    generatedNodes.length = 0;
    setStepGeneration(0);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (action) action(false);
        onClose();
      }}
      size={'4xl'}
      isCentered
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Do you need help to generate your learning path?
          <Text hidden={!screen1}>
            STEP 1: Submit your material in this box to use our analyser.
          </Text>
          <Text hidden={!screen2}>
            STEP 2: Choose the Level and Topic you want to use, additionally add
            some context for the class.
          </Text>
          <Text hidden={!screen3}>
            STEP 3: Define the specifics for each activities.
          </Text>
          <FormLabel paddingTop={'5px'} hidden={!screen3}>
            Select and define activities to generate
          </FormLabel>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody hidden={!screen1}>
          <FormLabel mb={2} fontWeight={'bold'}>
            Your material:
            <InfoButton
              title="Material to Analyze"
              description="Provide the source content you want the learning path to be built upon. This could be a text, article, lesson plan, or any other educational material."
              placement="right"
            />
          </FormLabel>
          <Textarea
            minHeight={'150px'}
            maxHeight={'350px'}
            placeholder="Insert your material here, you can put your plain text."
            value={sourceMaterial}
            overflowY={'auto'}
            onChange={(e) => {
              setGeneratingLoading(false);
              setSourceMaterial(e.currentTarget.value);
            }}
          />

          <Button
            marginTop={'15px'}
            onClick={async () => {
              try {
                setGeneratingLoading(true);
                if (!sourceMaterial) {
                  toast({
                    title: 'Material missing',
                    description:
                      'Please, insert your material before pressing analye button.',
                    status: 'error',
                    duration: 3000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                  throw new Error('Missing sourceMaterial');
                }
                const response: AxiosResponse = await API.analyseMaterial({
                  text: sourceMaterial,
                });
                console.log(response.data as AnalyzedMaterial);
                setAnalyzedMaterial(response.data as AnalyzedMaterial);
                setEduLevel(response.data.education_level as EducationLevel);
                setLearningOutcome(
                  response.data.learning_outcome as LearningOutcome
                );
              } catch (error: any) {
                console.log(error);
                if ((error as Error).name === 'SyntaxError') {
                  toast({
                    title: 'Invalid syntax',
                    description: (error as Error).toString(),
                    status: 'error',
                    duration: 3000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                  return;
                }
                if (error.response)
                  if (error.response.status) {
                    if (error.response.status == 500)
                      toast({
                        title: 'Material Error',
                        description:
                          'We are sorry, the resource is not analyzable, try with different material. Do not provide pages that are too long (e.g. Wikipedia pages) or too short, as they can not be analyzed correctly',
                        status: 'error',
                        duration: 5000,
                        position: 'bottom-left',
                        isClosable: true,
                      });
                    else if (error.response.status != 200)
                      toast({
                        title: 'AI API Error',
                        description:
                          'Internal Server error, try again. If the error persists try change material.',
                        status: 'error',
                        duration: 5000,
                        position: 'bottom-left',
                        isClosable: true,
                      });
                  } else
                    toast({
                      title: 'Generic Error',
                      description: 'Try later ' + (error as Error),
                      status: 'error',
                      duration: 5000,
                      position: 'bottom-left',
                      isClosable: true,
                    });
              } finally {
                setGeneratingLoading(false);
              }
            }}
            isLoading={generatingLoading}
          >
            Analyse Material
          </Button>
        </ModalBody>
        <ModalBody hidden={!screen2}>
          <FormControl label="Level">
            <FormLabel
              mb={2}
              fontWeight={'bold'}
              paddingTop={'5px'}
              paddingBottom={'-5px'}
            >
              Educational Level:
              <InfoButton
                title="Educational Level"
                description="Specify the academic level of the target audience, such as elementary school, high school, or college, to tailor the learning path appropriately."
                placement="right"
              />
            </FormLabel>
            <Select
              borderColor={'grey'}
              onChange={(event) =>
                setEduLevel(event.currentTarget.value as EducationLevel)
              }
            >
              {Object.values(EducationLevel).map((level) => (
                <option
                  key={level}
                  value={level}
                  selected={analysedMaterial?.education_level === level}
                >
                  {analysedMaterial?.education_level === level ? '*' : ''}
                  {level}
                  {analysedMaterial?.education_level === level ? '*' : ''}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl label="Learning Outcome">
            <FormLabel
              mb={2}
              fontWeight={'bold'}
              paddingTop={'5px'}
              paddingBottom={'-5px'}
            >
              Learning Outcome:
              <InfoButton
                title="Learning Outcome"
                description="Describe the intended educational goal of the learning path. For example: 'the ability to recall or recognize simple facts and definitions.'"
                placement="right"
              />
            </FormLabel>
            <Select
              borderColor={'grey'}
              onChange={(event) =>
                setLearningOutcome(event.currentTarget.value as LearningOutcome)
              }
            >
              {Object.values(LearningOutcome).map((outcome) => (
                <option
                  key={outcome}
                  value={outcome}
                  selected={analysedMaterial?.learning_outcome === outcome}
                >
                  {analysedMaterial?.learning_outcome === outcome ? '*' : ''}
                  {outcome}
                  {analysedMaterial?.learning_outcome === outcome ? '*' : ''}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl label="Topic" paddingTop={'5px'}>
            <FormLabel
              mb={2}
              fontWeight={'bold'}
              paddingTop={'5px'}
              paddingBottom={'-5px'}
            >
              Topics:
            </FormLabel>
            {analysedMaterial?.topics.map((topicObj, index) => (
              <Flex key={index} align="start" mb={3} direction="column">
                <Flex align="center">
                  <Checkbox
                    isChecked={isTopicSelected(topicObj)}
                    onChange={() => toggleTopic(topicObj)}
                    size="lg"
                    mr={2}
                    colorScheme="green"
                  />
                  <Text fontWeight="bold">{topicObj.topic}</Text>
                  <IconButton
                    size="sm"
                    ml={2}
                    aria-label="Toggle explanation"
                    icon={
                      expandedIndexes.includes(index) ? (
                        <ChevronUpIcon />
                      ) : (
                        <ChevronDownIcon />
                      )
                    }
                    onClick={() => toggleExpand(index)}
                    variant="ghost"
                  />
                </Flex>
                <Collapse in={expandedIndexes.includes(index)} animateOpacity>
                  <Box mt={2} ml={6}>
                    <Text fontSize="sm" color="gray.600">
                      {topicObj.explanation}
                    </Text>
                  </Box>
                </Collapse>
              </Flex>
            ))}
          </FormControl>
          <FormControl label="Read Material Activities">
            <Flex paddingTop={'5px'} alignItems={'center'}>
              <FormLabel mb={2} fontWeight={'bold'}>
                Number of read material activities:
                <InfoButton
                  title="Number of Reading Activities"
                  description="Indicate how many activities should involve reading custom-generated texts. These texts will be tailored to the specific topics and context of the learning path."
                  placement="right"
                />
              </FormLabel>
              <NumberInput
                float="right"
                value={nReadMaterial}
                min={1}
                max={8}
                width="80px"
                onChange={(valueString, valueNumber) => {
                  if (!isNaN(valueNumber)) setNReadMaterial(valueNumber);
                }}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Flex>
          </FormControl>
          <FormLabel mb={2} fontWeight={'bold'}>
            Context (optional):
            <InfoButton
              title="Context"
              description="Explain the educational setting in which the learning path will be used. For instance: 'Middle school class with a focus on individual learning activities.'"
              placement="right"
            />
          </FormLabel>
          <Textarea
            maxHeight={'200px'}
            placeholder="Here, you can define the context of the learning path's application."
            value={context}
            overflowY={'auto'}
            onChange={(e) => {
              setGeneratingLoading(false);
              setContext(e.currentTarget.value);
            }}
          />
          <Button
            marginTop={'15px'}
            onClick={async () => {
              try {
                setGeneratingLoading(true);
                if (selectedTopic.length < 1) {
                  toast({
                    title: 'Missing topics',
                    description: 'You need to select at least one topic.',
                    status: 'error',
                    duration: 3000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                  return;
                }
                if (!analysedMaterial) {
                  throw new Error('Missing analysedMaterial');
                }
                if (!learningOutcome || !eduLevel) {
                  throw new Error('Missing learningOutcome or eduLevel');
                }
                await API.planLesson({
                  topics: selectedTopic,
                  learning_outcome: learningOutcome,
                  language: analysedMaterial.language,
                  macro_subject: analysedMaterial.macro_subject,
                  title: analysedMaterial.title,
                  education_level: eduLevel,
                  context: context,
                  model: 'Gemini',
                }).then((response) => {
                  setAINodes(response.data);
                  const data: AIPlanLessonResponse = response.data;
                  const updatedNodes: PlanLessonNode[] = data.nodes.map(
                    (node) => {
                      const isIntegrated = QuestionTypeMap.find(
                        (qType) => qType.integrated && qType.key === node.type
                      );

                      return {
                        type: isIntegrated ? node.type : 'open question',
                        topic: node.topic,
                        details: node.details,
                        learning_outcome: node.learning_outcome,
                        duration: node.duration,
                        data: node.data,
                      };
                    }
                  );

                  setSelectedNodes({
                    ...data,
                    nodes: updatedNodes,
                  });
                });
              } catch (error: any) {
                if ((error as Error).name === 'SyntaxError') {
                  toast({
                    title: 'Invalid syntax',
                    description: (error as Error).toString(),
                    status: 'error',
                    duration: 3000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                  return;
                }
                if (error.response.status)
                  toast({
                    title: 'LearningObjective Error',
                    description:
                      'We are sorry, server was not able to generate the learning objective. Please, try again, if the error persists try a different topic',
                    status: 'error',
                    duration: 5000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                else {
                  toast({
                    title: 'Generic Error',
                    description: 'Try later: ' + (error as Error).message,
                    status: 'error',
                    duration: 5000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                }
              } finally {
                setGeneratingLoading(false);
              }
            }}
            isLoading={generatingLoading}
          >
            Plan Lesson
          </Button>
        </ModalBody>
        <ModalBody hidden={!screen3}>
          <FormControl label="Nodes">
            <Box display="flex" flexDirection="column" overflowY="auto">
              {AINodes &&
                selectedNodes &&
                selectedNodes?.nodes.map((node, id) => {
                  return (
                    <PlanLessonCard
                      plannedNode={AINodes.nodes[id]}
                      planNode={node}
                      key={id}
                      id={id}
                      setSelectedNode={handleToggleNode}
                      isSelected={selectedNodeIds.includes(id)}
                      updateNodeAt={updateNodeAt}
                    />
                  );
                })}
            </Box>
          </FormControl>
          <ProgressBar
            currentStep={stepGeneration}
            totalSteps={nReadMaterial + selectedNodeIds.length}
            isHidden={!generatingLoading && generatedNodes.length == 0}
            label="Activities generation"
            description="Success! All activities have been generated. Finalizing the learning path..."
          />
          <Button
            marginTop={'15px'}
            onClick={async () => {
              generatedNodes.length = 0;
              setGeneratingLoading(true);
              if (!analysedMaterial)
                throw new Error('Missing analysedMaterial');
              try {
                const nodesToGenerate = selectedNodes?.nodes
                  .map((aiNode, index) => {
                    if (selectedNodeIds.includes(index)) return aiNode;
                  })
                  .filter((node) => node != undefined);
                if (!nodesToGenerate || !nodesToGenerate[0]) {
                  toast({
                    title: 'Missing activities',
                    description:
                      'Please, select at least one activity to start generating the learning path.',
                    status: 'error',
                    duration: 3000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                  throw new Error('Missing selectedNodes');
                }
                const nTopicReadMaterial =
                  nReadMaterial == 1
                    ? nodesToGenerate.length
                    : nReadMaterial < nodesToGenerate.length
                    ? Math.ceil(nodesToGenerate.length / nReadMaterial)
                    : 1;
                let counter = 0;
                console.log('Starting node generation');
                let x = -195;
                let y = -210;
                let localReadMaterial = nReadMaterial;
                for (let i = 0; i < nodesToGenerate.length; i++) {
                  if (counter == 0 && localReadMaterial != 0) {
                    i--;
                    counter = nTopicReadMaterial;
                    localReadMaterial--;
                    const readTopics: LessonNodeAI[] = nodesToGenerate
                      .map((aiNode, index) => {
                        if (aiNode && index < nTopicReadMaterial)
                          return {
                            title: '',
                            learning_outcome: aiNode.learning_outcome,
                            topics: [
                              {
                                topic: aiNode.topic,
                                explanation:
                                  analysedMaterial.topics.find(
                                    (topic) => topic.topic == aiNode?.topic
                                  )?.explanation || '',
                              },
                            ],
                          };
                        return undefined;
                      })
                      .filter(
                        (node): node is LessonNodeAI => node !== undefined
                      );
                    try {
                      const response = await API.generateMaterial({
                        title: analysedMaterial.title,
                        macro_subject: analysedMaterial.macro_subject,
                        topics: readTopics,
                        education_level: analysedMaterial.education_level,
                        learning_outcome: analysedMaterial.learning_outcome,
                        duration: analysedMaterial.estimated_duration,
                        language: analysedMaterial.language,
                        model: 'Gemini',
                      });
                      const readMaterialGen: AIMaterialGenerated =
                        response.data;
                      const _id = UUIDv4();
                      generatedNodes.push({
                        _id: _id,
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
                    } catch (error) {
                      console.log('errror in generation readMaterial ' + error);
                    }
                  } else {
                    counter--;
                    const activity = nodesToGenerate[i];
                    if (!activity) break;
                    try {
                      let response: AxiosResponse | null = null;
                      const typeExercise =
                        activity.type != 'multiple choice'
                          ? activity.type
                          : activity.data?.solutions_number > 1
                          ? 'multiple select'
                          : 'multiple choice';
                      console.log('step');
                      console.log(activity.type);
                      console.log(typeExercise);
                      console.log(
                        'solutions:',
                        activity.data?.solutions_number
                      );
                      try {
                        // Primo tentativo
                        response = await API.generateNewExercise({
                          macro_subject: activity?.learning_outcome,
                          topic: activity.topic,
                          education_level: analysedMaterial.education_level,
                          learning_outcome: activity.learning_outcome,
                          material: sourceMaterial,
                          solutions_number:
                            activity.data?.solutions_number || 1,
                          distractors_number:
                            activity.data?.distractors_number || 2,
                          easily_discardable_distractors_number:
                            activity.data
                              ?.easily_discardable_distractors_number || 1,
                          type: typeExercise,
                          language: analysedMaterial.language,
                          model: 'Gemini',
                        });
                      } catch (err) {
                        console.warn('retry', err);

                        // Retry una volta
                        response = await API.generateNewExercise({
                          macro_subject: activity?.learning_outcome,
                          topic: activity.topic,
                          education_level: analysedMaterial.education_level,
                          learning_outcome: activity.learning_outcome,
                          material: sourceMaterial,
                          solutions_number:
                            activity.data?.solutions_number || 1,
                          distractors_number:
                            activity.data?.distractors_number || 2,
                          easily_discardable_distractors_number:
                            activity.data
                              ?.easily_discardable_distractors_number || 1,
                          type: typeExercise,
                          language: analysedMaterial.language,
                          model: 'Gemini',
                        });
                      }

                      // Se uno dei due tentativi ha avuto successo
                      if (response) {
                        handleResponseNewExercise(response, x, y);
                      }
                    } catch (error) {
                      console.error('Error on generating exercise: ', error);
                    }
                  }
                  x = x + 450;
                  if (x > 1605) {
                    x = -195;
                    y = y + 195;
                  }
                  setStepGeneration(generatedNodes.length);
                }
                setNReadMaterial(0);
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

                console.log('End data generation');
                const generatedEdges: PolyglotEdge[] = [];

                //edges generation
                const length = generatedNodes.length;
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
                          sourceMaterial: sourceMaterial,
                          learning_outcome: learningOutcome,
                          education_level: eduLevel,
                          topicsAI: selectedTopic,
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

                console.log('end node generation');
                const tags: { name: string; color: string }[] = [
                  { name: analysedMaterial.keywords[0], color: 'green' },
                  { name: analysedMaterial.keywords[1], color: 'red' },
                  { name: analysedMaterial.keywords[2], color: 'purple' },
                  { name: analysedMaterial.keywords[3], color: 'blue' },
                ];
                const topics = analysedMaterial.topics.map((t) => t.topic);

                const newFlow: PolyglotFlow = {
                  _id: UUIDv4(),
                  author: {
                    _id: 'afa2e0e7-e3d1-4837-b911-0eebac05f845',
                    username: '',
                  },
                  title: analysedMaterial.title,
                  description: analysedMaterial.macro_subject,
                  publish: false,
                  learningContext: analysedMaterial.learning_outcome,
                  duration: analysedMaterial.estimated_duration.toString(),
                  topics: topics,
                  tags: tags,
                  sourceMaterial: sourceMaterial,
                  learning_outcome: learningOutcome,
                  education_level: eduLevel,
                  topicsAI: selectedTopic,
                  language: analysedMaterial.language,
                  macro_subject: analysedMaterial.macro_subject,
                  nodes: generatedNodes,
                  edges: generatedEdges,
                };
                const flowResponse = await API.createNewFlowJson(newFlow);
                if (flowResponse.status !== 200) {
                  onClose();
                  toast({
                    title: 'Flow not created',
                    description: 'Something is off with your flow! Try again',
                    status: 'warning',
                    duration: 3000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                }
                toast({
                  title: 'Flow created',
                  description:
                    'Flow created successfully, you will be redirected soon.',
                  status: 'success',
                  duration: 3000,
                  position: 'bottom-left',
                  isClosable: true,
                });
                router.push('/flows/' + flowResponse.data.id);
              } catch (error) {
                console.log((error as Error).message);
              } finally {
                setGeneratingLoading(false);
              }
            }}
            isLoading={generatingLoading}
            isDisabled={generatingLoading || generatedNodes.length != 0}
          >
            Generate Learning Path
          </Button>
        </ModalBody>
        <ModalFooter>
          <Button onClick={resetAll} width={'80px'}>
            Restart
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateAILPModal;
