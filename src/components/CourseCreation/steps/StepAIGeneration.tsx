import { CheckCircleIcon, RepeatIcon, TimeIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { API } from '../../../data/api';
import {
  AIDefineSyllabusResponse,
  AIPlanCourse,
  AIPlanCourseResponse,
  AIPlanLessonResponse,
  AnalyzedMaterial,
  Assignment,
  EducationLevel,
  LearningOutcome,
  LessonNodeAI,
  PlanLessonNode,
  SyllabusTopic,
  Topic,
} from '../../../types/polyglotElements';
import PlanLessonCard from '../../Card/PlanLessonCard';
import ReviewLessonCard from '../../Card/ReviewLessonCard';
import EduChat from '../../Chat/EduChat';
import EnumField from '../../Forms/Fields/EnumField';
import InputTextField from '../../Forms/Fields/InputTextField';
import NumberField from '../../Forms/Fields/NumberField';
import TextField from '../../Forms/Fields/TextField';
import StepHeading from '../../UtilityComponents/StepHeading';

type StepCoursePlannerProps = {
  language: string;
  material: string;
  definedSyllabus: AIDefineSyllabusResponse | undefined;
  selectedTopic: SyllabusTopic | undefined;
  analysedMaterialProp: [
    AnalyzedMaterial | undefined,
    React.Dispatch<React.SetStateAction<AnalyzedMaterial | undefined>>
  ];
  plannedCourseProp: [
    AIPlanCourseResponse | undefined,
    React.Dispatch<React.SetStateAction<AIPlanCourseResponse | undefined>>
  ];
  GeneratedLessonsProp: [
    AIPlanLessonResponse[],
    React.Dispatch<React.SetStateAction<AIPlanLessonResponse[]>>
  ];
  CoursesNodesProp: [
    PlanLessonNode[][],
    React.Dispatch<React.SetStateAction<PlanLessonNode[][]>>
  ];
  ModelState: [string, React.Dispatch<React.SetStateAction<string>>];
  context: string;
  title: string;
  nextStep: () => void;
  prevStep: () => void;
};

const StepAIGeneration = ({
  material,
  analysedMaterialProp,
  plannedCourseProp,
  language,
  context,
  GeneratedLessonsProp,
  title,
  CoursesNodesProp,
  definedSyllabus,
  selectedTopic,
  ModelState,
  nextStep,
  prevStep,
}: StepCoursePlannerProps) => {
  const [analysedMaterial, setAnalysedMaterial] = analysedMaterialProp;
  const [plannedCourse, setPlannedCourse] = plannedCourseProp;
  const [isPlanCourseLoading, setIsPlanCourseLoading] = useState(false);
  const toast = useToast();
  const [generatedLessons, setGeneratedLessons] = GeneratedLessonsProp;
  const [macroSubject, setMacroSubject] = useState(
    analysedMaterial?.macro_subject || ''
  );
  const [eduLevel, setEduLevel] = useState<EducationLevel>(
    definedSyllabus?.educational_level || EducationLevel.HighSchool
  );
  const [courseNodes, setCourseNodes] = CoursesNodesProp;
  const [numLessons, setNumberOfLessons] = useState<number>(3);
  const [lessonDuration, setLessonDuration] = useState<number>(60);
  const [model, setModel] = ModelState;

  const [chatLessonResponseData, setChatLessonResponseData] =
    useState<any>(undefined);

  const [lessons, setLessons] = useState<LessonNodeAI[]>([]);

  const [currentStep, setCurrentStep] = useState<
    'course' | 'lessons' | 'generating' | 'check'
  >('course');

  useEffect(() => {
    const seenTopics = new Set<string>();
    const topics: Topic[] = [];

    if (!chatLessonResponseData) return;

    if (Array.isArray(chatLessonResponseData.topics)) {
      topics.push(...chatLessonResponseData.topics);
    } else if (Array.isArray(chatLessonResponseData.nodes)) {
      for (const node of chatLessonResponseData.nodes) {
        if (!seenTopics.has(node.topic)) {
          seenTopics.add(node.topic);
          topics.push({
            topic: node.topic,
            explanation: node.explanation,
            ...(node.learning_outcome
              ? { learning_outcome: node.learning_outcome }
              : {}),
          });
        }
      }
    }

    setLessons((prev) => [
      ...prev,
      {
        ...chatLessonResponseData,
        topics: topics,
      },
    ]);
  }, [chatLessonResponseData]);

  console.log(analysedMaterial)
  useEffect(() => {
    console.log(plannedCourse);
    if (plannedCourse) {
      setLessons(plannedCourse.nodes as LessonNodeAI[]);
      setCurrentStep('lessons');
    }
  }, [plannedCourse]);

  if (!definedSyllabus || !selectedTopic) return <></>;

  const extractAssignmentsWithTopicInfo = (lesson: LessonNodeAI) => {
    const all: {
      assignment: Assignment;
      topic: {
        topic: string;
        explanation: string;
        learning_outcome?: LearningOutcome;
      };
    }[] = [];

    lesson.topics?.forEach((topic) => {
      if (topic.assignments && Array.isArray(topic.assignments)) {
        topic.assignments.forEach((assignment) => {
          all.push({
            assignment,
            topic: {
              topic: topic.topic,
              explanation: topic.explanation,
              learning_outcome: topic.learning_outcome,
            },
          });
        });
      }
    });

    return all;
  };
  const updateGeneratedLesson = (
    index: number,
    updated: AIPlanLessonResponse
  ) => {
    setGeneratedLessons((prev) => {
      const newLessons = [...prev];
      newLessons[index] = updated;
      return newLessons;
    });
  };
  const updateLesson = (index: number, updatedLesson: LessonNodeAI) => {
    setLessons((prevLessons) => {
      const newLessons = [...prevLessons];
      newLessons[index] = updatedLesson;
      return newLessons;
    });
  };
  const handleDeleteLesson = (index: number) => {
    setLessons((prevLessons) => prevLessons.filter((_, i) => i !== index));
  };

  const educationOptions = Object.entries(EducationLevel).map(
    ([key, value]) => ({
      label: key.replace(/([A-Z])/g, ' $1').trim(),
      value,
    })
  );

  const handlePlanCourse = async () => {
    setIsPlanCourseLoading(true);
    setLessons([]);
    setPlannedCourse(undefined);
    try {
      if (!analysedMaterial) return;
      const response = await API.planCourse({
        title: analysedMaterial.title,
        macro_subject: macroSubject,
        education_level: eduLevel,
        learning_objectives: selectedTopic.learning_objectives,
        number_of_lessons: numLessons,
        duration_of_lesson: lessonDuration,
        language: language || analysedMaterial?.language || 'English',
        model: model || 'Gemini',
      } as AIPlanCourse);
      setPlannedCourse(response.data as AIPlanCourseResponse);
      setLessons(response.data.nodes as LessonNodeAI[]);
      toast({
        title: 'Course planned successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error planning course.',
        description: 'Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsPlanCourseLoading(false);
    }
  };

  const handlePlanLesson = () => {
    setCurrentStep('generating');
    generatedLessons.length = 0;
    try {
      lessons.forEach(async (lesson, index) => {
        const response = await API.planLesson({
          topics: lesson?.topics || [],
          learning_outcome: lesson.learning_outcome,
          language: language || definedSyllabus?.language || 'English',
          macro_subject: macroSubject,
          title: lesson.title,
          education_level: definedSyllabus.educational_level,
          context: context,
          model: model || 'Gemini',
        });
        setGeneratedLessons((prev) => [
          ...prev,
          {
            ...(response.data as AIPlanLessonResponse),
            data: extractAssignmentsWithTopicInfo(lesson),
          },
        ]);
      });

      toast({
        title: 'Lessons saved successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error during lesson creation.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.log(error);
    }
  };

  return (
    <Box>
      <Box textAlign="right" color={'purple.500'}>
        Step{' '}
        {currentStep === 'course' ? '1' : currentStep === 'lessons' ? '2' : '3'}{' '}
        of 3
      </Box>
      {currentStep === 'course' && (
        <>
          <EduChat
            usage="plan_course"
            responseDataState={[plannedCourse, setPlannedCourse]}
            knownData={{
              title: analysedMaterial?.title || '',
              macro_subject: macroSubject,
              education_level: eduLevel,
              learning_objectives: selectedTopic.learning_objectives,
              number_of_lessons: numLessons,
              duration_of_lesson: lessonDuration,
              language: language,
              model: model,
            }}
          />
          <StepHeading
            title="Plan Your Course"
            subtitle="Review the material and define the course structure."
          />

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <InputTextField
              label="Macro Subject"
              placeholder="e.g., Computer Science"
              value={macroSubject}
              setValue={setMacroSubject}
            />

            <EnumField
              label="Educational Level"
              value={eduLevel}
              setValue={(val) => setEduLevel(val as EducationLevel)}
              options={educationOptions}
            />

            <NumberField
              label="Number of Lessons"
              value={numLessons}
              setValue={(val) => {
                const num = parseInt(val.toString(), 10);
                setNumberOfLessons(num);
                setLessons((prev) =>
                  Array.from(
                    { length: num },
                    (_, i) =>
                      prev[i] || {
                        topic: '',
                        explanation: '',
                        learning_outcome: LearningOutcome.ApplyKnowledge,
                      }
                  )
                );
              }}
              min={1}
              max={5}
            />

            <TextField
              label="Lesson Duration (minutes)"
              value={lessonDuration.toString()}
              setValue={(val) => setLessonDuration(parseInt(val))}
              placeholder="e.g., 45"
            />
            <EnumField
              label="Model"
              value={model}
              setValue={setModel}
              options={[
                { label: 'Gemini', value: 'Gemini' },
                { label: 'OpenAI', value: 'OpenAI' },
              ]}
            />
          </SimpleGrid>
        </>
      )}
      {currentStep === 'lessons' && (
        <>
          <EduChat
            usage="plan_lessons"
            responseDataState={[
              chatLessonResponseData,
              setChatLessonResponseData,
            ]}
            knownData={{
              topics: definedSyllabus.topics,
              learning_outcome: selectedTopic.learning_objectives,
              language: language,
              macro_subject: macroSubject,
              education_level: definedSyllabus.educational_level,
              context: context,
              model: model,
            }}
          />
          <StepHeading
            title="Plan Your Lessons"
            subtitle="Edit each topic's details and learning outcomes."
          />

          <VStack spacing={6} mt={4}>
            {lessons.map((lesson, i) => (
              <PlanLessonCard
                key={i}
                lesson={lesson}
                index={i}
                updateLesson={updateLesson}
                onDelete={handleDeleteLesson}
              />
            ))}
          </VStack>
        </>
      )}
      {currentStep === 'generating' &&
        generatedLessons.length != lessons.length && (
          <>
            <StepHeading
              title="Your Lessons are generating"
              subtitle="Please wait while the AI generates your lessons. You can continue to edit the course details or wait for the generation to complete."
            />
            <VStack align="start" spacing={3}>
              {lessons.map((lesson, i) => {
                let status: 'generated' | 'generating' | 'waiting';

                if (i < generatedLessons.length) status = 'generated';
                else if (i === generatedLessons.length) status = 'generating';
                else status = 'waiting';

                const iconByStatus = {
                  generated: <CheckCircleIcon color="green.500" />,
                  generating: <RepeatIcon color="blue.500" />,
                  waiting: <TimeIcon color="orange.500" />,
                };

                return (
                  <Flex key={i} align="center" gap={3}>
                    {iconByStatus[status]}
                    <Text fontWeight="medium">{lesson.title}</Text>
                  </Flex>
                );
              })}
            </VStack>
          </>
        )}
      {currentStep === 'generating' &&
        generatedLessons.length == lessons.length && (
          <>
            <StepHeading
              title="Review Your Lessons"
              subtitle="Make final edits to your lesson content, topics, and assignments."
            />
            <VStack spacing={6} mt={4}>
              {generatedLessons.map((lesson, i) => (
                <ReviewLessonCard
                  key={i}
                  lesson={lesson}
                  index={i}
                  updateLesson={updateGeneratedLesson}
                  onDelete={handleDeleteLesson}
                  CoursesNodesProp={[courseNodes, setCourseNodes]}
                />
              ))}
            </VStack>
          </>
        )}
      <Flex mt={8} justify="space-between" py={2}>
        <Box flex="1" display="flex" justifyContent="center">
          <Button hidden={currentStep !== 'course'} onClick={() => prevStep()}>
            Back
          </Button>
          <Button
            hidden={currentStep !== 'lessons'}
            variant="outline"
            onClick={() => setCurrentStep('course')}
          >
            ← Back to Course
          </Button>
        </Box>
        <Box flex="1" display="flex" justifyContent="center"></Box>
        <Box flex="1" display="flex" justifyContent="center">
          <Button
            hidden={currentStep !== 'course'}
            colorScheme="teal"
            onClick={handlePlanCourse}
            isLoading={isPlanCourseLoading}
            isDisabled={!analysedMaterial}
          >
            Next: Plan Lessons
          </Button>
          <Button
            hidden={currentStep !== 'lessons'}
            colorScheme="teal"
            onClick={handlePlanLesson}
          >
            Save Lesson Plan
          </Button>
          <Button
            hidden={currentStep !== 'generating'}
            colorScheme="purple"
            onClick={nextStep}
          >
            Next
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default StepAIGeneration;
