import { CheckCircleIcon, RepeatIcon, TimeIcon } from '@chakra-ui/icons';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Heading,
  Progress,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  generateCourse,
  generateLessonFlow,
} from '../../../data/generationAlgorithm';
import {
  AIPlanLessonResponse,
  AnalyzedMaterial,
  EducationLevel,
  LearningObjectives,
  PlanLessonNode,
  PolyglotNode,
} from '../../../types/polyglotElements';

type StepCompleteProps = {
  generatedLessons: AIPlanLessonResponse[];
  sourceMaterial: string;
  coursesNodes: PlanLessonNode[][];
  analysedMaterial: AnalyzedMaterial | undefined;
  context: string;
  language: string;
  title: string;
  subjectArea: string;
  educationLevel: EducationLevel;
  description: string;
  learningObjectives: LearningObjectives;
  duration: string;
  prerequisites: string[];
  goals: string[];
  classContext: string;
  accessCode?: string;
  img?: string;
  tags: { name: string; color: string }[];
};

const StepComplete = ({
  generatedLessons,
  sourceMaterial,
  coursesNodes,
  analysedMaterial,
  context,
  language,
  title,
  subjectArea,
  educationLevel,
  description,
  learningObjectives,
  duration,
  goals,
  prerequisites,
  classContext,
  accessCode,
  img,
  tags,
}: StepCompleteProps) => {
  const router = useRouter();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [courseId, setCourseId] = useState('');
  const [flowNodes, setFlowNodes] = useState<PolyglotNode[]>([]);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [generating, setGenerating] = useState(true);
  const [isCourseGenerated, setIsCourseGenerated] = useState(false);

  useEffect(() => {
    if (isCourseGenerated) return;
    const generate = async () => {
      const flowsId: string[] = [];
      for (let i = 0; i < generatedLessons.length; i++) {
        setCurrentLessonIndex(i);
        setFlowNodes([]);

        const flowId = await generateLessonFlow({
          material: sourceMaterial,
          generatedLesson: generatedLessons[i],
          lessonNodes: coursesNodes[i],
          setFlowNodes,
          analysedMaterial,
          context,
          language,
        });
        flowsId.push(flowId);
        setCompletedLessons((prev) => [...prev, i]);
      }
      const newCourse = await generateCourse({
        title,
        subjectArea,
        educationLevel,
        language,
        description,
        learningObjectives,
        duration,
        prerequisites,
        goals,
        targetAudience: context,
        classContext,
        accessCode,
        analysedMaterial,
        material: sourceMaterial,
        img,
        tags,
        flowsId,
      });
      setGenerating(false);
      setIsCourseGenerated(true);
      setCourseId(newCourse.id || newCourse._id);
    };

    generate();
  }, []);

  const iconByStatus = {
    generated: <CheckCircleIcon color="green.500" />,
    generating: <RepeatIcon color="blue.500" />,
    waiting: <TimeIcon color="orange.500" />,
  };

  return (
    <Box p={6}>
      {generating ? (
        <>
          <Heading size="lg" mb={4}>
            Generating your Course
          </Heading>
          <Text mb={6} color="gray.600">
            The AI is currently generating lesson flows. You can expand each
            lesson to see detailed activity progress.
          </Text>
          <Accordion
            allowMultiple
            defaultIndex={[0]}
            index={currentLessonIndex}
          >
            {generatedLessons.map((lesson, i) => {
              let status: 'generated' | 'generating' | 'waiting' = 'waiting';
              if (completedLessons.includes(i)) status = 'generated';
              else if (i === currentLessonIndex) status = 'generating';

              const isActive = i === currentLessonIndex;

              return (
                <AccordionItem
                  key={i}
                  border="1px solid #EDF2F7"
                  rounded="md"
                  mb={3}
                >
                  <AccordionButton>
                    <Flex flex="1" textAlign="left" align="center" gap={3}>
                      {iconByStatus[status]}
                      <Text fontWeight="medium">{lesson.title}</Text>
                    </Flex>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    {isActive ? (
                      <VStack align="start" spacing={3}>
                        {flowNodes.length === 0 ? (
                          <Flex align="center" gap={2}>
                            <Spinner size="sm" />
                            <Text>Initializing flow generation...</Text>
                          </Flex>
                        ) : (
                          <>
                            {flowNodes.map((node, idx) => (
                              <Flex key={idx} align="center" gap={3}>
                                <CheckCircleIcon color="green.500" />
                                <Text>{node.title}</Text>
                              </Flex>
                            ))}
                            <Spinner size="sm" />
                          </>
                        )}
                        <Progress
                          mt={2}
                          size="sm"
                          colorScheme="teal"
                          value={(flowNodes.length / 6) * 100}
                        />
                      </VStack>
                    ) : status === 'generated' ? (
                      <>
                        {flowNodes.map((node, idx) => (
                          <Flex key={idx} align="center" gap={3}>
                            <CheckCircleIcon color="green.500" />
                            <Text>{node.type}</Text>
                          </Flex>
                        ))}
                        <Text color="green.600">✅ Flow generated</Text>
                      </>
                    ) : (
                      <Text color="gray.500">⏳ Waiting to be processed</Text>
                    )}
                  </AccordionPanel>
                </AccordionItem>
              );
            })}
          </Accordion>
        </>
      ) : (
        <Box textAlign="center">
          <CheckCircleIcon boxSize={12} color="green.400" mb={4} />
          <Heading size="lg" mb={2}>
            Course Created Successfully!
          </Heading>
          <Text color="gray.600">
            All flows have been generated. You can now manage it in your
            dashboard.
          </Text>
          <Flex mt={6} gap={4} justify="center" flexWrap="wrap">
            <Box flex="1" display="flex" justifyContent="center">
              <Button onClick={() => router.push('/dashboard')}>Home</Button>
            </Box>
            <Box flex="1" display="flex" justifyContent="center">
              <Button
                colorScheme="purple"
                onClick={() => router.push(`/courses/${courseId}`)}
              >
                Open Course
              </Button>
            </Box>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default StepComplete;
