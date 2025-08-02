import {
  AtSignIcon,
  CalendarIcon,
  CheckCircleIcon,
  CloseIcon,
  EditIcon,
  HamburgerIcon,
  InfoIcon,
  SettingsIcon,
  StarIcon,
  ViewIcon,
} from '@chakra-ui/icons';
import { Box, Button, Flex, IconButton, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { MdMenuBook } from 'react-icons/md';

type SidebarProps = {
  onNavigate?: (route: string) => void;
  isOpen: boolean;
  onToggle: () => void;
};

type NavItem = {
  label: string;
  icon: React.ReactElement;
  route: string;
  active: boolean;
};

type Section = {
  title: string;
  items: NavItem[];
};

const sections: Section[] = [
  {
    title: 'General',
    items: [
      {
        label: 'Dashboard',
        icon: <ViewIcon />,
        route: '/dashboard',
        active: true,
      },
      {
        label: 'Syllabuses',
        icon: <MdMenuBook />,
        route: '/syllabus',
        active: true,
      },
      {
        label: 'My Library',
        icon: <StarIcon />,
        route: '/library',
        active: false,
      },
      {
        label: 'Worksheet',
        icon: <EditIcon />,
        route: '/worksheet',
        active: false,
      },
    ],
  },
  {
    title: 'Course Content',
    items: [
      {
        label: 'Lesson Plan',
        icon: <CalendarIcon />,
        route: '/lesson-plan',
        active: false,
      },
      {
        label: 'My Courses',
        icon: <InfoIcon />,
        route: '/courses',
        active: false,
      },
    ],
  },
  {
    title: 'Exams',
    items: [
      {
        label: 'Exam Generate',
        icon: <CheckCircleIcon />,
        route: '/exam-generate',
        active: false,
      },
      {
        label: 'Grading Rubrics',
        icon: <AtSignIcon />,
        route: '/rubrics',
        active: false,
      },
    ],
  },
  {
    title: 'Account',
    items: [
      {
        label: 'Profile',
        icon: <ViewIcon />,
        route: '/profile',
        active: false,
      },
      {
        label: 'Setting',
        icon: <SettingsIcon />,
        route: '/settings',
        active: false,
      },
    ],
  },
];

export const MainSideBar = ({ onNavigate, isOpen, onToggle }: SidebarProps) => {
  const router = useRouter();
  return (
    <Box
      position="fixed"
      left="0"
      w={isOpen ? '250px' : '60px'}
      bg="white"
      height="calc(100vh - 60px)"
      transition="width 0.2s"
      boxShadow="md"
      overflowY="auto"
      zIndex={1000}
    >
      <Flex p={4} justify="space-between" align="center">
        <Text
          fontSize="lg"
          fontWeight="bold"
          display={isOpen ? 'block' : 'none'}
        >
          Menu
        </Text>
        <IconButton
          aria-label="Toggle Menu"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          size="sm"
          onClick={onToggle}
          variant="ghost"
        />
      </Flex>

      <Box mt={4} px={2}>
        {sections.map((section, idx) => (
          <Box key={idx} mb={6}>
            <Text
              fontSize="sm"
              fontWeight="bold"
              color="gray.500"
              ml={2}
              display={isOpen ? 'block' : 'none'}
              mb={2}
            >
              {section.title}
            </Text>
            <VStack spacing={1} align="stretch">
              {section.items.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  justifyContent={isOpen ? 'flex-start' : 'center'}
                  leftIcon={item.icon}
                  onClick={() =>
                    item.active
                      ? router.push(item.route)
                      : console.log('go to: ' + item.route)
                  }
                  size="sm"
                  fontWeight="normal"
                  px={isOpen ? 4 : 0}
                  w="100%"
                >
                  {isOpen && item.label}
                </Button>
              ))}
            </VStack>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MainSideBar;
