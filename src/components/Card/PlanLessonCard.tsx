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
  Select,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useRef } from 'react';
import {
  Assignment,
  LearningOutcome,
  LessonNodeAI,
  QuestionTypeMap,
  Topic,
} from '../../types/polyglotElements';
import InfoButton from '../UtilityComponents/InfoButton';

type PlanLessonCardProps = {
  lesson: LessonNodeAI;
  index: number;
  updateLesson: (index: number, updated: LessonNodeAI) => void;
  onDelete: (index: number) => void;
};

const PlanLessonCard = ({
  lesson,
  index,
  updateLesson,
  onDelete,
}: PlanLessonCardProps) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const updateField = (field: keyof LessonNodeAI, value: string) => {
    updateLesson(index, { ...lesson, [field]: value });
  };

  const updateTopic = (tIndex: number, updated: Topic) => {
    const newTopics = [...lesson.topics];
    newTopics[tIndex] = updated;
    updateLesson(index, { ...lesson, topics: newTopics });
  };

  const deleteTopic = (tIndex: number) => {
    const newTopics = lesson.topics.filter((_, i) => i !== tIndex);
    updateLesson(index, { ...lesson, topics: newTopics });
  };

  const addTopic = () => {
    const newTopic: Topic = {
      topic: '',
      explanation: '',
      learning_outcome: lesson.learning_outcome,
      assignments: [],
    };
    updateLesson(index, { ...lesson, topics: [...lesson.topics, newTopic] });
  };

  const addAssignment = (tIndex: number) => {
    const topic = lesson.topics[tIndex];
    const newAssign: Assignment = {
      type: '',
      learning_outcome: topic.learning_outcome || lesson.learning_outcome,
      data: undefined,
    };
    const updated = {
      ...topic,
      assignments: [...(topic.assignments || []), newAssign],
    };
    updateTopic(tIndex, updated);
  };

  const updateAssignment = (
    tIndex: number,
    aIndex: number,
    updated: Partial<Assignment>
  ) => {
    const topic = lesson.topics[tIndex];
    const assigns = topic.assignments || [];
    const newAssigns = assigns.map((a, i) =>
      i === aIndex ? { ...a, ...updated } : a
    );
    updateTopic(tIndex, { ...topic, assignments: newAssigns });
  };

  const deleteAssignment = (tIndex: number, aIndex: number) => {
    const topic = lesson.topics[tIndex];
    const newAssigns = (topic.assignments || []).filter((_, i) => i !== aIndex);
    updateTopic(tIndex, { ...topic, assignments: newAssigns });
  };

  const handleConfirmDelete = () => {
    onDelete(index);
    onClose();
  };

  return (
    <Box borderWidth="1px" borderRadius="xl" p={4} mb={6} boxShadow="md">
      {/* Lesson Title */}
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

      {/* Topics + Assignments */}
      <VStack align="stretch" spacing={5}>
        {lesson.topics.map((topic, tIndex) => (
          <Box
            key={tIndex}
            borderWidth="1px"
            borderLeftWidth="6px"
            borderLeftColor="teal.400"
            borderRadius="lg"
            p={3}
            mb={3}
            bg="gray.50"
            _hover={{ bg: 'gray.100' }}
            boxShadow="sm"
          >
            <Flex justify="space-between" align="center" mb={2}>
              <FormLabel fontWeight="semibold" fontSize="sm" mb={0}>
                🧩 Topic #{tIndex + 1}
              </FormLabel>
              <IconButton
                aria-label="Delete topic"
                icon={<DeleteIcon />}
                size="sm"
                colorScheme="red"
                variant="ghost"
                onClick={() => deleteTopic(tIndex)}
              />
            </Flex>

            <FormControl mb={2}>
              <FormLabel fontSize="sm" mb={1}>
                Title
              </FormLabel>
              <Input
                size="sm"
                value={topic.topic}
                onChange={(e) =>
                  updateTopic(tIndex, { ...topic, topic: e.target.value })
                }
              />
            </FormControl>

            <FormControl mb={2}>
              <FormLabel fontSize="sm" mb={1}>
                Explanation
              </FormLabel>
              <Textarea
                size="sm"
                value={topic.explanation}
                onChange={(e) =>
                  updateTopic(tIndex, { ...topic, explanation: e.target.value })
                }
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel fontSize="sm" mb={1}>
                Learning Outcome
              </FormLabel>
              <Select
                size="sm"
                placeholder="Select outcome"
                value={topic.learning_outcome || lesson.learning_outcome}
                onChange={(e) =>
                  updateTopic(tIndex, {
                    ...topic,
                    learning_outcome: e.target.value as LearningOutcome,
                  })
                }
              >
                {Object.values(LearningOutcome).map((outcome) => (
                  <option key={outcome} value={outcome}>
                    {outcome}
                  </option>
                ))}
              </Select>
            </FormControl>

            {/* Assignments */}
            {(topic.assignments || []).map((assign, aIndex) => (
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
                    onClick={() => deleteAssignment(tIndex, aIndex)}
                  />
                </Flex>

                <FormControl mb={2}>
                  <FormLabel fontSize="sm" mb={1}>
                    🧠 Learning Outcome
                  </FormLabel>
                  <Select
                    size="sm"
                    value={assign.learning_outcome || ''}
                    onChange={(e) =>
                      updateAssignment(tIndex, aIndex, {
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
                          onClick={() =>
                            updateAssignment(tIndex, aIndex, {
                              type: q.key,
                              data: q.defaultData,
                            })
                          }
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
              onClick={() => addAssignment(tIndex)}
            >
              Add New Assignment
            </Button>
          </Box>
        ))}
      </VStack>

      <Button
        leftIcon={<AddIcon />}
        mt={4}
        onClick={addTopic}
        variant="outline"
        colorScheme="teal"
      >
        Add Topic
      </Button>

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

export default PlanLessonCard;
