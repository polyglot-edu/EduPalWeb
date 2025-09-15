import { Box, Button, Flex, Heading } from '@chakra-ui/react';

interface StepGamificationProps {
  nextStep: () => void;
  prevStep: () => void;
}

const StepGamification = ({ nextStep, prevStep }: StepGamificationProps) => {
  return (
    <Box p={6}>
      <Heading size="md" mb={4}>
        Gamification
      </Heading>
      <Heading size="sm" mb={6} color="gray.600">
        Coming soon
      </Heading>
      {/* TODO: Aggiungi punteggi, logiche di gioco, badge, ecc. */}
      <Flex mt={8} justify="space-between" py={2}>
        <Box flex="1" display="flex" justifyContent="center">
          <Button onClick={() => prevStep()}>Back</Button>
        </Box>
        <Box flex="1" display="flex" justifyContent="center"></Box>
        <Box flex="1" display="flex" justifyContent="center">
          <Button colorScheme="purple" onClick={nextStep}>
            Next
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default StepGamification;
