import { CheckIcon, ChevronDownIcon, DeleteIcon } from '@chakra-ui/icons';
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
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useRef } from 'react';
import {
  AIPlanLessonResponse,
  Assignment,
  LearningOutcome,
  QuestionTypeMap,
} from '../../types/polyglotElements';
import InfoButton from '../UtilityComponents/InfoButton';

type ReviewLessonCardProps = {
  lesson: AIPlanLessonResponse;
  index: number;
  updateLesson: (index: number, updated: AIPlanLessonResponse) => void;
  onDelete: (index: number) => void;
};

const ReviewLessonCard = ({
  lesson,
  index,
  updateLesson,
  onDelete,
}: ReviewLessonCardProps) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const updateField = (field: keyof AIPlanLessonResponse, value: string) => {
    updateLesson(index, { ...lesson, [field]: value });
  };

  // Qui i topic NON sono modificabili, quindi NON usiamo updateTopic, addTopic o deleteTopic

  const updateAssignment = (
    tIndex: number,
    aIndex: number,
    updated: Partial<Assignment>
  ) => {
    const topic = lesson.data?.topic[tIndex];
    if (!topic) return;
    const assigns = topic.assignments || [];
    const prevAssignment = assigns[aIndex];

    const newAssign = { ...prevAssignment, ...updated };

    if (updated.type) {
      const typeConfig = QuestionTypeMap.find((q) => q.key === updated.type);
      if (typeConfig?.defaultData) {
        newAssign.data = typeConfig.defaultData;
      }
    }

    const newAssigns = assigns.map((a: any, i: number) => (i === aIndex ? newAssign : a));
    const newTopics = [...lesson.data.topic];
    newTopics[tIndex] = { ...topic, assignments: newAssigns };

    updateLesson(index, {
      ...lesson,
      data: {
        ...lesson.data,
        topic: newTopics,
      },
    });
  };

  const deleteAssignment = (tIndex: number, aIndex: number) => {
    const topic = lesson.data?.topic[tIndex];
    if (!topic) return;
    const newAssigns = (topic.assignments || []).filter((_: any, i: number) => i !== aIndex);
    const newTopics = [...lesson.data.topic];
    newTopics[tIndex] = { ...topic, assignments: newAssigns };

    updateLesson(index, {
      ...lesson,
      data: {
        ...lesson.data,
        topic: newTopics,
      },
    });
  };

  const assignments = lesson.data || [];
  console.log('Lesson topics:', assignments);
  console.log('Lesson data:');
  console.log(lesson.data);
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

      <VStack align="stretch" spacing={5}>
        {assignments.map((assignment: any, tIndex: number) => (
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
            <Text fontWeight="semibold" fontSize="md" mb={3}>
              🧩 Topic #{tIndex + 1}
            </Text>

            <FormControl mb={2}>
              <FormLabel fontSize="sm" mb={1}>
                Title
              </FormLabel>
              <Text
                fontSize="sm"
                px={2}
                py={1}
                bg="gray.100"
                borderRadius="md"
                userSelect="text"
              >
                {assignment.topic.topic}
              </Text>
            </FormControl>

            <FormControl mb={2}>
              <FormLabel fontSize="sm" mb={1}>
                Explanation
              </FormLabel>
              <Text
                fontSize="sm"
                px={2}
                py={1}
                bg="gray.100"
                borderRadius="md"
                whiteSpace="pre-wrap"
                userSelect="text"
              >
                {assignment.topic.explanation}
              </Text>
            </FormControl>

            <FormControl mb={4}>
              <FormLabel fontSize="sm" mb={1}>
                Learning Outcome
              </FormLabel>
              <Text
                fontSize="sm"
                px={2}
                py={1}
                bg="gray.100"
                borderRadius="md"
                userSelect="text"
              >
                {assignment.topic.learning_outcome || ''}
              </Text>
            </FormControl>

            {(assignments).map((assign: any, aIndex: any) => (
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
                            updateAssignment(tIndex, aIndex, { type: q.key })
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
            {/* Nota: nessun bottone Add Topic, Delete Topic o modifica Topic */}
          </Box>
        ))}
      </VStack>

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
