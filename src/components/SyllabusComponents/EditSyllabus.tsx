import {
  Box,
  Button,
  Center,
  Flex,
  FormLabel,
  SimpleGrid,
} from '@chakra-ui/react';
import {
  EducationLevel,
  LearningObjectives,
  SyllabusTopic,
} from '../../types/polyglotElements';
import ArrayField from '../Forms/Fields/ArrayField';
import EnumField from '../Forms/Fields/EnumField';
import EnumFieldWithCustom from '../Forms/Fields/EnumFieldWithCustom';
import InputTextField from '../Forms/Fields/InputTextField';
import MarkDownField from '../Forms/Fields/MarkDownField';
import TextField from '../Forms/Fields/TextField';
import StepHeading from '../UtilityComponents/StepHeading';

type Props = {
  definedSyllabus: any;
  setDefinedSyllabus: (s: any) => void;

  academicYearState: [string, (v: string) => void];
  courseCodeState: [string, (v: string) => void];
  courseOfStudyState: [string, (v: string) => void];
  semesterState: [string, (v: string) => void];
  creditsState: [number, (v: number) => void];
  teachingHoursState: [number, (v: number) => void];
  disciplinarySectorState: [string, (v: string) => void];
  teachingMethodsState: [string[], (v: string[]) => void];
  assessmentMethodsState: [string[], (v: string[]) => void];
  referenceMaterialsState: [string[], (v: string[]) => void];
  selectedTopicState: [number[], React.Dispatch<number[]>];
  studyregulationState: [string, (v: string) => void];
  curriculumPathState: [string, (v: string) => void];
  studentPartitionState: [string, (v: string) => void];
  integratedCourseUnitState: [string, (v: string) => void];
  courseTypeState: [string, (v: string) => void];
  departmentState: [string, (v: string) => void];
  courseYearState: [string, (v: string) => void];
};

