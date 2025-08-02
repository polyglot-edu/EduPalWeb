import { Box, Center, Flex, FormLabel, SimpleGrid } from '@chakra-ui/react';
import {
  AIDefineSyllabusResponse,
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
  selectedTopicState: [
    { topic: SyllabusTopic; index: number } | undefined,
    React.Dispatch<
      React.SetStateAction<{ topic: SyllabusTopic; index: number } | undefined>
    >
  ];
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

  const educationOptions = Object.entries(EducationLevel).map(
    ([key, value]) => ({
      label: key.replace(/([A-Z])/g, ' $1').trim(),
      value,
    })
  );
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
          value={definedSyllabus.general_subject}
          setValue={(val: any) =>
            setDefinedSyllabus({ ...definedSyllabus, general_subject: val })
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
        <Center>
          <FormLabel>Learning Objective</FormLabel>
        </Center>
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
