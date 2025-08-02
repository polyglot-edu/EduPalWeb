import { useUser } from '@auth0/nextjs-auth0/client';
import { Box, Flex, Heading, useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import NavBar from '../../../components/NavBars/NavBar';
import MainSideBar from '../../../components/Sidebar/MainSidebar';
import SyllabusDetailView from '../../../components/SyllabusComponents/SyllabusDetailView';
import SyllabusDocxButton from '../../../components/SyllabusComponents/SyllabusDocxButtonGen';
import { APIV2 } from '../../../data/api';
import { PolyglotSyllabus } from '../../../types/polyglotElements';

type DashboardIndexPageProps = {
  accessToken: string | undefined;
};

const SyllabusDashboard = ({ accessToken }: DashboardIndexPageProps) => {
  const router = useRouter();
  const syllabusId = router.query?.id?.toString();
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
  const [currentTab, setCurrentTab] = useState(0);
  const [syllabus, setSyllabus] = useState<PolyglotSyllabus>();
  const { user } = useUser();

  const API = useMemo(() => new APIV2(accessToken), [accessToken]);

  const handleNavigate = (route: string) => {
    console.log('Navigate to:', route);
  };

  useEffect(() => {
    if (!syllabusId) return;
    if (user || process.env.TEST_MODE === 'true') {
      API.getSyllabus(syllabusId)
        .then((resp) => {
          console.log(resp.data);
          setSyllabus(resp.data as PolyglotSyllabus);
        })
        .catch((err) => {
          console.error('Backend fetch failed, using mock data:', err.message);
        });
    }
  }, [user, API, currentTab, syllabusId]);

  if (!syllabus)
    return (
      <>
        <Box></Box>
      </>
    );

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
          <SyllabusDetailView syllabus={syllabus} />
        </Flex>
      </Box>
    </>
  );
};

export default SyllabusDashboard;
