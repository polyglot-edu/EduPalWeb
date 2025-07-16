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
  AIPlanCourse,
  AIPlanCourseResponse,
  AIPlanLessonResponse,
  AnalyzedMaterial,
  Assignment,
  EducationLevel,
  LearningOutcome,
  LessonNodeAI,
  PlanLessonNode,
} from '../../../types/polyglotElements';
import PlanLessonCard from '../../Card/PlanLessonCard';
import ReviewLessonCard from '../../Card/ReviewLessonCard';
import EnumField from '../../Forms/Fields/EnumField';
import InputTextField from '../../Forms/Fields/InputTextField';
import NumberField from '../../Forms/Fields/NumberField';
import StepHeading from '../../UtilityComponents/StepHeading';

type StepCoursePlannerProps = {
  language: string;
  material: string;
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
  context: string;
  title: string;
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
}: StepCoursePlannerProps) => {
  const [analysedMaterial] = analysedMaterialProp;
  const [plannedCourse, setPlannedCourse] = plannedCourseProp;
  const [isPlanCourseLoading, setIsPlanCourseLoading] = useState(false);
  const toast = useToast();
  const [generatedLessons, setGeneratedLessons] = GeneratedLessonsProp;
  const [macroSubject, setMacroSubject] = useState(
    analysedMaterial?.macro_subject || ''
  );
  const [eduLevel, setEduLevel] = useState<EducationLevel>(
    analysedMaterial?.education_level || EducationLevel.HighSchool
  );
  const [courseNodes, setCourseNodes] = CoursesNodesProp;
  const [objectives, setObjectives] = useState<string[]>([]);
  const [numLessons, setNumberOfLessons] = useState<number>(6);
  const [lessonDuration, setLessonDuration] = useState<number>(60);
  const [model, setModel] = useState<string>('Gemini');

  const [lessons, setLessons] = useState<LessonNodeAI[]>([]);

  const [currentStep, setCurrentStep] = useState<
    'course' | 'lessons' | 'generating' | 'check'
  >('course');

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
        learning_objectives: {
          //to be implemented
          knowledge: '',
          skills: '',
          attitude: '',
        },
        number_of_lessons: numLessons,
        duration_of_lesson: lessonDuration,
        language: language || analysedMaterial?.language || 'English',
        model: model || 'Gemini',
      } as AIPlanCourse);
      setPlannedCourse(response.data as AIPlanCourseResponse);
      setLessons(response.data.nodes as LessonNodeAI[]);
      setCurrentStep('lessons');
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
    lessons.forEach(async (lesson, index) => {
      const response = await API.planLesson({
        topics: lesson.topics,
        learning_outcome: lesson.learning_outcome,
        language: language || analysedMaterial?.language || 'English',
        macro_subject: macroSubject,
        title: lesson.title,
        education_level: eduLevel,
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
  };

  useEffect(() => {
    console.log('lesson change');
    console.log(lessons);
  }, [lessons]);

  return (
    <Box>
      <Box textAlign="right" color={'purple.500'}>
        Step{' '}
        {currentStep === 'course' ? '1' : currentStep === 'lessons' ? '2' : '3'}{' '}
        of 3
      </Box>
      {currentStep === 'course' && (
        <>
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
                        learning_outcome: undefined,
                      }
                  )
                );
              }}
              min={1}
              max={50}
            />

            <InputTextField
              label="Lesson Duration (minutes)"
              value={lessonDuration.toString()}
              setValue={(val) => setLessonDuration(parseInt(val))}
              placeholder="e.g., 45"
            />
          </SimpleGrid>

          <Box mt={4}>
            <InputTextField
              label="Learning Objectives (comma-separated)"
              value={objectives.join(', ')}
              setValue={(val) =>
                setObjectives(val.split(',').map((s) => s.trim()))
              }
              placeholder="e.g., Understand recursion, Apply sorting algorithms"
            />
          </Box>

          <Box mt={6}>
            <Button
              colorScheme="teal"
              onClick={handlePlanCourse}
              isLoading={isPlanCourseLoading}
              isDisabled={!analysedMaterial}
            >
              Next: Plan Lessons
            </Button>
          </Box>
        </>
      )}
      {currentStep === 'lessons' && (
        <>
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

          <Box mt={6} display="flex" justifyContent="space-between">
            <Button variant="outline" onClick={() => setCurrentStep('course')}>
              ← Back to Course
            </Button>
            <Button colorScheme="teal" onClick={handlePlanLesson}>
              Save Lesson Plan
            </Button>
          </Box>
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
    </Box>
  );
};

export default StepAIGeneration;
