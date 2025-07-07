import { useUser } from '@auth0/nextjs-auth0/client';
import { Box, Flex, Heading, useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { CourseCardView } from '../../../components/CourseComponents/CourseListView';
import NavBar from '../../../components/NavBars/NavBar';
import MainSideBar from '../../../components/Sidebar/MainSidebar';
import { APIV2 } from '../../../data/api';
import { PolyglotCourseWithFlows } from '../../../types/polyglotElements';

type DashboardIndexPageProps = {
  accessToken: string | undefined;
};

const CourseDashboard = ({ accessToken }: DashboardIndexPageProps) => {
  const router = useRouter();
  const courseId = router.query?.id?.toString();
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
  const [currentTab, setCurrentTab] = useState(0);
  const [course, setCourse] = useState<PolyglotCourseWithFlows>();
  const { user } = useUser();

  const API = useMemo(() => new APIV2(accessToken), [accessToken]);

  const analytics = {
    totalStudents: { nTotal: 180, monthDifference: 12 },
    activeCourses: { nTotal: 2, monthDifference: 2 },
    completionRate: { nTotal: 23, monthDifference: 5 },
    badgesEarned: { nTotal: 24, monthDifference: 28 },
  };

  const handleNavigate = (route: string) => {
    console.log('Navigate to:', route);
  };

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
    }
  }, [user, API, currentTab]);

  if (!course)
    return (
      <>
        <Box></Box>
      </>
    );

  function onEditCourse(id: string): void {
    throw new Error('Function not implemented.');
  }

  function onViewCourse(id: string): void {
    throw new Error('Function not implemented.');
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
        ml={isOpen ? '250px' : '60px'}
        transition="margin-left 0.2s"
      >
        <Heading size="lg" mb={4}>
          👋 Welcome, {user?.name || 'Guest'}!
        </Heading>

        <Flex justify="space-between" mb={4}>
          <CourseCardView
            key={course._id}
            course={course}
            onEdit={onEditCourse}
            onView={onViewCourse}
          />
        </Flex>
      </Box>
    </>
  );
};

export default CourseDashboard;
