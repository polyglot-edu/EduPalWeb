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
import {
  Box,
  Button,
  Flex,
  IconButton,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';

type SidebarProps = {
  onNavigate?: (route: string) => void;
  isOpen: boolean;
  onToggle: () => void;
};

type NavItem = {
  label: string;
  icon: React.ReactElement;
  route: string;
};

type Section = {
  title: string;
  items: NavItem[];
};

const sections: Section[] = [
  {
    title: 'General',
    items: [
      { label: 'Dashboard', icon: <ViewIcon />, route: '/dashboard' },
      { label: 'My Library', icon: <StarIcon />, route: '/library' },
      { label: 'Worksheet', icon: <EditIcon />, route: '/worksheet' },
    ],
  },
  {
    title: 'Course Content',
    items: [
      { label: 'Lesson Plan', icon: <CalendarIcon />, route: '/lesson-plan' },
      { label: 'My Courses', icon: <InfoIcon />, route: '/courses' },
    ],
  },
  {
    title: 'Exams',
    items: [
      {
        label: 'Exam Generate',
        icon: <CheckCircleIcon />,
        route: '/exam-generate',
      },
      { label: 'Grading Rubrics', icon: <AtSignIcon />, route: '/rubrics' },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Profile', icon: <ViewIcon />, route: '/profile' },
      { label: 'Setting', icon: <SettingsIcon />, route: '/settings' },
    ],
  },
];

export const MainSideBar = ({ onNavigate, isOpen, onToggle }: SidebarProps) => {
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
                  onClick={() => onNavigate?.(item.route)}
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
