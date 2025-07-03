import { useUser } from '@auth0/nextjs-auth0/client';
import { Box, Flex, useDisclosure } from '@chakra-ui/react';
import { useEffect } from 'react';
import CourseCreationStepper from '../../../components/CourseCreation/CourseCreationStepper';
import NavBar from '../../../components/NavBars/NavBar';
import MainSideBar from '../../../components/Sidebar/MainSidebar';

export default function CourseCreatePage() {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
  const handleNavigate = (route: string) => {
    console.log('Navigate to:', route);
  };
  const { user } = useUser();

  useEffect(() => {
    if (user || process.env.TEST_MODE === 'true') {
      console.log('User is available:', user);
    }
  }, [user]);

  return (
    <Box h="100vh" overflow="hidden" bg="gray.50">
      <Box h="64px">
        <NavBar
          user={user}
          onAccessibilityClick={() => console.log('Access clicked')}
        />
      </Box>

      <Flex h="calc(100vh - 64px)">
        <MainSideBar
          onNavigate={handleNavigate}
          isOpen={isOpen}
          onToggle={onToggle}
        />
        <Box ml={isOpen ? '250px' : '60px'} flex="1" overflow="auto">
          <CourseCreationStepper />
        </Box>
      </Flex>
    </Box>
  );
}
