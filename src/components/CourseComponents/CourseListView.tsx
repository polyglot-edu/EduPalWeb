import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  Image,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { MdEdit, MdVisibility } from 'react-icons/md';
import defaultImg from '../../public/exampleFlow.png';
import { PolyglotCourseWithFlows } from '../../types/polyglotElements';

interface CourseCardProps {
  course: PolyglotCourseWithFlows;
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
}

export const CourseCardView = ({ course, onEdit, onView }: CourseCardProps) => {
  const {
    _id: _id,
    title,
    description,
    macro_subject,
    education_level,
    language,
    duration,
    learningObjectives,
    topics,
    tags,
    img,
    context,
    learningContext,
    author,
    published,
    lastUpdate,
    nSubscribed,
    nCompleted,
    flows,
  } = course;

  const router = useRouter();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const [idIsOpen, setIdIsOpen] = useState('');

  function toggle(id: string) {
    setIdIsOpen(id != idIsOpen ? id : '');
  }

  return (
    <Box
      bg={cardBg}
      p={6}
      borderRadius="lg"
      boxShadow="xl"
      borderColor={borderColor}
    >
      <Image
        src={img || defaultImg.src}
        alt="Course image"
        objectFit="cover"
        w="100%"
        h="250px"
        mb={4}
        borderRadius="md"
      />

      <Flex justify="space-between" align="center" mb={2}>
        <Heading size="lg">{title || 'Untitled Course'}</Heading>
        <Badge colorScheme={published ? 'green' : 'yellow'}>
          {published ? 'Published' : 'Draft'}
        </Badge>
      </Flex>

      <Text fontSize="md" mb={2} color="gray.600">
        {description || 'No description provided.'}
      </Text>

      <Flex wrap="wrap" gap={2} mb={4}>
        {macro_subject && <Badge colorScheme="blue">{macro_subject}</Badge>}
        {education_level && (
          <Badge colorScheme="purple">{education_level}</Badge>
        )}
        {language && <Badge colorScheme="orange">{language}</Badge>}
        {duration && <Badge colorScheme="teal">Duration: {duration}</Badge>}
        {learningContext && <Badge colorScheme="cyan">{learningContext}</Badge>}
      </Flex>

      {tags?.length > 0 && (
        <Stack direction="row" wrap="wrap" mb={4}>
          {tags.map((tag, idx) => (
            <Badge key={idx} colorScheme={tag.color} mr={1}>
              {tag.name}
            </Badge>
          ))}
        </Stack>
      )}

      {learningObjectives && (
        <Box mb={4}>
          <Text fontWeight="bold">Learning Objectives:</Text>
          <Text>{learningObjectives}</Text>
        </Box>
      )}

      {topics?.length > 0 && (
        <Box mb={4}>
          <Text fontWeight="bold">Topics:</Text>
          <Text>{topics.join(', ')}</Text>
        </Box>
      )}

      <Divider my={4} />

      <Heading size="md" mb={2}>
        Flows
      </Heading>
      <Stack spacing={4}>
        {flows.map((flow, index) => {
          return (
            <Box
              key={index}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              borderColor={borderColor}
            >
              <Flex justify="space-between" align="center">
                <Box>
                  <Text fontWeight="bold" fontSize="lg">
                    {flow.title}
                  </Text>
                  <Text color="gray.500" fontSize="sm">
                    {flow.description}
                  </Text>
                  <Flex mt={2} wrap="wrap" gap={2}>
                    {flow.tags?.map((tag, idx) => (
                      <Badge key={idx} colorScheme={tag.color}>
                        {tag.name}
                      </Badge>
                    ))}
                  </Flex>
                  <Text mt={2}>Activities: {flow.nodes?.length ?? 0}</Text>
                </Box>

                <Button
                  onClick={() =>
                    router.push(
                      'https://staging.polyglot-edu.com/flows/' + flow._id
                    )
                  }
                  size="sm"
                >
                  Open Learning Path
                </Button>
              </Flex>
            </Box>
          );
        })}
      </Stack>

      <Divider my={6} />

      <Flex justify="space-between" fontSize="sm" color="gray.500">
        <Flex align="center" gap={1}>
          <Icon as={FaUser} /> {author?.username || 'Anonymous'}
        </Flex>
        <Flex gap={3}>
          <Text>{nSubscribed} enrolled</Text>
          <Text>{nCompleted} completed</Text>
        </Flex>
      </Flex>

      <Stack direction="row" spacing={4} mt={6}>
        <Tooltip label="View Course">
          <Button
            leftIcon={<Icon as={MdVisibility} />}
            onClick={() => onView?.(_id)}
          >
            View
          </Button>
        </Tooltip>
        <Tooltip label="Edit Course">
          <Button
            leftIcon={<Icon as={MdEdit} />}
            variant="outline"
            onClick={() => onEdit?.(_id)}
          >
            Edit
          </Button>
        </Tooltip>
      </Stack>
    </Box>
  );
};
