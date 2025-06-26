import {
  Box,
  Button,
  Flex,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { API } from '../../../data/api';
import { PolyglotFlow } from '../../../types/polyglotElements';
import FlowCarousel from '../../Carousel/FlowCarousel';
import StepHeading from '../../UtilityComponents/StepHeading';

interface StepPublishingProps {
  publishMethod: [string, React.Dispatch<React.SetStateAction<string>>];
  accessCode: [string, React.Dispatch<React.SetStateAction<string>>];
  materialMethod: string;
}

function makeCode(length: number) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const StepPublishing = ({
  publishMethod,
  accessCode,
  materialMethod,
}: StepPublishingProps) => {
  const [visibility, setVisibility] = publishMethod;
  const [code, setAccessCode] = accessCode;

  const [selectedFlows, setSelectedFlows] = useState<string[]>([]);
  const [flows, setFlows] = useState<PolyglotFlow[]>([]);
  useEffect(() => {
    API.loadFlowList().then((resp) => {
      setFlows(resp.data);
    });
  }, []);
  return (
    <Box p={8}>
      <StepHeading
        title="Publishing"
        subtitle="Choose how to share your course"
      />
      <Box mb={6} hidden={materialMethod === 'selected' ? false : true}>
        <Text mb={2} fontSize="sm" color="gray.600">
          {selectedFlows.length} learning path{selectedFlows.length !== 1 && 's'}{' '}
          selected
        </Text>
        <FlowCarousel
          flows={flows}
          selectedFlows={selectedFlows}
          setSelectedFlows={setSelectedFlows}
        />
      </Box>
      <RadioGroup onChange={setVisibility} value={visibility}>
        <Stack spacing={4} direction="row" flexWrap="wrap">
          <Box
            border="2px"
            borderColor={visibility === 'public' ? 'purple.500' : 'gray.200'}
            bgColor={visibility === 'public' ? 'purple.50' : 'white'}
            _hover={{ bg: 'purple.50' }}
            borderRadius="3xl"
            p={5}
            minW="250px"
            flex="1"
            onClick={() => {
              setAccessCode('');
              setVisibility('public');
            }}
          >
            <Radio value="public">Public Course</Radio>
            <Text fontSize="sm" mt={2} color="gray.600">
              ✓ Listed in search results
              <br />
              ✓ Open enrollment
              <br />✓ Wider audience reach
            </Text>
          </Box>

          <Box
            border="2px"
            borderColor={visibility === 'private' ? 'purple.500' : 'gray.200'}
            _hover={{ bg: 'purple.50' }}
            bgColor={visibility === 'private' ? 'purple.50' : 'white'}
            borderRadius="3xl"
            p={5}
            minW="250px"
            flex="1"
            onClick={() => setVisibility('private')}
          >
            <Radio value="private">Private Course</Radio>
            <Text fontSize="sm" mt={2} color="gray.600">
              ✓ Access code required
              <br />
              ✓ Not listed in public search
              <br />✓ Perfect for specific student groups
            </Text>
          </Box>
        </Stack>
      </RadioGroup>

      {visibility === 'private' && (
        <Box mt={6}>
          <Text mb={1}>Access Code</Text>
          <Flex gap={2}>
            <Input
              value={code}
              onChange={(event) => setAccessCode(event.currentTarget.value)}
            />
            <Button
              variant="outline"
              onClick={() => setAccessCode(() => makeCode(8))}
            >
              Regenerate
            </Button>
          </Flex>
        </Box>
      )}

      <Box mt={2}>
        <Text fontSize="sm" color="blue.600">
          Course Sharing Link
        </Text>
        <Text fontSize="sm" color="blue.800">
          https://edupal.io/courses/join/{code}
        </Text>
      </Box>
    </Box>
  );
};

export default StepPublishing;
