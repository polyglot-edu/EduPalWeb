import { useUser } from '@auth0/nextjs-auth0/client';
import { AddIcon, CheckIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormLabel,
  IconButton,
  SimpleGrid,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { v4 as UUIDv4 } from 'uuid';
import ArrayField from '../../../components/Forms/Fields/ArrayField';
import EnumField from '../../../components/Forms/Fields/EnumField';
import InputTextField from '../../../components/Forms/Fields/InputTextField';
import MarkDownField from '../../../components/Forms/Fields/MarkDownField';
import SyllabusTopicsField from '../../../components/Forms/Fields/SyllabusTopicsField';
import NavBar from '../../../components/NavBars/NavBar';
import MainSideBar from '../../../components/Sidebar/MainSidebar';
import EditSyllabus from '../../../components/SyllabusComponents/EditSyllabus';
import StepHeading from '../../../components/UtilityComponents/StepHeading';
import { API } from '../../../data/api';
import {
  AIDefineSyllabusResponse,
  EducationLevel,
  SyllabusTopic,
} from '../../../types/polyglotElements';

export default function SyllabusCreatePage() {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
  const handleNavigate = (route: string) => console.log('Navigate to:', route);
  const { user } = useUser();

  const [selectedTopic, setSelectedTopic] = useState<
    | {
        topic: SyllabusTopic;
        index: number;
      }
    | undefined
  >({
    topic: {
      macro_topic: '',
      details: '',
      learning_objectives: {
        knowledge: '',
        skills: '',
        attitude: '',
      },
    },
    index: -1,
  });

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

  const toast = useToast();

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

  const [aiHelp, setAiHelp] = useState(true);
  const [isLoadingSyllabus, setIsLoadingSyllabus] = useState(false);

  const router = useRouter();

  const [hasMounted, setHasMounted] = useState(false);

  const educationOptions = Object.entries(EducationLevel).map(
    ([key, value]) => ({
      label: key.replace(/([A-Z])/g, ' $1').trim(),
      value,
    })
  );

  const handleDefineSyllabus = () => {
    if (!subjectArea || subjectArea == '') {
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
        definedSyllabus?.educational_level || ('high school' as EducationLevel),
      language: definedSyllabus?.language || 'english',
    })
      .then((res) => {
        toast({
          title:
            'Syllabus generated successfully! Feel free to customize it as needed.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'bottom-left',
        });
        setDefinedSyllabus(res.data as AIDefineSyllabusResponse);
        console.log(res.data);
      })
      .catch((err) => {
        toast({
          title: 'Something went wrong try against later!',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'bottom-left',
        });
        console.log(err);
      })
      .finally(() => setIsLoadingSyllabus(false));
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

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

    if (!selectedTopic) return;

    API.createNewPolyglotSyllabus({
      _id: UUIDv4(),
      subjectArea: definedSyllabus.general_subject,
      educational_level: definedSyllabus.educational_level,
      additional_information: definedSyllabus.additional_information,
      title: definedSyllabus.title,
      description: definedSyllabus.description,
      goals: definedSyllabus.goals,
      topics: [selectedTopic.topic],
      prerequisites: definedSyllabus.prerequisites,
      language: definedSyllabus.language,
      author: {
        _id: 'guest',
        username: 'guest',
      },
      lastUpdate: new Date(),
      academicYear: academicYear,
      courseCode: courseCode,
      courseOfStudy: courseOfStudy,
      semester: semester,
      credits: credits,
      teachingHours: teachingHours,
      disciplinarySector: disciplinarySector,
      teachingMethods: teachingMethods,
      assessmentMethods: assessmentMethods,
      referenceMaterials: referenceMaterials,
      studyRegulation: studyRegulation,
      curriculumPath: curriculumPath,
      studentPartition: studentPartition,
      integratedCourseUnit: integratedCourseUnit,
      courseType: courseType,
      department: department,
      courseYear: courseYear,
    })
      .then((res) => {
        console.log('Syllabus created:', res.data);
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
          description:
            'Error creating syllabus, try again changing:' + err.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'bottom-left',
        });
        console.error('Error creating syllabus:', err);
      });
  };

  if (!hasMounted) return null;

  if (definedSyllabus === undefined) return <></>;
  console.log('general_subject:', definedSyllabus?.general_subject === '');
  return (
    <Box h="100vh" overflow="hidden" bg="gray.50">
      <Box h="64px">
        <NavBar
          user={user}
          onAccessibilityClick={() => {
            console.log('access');
          }}
        />
      </Box>

      <Flex h="calc(100vh - 64px)">
        <MainSideBar
          onNavigate={handleNavigate}
          isOpen={isOpen}
          onToggle={onToggle}
        />

        <Box
          ml={isOpen ? '250px' : '60px'}
          flex="1"
          overflow="auto"
          p={6}
          title={!aiHelp ? 'AI Help' : 'Custom'}
          hidden={!aiHelp}
        >
          <IconButton
            aria-label={'ai-custom'}
            float="right"
            onClick={() => setAiHelp(!aiHelp)}
          >
            {!aiHelp ? <AddIcon /> : <HamburgerIcon />}
          </IconButton>
          {definedSyllabus?.title === '' ? (
            <>
              <Box>
                <StepHeading
                  title="Define Syllabus"
                  subtitle="Provide basic information about your course."
                />
                <InputTextField
                  label="General Subject"
                  placeholder="Enter syllabus subject."
                  value={subjectArea}
                  setValue={setSubjectArea}
                  infoTitle="Title"
                  infoDescription="Enter the general subject of your syllabus."
                  infoPlacement="right"
                />
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <EnumField
                    label="Educational Level"
                    value={definedSyllabus.educational_level}
                    setValue={(value: string) =>
                      setDefinedSyllabus({
                        ...definedSyllabus,
                        educational_level: value as EducationLevel,
                      })
                    }
                    options={educationOptions}
                    infoTitle="Educational Level"
                    infoDescription="Specify the academic level of the target audience."
                    infoPlacement="right"
                  />

                  <EnumField
                    label="Language"
                    value={definedSyllabus.language}
                    setValue={(value: string) =>
                      setDefinedSyllabus({
                        ...definedSyllabus,
                        language: value,
                      })
                    }
                    options={[
                      { label: 'English', value: 'english' },
                      { label: 'Italiano', value: 'italian' },
                      { label: 'Français', value: 'french' },
                      { label: 'Español', value: 'spanish' },
                      { label: 'Deutsch', value: 'german' },
                    ]}
                    infoTitle="Language"
                    infoDescription="Choose the language of the syllabus."
                    infoPlacement="right"
                  />
                </SimpleGrid>

                <Box width="100%" mt={6}>
                  <MarkDownField
                    label="Additional Information"
                    value={additionalInformation}
                    setValue={setAdditionalInformation}
                    infoTitle="Additional Info"
                    infoDescription="Provide more details about the course you want to create to help centralize and define its syllabus."
                    infoPlacement="right"
                  />
                </Box>
                <Box mt={6}>
                  <Button
                    colorScheme="teal"
                    onClick={handleDefineSyllabus}
                    isLoading={isLoadingSyllabus}
                  >
                    Define Syllabus
                  </Button>
                </Box>
              </Box>
            </>
          ) : (
            <>
              <StepHeading
                title="Edit Complete Syllabus Topic"
                subtitle="You can now complete or adjust the topic of your syllabus."
              />
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <InputTextField
                  label="Title"
                  value={definedSyllabus.title}
                  setValue={(val: any) =>
                    setDefinedSyllabus({ ...definedSyllabus, title: val })
                  }
                />
                <InputTextField
                  label="General Subject"
                  value={definedSyllabus.general_subject}
                  setValue={(val: any) =>
                    setDefinedSyllabus({
                      ...definedSyllabus,
                      general_subject: val,
                    })
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
                  options={[
                    { label: 'University', value: 'UNIVERSITY' },
                    { label: 'High School', value: 'HIGH_SCHOOL' },
                  ]}
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
                  setDefinedSyllabus({
                    ...definedSyllabus,
                    description: val,
                  })
                }
              />
              <FormLabel mt={4}>
                Define the structure of your course by selecting or editing
                topics.
              </FormLabel>
              <SyllabusTopicsField
                topics={definedSyllabus.topics}
                updateTopics={(val: any) =>
                  setDefinedSyllabus({
                    ...definedSyllabus,
                    topics: val,
                  })
                }
                selectedTopicState={[selectedTopic, setSelectedTopic]}
              />
              <Flex
                gap={6}
                direction="row"
                wrap={{ base: 'wrap', md: 'nowrap' }}
                justify="space-between"
              >
                <Box w={{ base: '100%', md: '48%' }}>
                  <ArrayField
                    label="Goals"
                    value={definedSyllabus.goals}
                    setValue={(val: any) =>
                      setDefinedSyllabus({
                        ...definedSyllabus,
                        goals: val,
                      })
                    }
                  />
                </Box>
                <Box w={{ base: '100%', md: '48%' }}>
                  <ArrayField
                    label="Prerequisites"
                    value={definedSyllabus.prerequisites}
                    setValue={(val: any) =>
                      setDefinedSyllabus({
                        ...definedSyllabus,
                        prerequisites: val,
                      })
                    }
                  />
                </Box>
              </Flex>
              <Box mt={6}>
                <Button colorScheme="teal" onClick={() => setAiHelp(false)}>
                  Confirm <CheckIcon />
                </Button>
              </Box>
            </>
          )}
        </Box>
        <Box
          ml={isOpen ? '250px' : '60px'}
          flex="1"
          overflow="auto"
          p={6}
          hidden={aiHelp}
        >
          {definedSyllabus && (
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
              assessmentMethodsState={[assessmentMethods, setAssessmentMethods]}
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
          )}

          <Box mt={6} display="flex" justifyContent="space-between">
            <Button variant="outline" onClick={() => setAiHelp(true)}>
              Undo
            </Button>
            <Button colorScheme="teal" onClick={handleCreateSyllabus}>
              Create Syllabus
            </Button>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
