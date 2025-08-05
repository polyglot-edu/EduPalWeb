import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { MdEdit, MdVisibility } from 'react-icons/md';
import { PolyglotSyllabus } from '../../types/polyglotElements';
import SyllabusDocxButton from './SyllabusDocxButtonGen';

type Props = {
  syllabus: PolyglotSyllabus;
};

export default function SyllabusDetailView({ syllabus }: Props) {
  const router = useRouter();
    console.log('Syllabus Detail View:', syllabus);
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

  if (!syllabus) {
    return <Box>No syllabus data available.</Box>;
  }
  return (
    <Box
      bg={cardBg}
      borderRadius="lg"
      boxShadow="xl"
      borderColor={borderColor}
    >
      <Box p={6}>
        <SyllabusDocxButton syllabus={syllabus} />

        <Heading size="lg" mb={1}>
          {syllabus.title || 'Untitled Course'}
        </Heading>
        <Text fontSize="md" color="gray.600" mb={4}>
          {syllabus.description || 'No description provided.'}
        </Text>

        <Stack direction="row" spacing={3} mb={6}>
          {syllabus.subjectArea && (
            <Badge colorScheme="blue">{syllabus.subjectArea}</Badge>
          )}
          {syllabus.educational_level && (
            <Badge colorScheme="purple">{syllabus.educational_level}</Badge>
          )}
          {syllabus.language && (
            <Badge colorScheme="orange">{syllabus.language}</Badge>
          )}
        </Stack>

        <Divider mb={4} />
        {/* Goals & Prerequisites */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
          <Box>
            <Heading size="md" mb={2}>
              Goals
            </Heading>
            <Stack spacing={1}>
              {syllabus.goals?.length ? (
                syllabus.goals.map((goal, idx) => (
                  <Text key={idx}>• {goal}</Text>
                ))
              ) : (
                <Text color="gray.400">Not provided</Text>
              )}
            </Stack>
          </Box>
          <Box>
            <Heading size="md" mb={2}>
              Prerequisites
            </Heading>
            <Stack spacing={1}>
              {syllabus.prerequisites?.length ? (
                syllabus.prerequisites.map((pre, idx) => (
                  <Text key={idx}>• {pre}</Text>
                ))
              ) : (
                <Text color="gray.400">Not provided</Text>
              )}
            </Stack>
          </Box>
        </SimpleGrid>
        {syllabus.topics && syllabus.topics.length > 0 && (
          <Box mb={6}>
            <Heading size="md" mb={4}>
              Learning Objectives
            </Heading>

            {syllabus.topics.map((topic, index) => {
              const lo = topic.learning_objectives;
              if (!lo) return null;

              return (
                <Box
                  key={index}
                  mb={6}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                >
                  <Heading size="sm" mb={3}>
                    Topic {index + 1}: {topic.macro_topic || 'Untitled'}
                  </Heading>
                  <Text size="sm">{topic.details}</Text>
                  <Table variant="striped" size="sm" mt={'1'}>
                    <Tbody>
                      <Tr>
                        <Td fontWeight="bold" width="150px">
                          Knowledge
                        </Td>
                        <Td>{lo.knowledge || '-'}</Td>
                      </Tr>
                      <Tr>
                        <Td fontWeight="bold">Skills</Td>
                        <Td>{lo.skills || '-'}</Td>
                      </Tr>
                      <Tr>
                        <Td fontWeight="bold">Attitude</Td>
                        <Td>{lo.attitude || '-'}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </Box>
              );
            })}
          </Box>
        )}

        <Box mb={6}>
          <Heading size="md" mb={2}>
            Course Info
          </Heading>
          <Table size="sm" variant="simple">
            <Tbody>
              {[
                ['Academic Year', syllabus.academicYear],
                ['Course Code', syllabus.courseCode],
                ['Course of Study', syllabus.courseOfStudy],
                ['Study Regulation', syllabus.studyRegulation],
                ['Curriculum Path', syllabus.curriculumPath],
                ['Integrated Course Unit', syllabus.integratedCourseUnit],
                ['Student Partition', syllabus.studentPartition],
                ['Semester', syllabus.semester],
                ['Course Year', syllabus.courseYear],
                ['Subject Area', syllabus.subjectArea],
                ['Course Type', syllabus.courseType],
                ['Department', syllabus.department],
                ['Credits (CFU)', syllabus.credits],
                ['Teaching Hours', syllabus.teachingHours],
                ['Disciplinary Sector', syllabus.disciplinarySector],
              ].map(([label, value]) =>
                value ? (
                  <Tr key={label}>
                    <Td>
                      <b>{label}</b>
                    </Td>
                    <Td>{value}</Td>
                  </Tr>
                ) : null
              )}
            </Tbody>
          </Table>
        </Box>

        {/* Teaching / Assessment / Materials */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Box>
            <Heading size="sm" mb={2}>
              Teaching Methods
            </Heading>
            {syllabus.teachingMethods?.length ? (
              syllabus.teachingMethods.map((m, idx) => (
                <Text key={idx}>• {m}</Text>
              ))
            ) : (
              <Text color="gray.400">Not provided</Text>
            )}
          </Box>
          <Box>
            <Heading size="sm" mb={2}>
              Assessment Methods
            </Heading>
            {syllabus.assessmentMethods?.length ? (
              syllabus.assessmentMethods.map((m, idx) => (
                <Text key={idx}>• {m}</Text>
              ))
            ) : (
              <Text color="gray.400">Not provided</Text>
            )}
          </Box>
          <Box>
            <Heading size="sm" mb={2}>
              Reference Materials
            </Heading>
            {syllabus.referenceMaterials?.length ? (
              syllabus.referenceMaterials.map((r, idx) => (
                <Text key={idx}>• {r}</Text>
              ))
            ) : (
              <Text color="gray.400">Not provided</Text>
            )}
          </Box>
        </SimpleGrid>
      </Box>

      <Box
        bg="rgba(244, 232, 193, 0.45)"
        borderTop="1px solid"
        borderColor="purple.200"
        py={3}
      >
        <Flex justify="space-evenly">
          <Button
            leftIcon={<MdEdit />}
            bg="purple.300"
            color="white"
            _hover={{ bg: 'purple.400' }}
            size="sm"
            onClick={() => router.push(`/syllabus/${syllabus._id}/edit`)}
          >
            Edit
          </Button>
          <Button
            leftIcon={<MdVisibility />}
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
}
