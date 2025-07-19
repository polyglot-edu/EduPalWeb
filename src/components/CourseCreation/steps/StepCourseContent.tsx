import {
  Box,
  Center,
  Flex,
  FormLabel,
  Image,
  SimpleGrid,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import {
  EducationLevel,
  LearningObjectives,
  SyllabusTopic,
} from '../../../types/polyglotElements';
import ArrayField from '../../Forms/Fields/ArrayField';
import EnumField from '../../Forms/Fields/EnumField';
import InputTextField from '../../Forms/Fields/InputTextField';
import MarkDownField from '../../Forms/Fields/MarkDownField';
import TagsField from '../../Forms/Fields/TagsField';
import TextField from '../../Forms/Fields/TextField';
import StepHeading from '../../UtilityComponents/StepHeading';

type Tag = {
  name: string;
  color: string;
};

type StepCourseContentProps = {
  selectedTopicState: [
    { topic: SyllabusTopic; index: number } | undefined,
    React.Dispatch<
      React.SetStateAction<{ topic: SyllabusTopic; index: number } | undefined>
    >
  ];
  durationState: [string, React.Dispatch<React.SetStateAction<string>>];
  prerequisitesState: [
    string[],
    React.Dispatch<React.SetStateAction<string[]>>
  ];
  goalsState: [string[], React.Dispatch<React.SetStateAction<string[]>>];
  targetAudienceState: [string, React.Dispatch<React.SetStateAction<string>>];
  classContextState: [string, React.Dispatch<React.SetStateAction<string>>];
  titleState: [string, React.Dispatch<React.SetStateAction<string>>];
  subjectAreaState: [string, React.Dispatch<React.SetStateAction<string>>];
  descriptionState: [string, React.Dispatch<React.SetStateAction<string>>];
  imgState: [string, React.Dispatch<React.SetStateAction<string>>];
  tagsState: [Tag[], React.Dispatch<React.SetStateAction<Tag[]>>];
};

const StepCourseContent = ({
  selectedTopicState,
  durationState,
  prerequisitesState,
  goalsState,
  targetAudienceState,
  classContextState,
  titleState,
  subjectAreaState,
  descriptionState,
  imgState,
  tagsState,
}: StepCourseContentProps) => {
  const [selectedTopic, setSelectedTopic] = selectedTopicState;
  const [duration, setDuration] = durationState;
  const [classContext, setClassContext] = classContextState;
  const [prerequisites, setPrerequisites] = prerequisitesState;
  const [goals, setGoals] = goalsState;
  const [targetAudience, setTargetAudience] = targetAudienceState;
  const [title, setTitle] = titleState;
  const [subjectArea, setSubjectArea] = subjectAreaState;
  const [description, setDescription] = descriptionState;
  const [img, setImg] = imgState;
  const [tags, setTags] = tagsState;

  const [tagName, setTagName] = useState('');
  const [colorTag, setColorTag] = useState('gray');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [imgError, setImgError] = useState(false);

  const updateTopicField = (
    field: keyof SyllabusTopic | keyof LearningObjectives,
    value: string
  ) => {
    if (!selectedTopic) return;
    const updatedTopic = selectedTopic.topic;
    if (field === 'macro_topic' || field === 'details') {
      updatedTopic[field] = value;
    } else {
      updatedTopic.learning_objectives = {
        ...updatedTopic.learning_objectives,
        [field]: value,
      };
    }
    setSelectedTopic({ topic: updatedTopic, index: selectedTopic.index });
  };

  return (
    <Box>
      <StepHeading
        title="Course Details"
        subtitle="Define the structure and content of your course."
      />

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <InputTextField
          label="Course Title"
          placeholder="Enter course title"
          value={title}
          setValue={setTitle}
          infoTitle="Title"
          infoDescription="Enter the title you want to give to your course."
          infoPlacement="right"
        />

        <InputTextField
          label="Subject Area"
          placeholder="Enter subject area, e.g., Mathematics"
          value={subjectArea}
          setValue={setSubjectArea}
          infoTitle="Subject Area"
          infoDescription="Enter the general discipline or domain to which the course belongs."
          infoPlacement="right"
        />
      </SimpleGrid>

      <Flex mt={6} alignItems="flex-start" gap={6} flexWrap="wrap">
        <Flex flex="1" minW="280px" alignItems="flex-start" gap={4}>
          <Box flex="1">
            <InputTextField
              label="Course Image URL"
              placeholder="https://example.com/image.png"
              value={img}
              setValue={(val) => {
                setImg(val);
                setImgError(false);
              }}
              infoTitle="Image URL"
              infoDescription="Provide a direct image link for your course thumbnail."
              infoPlacement="right"
            />
          </Box>
          <Box
            mt={2}
            w="100px"
            h="60px"
            border="1px solid #ccc"
            rounded="md"
            overflow="hidden"
            flexShrink={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {img && !imgError ? (
              <Image
                src={img}
                alt="Course preview"
                objectFit="cover"
                w="100%"
                h="100%"
                onError={() => setImgError(true)}
              />
            ) : (
              <Text color="red.400" fontSize="xs" textAlign="center">
                Not Found
              </Text>
            )}
          </Box>
        </Flex>

        <Box flex="1">
          <TagsField
            tags={tags}
            setTags={setTags}
            tagName={tagName}
            setTagName={setTagName}
            colorTag={colorTag}
            setColorTag={setColorTag}
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
          />
        </Box>
      </Flex>
      <Box width="100%" mt={6}>
        <MarkDownField
          label="Description"
          value={description}
          setValue={setDescription}
          infoTitle="Description"
          infoDescription="Provide a clear summary of the learning path. Markdown supported."
          infoPlacement="right"
        />
      </Box>
      <Box pt={'10px'}>
        <Center>
          <FormLabel>Course Topic</FormLabel>
        </Center>
        <InputTextField
          label="Macro Topic"
          value={selectedTopic?.topic.macro_topic || ''}
          setValue={(val) => updateTopicField('macro_topic', val)}
          height="2rem"
        />
        <InputTextField
          label="Details"
          value={selectedTopic?.topic.details || ''}
          setValue={(val) => updateTopicField('details', val)}
          height="2rem"
        />
        <FormLabel>Learning Objective</FormLabel>
        <SimpleGrid columns={{ base: 3, md: 3 }} spacing={4} mb={4}>
          <TextField
            label="Knowledge"
            isTextArea
            value={selectedTopic?.topic.learning_objectives.knowledge || ''}
            setValue={(val) => updateTopicField('knowledge', val)}
            height="2rem"
          />
          <TextField
            label="Skills"
            isTextArea
            value={selectedTopic?.topic.learning_objectives.skills || ''}
            setValue={(val) => updateTopicField('skills', val)}
            height="2rem"
          />
          <TextField
            label="Attitude"
            isTextArea
            value={selectedTopic?.topic.learning_objectives.attitude || ''}
            setValue={(val) => updateTopicField('attitude', val)}
            height="2rem"
          />
        </SimpleGrid>
      </Box>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <InputTextField
          label="Duration"
          placeholder="Enter course duration (e.g., 10 hours)"
          value={duration}
          setValue={setDuration}
          infoTitle="Duration"
          infoDescription="Specify the total time required to complete the course, including lectures, assignments, and assessments."
          infoPlacement="right"
        />

        <EnumField
          label="Target Audience"
          value={targetAudience}
          setValue={setTargetAudience}
          options={[
            { label: 'Science students', value: 'science students' },
            { label: 'Literature students', value: 'literature students' },
            {
              label: 'Computer science students',
              value: 'computer science students',
            },
            { label: 'Economics students', value: 'economics students' },
            { label: 'Art students', value: 'art students' },
            { label: 'Engineering students', value: 'engineering students' },
            { label: 'Geography students', value: 'geography students' },
            { label: 'Philosophy students', value: 'philosophy students' },
            {
              label: 'Environmental studies students',
              value: 'environmental studies students',
            },
            { label: 'Language students', value: 'language students' },
          ]}
          infoTitle="Target Audience"
          infoDescription="Select the target student group for the course based on the main subject area or field of study. This will help tailor the content and learning approach more effectively."
          infoPlacement="right"
        />
      </SimpleGrid>
      <InputTextField
        label="Class Context"
        placeholder="Describe the context of the class"
        value={classContext}
        setValue={setClassContext}
        infoTitle="Class Context"
        infoDescription="Provide details about the class environment, such as class size or any specific characteristics of the student group that may influence the course design."
        infoPlacement="right"
        height="100px"
      />
      <Flex
        gap={6}
        direction={'row'}
        wrap={{ base: 'wrap', md: 'nowrap' }}
        justify="space-between"
      >
        <Box w={{ base: '100%', md: '48%' }}>
          <ArrayField
            label="Goals"
            value={goals}
            setValue={(val) => setGoals(val)}
          />
        </Box>
        <Box w={{ base: '100%', md: '48%' }}>
          <ArrayField
            label="Prerequisites"
            value={prerequisites}
            setValue={(val) => setPrerequisites(val)}
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default StepCourseContent;
