import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { API } from '../../data/api';
import {
  AIDefineSyllabusResponse,
  PolyglotSyllabus,
} from '../../types/polyglotElements';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (syllabus: AIDefineSyllabusResponse) => void;
};

export default function SelectSyllabusModal({
  isOpen,
  onClose,
  onSelect,
}: Props) {
  const [syllabi, setSyllabi] = useState<PolyglotSyllabus[]>([]);
  const [selected, setSelected] = useState<PolyglotSyllabus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setIsLoading(true);
    try {
      API.getAllSyllabuses().then((response) => {
        setSyllabi(response.data as PolyglotSyllabus[]);
        setSelected(null);
        setIsLoading(false);
      });
    } catch (e) {
      setIsLoading(false);
    }
  }, [isOpen]);

  function convertToSyllabusResponse(syllabus: PolyglotSyllabus) {
    onSelect({
      general_subject: syllabus.subjectArea || '',
      educational_level: syllabus.educational_level,
      additional_information: syllabus.additional_information,
      title: syllabus.title,
      description: syllabus.description,
      goals: syllabus.goals,
      topics: syllabus.topics,
      prerequisites: syllabus.prerequisites,
      language: syllabus.language,
    } as AIDefineSyllabusResponse);
    onClose();
  }

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Choose a syllabus</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoading && (
            <Center py={10}>
              <Spinner size="xl" color="purple.500" mr={2} />
              <Alert status="info" borderRadius="md" maxW="sm">
                <AlertIcon />
                Loading syllabi...
              </Alert>
            </Center>
          )}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {syllabi.map((syllabus) => (
              <Box
                key={syllabus._id}
                p={4}
                borderWidth={2}
                borderColor={
                  selected?._id === syllabus._id ? 'purple.400' : borderColor
                }
                borderRadius="lg"
                bg={cardBg}
                boxShadow={
                  selected?._id === syllabus._id ? '0 0 0 2px purple' : 'md'
                }
                cursor="pointer"
                onClick={() => setSelected(syllabus)}
              >
                <Heading size="md" mb={1}>
                  {syllabus.title || 'Untitled Course'}
                </Heading>
                <Text fontSize="sm" color="gray.600" mb={3} noOfLines={2}>
                  {syllabus.description || 'No description provided.'}
                </Text>

                <Stack direction="row" spacing={2} wrap="wrap" mb={3}>
                  {syllabus.subjectArea && (
                    <Badge colorScheme="blue">{syllabus.subjectArea}</Badge>
                  )}
                  {syllabus.educational_level && (
                    <Badge colorScheme="purple">
                      {syllabus.educational_level}
                    </Badge>
                  )}
                  {syllabus.language && (
                    <Badge colorScheme="orange">{syllabus.language}</Badge>
                  )}
                </Stack>

                {syllabus.goals?.length ? (
                  <Text fontSize="sm" noOfLines={2}>
                    🎯 {syllabus.goals.join(', ')}
                  </Text>
                ) : (
                  <Text fontSize="sm" color="gray.400">
                    No goals provided
                  </Text>
                )}
              </Box>
            ))}
          </SimpleGrid>
        </ModalBody>

        <ModalFooter>
          <Flex w="100%" justify="space-between">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="purple"
              onClick={() => selected && convertToSyllabusResponse(selected)}
              isDisabled={!selected}
            >
              Confirm
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
