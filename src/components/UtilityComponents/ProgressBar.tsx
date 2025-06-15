import { CheckCircleIcon } from '@chakra-ui/icons';
import { Box, Progress, Text, useToast } from '@chakra-ui/react';
import { useEffect } from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  isHidden: boolean;
  label?: string;
  description?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  isHidden,
  label,
  description,
}) => {
  const toast = useToast();
  const progress =
    totalSteps > 0
      ? Math.min(Math.round((currentStep / totalSteps) * 100), 100)
      : 0;

  useEffect(() => {
    if (progress == 100 && description && label)
      toast({
        title: label,
        description: description,
        status: 'success',
        duration: 2000,
        position: 'bottom-left',
        isClosable: false,
      });
  }, [progress]);

  return (
    <Box w="100%" p={4} hidden={isHidden}>
      <Text mb={2}>
        {label ?? 'Progress'}: {progress}%{' '}
        {progress == 100 && (
          <>
            <CheckCircleIcon color="green.400" />
            <Text color="green.500" fontWeight="medium">
              Completed
            </Text>
          </>
        )}
      </Text>
      <Progress
        colorScheme="teal"
        size="md"
        value={progress}
        hasStripe
        isAnimated={progress < 100}
      />
    </Box>
  );
};

export default ProgressBar;
