import { Box, Flex, Progress, Text } from '@chakra-ui/react';
import { IconType } from 'react-icons';

interface ProgressBarProps {
  currentStep: number;
  steps: {
    name: string;
    icon: IconType;
  }[];
}

//to be fixed AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

const StepProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  steps,
}) => {
  const progress =
    steps.length + 1 > 0
      ? Math.min(Math.round((currentStep / (steps.length + 1)) * 100), 100)
      : 0;
  return (
    <Box w="100%" px={4} pt={3}>
      <Box textAlign="right" color={'purple.500'}>
        Step {currentStep} of {steps.length + 1}
      </Box>
      <Progress
        colorScheme="purple"
        size="sm"
        value={progress}
        hasStripe
        isAnimated={progress < 100}
        borderRadius="md"
      />
      <Flex justify="space-between" align="center" mb={2} pt={2}>
        {steps.map((step, idx) => (
          <Flex
            key={step.name}
            direction="column"
            align="center"
            flex={1}
            opacity={idx > currentStep ? 0.5 : 1}
          >
            <Box
              as={step.icon}
              boxSize={6}
              color={
                idx === currentStep
                  ? 'purple.500'
                  : idx < currentStep
                  ? 'green.400'
                  : 'gray.400'
              }
            />
            <Text fontSize="xs" mt={1} textAlign="center">
              {step.name}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};

export default StepProgressBar;
