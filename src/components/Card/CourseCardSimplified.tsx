import { DeleteIcon } from '@chakra-ui/icons';
import {
  Badge,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Image,
  SpaceProps,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { useCallback } from 'react';
import { APIV2 } from '../../data/api';
import cardImage from '../../public/screenLPs.png';
import { PolyglotCourse } from '../../types/polyglotElements';
import DeleteCourseModal from '../Modals/DeleteCourseModal';

type CourseCardProps = {
  py?: SpaceProps['py'];
  px?: SpaceProps['px'];
  canDelete?: boolean;
  openChildren?: () => void;
  course: PolyglotCourse;
  API: APIV2;
  setCourses: any;
};

const CourseCardSemplified = ({
  course,
  px,
  py,
  canDelete,
  openChildren,
  API,
  setCourses,
}: CourseCardProps) => {
  const { isOpen: dOpen, onClose: dOnClose, onOpen: dOnOpen } = useDisclosure();

  const deleteCourse = useCallback(
    async (courseId: string) => {
      await API.deleteCourse(courseId);
      setCourses((prev: any) =>
        prev.filter((course: any) => course._id !== courseId)
      );
    },
    [API]
  );

  return (
    <Card
      direction={{ base: 'column', sm: 'row' }}
      overflow="hidden"
      variant="outline"
      onClick={openChildren}
      backgroundColor={'blue.100'}
    >
      <Image
        objectFit="cover"
        maxW={{ base: '100%', sm: '200px' }}
        src={cardImage.src}
        alt="Flow card"
      />

      <Stack w="full">
        <CardBody>
          <Flex float={'right'}>
            {canDelete && (
              <Button
                zIndex={11}
                float={'right'}
                variant="unstyled"
                hidden={!canDelete}
              >
                <Tooltip label="Delete" placement="right">
                  <DeleteIcon onClick={dOnOpen} w={5} h={5} color="red" />
                </Tooltip>
              </Button>
            )}
          </Flex>
          <Heading size="md">{course.title}</Heading>
          {course.tags &&
            course.tags.map((tag, id) => (
              <Badge key={id} mr={1} colorScheme={tag.color}>
                {tag.name}
              </Badge>
            ))}
          <Text pt={2} whiteSpace={'pre-wrap'} noOfLines={3}>
            {course.description}
          </Text>
          <Text pt={2} whiteSpace={'pre-wrap'} noOfLines={3}>
            In this Course there are: {course.flows.length} learning paths
          </Text>
          <Heading size={'s'}>Click me to see the Learning paths List</Heading>
        </CardBody>
      </Stack>
      <DeleteCourseModal
        isOpen={dOpen}
        onClose={dOnClose}
        deleteFunc={deleteCourse}
        courseId={course._id ?? ''}
      />
    </Card>
  );
};

export default CourseCardSemplified;

export function ScheletonCourseCard() {
  return (
    <div className="animate-pulse bg-gray-300 w-2/3 h-12 p-3 rounded"></div>
  );
}
