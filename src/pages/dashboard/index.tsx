import { useUser } from '@auth0/nextjs-auth0/client';
import {
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { MdCheckCircle, MdGroup, MdSchool, MdStar } from 'react-icons/md';
import AnalyticsCard from '../../components/Card/AnalyticsCard';
import CourseCard from '../../components/Card/CourseCard';
import NavBar from '../../components/NavBars/NavBar';
import SearchBar from '../../components/SearchBar/SearchBar';
import MainSideBar from '../../components/Sidebar/MainSidebar';
import { APIV2 } from '../../data/api';
import {
  EducationLevel,
  PolyglotCourseWithFlows,
} from '../../types/polyglotElements';

const fakeCourses: PolyglotCourseWithFlows[] = [
  {
    _id: '1',
    title: 'The Roman Empire in Europe',
    description:
      'A comprehensive study of the Roman Empire’s influence across Europe, covering political structures, cultural impacts, and historical legacy.',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/800px-Colosseo_2020.jpg',
    tags: [
      { name: 'History', color: 'yellow' },
      { name: 'University', color: 'blue' },
    ],
    author: { username: 'admin' },
    published: true,
    lastUpdate: new Date('2025-06-03'),
    nSubscribed: 28,
    nCompleted: 13,
    flows: [],
    subjectArea: 'History',
    macro_subject: 'Humanities',
    education_level: EducationLevel.College,
    language: 'English',
    duration: '10',
    topics: [],
    topicsAI: [],
    classContext: '',
    flowsId: [],
    learningObjectives: {
      knowledge: '',
      skills: '',
      attitude: '',
    },
    goals: [
      'Gain historical perspective',
      'Develop critical thinking about ancient civilizations',
    ],
    prerequisites: ['Basic knowledge of European history'],
    targetAudience: 'College students',
  },
  {
    _id: '2',
    title: 'Renaissance Art Interactive Tour',
    description: 'Museum exhibition guide for Renaissance masterpieces.',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/800px-Colosseo_2020.jpg',
    tags: [
      { name: 'Art History', color: 'orange' },
      { name: 'General', color: 'blue' },
    ],
    author: { username: 'anna.smith' },
    published: false,
    lastUpdate: new Date('2025-06-19'),
    nSubscribed: 10,
    nCompleted: 2,
    flows: [],
    subjectArea: 'Art History',
    macro_subject: 'Arts',
    education_level: EducationLevel.HighSchool,
    language: 'English',
    duration: '5',
    topics: [],
    topicsAI: [],
    classContext: '',
    flowsId: [],
    learningObjectives: {
      knowledge: '',
      skills: '',
      attitude: '',
    },
    goals: [
      'Appreciate Renaissance art',
      'Understand historical context of masterpieces',
    ],
    prerequisites: ['Interest in art history'],
    targetAudience: 'High school students',
  },
];

type DashboardIndexPageProps = {
  accessToken: string | undefined;
};

const CourseDashboard = ({ accessToken }: DashboardIndexPageProps) => {
  const router = useRouter();
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
  const [currentTab, setCurrentTab] = useState(0);
  const [courses, setCourses] = useState<PolyglotCourseWithFlows[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
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
    if (user || process.env.TEST_MODE === 'true') {
      let queryparams = '';
      if (currentTab === 0) queryparams = '?me=true&';
      if (searchValue) queryparams += 'q=' + searchValue;
      setCourses(fakeCourses);
      setSuggestions(fakeCourses.map((c) => c.title));
      API.loadCourses(queryparams)
        .then((resp) => {
          setCourses(resp.data);
          setSuggestions([
            ...new Set(resp.data.map((c: PolyglotCourseWithFlows) => c.title)),
          ]);
        })
        .catch((err) => {
          console.error('Backend fetch failed, using mock data:', err.message);
          setCourses(fakeCourses);
          setSuggestions(fakeCourses.map((c) => c.title));
        });
    }
  }, [user, searchValue, API, currentTab]);

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
        <SearchBar
          inputValue={searchValue}
          setInputValue={setSearchValue}
          items={suggestions}
          placeholder="Search courses by title or description..."
        />
        <SimpleGrid columns={[1, 2, 2, 4]} spacing={4} my={6}>
          <AnalyticsCard
            title="Total Students"
            value={analytics.totalStudents.nTotal}
            difference={analytics.totalStudents.monthDifference}
            icon={MdGroup}
            colorScheme="blue"
          />
          <AnalyticsCard
            title="Active Courses"
            value={analytics.activeCourses.nTotal}
            difference={analytics.activeCourses.monthDifference}
            icon={MdSchool}
            colorScheme="green"
          />
          <AnalyticsCard
            title="Completion Rate"
            value={analytics.completionRate.nTotal}
            difference={analytics.completionRate.monthDifference}
            icon={MdCheckCircle}
            colorScheme="purple"
          />
          <AnalyticsCard
            title="Badges Earned"
            value={analytics.badgesEarned.nTotal}
            difference={analytics.badgesEarned.monthDifference}
            icon={MdStar}
            colorScheme="orange"
          />
        </SimpleGrid>

        <Flex justify="space-between" mb={4}>
          <Heading size="md">My Courses</Heading>
          <Flex gap={2}>
            <Button variant="outline">Course Templates</Button>
            <Button
              colorScheme="purple"
              onClick={() => router.push('/courses/create')}
            >
              Create New Course
            </Button>
          </Flex>
        </Flex>

        <SimpleGrid columns={[1, 2]} spacing={6}>
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </SimpleGrid>
      </Box>
    </>
  );
};

export default CourseDashboard;
