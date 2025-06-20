/* eslint-disable react/jsx-key */
import { Box, Button, Flex } from '@chakra-ui/react';
import { useState } from 'react';
import { AiOutlineFolderOpen } from 'react-icons/ai';
import { BsStars } from 'react-icons/bs';
import { FaRegCheckCircle } from 'react-icons/fa';
import { GoBook } from 'react-icons/go';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { TbLock } from 'react-icons/tb';

import StepProgressBar from '../UtilityComponents/StepProgressBar';

import StepAIGeneration from './steps/StepAIGeneration';
import StepComplete from './steps/StepComplete';
import StepContentForm from './steps/StepContentForm';
import StepContentUpload from './steps/StepContentUpload';
import StepCourseContent from './steps/StepCourseContent';
import StepCourseDetails from './steps/StepCourseDetails';
import StepGamification from './steps/StepGamification';
import StepPublishing from './steps/StepPublishing';

const stepComponents = [
  <StepCourseDetails />, // 0
  <StepCourseContent />, // 1 (intermedio)
  <StepContentUpload />, // 2
  <StepContentForm />, // 3 (intermedio)
  <StepAIGeneration />, // 4
  <StepGamification />, // 5
  <StepPublishing />, // 6
  <StepComplete />, // 7
];

const CourseCreationStepper = () => {
  const [step, setStep] = useState(0);

  const currentMainStep = (() => {
    if (step === 0 || step === 1) return 0;
    if (step === 2 || step === 3) return 1;
    if (step === 4) return 2;
    if (step === 5) return 3;
    if (step === 6) return 4;
    if (step === 7) return 5;
    return 0;
  })();

  const nextStep = () =>
    setStep((s) => Math.min(s + 1, stepComponents.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <Flex direction="column" w="100%" h="100%" bg="purple.200" p={6}>
      <StepProgressBar
        currentStep={currentMainStep}
        steps={[
          { name: 'Course Details', icon: GoBook },
          { name: 'Content Upload', icon: IoCloudUploadOutline },
          { name: 'AI Generation', icon: BsStars },
          { name: 'Gamification', icon: TbLock },
          { name: 'Publishing', icon: AiOutlineFolderOpen },
          { name: 'Complete', icon: FaRegCheckCircle },
        ]}
      />
      <Box
        bg="white"
        borderRadius="md"
        boxShadow="md"
        p={4}
        mt={4}
        mb={2}
        textAlign="center"
        py={2}
      >
        <Box flex="1" overflowY="auto" mt={6} mb={4}>
          {stepComponents[step]}
        </Box>

        <Flex mt={8} justify="space-between" py={2}>
          <Box flex="1" display="flex" justifyContent="center">
            <Button onClick={prevStep} isDisabled={step === 0}>
              Back
            </Button>
          </Box>
          <Box flex="1" display="flex" justifyContent="center"></Box>
          <Box flex="1" display="flex" justifyContent="center">
            <Button
              colorScheme="purple"
              onClick={nextStep}
              isDisabled={step === stepComponents.length - 1}
            >
              Next
            </Button>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

export default CourseCreationStepper;
