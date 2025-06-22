import { CheckCircleIcon } from '@chakra-ui/icons';
import { Box, Heading, Text } from '@chakra-ui/react';

const StepComplete = () => {
  return (
    <Box p={6} textAlign="center">
      <CheckCircleIcon boxSize={12} color="green.400" mb={4} />
      <Heading size="lg" mb={2}>
        Course Created Successfully!
      </Heading>
      <Text color="gray.600">
        You can now share it or manage it in the dashboard.
      </Text>
    </Box>
  );
};

export default StepComplete;
