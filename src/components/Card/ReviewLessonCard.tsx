import {
  AddIcon,
  CheckIcon,
  ChevronDownIcon,
  DeleteIcon,
} from '@chakra-ui/icons';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import {
  AIPlanLessonResponse,
  LearningOutcome,
  PlanLessonNode,
  QuestionTypeMap,
} from '../../types/polyglotElements';
import InfoButton from '../UtilityComponents/InfoButton';

type ReviewLessonCardProps = {
  lesson: AIPlanLessonResponse;
  index: number;
  updateLesson: (index: number, updated: AIPlanLessonResponse) => void;
  onDelete: (index: number) => void;
  CourseNodesProp: [
    PlanLessonNode[][],
    React.Dispatch<React.SetStateAction<PlanLessonNode[][]>>
  ];
};
function initializeCourseNodesFromLesson(
  lesson: AIPlanLessonResponse
): PlanLessonNode[] {
  if (
    !Array.isArray(lesson.data) ||
    !lesson.data.every(
      (item) =>
        item &&
        typeof item.assignment?.type === 'string' &&
        'data' in item.assignment &&
        'learning_outcome' in item.assignment &&
        typeof item.topic?.topic === 'string' &&
        typeof item.topic?.explanation === 'string'
    )
  ) {
    return [];
  }

  return lesson.data.map(({ assignment, topic }) => ({
    type: assignment.type,
    topic: topic.topic,
    details: topic.explanation,
    learning_outcome:
      assignment.learning_outcome ?? topic.learning_outcome ?? 'UNKNOWN',
    duration: 15, // puoi cambiare il valore predefinito o calcolarlo in base ai dati
    data: assignment.data,
  }));
}

