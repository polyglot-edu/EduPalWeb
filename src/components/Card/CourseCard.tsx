import { EditIcon, InfoIcon, ViewIcon } from '@chakra-ui/icons';
import { Badge, Box, Button, Flex, Image, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { HiUsers } from 'react-icons/hi';
import FlowExample from '../../public/exampleFlow.png';
import { PolyglotCourseWithFlows } from '../../types/polyglotElements';
import ProgressBar from '../UtilityComponents/ProgressBar';

interface CourseCardProps {
  course: PolyglotCourseWithFlows;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const image =
    course.img != undefined && course.img != '' ? course.img : FlowExample.src;

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
      <Image
        src={image}
        alt={course.title}
        objectFit="cover"
        w="100%"
        h="150px"
      />

      <Box p={4} flex="1">
        <Text fontWeight="bold" fontSize="lg" mb={2}>
          {course.title}
        </Text>
        <Text fontSize="sm" color="gray.600" noOfLines={2}>
          {course.description}
        </Text>
        <Flex wrap="wrap" mt={2} gap={2}>
          {course.tags?.map((tag, idx) => (
            <Badge key={idx} colorScheme={tag.color}>
              {tag.name}
            </Badge>
          ))}
        </Flex>
      </Box>
      <Box px={4} mb={2}>
        {course.published ? (
          <ProgressBar
            currentStep={course.nCompleted || 0}
            totalSteps={course.nSubscribed || 0}
            label="Course Progress"
            elementsName={'Students'}
            elementsIcon={HiUsers}
            date={course.lastUpdate}
          />
        ) : (
          <Box w="100%" px={4} pt={3} pb={2} bg="gray.50" borderRadius="md">
            <Flex align="center" gap={2} mb={1}>
              <InfoIcon color="yellow.300" />
              <Text fontSize="sm" color="gray.700" fontWeight="medium">
                This course is not yet published.
              </Text>
            </Flex>
            <Text fontSize="sm" color="gray.600">
              {course.flows.length} learning path
              {course.flows.length === 1 ? '' : 's'} defined.
            </Text>
          </Box>
        )}
      </Box>

      <Box
        bg="rgba(244, 232, 193, 0.45)"
        borderTop="1px solid"
        borderColor="purple.200"
        py={2}
      >
        <Flex justify="space-between" px={6}>
          <Box flex="1" display="flex" justifyContent="center">
            <Button
              leftIcon={<EditIcon />}
              bg="purple.300"
              color="white"
              _hover={{ bg: 'purple.400' }}
              size="sm"
              onClick={() => router.push(`/courses/${course._id}/edit`)}
            >
              Edit
            </Button>
          </Box>
          <Box flex="1" display="flex" justifyContent="center">
            <Button
              leftIcon={<ViewIcon />}
              bg="purple.600"
              color="white"
              _hover={{ bg: 'purple.700' }}
              size="sm"
              onClick={() => router.push(`/courses/${course._id}`)}
            >
              View
            </Button>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default CourseCard;
