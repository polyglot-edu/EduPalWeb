import { useUser } from '@auth0/nextjs-auth0/client';
import { DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Heading,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CourseEditor from '../../../../components/CourseComponents/CourseEditor';
import DeleteCourseModal from '../../../../components/Modals/DeleteCourseModal';
import SaveCourseModal from '../../../../components/Modals/SaveCourseModal';
import NavBar from '../../../../components/NavBars/NavBar';
import MainSideBar from '../../../../components/Sidebar/MainSidebar';
import { APIV2 } from '../../../../data/api';
import {
  PolyglotCourse,
  PolyglotCourseWithFlows,
} from '../../../../types/polyglotElements';

type CourseEditPageProps = {
  accessToken: string | undefined;
};

export default function CourseEditPage({ accessToken }: CourseEditPageProps) {
  const toast = useToast();
  const router = useRouter();
  const courseId = router.query?.id?.toString();
  const API = useMemo(() => new APIV2(accessToken), [accessToken]);
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
  const { isOpen: dOpen, onClose: dOnClose, onOpen: dOnOpen } = useDisclosure();
  const { isOpen: sOpen, onClose: sOnClose, onOpen: sOnOpen } = useDisclosure();

  const [course, setCourse] = useState<PolyglotCourseWithFlows>();

  const handleNavigate = (route: string) => {
    console.log('Navigate to:', route);
  };
  const { user } = useUser();

  const [hasMounted, setHasMounted] = useState(false);
  const deleteCourse = useCallback(
    async (courseId: string) => {
      API.deleteCourse(courseId).then((res) => {
        if (res.status == 204) {
          toast({
            title: 'Course deleted successfully.',
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'bottom-left',
          });
          router.push('/dashboard');
        } else {
          toast({
            title: 'Error deleting course.',
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

  const saveCourse = useCallback(async () => {
    console.log('Saving course:', course);
    if (!course) return;
    try {
      API.saveCourse(course as PolyglotCourse).then((res) => {
        if (res.status == 204||res.status == 200) {
          toast({
            title: 'Course saved successfully.',
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'bottom-left',
          });
          router.push('/courses/' + course._id );
        } else {
          toast({
            title: 'Error saving course.',
            description: 'Please try again.',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'bottom-left',
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  }, [API, course]);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!courseId) return;
    if (user || process.env.TEST_MODE === 'true') {
      API.loadCourseElement(courseId)
        .then((resp) => {
          setCourse({ ...resp.data, _id: courseId });
        })
        .catch((err) => {
          console.error('Backend fetch failed, using mock data:', err.message);
        });
      console.log('User is available:', user);
    }
  }, [user, courseId]);

  if (!hasMounted) {
    return null; // o un Skeleton
  }

  return (
    <>
      <NavBar
        user={user}
        onAccessibilityClick={() => console.log('Access clicked')}
      />
      <MainSideBar
        onNavigate={handleNavigate}
        isOpen={isOpen}
        onToggle={onToggle}
      />
      <Box
        flex="1"
        p={6}
        bg="gray.50"
        transition="margin-left 0.2s"
        ml={isOpen ? '250px' : '60px'}
      >
        <Heading as="h2" size="lg" mb={4} textAlign="left">
          Edit Course
        </Heading>
        <Heading as="h3" size="md" mb={4} textAlign="left">
          {' '}
          Modify course preview information and structure.{' '}
        </Heading>
        <Box
          bg="white"
          borderRadius="md"
          boxShadow="md"
          p={4}
          textAlign="center"
          py={2}
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
          <CourseEditor courseState={[course, setCourse]} />
          <Flex mt={8} justify="space-between" py={2}>
            <Box flex="2" display="flex" justifyContent="center">
              <Button onClick={() => router.back()}>{'Cancel'}</Button>
            </Box>
            <Box flex="2" display="flex" justifyContent="center"></Box>
            <Box flex="2" display="flex" justifyContent="center">
              <Button colorScheme="purple" onClick={sOnOpen}>
                Save
              </Button>
            </Box>
          </Flex>
        </Box>
        <DeleteCourseModal
          isOpen={dOpen}
          onClose={dOnClose}
          deleteFunc={deleteCourse}
          courseId={courseId ?? ''}
        />
        <SaveCourseModal
          isOpen={sOpen}
          onClose={sOnClose}
          saveFunc={saveCourse}
          courseId={courseId ?? ''}
        />
      </Box>
    </>
  );
}