export default function EditSyllabus({
  definedSyllabus,
  setDefinedSyllabus,
  academicYearState,
  courseCodeState,
  courseOfStudyState,
  semesterState,
  creditsState,
  teachingHoursState,
  disciplinarySectorState,
  teachingMethodsState,
  assessmentMethodsState,
  referenceMaterialsState,
  selectedTopicState,
  studyregulationState: studyRegulationState,
  curriculumPathState,
  studentPartitionState,
  integratedCourseUnitState,
  courseTypeState,
  departmentState,
  courseYearState,
}: Props) {
  const [academicYear, setAcademicYear] = academicYearState;
  const [courseCode, setCourseCode] = courseCodeState;
  const [courseOfStudy, setCourseOfStudy] = courseOfStudyState;
  const [semester, setSemester] = semesterState;
  const [credits, setCredits] = creditsState;
  const [teachingHours, setTeachingHours] = teachingHoursState;
  const [disciplinarySector, setDisciplinarySector] = disciplinarySectorState;
  const [teachingMethods, setTeachingMethods] = teachingMethodsState;
  const [assessmentMethods, setAssessmentMethods] = assessmentMethodsState;
  const [referenceMaterials, setReferenceMaterials] = referenceMaterialsState;
  const [selectedTopic, setSelectedTopic] = selectedTopicState;

  const [studyRegulation, setStudyRegulation] = studyRegulationState;
  const [curriculumPath, setCurriculumPath] = curriculumPathState;
  const [studentPartition, setStudentPartition] = studentPartitionState;
  const [integratedCourseUnit, setIntegratedCourseUnit] =
    integratedCourseUnitState;
  const [courseType, setCourseType] = courseTypeState;
  const [department, setDepartment] = departmentState;
  const [courseYear, setCourseYear] = courseYearState;

  const updateTopicField = (
    field: keyof SyllabusTopic | keyof LearningObjectives,
    value: string,
    index: number
  ) => {
    const updatedTopics: SyllabusTopic[] = [...definedSyllabus.topics];

    if (field === 'macro_topic' || field === 'details') {
      updatedTopics[index][field] = value;
    } else {
      updatedTopics[index].learning_objectives = {
        ...updatedTopics[index].learning_objectives,
        [field]: value,
      };
    }
    setDefinedSyllabus((prev: any) => ({ ...prev, topics: updatedTopics }));
  };

  const educationOptions = Object.entries(EducationLevel).map(
    ([key, value]) => ({
      label: key.replace(/([A-Z])/g, ' $1').trim(),
      value,
    })
  );

  const addTopic = () => {
    setDefinedSyllabus((prev: { topics: any }) => ({
      ...prev,
      topics: [
        ...prev.topics,
        {
          macro_topic: '',
          details: '',
          learning_objectives: {
            knowledge: '',
            skills: '',
            attitude: '',
          },
        },
      ],
    }));
    setSelectedTopic([...selectedTopic, definedSyllabus.topics.length]);
  };

  const removeTopic = (indexToRemove: number) => {
    setDefinedSyllabus((prev: { topics: any[] }) => {
      const updatedTopics = prev.topics.filter((_, i) => i !== indexToRemove);
      return { ...prev, topics: updatedTopics };
    });

    setSelectedTopic(
      selectedTopic
        .filter((i) => i !== indexToRemove)
        .map((i) => (i > indexToRemove ? i - 1 : i))
    );
  };

  return (
    <Box>
      <StepHeading
        title="Edit Full Syllabus"
        subtitle="Modify the entire syllabus and fill in institutional metadata."
      />

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <TextField
          label="Title"
          value={definedSyllabus.title}
          setValue={(val: any) =>
            setDefinedSyllabus({ ...definedSyllabus, title: val })
          }
        />
        <TextField
          label="Subject Area"
          value={definedSyllabus.subjectArea || definedSyllabus.general_subject}
          setValue={(val: any) =>
            setDefinedSyllabus({ ...definedSyllabus, subjectArea: val })
          }
        />

        <EnumField
          label="Education Level"
          value={definedSyllabus.educational_level}
          setValue={(val: any) =>
            setDefinedSyllabus({
              ...definedSyllabus,
              educational_level: val as EducationLevel,
            })
          }
          options={educationOptions}
        />
        <EnumField
          label="Language"
          value={definedSyllabus.language}
          setValue={(val: any) =>
            setDefinedSyllabus({ ...definedSyllabus, language: val })
          }
          options={[
            { label: 'English', value: 'english' },
            { label: 'Italiano', value: 'italian' },
            { label: 'Français', value: 'french' },
            { label: 'Español', value: 'spanish' },
            { label: 'Deutsch', value: 'german' },
          ]}
        />
      </SimpleGrid>

      <MarkDownField
        label="Additional Information"
        value={definedSyllabus.additional_information}
        setValue={(val: any) =>
          setDefinedSyllabus({
            ...definedSyllabus,
            additional_information: val,
          })
        }
      />

      <InputTextField
        label="Description"
        value={definedSyllabus.description}
        setValue={(val: any) =>
          setDefinedSyllabus({ ...definedSyllabus, description: val })
        }
      />
      <Box pt="10px">
        <Center>
          <FormLabel>Syllabus Topics</FormLabel>
        </Center>

        {selectedTopic &&
          selectedTopic.map((index) => {
            const topic = definedSyllabus.topics[index];
            if (!topic) return null;

            return (
              <Box
                key={index}
                mt="3"
                borderWidth="1px"
                borderRadius="md"
                p={3}
                bg="purple.100"
                _hover={{
                  bg: 'purple.200',
                  cursor: 'pointer',
                }}
              >
                <Flex justify="space-between" align="center" mb={2}>
                  <FormLabel m={0}>Topic {index + 1}</FormLabel>
                  <Button
                    size="xs"
                    colorScheme="red"
                    onClick={() => removeTopic(index)}
                  >
                    Remove
                  </Button>
                </Flex>

                <InputTextField
                  label="Macro Topic"
                  value={topic.macro_topic || ''}
                  setValue={(val) =>
                    updateTopicField('macro_topic', val, index)
                  }
                  height="2rem"
                />

                <InputTextField
                  label="Details"
                  value={topic.details || ''}
                  setValue={(val) => updateTopicField('details', val, index)}
                  height="2rem"
                />

                <Center>
                  <FormLabel>Learning Objective</FormLabel>
                </Center>

                <SimpleGrid columns={{ base: 3, md: 3 }} spacing={4} mb={4}>
                  <TextField
                    label="Knowledge"
                    isTextArea
                    value={topic.learning_objectives?.knowledge || ''}
                    setValue={(val) =>
                      updateTopicField('knowledge', val, index)
                    }
                    height="2rem"
                  />
                  <TextField
                    label="Skills"
                    isTextArea
                    value={topic.learning_objectives?.skills || ''}
                    setValue={(val) => updateTopicField('skills', val, index)}
                    height="2rem"
                  />
                  <TextField
                    label="Attitude"
                    isTextArea
                    value={topic.learning_objectives?.attitude || ''}
                    setValue={(val) => updateTopicField('attitude', val, index)}
                    height="2rem"
                  />
                </SimpleGrid>
              </Box>
            );
          })}

        {/* Pulsante per aggiungere un topic */}
        <Center mt={4}>
          <Button size="sm" colorScheme="purple" onClick={addTopic}>
            + Add Topic
          </Button>
        </Center>
      </Box>

      <Flex gap={6} wrap={{ base: 'wrap', md: 'nowrap' }} mt={4}>
        <Box w={{ base: '100%', md: '48%' }}>
          <ArrayField
            label="Goals"
            value={definedSyllabus.goals}
            setValue={(val: any) =>
              setDefinedSyllabus({ ...definedSyllabus, goals: val })
            }
          />
        </Box>
        <Box w={{ base: '100%', md: '48%' }}>
          <ArrayField
            label="Prerequisites"
            value={definedSyllabus.prerequisites}
            setValue={(val: any) =>
              setDefinedSyllabus({ ...definedSyllabus, prerequisites: val })
            }
          />
        </Box>
      </Flex>

      <Box mt={8}>
        <StepHeading
          title="Course Metadata"
          subtitle="Institutional and organizational fields."
        />

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <TextField
            label="Course of Study"
            value={courseOfStudy}
            setValue={setCourseOfStudy}
          />
          <TextField
            label="Study Regulation"
            value={studyRegulation}
            setValue={setStudyRegulation}
          />
          <TextField
            label="Curriculum Path"
            value={curriculumPath}
            setValue={setCurriculumPath}
          />
          <TextField
            label="Course Code"
            value={courseCode}
            setValue={setCourseCode}
          />
          <TextField
            label="Integrated Course Unit"
            value={integratedCourseUnit}
            setValue={setIntegratedCourseUnit}
          />

          <TextField
            label="Student Partition"
            value={studentPartition}
            setValue={setStudentPartition}
          />
          <TextField
            label="Academic Year"
            value={academicYear}
            setValue={setAcademicYear}
          />
          <EnumField
            label="Semester"
            value={semester}
            setValue={(val: any) => setSemester(val)}
            options={[
              { label: 'first semester', value: 'first' },
              { label: 'second semester', value: 'second' },
              { label: 'annual course', value: 'year' },
            ]}
          />

          <TextField
            label="Department"
            value={department}
            setValue={setDepartment}
          />
          <TextField
            label="Disciplinary Sector"
            value={disciplinarySector}
            setValue={setDisciplinarySector}
          />

          <TextField
            label="Course Type"
            value={courseType}
            setValue={setCourseType}
          />

          <TextField
            label="Teaching Hours"
            value={teachingHours.toString()}
            setValue={(v: any) => setTeachingHours(parseInt(v) || 0)}
          />
          <EnumFieldWithCustom
            label="Credits (CFU)"
            value={credits.toString()}
            setValue={(v: any) => setCredits(parseInt(v) || 0)}
            options={[
              { label: '4 credits', value: '4' },
              { label: '6 credits', value: '6' },
              { label: '12 credits', value: '12' },
              { label: '18 credits', value: '18' },
            ]}
            allowCustom={true}
          />
          <EnumFieldWithCustom
            label="Course Year"
            value={courseYear}
            setValue={(v: any) => setCourseYear(v || 0)}
            options={[
              { label: '1st year', value: '1st' },
              { label: '2nd year', value: '2nd' },
              { label: '3rd year', value: '3rd' },
              { label: '4th year', value: '4th' },
              { label: '5th year', value: '5th' },
            ]}
            allowCustom={true}
          />
        </SimpleGrid>

        <ArrayField
          label="Teaching Methods"
          value={teachingMethods}
          setValue={setTeachingMethods}
        />
        <ArrayField
          label="Assessment Methods"
          value={assessmentMethods}
          setValue={setAssessmentMethods}
        />
        <ArrayField
          label="Reference Materials"
          value={referenceMaterials}
          setValue={setReferenceMaterials}
        />
      </Box>
    </Box>
  );
}
