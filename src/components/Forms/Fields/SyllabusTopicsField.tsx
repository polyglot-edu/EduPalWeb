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
  selectedTopicState: [
    { topic: SyllabusTopic; index: number } | undefined,
    React.Dispatch<
      React.SetStateAction<{ topic: SyllabusTopic; index: number } | undefined>
    >
  ];
};

const SyllabusTopicsField = ({
  topics,
  updateTopics,
  selectedTopicState,
}: Props) => {
  const [selectedTopic, setSelectedTopic] = selectedTopicState;
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
    if (selectedTopic && selectedTopic.index === index) {
      setSelectedTopic({ topic: updatedTopics[index], index });
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
      {topics.map((topic, index) => {
        const isSelected = selectedTopic && selectedTopic.index === index;
        return (
          <Box
            key={index}
            borderWidth="1px"
            borderRadius="md"
            p={3}
            bg={isSelected ? 'purple.50' : 'gray.50'}
            _hover={{
              bg: isSelected ? 'purple.50' : 'gray.200',
              cursor: 'pointer',
            }}
            borderColor={isSelected ? 'grey.500' : ''}
            border={isSelected ? '1px dashed grey' : '0px solid'}
            onClick={() => setSelectedTopic({ topic: topic, index: index })}
          >
            <Flex justify="space-between" align="center" mb={2}>
              <Box fontSize="sm" fontWeight="semibold">
                Topic #{index + 1} {isSelected && '✓'}
              </Box>
              <IconButton
                size="xs"
                icon={<DeleteIcon />}
                aria-label="Delete topic"
                colorScheme="red"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTopic(index);
                }}
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
        );
      })}

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