const ReviewLessonCard = ({
  lesson,
  index,
  updateLesson,
  onDelete,
  CourseNodesProp,
}: ReviewLessonCardProps) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenNAss,
    onOpen: onOpenNAss,
    onClose: onCloseNAss,
  }: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
  } = useDisclosure();
  const [courseNodes, setCourseNodes] = CourseNodesProp;
  const updateField = (field: keyof AIPlanLessonResponse, value: string) => {
    updateLesson(index, { ...lesson, [field]: value });
  };

  const updateAssignment = (
    aIndex: number,
    updatedFields: Partial<PlanLessonNode>
  ) => {
    setCourseNodes((prev) => {
      const updated = [...prev];
      const lessonAssignments = [...(updated[index] || [])];
      lessonAssignments[aIndex] = {
        ...lessonAssignments[aIndex],
        ...updatedFields,
      };
      updated[index] = lessonAssignments;
      return updated;
    });
  };

  const deleteAssignment = (aIndex: number) => {
    setCourseNodes((prev) => {
      const updated = [...prev];
      const lessonAssignments = [...(updated[index] || [])];
      lessonAssignments.splice(aIndex, 1);
      updated[index] = lessonAssignments;
      return updated;
    });
  };
  const addAssignmentFromNode = (node: PlanLessonNode) => {
    const match =
      QuestionTypeMap.find((q) => q.key === node.type && q.integrated) ||
      QuestionTypeMap.find((q) => q.key === 'open question');

    if (!match) return;

    const newAssignment = {
      type: match.key,
      topic: node.topic || '',
      details: node.details || '',
      learning_outcome: node.learning_outcome,
      duration: 10,
      data: match.defaultData,
    };

    const updatedAssignments = [...(courseNodes[index] || []), newAssignment];
    const updatedCourseNodes = [...courseNodes];
    updatedCourseNodes[index] = updatedAssignments;
    setCourseNodes(updatedCourseNodes);
    onCloseNAss();
  };

  const assignments = lesson.data || [];
  console.log('Lesson topics:', assignments);
  console.log('Lesson data:');
  console.log(lesson.data);
  const handleConfirmDelete = () => {
    onDelete(index);
    onClose();
  };
  useEffect(() => {
    const initialCourseNodes = initializeCourseNodesFromLesson(lesson);
    setCourseNodes((prev) => {
      const updated = [...prev];
      updated[index] = initialCourseNodes;
      return updated;
    });
  }, []);
  return (
    <Box borderWidth="1px" borderRadius="xl" p={4} mb={6} boxShadow="md" bg='purple.50'>
      <FormControl mb={4}>
        <FormLabel>
          <Flex justify="space-between" align="center">
            <Box>
              Lesson Title{' '}
              <InfoButton
                title="Lesson Title"
                description="Enter the title or main theme of this lesson."
                placement="right"
              />
            </Box>
            <IconButton
              aria-label="Delete lesson"
              icon={<DeleteIcon />}
              colorScheme="red"
              onClick={onOpen}
              size="sm"
            />
          </Flex>
        </FormLabel>
        <Input
          value={lesson.title}
          onChange={(e) => updateField('title', e.target.value)}
        />
      </FormControl>

      {/* Learning Outcome */}
      <FormControl mb={6}>
        <FormLabel>
          Learning Outcome{' '}
          <InfoButton
            title="Learning Outcome"
            description="Overall outcome expected from this lesson."
            placement="right"
          />
        </FormLabel>
        <Select
          placeholder="Select outcome"
          value={lesson.learning_outcome}
          onChange={(e) =>
            updateField('learning_outcome', e.target.value as LearningOutcome)
          }
        >
          {Object.values(LearningOutcome).map((outcome) => (
            <option key={outcome} value={outcome}>
              {outcome}
            </option>
          ))}
        </Select>
      </FormControl>
      <VStack align="stretch" spacing={5}>
        <Box>Lesson&apos;s Assignments</Box>
        {courseNodes[index]?.map((assign, aIndex) => (
          <Box
            key={aIndex}
            mt={3}
            p={3}
            borderWidth="1px"
            borderRadius="md"
            bg="white"
            boxShadow="sm"
            
          >
            <Flex justify="space-between" align="center" mb={2}>
              <Text fontWeight="medium">Assignment #{aIndex + 1}</Text>
              <IconButton
                aria-label="Remove assignment"
                icon={<DeleteIcon />}
                size="xs"
                colorScheme="red"
                onClick={() => deleteAssignment(aIndex)}
              />
            </Flex>

            {/* Select topic */}
            <FormControl mb={2}>
              <FormLabel fontSize="sm" mb={1}>
                🧩 Topic
              </FormLabel>
              <Select
                size="sm"
                value={assign.topic || ''}
                onChange={(e) =>
                  updateAssignment(aIndex, {
                    topic: e.target.value,
                  })
                }
              >
                {(lesson.nodes || [])
                  .flatMap((node) => node.topic || [])
                  .map((topic, i) => (
                    <option key={i} value={topic}>
                      {topic}
                    </option>
                  ))}
              </Select>
            </FormControl>
            {
              (lesson.nodes[0].topic,
              lesson.nodes[0].learning_outcome,
              lesson.nodes[0].type)
            }
            <FormControl mb={2}>
              <FormLabel fontSize="sm" mb={1}>
                🧠 Learning Outcome
              </FormLabel>
              <Select
                size="sm"
                value={assign.learning_outcome || ''}
                onChange={(e) =>
                  updateAssignment(aIndex, {
                    learning_outcome: e.target.value as LearningOutcome,
                  })
                }
              >
                {Object.values(LearningOutcome).map((out) => (
                  <option key={out} value={out}>
                    {out}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm" mb={1}>
                📘 Assignment Type
              </FormLabel>
              <Menu>
                <MenuButton
                  as={Button}
                  size="sm"
                  variant="outline"
                  width="100%"
                  rightIcon={<ChevronDownIcon />}
                >
                  {assign.type || 'Select type'}
                </MenuButton>
                <MenuList maxH="200px" overflowY="auto">
                  {QuestionTypeMap.filter((q) => q.integrated).map((q) => (
                    <MenuItem
                      key={q.key}
                      onClick={() => updateAssignment(aIndex, { type: q.key })}
                    >
                      <Flex justify="space-between" align="center" w="full">
                        <Box>{q.text}</Box>
                        {assign.type === q.key && (
                          <CheckIcon color="green.400" boxSize={3} />
                        )}
                      </Flex>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </FormControl>
          </Box>
        ))}
        <Button
          leftIcon={<AddIcon />}
          size="sm"
          mt={4}
          variant="outline"
          colorScheme="teal"
          onClick={onOpenNAss}
        >
          Add New Assignment
        </Button>
      </VStack>
      <Modal isOpen={isOpenNAss} onClose={onCloseNAss} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Suggested Assignments</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid columns={[1, 2]} spacing={4}>
              {lesson.nodes.map((node, idx) => {
                const match =
                  QuestionTypeMap.find(
                    (q) => q.key === node.type && q.integrated
                  ) || QuestionTypeMap.find((q) => q.key === 'open question');

                return (
                  <Box
                    key={idx}
                    borderWidth="1px"
                    borderRadius="md"
                    p={3}
                    bg="gray.50"
                    boxShadow="sm"
                    position="relative"
                    minH="140px"
                  >
                    <Box mb={8}>
                      <Text fontWeight="bold" mb={1}>
                        🧩 Topic: {node.topic}
                      </Text>
                      <Text fontSize="sm" mb={1}>
                        🎯 Outcome: {node.learning_outcome}
                      </Text>
                      <Text fontSize="sm">
                        📘 Type: {match?.text || 'Open Question'}
                      </Text>
                    </Box>
                    <Button
                      position="absolute"
                      bottom="10px"
                      left="50%"
                      transform="translateX(-50%)"
                      size="sm"
                      colorScheme="teal"
                      onClick={() => addAssignmentFromNode(node)}
                    >
                      Select
                    </Button>
                  </Box>
                );
              })}
            </SimpleGrid>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onCloseNAss}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Lesson
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this lesson? This action cannot be
              undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleConfirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ReviewLessonCard;
