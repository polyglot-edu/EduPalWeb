import { useUser } from '@auth0/nextjs-auth0/client';
import { Box, Button, Flex, useDisclosure, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import NavBar from '../../../../components/NavBars/NavBar';
import MainSideBar from '../../../../components/Sidebar/MainSidebar';
import EditSyllabus from '../../../../components/SyllabusComponents/EditSyllabus';
import { APIV2 } from '../../../../data/api';
import {
  PolyglotSyllabus,
  SyllabusTopic,
} from '../../../../types/polyglotElements';

export default function EditSyllabusPage({
  accessToken,
}: {
  accessToken?: string;
}) {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
  const handleNavigate = (route: string) => console.log('Navigate to:', route);
  const { user } = useUser();
  const [syllabus, setSyllabus] = useState<PolyglotSyllabus | undefined>();
  const [originalSyllabus, setOriginalSyllabus] = useState<PolyglotSyllabus>();
  const [selectedTopic, setSelectedTopic] = useState<{
    topic: SyllabusTopic;
    index: number;
  }>();

  const toast = useToast();
  const router = useRouter();
  const syllabusId = router.query.id as string;

  const API = useMemo(() => new APIV2(accessToken), [accessToken]);

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

  const handleSaveSyllabus = () => {
    if (!syllabus) return;

    API.updateSyllabus({
      _id: syllabus._id,
      general_subject: syllabus.general_subject,
      educational_level: syllabus.educational_level,
      additional_information: syllabus.additional_information,
      title: syllabus.title,
      description: syllabus.description,
      goals: syllabus.goals,
      topics: syllabus.topics,
      prerequisites: syllabus.prerequisites,
      language: syllabus.language,
      author: syllabus.author,
      lastUpdate: new Date(),
      academicYear: syllabus.academicYear,
      courseCode: syllabus.courseCode,
      courseOfStudy: syllabus.courseOfStudy,
      semester: syllabus.semester,
      credits: syllabus.credits,
      teachingHours: syllabus.teachingHours,
      disciplinarySector: syllabus.disciplinarySector,
      teachingMethods: syllabus.teachingMethods,
      assessmentMethods: syllabus.assessmentMethods,
      referenceMaterials: syllabus.referenceMaterials,
    })
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
        <NavBar user={user} onAccessibilityClick={() => {}} />
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
            selectedTopicState={[selectedTopic, setSelectedTopic]}
          />

          <Box mt={6} display="flex" justifyContent="space-between">
            <Button
              variant="outline"
              onClick={() => setSyllabus(originalSyllabus)}
            >
              Undo
            </Button>
            <Button colorScheme="teal" onClick={handleSaveSyllabus}>
              Save Changes
            </Button>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
