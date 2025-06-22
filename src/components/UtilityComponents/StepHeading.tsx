// StepHeading.tsx
import { Box, Heading, Text } from '@chakra-ui/react';

interface StepHeadingProps {
  title: string;
  subtitle?: string;
}

const StepHeading = ({ title, subtitle }: StepHeadingProps) => {
  return (
    <Box mb={6} textAlign="left">
      <Heading fontSize="lg" fontWeight="semibold" color="gray.800" mb={1}>
        {title}
      </Heading>
      {subtitle && (
        <Text fontSize="small" color="gray.600">
          {subtitle}
        </Text>
      )}
    </Box>
  );
};

export default StepHeading;
