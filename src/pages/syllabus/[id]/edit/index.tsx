import { useUser } from '@auth0/nextjs-auth0/client';
import { DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import DeleteSyllabusModal from '../../../../components/Modals/DeleteSyllabusModal';
import SaveSyllabusModal from '../../../../components/Modals/SaveSyllabusModal';
import NavBar from '../../../../components/NavBars/NavBar';
import MainSideBar from '../../../../components/Sidebar/MainSidebar';
import EditSyllabus from '../../../../components/SyllabusComponents/EditSyllabus';
import { APIV2 } from '../../../../data/api';
import { PolyglotSyllabus } from '../../../../types/polyglotElements';

export default function EditSyllabusPage({
  accessToken,
}: {
  accessToken?: string;
}) {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
  const handleNavigate = (route: string) => console.log('Navigate to:', route);
  const { user } = useUser();
  const { isOpen: dOpen, onClose: dOnClose, onOpen: dOnOpen } = useDisclosure();
  const { isOpen: sOpen, onClose: sOnClose, onOpen: sOnOpen } = useDisclosure();
  const [syllabus, setSyllabus] = useState<PolyglotSyllabus | undefined>();
  const [selectedTopic, setSelectedTopic] = useState<number[]>();
  const [originalSyllabus, setOriginalSyllabus] = useState<PolyglotSyllabus>();

  const toast = useToast();
  const router = useRouter();
  const syllabusId = router.query.id as string;

  const API = useMemo(() => new APIV2(accessToken), [accessToken]);
  const deleteSyllabus = useCallback(
    async (syllabusId: string) => {
      API.deleteSyllabus(syllabusId).then((res) => {
        if (res.status == 204) {
          toast({
            title: 'Syllabus deleted successfully.',
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'bottom-left',
          });
          router.push('/syllabus');
        } else {
          toast({
            title: 'Error deleting Syllabus.',
            description: 'Please try again.',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'bottom-left',
          });
        }
      });
    },
    [API]
  );
  useEffect(() => {
    if (!syllabusId) return;

    API.getSyllabus(syllabusId)
      .then((res: any) => {
        setSyllabus(res.data);
        setOriginalSyllabus(res.data);
      })
      .catch((err: any) => {
        toast({
          title: 'Error loading syllabus',
          description: err.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        console.error(err);
      });
  }, [syllabusId, API]);

  useEffect(() => {
    if (syllabus)
      if (syllabus?.topics?.length)
        setSelectedTopic(syllabus.topics.map((_, index) => index));
  }, [syllabus]);

  const handleSaveSyllabus = () => {
    if (!syllabus) return;

    API.updateSyllabus(syllabus)
      .then((res: any) => {
        toast({
          title: 'Syllabus updated successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'bottom-left',
        });
        router.push(`/syllabus/${syllabusId}`);
      })
      .catch((err: any) => {
        toast({
          title: 'Error saving syllabus',
          description: err.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'bottom-left',
        });
        console.error(err);
      });
  };

  if (!syllabus) return null;

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
          p={6}
          bg="gray.50"
          borderRadius="lg"
          ml={isOpen ? '250px' : '60px'}
          flex="1"
          overflow="auto"
        >
          <Flex float={'right'}>
            <Button zIndex={11} float={'right'} variant="unstyled">
              <Tooltip label="Delete" placement="right">
                <DeleteIcon onClick={dOnOpen} w={5} h={5} color="red" />
              </Tooltip>
            </Button>
          </Flex>
          <EditSyllabus
            definedSyllabus={syllabus}
            setDefinedSyllabus={setSyllabus}
            academicYearState={[
              syllabus.academicYear,
              (v: any) => setSyllabus({ ...syllabus, academicYear: v }),
            ]}
            courseCodeState={[
              syllabus.courseCode,
              (v: any) => setSyllabus({ ...syllabus, courseCode: v }),
            ]}
            courseOfStudyState={[
              syllabus.courseOfStudy,
              (v: any) => setSyllabus({ ...syllabus, courseOfStudy: v }),
            ]}
            semesterState={[
              syllabus.semester,
              (v: any) => setSyllabus({ ...syllabus, semester: v }),
            ]}
            creditsState={[
              syllabus.credits,
              (v: any) => setSyllabus({ ...syllabus, credits: v }),
            ]}
            teachingHoursState={[
              syllabus.teachingHours,
              (v: any) => setSyllabus({ ...syllabus, teachingHours: v }),
            ]}
            disciplinarySectorState={[
              syllabus.disciplinarySector,
              (v: any) => setSyllabus({ ...syllabus, disciplinarySector: v }),
            ]}
            teachingMethodsState={[
              syllabus.teachingMethods,
              (v: any) => setSyllabus({ ...syllabus, teachingMethods: v }),
            ]}
            assessmentMethodsState={[
              syllabus.assessmentMethods,
              (v: any) => setSyllabus({ ...syllabus, assessmentMethods: v }),
            ]}
            referenceMaterialsState={[
              syllabus.referenceMaterials,
              (v: any) => setSyllabus({ ...syllabus, referenceMaterials: v }),
            ]}
            selectedTopicState={[selectedTopic || [], setSelectedTopic]}
            studyregulationState={[
              syllabus.studyRegulation,
              (v: any) => setSyllabus({ ...syllabus, studyRegulation: v }),
            ]}
            curriculumPathState={[
              syllabus.curriculumPath,
              (v: any) => setSyllabus({ ...syllabus, curriculumPath: v }),
            ]}
            studentPartitionState={[
              syllabus.studentPartition,
              (v: any) => setSyllabus({ ...syllabus, studentPartition: v }),
            ]}
            integratedCourseUnitState={[
              syllabus.integratedCourseUnit,
              (v: any) => setSyllabus({ ...syllabus, integratedCourseUnit: v }),
            ]}
            courseTypeState={[
              syllabus.courseType,
              (v: any) => setSyllabus({ ...syllabus, courseType: v }),
            ]}
            departmentState={[
              syllabus.department,
              (v: any) => setSyllabus({ ...syllabus, department: v }),
            ]}
            courseYearState={[
              syllabus.courseYear,
              (v: any) => setSyllabus({ ...syllabus, courseYear: v }),
            ]}
          />
          <Flex mt={8} justify="space-between" py={2}>
            <Box flex="2" display="flex" justifyContent="center">
              <Button onClick={() => router.back()}>Cancel</Button>
            </Box>
            <Box flex="2" display="flex" justifyContent="center">
              <Button
                colorScheme="teal"
                onClick={() => setSyllabus(originalSyllabus)}
              >
                Undo
              </Button>
            </Box>
            <Box flex="2" display="flex" justifyContent="center">
              <Button colorScheme="purple" onClick={sOnOpen}>
                Save
              </Button>
            </Box>
          </Flex>
        </Box>
      </Flex>
      <DeleteSyllabusModal
        isOpen={dOpen}
        onClose={dOnClose}
        deleteFunc={deleteSyllabus}
        syllabusId={syllabusId ?? ''}
      />
      <SaveSyllabusModal
        isOpen={sOpen}
        onClose={sOnClose}
        saveFunc={handleSaveSyllabus}
        syllabusId={syllabusId ?? ''}
      />
    </Box>
  );
}
