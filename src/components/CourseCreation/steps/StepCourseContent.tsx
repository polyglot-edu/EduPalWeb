import { Box, SimpleGrid } from '@chakra-ui/react';
import EnumField from '../../Forms/Fields/EnumField';
import InputTextField from '../../Forms/Fields/InputTextField';
import StepHeading from '../../UtilityComponents/StepHeading';

type StepCourseContentProps = {
  learningObjectivesState: [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ];
  durationState: [string, React.Dispatch<React.SetStateAction<string>>];
  prerequisitesState: [string, React.Dispatch<React.SetStateAction<string>>];
  targetAudienceState: [string, React.Dispatch<React.SetStateAction<string>>];
};

const StepCourseContent = ({
  learningObjectivesState,
  durationState,
  prerequisitesState,
  targetAudienceState,
}: StepCourseContentProps) => {
  const [learningObjectives, setObjectives] = learningObjectivesState;
  const [duration, setDuration] = durationState;
  const [prerequisites, setPrerequisites] = prerequisitesState;
  const [targetAudience, setTargetAudience] = targetAudienceState;

  return (
    <Box>
      <StepHeading
        title="Course Content"
        subtitle="Define the structure and content of your course."
      />
      <InputTextField
        label="Learning Objectives"
        placeholder="Enter learning objectives"
        value={learningObjectives}
        setValue={setObjectives}
        infoTitle="Learning Objectives"
        infoDescription="Define the key learning outcomes you want students to achieve by the end of the course."
        infoPlacement="right"
      />
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
        label="Prerequisites"
        placeholder="Enter prerequisites (if any)"
        value={prerequisites}
        setValue={setPrerequisites}
        infoTitle="Prerequisites"
        infoDescription="List any prior knowledge or skills required for students to successfully engage with the course content."
        infoPlacement="right"
      />
    </Box>
  );
};

export default StepCourseContent;
