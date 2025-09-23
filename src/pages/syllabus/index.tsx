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
import { useEffect, useState } from 'react';
import SyllabusCard from '../../components/Card/SyllabusCard';
import EduChat from '../../components/Chat/EduChat';
import Layout from '../../components/Layout/LayoutPages';
import NavBar from '../../components/NavBars/NavBar';
import SearchBar from '../../components/SearchBar/SearchBar';
import MainSideBar from '../../components/Sidebar/MainSidebar';
import { API } from '../../data/api';
import { PolyglotSyllabus } from '../../types/polyglotElements';

const SyllabusDashboard = () => {
  const router = useRouter();
  const { user } = useUser();
  const [syllabuses, setSyllabuses] = useState<PolyglotSyllabus[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [chatDataResponse, setChatDataResponse] = useState<any>(null);

  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });

  const handleNavigate = (route: string) => {
    console.log('Navigate to:', route);
  };

  useEffect(() => {
    API.getAllSyllabuses()
      .then((res) => {
        const data = res.data;
        setSyllabuses(data);
        setSuggestions([
          ...new Set(data.map((s: PolyglotSyllabus) => s.title) as string),
        ]);
      })
      .catch((err) => {
        console.error('Failed to load syllabi:', err.message);
      });
  }, [API]);

  const filteredSyllabuses = syllabuses.filter((s) =>
    s.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Layout
      user={user}
      handleNavigate={handleNavigate}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <Box
        flex="1"
        p={6}
        bg="gray.50"
        ml={isOpen ? '250px' : '60px'}
        transition="margin-left 0.2s"
      >
        <EduChat
          usage="general"
          responseDataState={[chatDataResponse, setChatDataResponse]}
        />

        <Heading size="lg" mb={4}>
          📚 Syllabi
        </Heading>

        <SearchBar
          inputValue={searchValue}
          setInputValue={setSearchValue}
          items={suggestions}
          placeholder="Search syllabi by title or description..."
        />

        <Flex justify="flex-end" mt={4} mb={6}>
          <Button
            colorScheme="purple"
            onClick={() => router.push('/syllabus/create')}
          >
            Create New Syllabus
          </Button>
        </Flex>

        <SimpleGrid columns={[1, 2]} spacing={6}>
          {filteredSyllabuses.map((syllabus) => (
            <SyllabusCard key={syllabus._id} syllabus={syllabus} />
          ))}
        </SimpleGrid>
      </Box>
    </Layout>
  );
};

export default SyllabusDashboard;
