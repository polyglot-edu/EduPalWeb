import { useUser } from '@auth0/nextjs-auth0/client';
import { Box, Button, Flex, Heading, useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import CourseEditor from '../../../../components/CourseComponents/CourseEditor';
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
  const router = useRouter();
  const courseId = router.query?.id?.toString();
  const API = useMemo(() => new APIV2(accessToken), [accessToken]);
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });

  const [course, setCourse] = useState<PolyglotCourseWithFlows>();

  const handleNavigate = (route: string) => {
    console.log('Navigate to:', route);
  };
  const { user } = useUser();

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!courseId) return;
    if (user || process.env.TEST_MODE === 'true') {
      API.loadCourseElement(courseId)
        .then((resp) => {
          console.log(resp.data);
          setCourse({ ...resp.data, _id: courseId });
        })
        .catch((err) => {
          console.error('Backend fetch failed, using mock data:', err.message);
        });
      console.log('User is available:', user);
    }
    console.log('test');
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
          <CourseEditor courseState={[course, setCourse]} />
          <Flex mt={8} justify="space-between" py={2}>
            <Box flex="2" display="flex" justifyContent="center">
              <Button onClick={() => router.back()}>{'Cancel'}</Button>
            </Box>
            <Box flex="2" display="flex" justifyContent="center"></Box>
            <Box flex="2" display="flex" justifyContent="center">
              <Button
                colorScheme="purple"
                onClick={() => {
                  if (course) API.saveCourse(course as PolyglotCourse);
                  else console.log('course undefined');
                }}
              >
                Next
              </Button>
            </Box>
          </Flex>
        </Box>
      </Box>
    </>
  );
}
