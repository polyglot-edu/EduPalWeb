import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
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
  Select,
  Textarea,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useRef } from 'react';
import {
  LearningOutcome,
  LessonNodeAI,
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
    updateLesson(index, {
      ...lesson,
      [field]: value,
    });
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
    };
    updateLesson(index, { ...lesson, topics: [...lesson.topics, newTopic] });
  };

  const handleConfirmDelete = () => {
    onDelete(index);
    onClose();
  };

  return (
    <Box borderWidth="1px" borderRadius="xl" p={4} mb={6} boxShadow="md">
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

      {/* Topics */}
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

            <FormControl>
              <FormLabel fontSize="sm" mb={1}>
                Learning Outcome
              </FormLabel>
              <Select
                size="sm"
                placeholder="Select outcome"
                value={topic.learning_outcome || ''}
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
