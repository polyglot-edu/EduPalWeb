import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  IconButton,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  LearningObjectives,
  SyllabusTopic,
} from '../../../types/polyglotElements';
import InputTextField from './InputTextField';
import TextField from './TextField';

type Props = {
  topics: SyllabusTopic[];
  updateTopics: (updated: SyllabusTopic[]) => void;
};

const SyllabusTopicsField = ({ topics, updateTopics }: Props) => {
  const updateTopicField = (
    index: number,
    field: keyof SyllabusTopic | keyof LearningObjectives,
    value: string
  ) => {
    const updatedTopics = [...topics];

    if (field === 'macro_topic' || field === 'details') {
      updatedTopics[index][field] = value;
    } else {
      updatedTopics[index].learning_objectives = {
        ...updatedTopics[index].learning_objectives,
        [field]: value,
      };
    }

    updateTopics(updatedTopics);
  };

  const addTopic = () => {
    updateTopics([
      ...topics,
      {
        macro_topic: '',
        details: '',
        learning_objectives: {
          knowledge: '',
          skills: '',
          attitude: '',
        },
      },
    ]);
  };

  const deleteTopic = (index: number) => {
    const updatedTopics = topics.filter((_, i) => i !== index);
    updateTopics(updatedTopics);
  };

  return (
    <VStack align="stretch" spacing={3}>
      {topics.map((topic, index) => (
        <Box
          key={index}
          borderWidth="1px"
          borderRadius="md"
          p={3}
          bg="gray.50"
          _hover={{ bg: 'gray.100' }}
        >
          <Flex justify="space-between" align="center" mb={2}>
            <Box fontSize="sm" fontWeight="semibold">
              Topic #{index + 1}
            </Box>
            <IconButton
              size="xs"
              icon={<DeleteIcon />}
              aria-label="Delete topic"
              colorScheme="red"
              variant="ghost"
              onClick={() => deleteTopic(index)}
            />
          </Flex>

          <InputTextField
            label="Macro Topic"
            value={topic.macro_topic}
            setValue={(val) => updateTopicField(index, 'macro_topic', val)}
            height="2rem"
          />
          <InputTextField
            label="Details"
            value={topic.details}
            setValue={(val) => updateTopicField(index, 'details', val)}
            height="2rem"
          />
          <Text>Learning Objective</Text>
          <SimpleGrid columns={{ base: 3, md: 3 }} spacing={4} mb={4}>
            <TextField
              label="Knowledge"
              isTextArea
              value={topic.learning_objectives.knowledge}
              setValue={(val) => updateTopicField(index, 'knowledge', val)}
              height="2rem"
            />
            <TextField
              label="Skills"
              isTextArea
              value={topic.learning_objectives.skills}
              setValue={(val) => updateTopicField(index, 'skills', val)}
              height="2rem"
            />
            <TextField
              label="Attitude"
              isTextArea
              value={topic.learning_objectives.attitude}
              setValue={(val) => updateTopicField(index, 'attitude', val)}
              height="2rem"
            />
          </SimpleGrid>
        </Box>
      ))}

      <Button
        onClick={addTopic}
        leftIcon={<AddIcon />}
        variant="outline"
        size="sm"
        alignSelf="flex-start"
      >
        Add Topic
      </Button>
    </VStack>
  );
};

export default SyllabusTopicsField;
