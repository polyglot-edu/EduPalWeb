import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  EducationLevel,
  PolyglotCourseWithFlows,
} from '../../types/polyglotElements';
import EnumField from '../Forms/Fields/EnumField';
import InputTextField from '../Forms/Fields/InputTextField';
import MarkDownField from '../Forms/Fields/MarkDownField';
import TagsField from '../Forms/Fields/TagsField';
import StepHeading from '../UtilityComponents/StepHeading';
import SortableList from './SortableList';

type CourseEditorProps = {
  courseState: [
    PolyglotCourseWithFlows | undefined,
    React.Dispatch<React.SetStateAction<PolyglotCourseWithFlows | undefined>>
  ];
};

const CourseEditor = ({ courseState }: CourseEditorProps) => {
  const [course, setCourse] = courseState;

  const [title, setTitle] = useState(course?.title ?? '');
  const [subjectArea, setSubjectArea] = useState(course?.subjectArea ?? '');
  const [eduLevel, setEduLevel] = useState(
    course?.education_level ?? EducationLevel.HighSchool
  );
  const [language, setLanguage] = useState(course?.language ?? 'english');
  const [description, setDescription] = useState(course?.description ?? '');
  const [img, setImg] = useState(course?.img ?? '');
  const [tags, setTags] = useState(course?.tags ?? []);
  const [duration, setDuration] = useState(course?.duration ?? '');
  const [learningObjectives, setObjectives] = useState(
    course?.learningObjectives ?? ''
  );
  const [topics, setTopics] = useState(course?.topics ?? []);
  const [learningContext, setLearningContext] = useState(
    course?.learningContext ?? ''
  );
  const [flows, setFlows] = useState(course?.flows ?? []);
  const [tagName, setTagName] = useState('');
  const [colorTag, setColorTag] = useState('gray');
  const [imgError, setImgError] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const educationOptions = Object.entries(EducationLevel).map(
    ([key, value]) => ({
      label: key.replace(/([A-Z])/g, ' $1').trim(),
      value,
    })
  );

  useEffect(() => {
    if (!course) return;
    setTitle(course.title ?? '');
    setSubjectArea(course.subjectArea ?? '');
    setEduLevel(course.education_level ?? EducationLevel.HighSchool);
    setLanguage(course.language ?? 'english');
    setDescription(course.description ?? '');
    setImg(course.img ?? '');
    setTags(course.tags ?? []);
    setDuration(course.duration ?? '');
    setObjectives(course.learningObjectives ?? '');
    setTopics(course.topics ?? []);
    setLearningContext(course.learningContext ?? '');
    setFlows(course.flows ?? []);
  }, [course]);

  if (!course) {
    return <p>Loading...</p>;
  }
  return (
    <Box>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
        <InputTextField label="Title" value={title} setValue={setTitle} />
        <InputTextField
          label="Subject Area"
          value={subjectArea}
          setValue={setSubjectArea}
        />
        <EnumField
          label="Education Level"
          value={eduLevel}
          setValue={(val) => setEduLevel(val as EducationLevel)}
          options={educationOptions}
        />
        <EnumField
          label="Language"
          value={language}
          setValue={setLanguage}
          options={[
            { label: 'English', value: 'english' },
            { label: 'Italiano', value: 'italian' },
            { label: 'Français', value: 'french' },
            { label: 'Español', value: 'spanish' },
            { label: 'Deutsch', value: 'german' },
          ]}
        />
        <InputTextField
          label="Duration"
          value={duration}
          setValue={setDuration}
        />
        <InputTextField
          label="Learning Context"
          value={learningContext}
          setValue={setLearningContext}
        />
      </SimpleGrid>
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

      <Box my={4}>
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

      <MarkDownField
        label="Description"
        value={description}
        setValue={setDescription}
      />
      <InputTextField
        label="Learning Objectives"
        value={learningObjectives}
        setValue={setObjectives}
        placeholder="List key outcomes"
      />

      <Divider my={6} />

      <StepHeading title="Learning Flows" subtitle="Reorder and manage flows" />
      <SortableList
        items={flows}
        onChange={setFlows}
        onAdd={() => console.log('Add new flow')}
        renderActions={(item) => (
          <Button size="sm" onClick={() => console.log('Edit', item._id)}>
            Edit
          </Button>
        )}
      />

      <Button leftIcon={<AddIcon />} mt={4}>
        Add New Flow
      </Button>
    </Box>
  );
};

export default CourseEditor;
