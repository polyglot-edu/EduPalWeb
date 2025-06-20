import { CalendarIcon, CheckCircleIcon } from '@chakra-ui/icons';
import { Box, Flex, Progress, Text } from '@chakra-ui/react';
import { IconType } from 'react-icons';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  label?: string;
  date?: Date;
  elementsName?: string;
  elementsIcon?: IconType;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  label = 'Student Progress',
  date,
  elementsName,
  elementsIcon: ElementIcon,
}) => {
  const progress =
    totalSteps > 0
      ? Math.min(Math.round((currentStep / totalSteps) * 100), 100)
      : 0;

  const formattedDate = date?.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Box w="100%" px={4} pt={3}>
      <Text mb={2} fontWeight="medium">
        {label}: {progress}%{' '}
        {progress === 100 && <CheckCircleIcon color="green.400" ml={1} />}
      </Text>

      <Progress
        colorScheme="purple"
        size="sm"
        value={progress}
        hasStripe
        isAnimated={progress < 100}
        borderRadius="md"
      />

      <Flex
        mt={2}
        justify="space-between"
        align="center"
        fontSize="sm"
        color="gray.600"
      >
        {(ElementIcon || elementsName) && (
          <Flex align="center" gap={1}>
            {ElementIcon && <ElementIcon />}
            <Text>
              {totalSteps} {elementsName}
            </Text>
          </Flex>
        )}
        {date && (
          <Flex align="center" gap={1}>
            <CalendarIcon />
            <Text>{formattedDate}</Text>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default ProgressBar;
