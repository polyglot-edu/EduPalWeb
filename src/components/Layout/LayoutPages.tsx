import { UserProfile } from '@auth0/nextjs-auth0/client';
import { Box, Flex } from '@chakra-ui/react';
import { ReactNode } from 'react';
import Navbar from '../NavBars/NavBar';
import MainSideBar from '../Sidebar/MainSidebar';

interface LayoutProps {
  children: ReactNode;
  user?: UserProfile;
  handleNavigate: (path: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Layout({
  children,
  user,
  handleNavigate,
  isOpen,
  onToggle,
}: LayoutProps) {
  return (
    <Flex direction="column" minH="100vh">
      <Box position="fixed" top="0" left="0" right="0" zIndex="120">
        <Navbar
          user={user}
          onAccessibilityClick={() => console.log('Access clicked')}
        />
      </Box>

      <Flex flex="1">
        <Box mt="64px">
          <MainSideBar
            onNavigate={handleNavigate}
            isOpen={isOpen}
            onToggle={onToggle}
          />
        </Box>

        <Box flex="1" p={4} mt="64px">
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}
