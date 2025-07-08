import { useUser } from '@auth0/nextjs-auth0/client';
import {
  Button,
  Center,
  Heading,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import Link from 'next/link';
import Navbar from '../components/NavBars/NavBar';
import MainSideBar from '../components/Sidebar/MainSidebar';

const Home = () => {
  const { user } = useUser();
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });

  const handleNavigate = (route: string) => {
    // Esegui il routing con next/router o altro
    console.log('Navigate to:', route);
  };
  return (
    <>
      <Navbar user={user} />
      <Center h="92vh">
        <Stack align="center">
          <MainSideBar
            onNavigate={handleNavigate}
            isOpen={isOpen}
            onToggle={onToggle}
          />
          <Heading as="b" fontSize="3xl">
            Go to Flow
          </Heading>
          <Link href={'/flows'} style={{ textDecoration: 'none' }}>
            <Button colorScheme={'blue'}>Enter</Button>
          </Link>
        </Stack>
      </Center>
    </>
  );
};

export default Home;
