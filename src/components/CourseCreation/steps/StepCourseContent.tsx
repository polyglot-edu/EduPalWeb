import {
  Box,
  Button,
  Flex,
  Image,
  SimpleGrid,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import {
  LearningObjectives,
  SyllabusTopic,
} from '../../../types/polyglotElements';
import ArrayField from '../../Forms/Fields/ArrayField';
import EnumField from '../../Forms/Fields/EnumField';
import InputTextField from '../../Forms/Fields/InputTextField';
import TagsField from '../../Forms/Fields/TagsField';
import StepHeading from '../../UtilityComponents/StepHeading';

type Tag = {
  name: string;
  color: string;
};

type StepCourseContentProps = {
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
  imgState: [string, React.Dispatch<React.SetStateAction<string>>];
  tagsState: [Tag[], React.Dispatch<React.SetStateAction<Tag[]>>];
  nextStep: () => void;
  prevStep: () => void;
};

const StepCourseContent = ({
  durationState,
  prerequisitesState,
  goalsState,
  targetAudienceState,
  classContextState,
  titleState,
  subjectAreaState,
  imgState,
  tagsState,
  nextStep,
  prevStep,
}: StepCourseContentProps) => {
  const [duration, setDuration] = durationState;
  const [classContext, setClassContext] = classContextState;
  const [prerequisites, setPrerequisites] = prerequisitesState;
  const [goals, setGoals] = goalsState;
  const [targetAudience, setTargetAudience] = targetAudienceState;
  const [title, setTitle] = titleState;
  const [subjectArea, setSubjectArea] = subjectAreaState;
  const [img, setImg] = imgState;
  const [tags, setTags] = tagsState;

  const [tagName, setTagName] = useState('');
  const [colorTag, setColorTag] = useState('gray');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [imgError, setImgError] = useState(false);

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
      <Flex mt={8} justify="space-between" py={2}>
        <Box flex="1" display="flex" justifyContent="center">
          <Button onClick={() => prevStep()}>Back</Button>
        </Box>
        <Box flex="1" display="flex" justifyContent="center"></Box>
        <Box flex="1" display="flex" justifyContent="center">
          <Button colorScheme="purple" onClick={nextStep}>
            Next
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default StepCourseContent;
