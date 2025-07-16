import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Divider,
  Flex,
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
  }, [course]);

  if (!course) {
    return <p>Loading...</p>;
  }
  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
        <InputTextField
          label="Title"
          value={course.title}
          setValue={(val) => setCourse({ ...course, title: val })}
        />
        <InputTextField
          label="Subject Area"
          value={course.subjectArea}
          setValue={(val) => setCourse({ ...course, subjectArea: val })}
        />
        <EnumField
          label="Education Level"
          value={course.education_level}
          setValue={(val) =>
            setCourse({ ...course, education_level: val as EducationLevel })
          }
          options={educationOptions}
        />
        <EnumField
          label="Language"
          value={course.language}
          setValue={(val) => setCourse({ ...course, language: val })}
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
          value={course.duration}
          setValue={(val) => setCourse({ ...course, duration: val })}
        />
        <InputTextField
          label="Learning Context"
          value={course.learningContext}
          setValue={(val) => setCourse({ ...course, learningContext: val })}
        />
      </SimpleGrid>
      <Flex flex="1" minW="280px" alignItems="flex-start" gap={4}>
        <Box flex="1">
          <InputTextField
            label="Course Image URL"
            placeholder="https://example.com/image.png"
            value={course.img || ''}
            setValue={(val) => {
              setCourse({ ...course, img: val });
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
          {course.img && !imgError ? (
            <Image
              src={course.img}
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
          tags={course.tags}
          setTags={(tags) =>
            setCourse((prev) => {
              if (!prev) return prev;

              return {
                ...prev,
                tags: typeof tags === 'function' ? tags(prev.tags) : tags,
              };
            })
          }
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
        value={course.description}
        setValue={(val) => setCourse({ ...course, description: val })}
      />
      <InputTextField
        label="Learning Objectives"
        value={course.learningObjectives || ''}
        setValue={(val) => setCourse({ ...course, learningObjectives: val })}
        placeholder="List key outcomes"
      />

      <Divider my={6} />

      <StepHeading title="Learning Flows" subtitle="Reorder and manage flows" />
      <SortableList
        items={course.flows}
        onChange={(flows) => setCourse({ ...course, flows })}
        onAdd={() => console.log('Add new flow')}
        renderActions={(item) => (
          <Button size="sm" onClick={() => console.log('Edit', item._id)}>
            Edit
          </Button>
        )}
        renderItem={(item) => (
          <Box>
            <Text fontWeight="bold">{item.title}</Text>
            <Text fontSize="sm" color="gray.500">
              {item.description}
            </Text>
          </Box>
        )}
      />

      <Button leftIcon={<AddIcon />} mt={4}>
        Add New Flow
      </Button>
    </Box>
  );
};

export default CourseEditor;
