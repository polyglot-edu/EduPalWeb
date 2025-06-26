import {
  Box,
  Flex,
  Image,
  SimpleGrid,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { EducationLevel } from '../../../types/polyglotElements';
import EnumField from '../../Forms/Fields/EnumField';
import InputTextField from '../../Forms/Fields/InputTextField';
import MarkDownField from '../../Forms/Fields/MarkDownField';
import TagsField from '../../Forms/Fields/TagsField';
import StepHeading from '../../UtilityComponents/StepHeading';

type Tag = {
  name: string;
  color: string;
};

type StepCourseDetailsProps = {
  titleState: [string, React.Dispatch<React.SetStateAction<string>>];
  subjectAreaState: [string, React.Dispatch<React.SetStateAction<string>>];
  eduLevelState: [
    EducationLevel,
    React.Dispatch<React.SetStateAction<EducationLevel>>
  ];
  languageState: [string, React.Dispatch<React.SetStateAction<string>>];
  descriptionState: [string, React.Dispatch<React.SetStateAction<string>>];
  imgState: [string, React.Dispatch<React.SetStateAction<string>>];
  tagsState: [Tag[], React.Dispatch<React.SetStateAction<Tag[]>>];
};

const StepCourseDetails = ({
  titleState,
  subjectAreaState,
  eduLevelState,
  languageState,
  descriptionState,
  imgState,
  tagsState,
}: StepCourseDetailsProps) => {
  const [title, setTitle] = titleState;
  const [subjectArea, setSubjectArea] = subjectAreaState;
  const [eduLevel, setEduLevel] = eduLevelState;
  const [language, setLanguage] = languageState;
  const [description, setDescription] = descriptionState;
  const [img, setImg] = imgState;
  const [tags, setTags] = tagsState;

  const [tagName, setTagName] = useState('');
  const [colorTag, setColorTag] = useState('gray');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [imgError, setImgError] = useState(false);

  const educationOptions = Object.entries(EducationLevel).map(
    ([key, value]) => ({
      label: key.replace(/([A-Z])/g, ' $1').trim(),
      value,
    })
  );

  return (
    <Box>
      <StepHeading
        title="Add a new Course"
        subtitle="Provide basic information about your course."
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

        <EnumField
          label="Educational Level"
          value={eduLevel}
          setValue={(value: string) => setEduLevel(value as EducationLevel)}
          options={educationOptions}
          infoTitle="Educational Level"
          infoDescription="Specify the academic level of the target audience."
          infoPlacement="right"
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
          infoTitle="Language"
          infoDescription="Choose the language of the learning materials."
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
    </Box>
  );
};

export default StepCourseDetails;
