import { useUser } from '@auth0/nextjs-auth0/client';
import { AddIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  IconButton,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { v4 as UUIDv4 } from 'uuid';
import EduChat from '../../../components/Chat/EduChat';
import EnumField from '../../../components/Forms/Fields/EnumField';
import InputTextField from '../../../components/Forms/Fields/InputTextField';
import MarkDownField from '../../../components/Forms/Fields/MarkDownField';
import SyllabusTopicsFieldMultiple from '../../../components/Forms/Fields/SyllabusTopicsFieldMultiple';
import Layout from '../../../components/Layout/LayoutPages';
import EditSyllabus from '../../../components/SyllabusComponents/EditSyllabus';
import StepHeading from '../../../components/UtilityComponents/StepHeading';
import { API } from '../../../data/api';
import {
  AIDefineSyllabusResponse,
  EducationLevel,
} from '../../../types/polyglotElements';

export default function SyllabusCreatePage() {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
  const handleNavigate = (route: string) => console.log('Navigate to:', route);
  const { user } = useUser();
  const toast = useToast();
  const router = useRouter();

  const [hasMounted, setHasMounted] = useState(false);
  const [aiHelp, setAiHelp] = useState(true);
  const containerStartRef = useRef<HTMLDivElement>(null);

  const [selectedTopic, setSelectedTopic] = useState<number[]>([]);
  const [definedSyllabus, setDefinedSyllabus] = useState<
    AIDefineSyllabusResponse | undefined
  >({
    title: '',
    general_subject: '',
    educational_level: EducationLevel.HighSchool,
    language: 'english',
    additional_information: '',
    description: '',
    goals: [],
    topics: [],
    prerequisites: [],
  });

  const [subjectArea, setSubjectArea] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');

  const [academicYear, setAcademicYear] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseOfStudy, setCourseOfStudy] = useState('');
  const [semester, setSemester] = useState('first');
  const [credits, setCredits] = useState<number>(6);
  const [teachingHours, setTeachingHours] = useState<number>(30);
  const [disciplinarySector, setDisciplinarySector] = useState('');
  const [teachingMethods, setTeachingMethods] = useState<string[]>([]);
  const [assessmentMethods, setAssessmentMethods] = useState<string[]>([]);
  const [referenceMaterials, setReferenceMaterials] = useState<string[]>([]);
  const [courseYear, setCourseYear] = useState('1st');
  const [studyRegulation, setStudyregulation] = useState('');
  const [curriculumPath, setCurriculumPath] = useState('');
  const [studentPartition, setStudentPartition] = useState('');
  const [integratedCourseUnit, setIntegratedCourseUnit] = useState('');
  const [courseType, setCourseType] = useState('');
  const [department, setDepartment] = useState('');
  const [isLoadingSyllabus, setIsLoadingSyllabus] = useState(false);

  const educationOptions = Object.entries(EducationLevel).map(
    ([key, value]) => ({
      label: key.replace(/([A-Z])/g, ' $1').trim(),
      value,
    })
  );

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (containerStartRef.current) {
      containerStartRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiHelp]);

  const handleDefineSyllabus = () => {
    if (!subjectArea) {
      toast({
        title: 'General subject is mandatory!',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left',
      });
      return;
    }
    setIsLoadingSyllabus(true);
    API.defineSyllabus({
      general_subject: subjectArea,
      additional_information: additionalInformation,
      education_level:
        definedSyllabus?.educational_level || EducationLevel.HighSchool,
      language: definedSyllabus?.language || 'english',
    })
      .then((res) => {
        toast({
          title: 'Syllabus generated successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'bottom-left',
        });
        setDefinedSyllabus(res.data as AIDefineSyllabusResponse);
      })
      .catch(() => {
        toast({
          title: 'Something went wrong, try again later!',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'bottom-left',
        });
      })
      .finally(() => setIsLoadingSyllabus(false));
  };

  const handleCreateSyllabus = () => {
    if (!definedSyllabus) {
      toast({
        title: 'Please define the syllabus first!',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left',
      });
      return;
    }

    const topicsSelected = definedSyllabus.topics.filter((_, index) =>
      selectedTopic.includes(index)
    );

    API.createNewPolyglotSyllabus({
      _id: UUIDv4(),
      subjectArea: definedSyllabus.general_subject,
      educational_level: definedSyllabus.educational_level,
      additional_information: definedSyllabus.additional_information,
      title: definedSyllabus.title,
      description: definedSyllabus.description,
      goals: definedSyllabus.goals,
      topics: topicsSelected,
      prerequisites: definedSyllabus.prerequisites,
      language: definedSyllabus.language,
      author: { _id: 'guest', username: 'guest' },
      lastUpdate: new Date(),
      academicYear,
      courseCode,
      courseOfStudy,
      semester,
      credits,
      teachingHours,
      disciplinarySector,
      teachingMethods,
      assessmentMethods,
      referenceMaterials,
      studyRegulation,
      curriculumPath,
      studentPartition,
      integratedCourseUnit,
      courseType,
      department,
      courseYear,
    })
      .then((res) => {
        if (res.status === 201) {
          toast({
            title: 'Syllabus created successfully!',
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'bottom-left',
          });
          router.push('/syllabus/' + res.data._id);
        }
      })
      .catch((err) => {
        toast({
          title: 'Error creating syllabus',
          description: 'Error creating syllabus: ' + err.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'bottom-left',
        });
      });
  };

  if (!hasMounted || !definedSyllabus) return null;

  return (
    <Layout
      user={user}
      isOpen={isOpen}
      onToggle={onToggle}
      handleNavigate={handleNavigate}
    >
      <Box
        flex="1"
        p={6}
        bg="purple.50"
        transition="margin-left 0.2s"
        ml={isOpen ? '250px' : '60px'}
        ref={containerStartRef}
        overflow="auto"
        borderRadius="md"
        boxShadow="md"
      >
        {aiHelp && (
          <Box>
            <IconButton
              aria-label="Toggle AI Help"
              float="right"
              onClick={() => setAiHelp(!aiHelp)}
              icon={!aiHelp ? <AddIcon /> : <HamburgerIcon />}
            />
            {definedSyllabus.title === '' ? (
              <>
                <StepHeading
                  title="Define Syllabus"
                  subtitle="Provide basic information about your syllabus."
                />
                <Box
                  bg="white"
                  borderRadius="md"
                  boxShadow="md"
                  p={4}
                  mt={4}
                  mb={2}
                  textAlign="center"
                  py={2}
                >
                  <InputTextField
                    label="General Subject"
                    placeholder="Enter syllabus subject."
                    value={subjectArea}
                    setValue={setSubjectArea}
                  />
                  <EnumField
                    label="Educational Level"
                    value={definedSyllabus.educational_level}
                    setValue={(val: string) =>
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
                    setValue={(val: string) =>
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
                  <MarkDownField
                    label="Additional Information"
                    value={additionalInformation}
                    setValue={setAdditionalInformation}
                  />
                  <Button
                    mt={4}
                    colorScheme="teal"
                    onClick={handleDefineSyllabus}
                    isLoading={isLoadingSyllabus}
                  >
                    Define Syllabus
                  </Button>
                  <EduChat
                    usage="define_syllabus"
                    responseDataState={[definedSyllabus, setDefinedSyllabus]}
                  />
                </Box>
              </>
            ) : (
              <>
                <StepHeading
                  title="Select the Topics to include on your syllabus"
                  subtitle="You can choose which topics you want in your syllabus, you can adjust them or review later."
                />
                <Box
                  bg="white"
                  borderRadius="md"
                  boxShadow="md"
                  p={4}
                  mt={4}
                  mb={2}
                  textAlign="center"
                  py={2}
                >
                  <SyllabusTopicsFieldMultiple
                    topics={definedSyllabus.topics}
                    updateTopics={(val: any) =>
                      setDefinedSyllabus({ ...definedSyllabus, topics: val })
                    }
                    selectedTopicState={[selectedTopic, setSelectedTopic]}
                  />
                  <Flex gap={4} mt={4}>
                    <Button colorScheme="teal" onClick={() => setAiHelp(false)}>
                      Confirm
                    </Button>
                  </Flex>
                </Box>
              </>
            )}
          </Box>
        )}

        {!aiHelp && (
          <>
            <StepHeading
              title="Edit Full Syllabus"
              subtitle="Modify the entire syllabus and fill in institutional metadata."
            />
            <Box
              bg="white"
              borderRadius="md"
              boxShadow="md"
              p={4}
              mt={4}
              mb={2}
              textAlign="center"
              py={2}
            >
              <EditSyllabus
                definedSyllabus={definedSyllabus}
                selectedTopicState={[selectedTopic, setSelectedTopic]}
                setDefinedSyllabus={setDefinedSyllabus}
                academicYearState={[academicYear, setAcademicYear]}
                courseCodeState={[courseCode, setCourseCode]}
                courseOfStudyState={[courseOfStudy, setCourseOfStudy]}
                semesterState={[semester, setSemester]}
                creditsState={[credits, setCredits]}
                teachingHoursState={[teachingHours, setTeachingHours]}
                disciplinarySectorState={[
                  disciplinarySector,
                  setDisciplinarySector,
                ]}
                teachingMethodsState={[teachingMethods, setTeachingMethods]}
                assessmentMethodsState={[
                  assessmentMethods,
                  setAssessmentMethods,
                ]}
                referenceMaterialsState={[
                  referenceMaterials,
                  setReferenceMaterials,
                ]}
                studyregulationState={[studyRegulation, setStudyregulation]}
                courseYearState={[courseYear, setCourseYear]}
                curriculumPathState={[curriculumPath, setCurriculumPath]}
                studentPartitionState={[studentPartition, setStudentPartition]}
                integratedCourseUnitState={[
                  integratedCourseUnit,
                  setIntegratedCourseUnit,
                ]}
                courseTypeState={[courseType, setCourseType]}
                departmentState={[department, setDepartment]}
              />
            </Box>
          </>
        )}

        {!aiHelp && (
          <Flex gap={4} mt={6} justify="space-between">
            <Button variant="outline" onClick={() => setAiHelp(true)}>
              Undo
            </Button>
            <Button colorScheme="teal" onClick={handleCreateSyllabus}>
              Create Syllabus
            </Button>
          </Flex>
        )}
      </Box>
    </Layout>
  );
}
