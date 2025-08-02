import { EditIcon, ViewIcon } from '@chakra-ui/icons';
import { Badge, Box, Button, Flex, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { PolyglotSyllabus } from '../../types/polyglotElements';

interface SyllabusCardProps {
  syllabus: PolyglotSyllabus;
}

const SyllabusCard = ({ syllabus }: SyllabusCardProps) => {
  const router = useRouter();

  return (
    <Box
      bg="white"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      borderWidth="2px"
      borderColor="purple.300"
      display="flex"
      flexDirection="column"
      height="100%"
    >
      <Box p={4} flex="1">
        <Text fontWeight="bold" fontSize="lg" mb={1}>
          {syllabus.title}
        </Text>

        <Text fontSize="sm" color="gray.600" noOfLines={2}>
          {syllabus.description}
        </Text>

        <Flex wrap="wrap" mt={3} gap={2}>
          <Badge colorScheme="purple">{syllabus.courseCode}</Badge>
          <Badge colorScheme="blue">{syllabus.academicYear}</Badge>
          <Badge colorScheme="green">{syllabus.credits} credits</Badge>
          <Badge colorScheme="yellow">{syllabus.language}</Badge>
        </Flex>

        <Text fontSize="xs" color="gray.500" mt={2}>
          Last updated: {new Date(syllabus.lastUpdate).toLocaleDateString()}
        </Text>
      </Box>

      <Box
        bg="rgba(244, 232, 193, 0.45)"
        borderTop="1px solid"
        borderColor="purple.200"
        py={2}
      >
        <Flex justify="space-between" px={6}>
          <Button
            leftIcon={<EditIcon />}
            bg="purple.300"
            color="white"
            _hover={{ bg: 'purple.400' }}
            size="sm"
            onClick={() => router.push(`/syllabus/${syllabus._id}/edit`)}
          >
            Edit
          </Button>
          <Button
            leftIcon={<ViewIcon />}
            bg="purple.600"
            color="white"
            _hover={{ bg: 'purple.700' }}
            size="sm"
            onClick={() => router.push(`/syllabus/${syllabus._id}`)}
          >
            View
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default SyllabusCard;
