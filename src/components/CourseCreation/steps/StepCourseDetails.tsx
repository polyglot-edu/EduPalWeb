import { Box, SimpleGrid } from '@chakra-ui/react';
import { EducationLevel } from '../../../types/polyglotElements';
import EnumField from '../../Forms/Fields/EnumField';
import InputTextField from '../../Forms/Fields/InputTextField';
import MarkDownField from '../../Forms/Fields/MarkDownField';
import StepHeading from '../../UtilityComponents/StepHeading';
type StepCourseDetailsProps = {
  titleState: [string, React.Dispatch<React.SetStateAction<string>>];
  subjectAreaState: [string, React.Dispatch<React.SetStateAction<string>>];
  eduLevelState: [
    EducationLevel,
    React.Dispatch<React.SetStateAction<EducationLevel>>
  ];
  languageState: [string, React.Dispatch<React.SetStateAction<string>>];
  descriptionState: [string, React.Dispatch<React.SetStateAction<string>>];
};
const StepCourseDetails = ({
  titleState,
  subjectAreaState,
  eduLevelState,
  languageState,
  descriptionState,
}: StepCourseDetailsProps) => {
  const [title, setTitle] = titleState;
  const [subjectArea, setSubjectArea] = subjectAreaState;
  const [eduLevel, setEduLevel] = eduLevelState;
  const [language, setLanguage] = languageState;
  const [description, setDescription] = descriptionState;

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
          infoDescription="Enter the general discipline or domain to which the course belongs, such as 'Mathematics', 'Environmental Science', or 'Digital Skills'."
          infoPlacement="right"
        />

        <EnumField
          label="Educational Level"
          value={eduLevel}
          setValue={(value: string) => setEduLevel(value as EducationLevel)}
          options={educationOptions}
          infoTitle="Educational Level"
          infoDescription="Specify the academic level of the target audience, such as elementary school, high school, or college, to tailor the learning path appropriately."
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
          infoDescription="Choose the language in which the learning materials and content will be presented."
          infoPlacement="right"
        />
      </SimpleGrid>
      <Box width="100%">
        <MarkDownField
          label="Description"
          value={description}
          setValue={setDescription}
          infoTitle="Description"
          infoDescription="Provide a clear and concise summary of the learning path's purpose, content, and goals. Use markdown to format your text if needed."
          infoPlacement="right"
        />
      </Box>
    </Box>
  );
};

export default StepCourseDetails;
