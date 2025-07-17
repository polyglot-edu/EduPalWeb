import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { AiOutlineFolderOpen } from 'react-icons/ai';
import { BsStars } from 'react-icons/bs';
import { FaRegCheckCircle } from 'react-icons/fa';
import { GoBook } from 'react-icons/go';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { TbLock } from 'react-icons/tb';

import StepProgressBar from '../UtilityComponents/StepProgressBar';

import { HamburgerIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { IconType } from 'react-icons';
import {
  AIDefineSyllabusResponse,
  AIPlanCourseResponse,
  AIPlanLessonResponse,
  AnalyzedMaterial,
  EducationLevel,
  LearningObjectives,
  PlanLessonNode,
  SyllabusTopic,
} from '../../types/polyglotElements';
import StepAIGeneration from './steps/StepAIGeneration';
import StepComplete from './steps/StepComplete';
import StepContentForm from './steps/StepContentForm';
import StepContentUpload from './steps/StepContentUpload';
import StepCourseContent from './steps/StepCourseContent';
import StepDefineSyllabus from './steps/StepDefineSyllabus';
import StepGamification from './steps/StepGamification';
import StepPublishing from './steps/StepPublishing';

const CourseCreationStepper = () => {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [progressStep, setProgressStep] = useState(0);
  const [generalSubject, setGeneralSubject] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [definedSyllabus, setDefinedSyllabus] =
    useState<AIDefineSyllabusResponse>();
  const [uploadMethod, setUploadMethod] = useState('');
  const [duration, setDuration] = useState('');
  const [context, setContext] = useState('');
  const [publishMethod, setPublishMethod] = useState('public');
  const [accessCode, setAccessCode] = useState('');
  const [analysedMaterial, setAnalysedMaterial] = useState<AnalyzedMaterial>();
  const [plannedCourse, setPlannedCourse] = useState<AIPlanCourseResponse>();
  const [generatedLessons, setGeneratedLessons] = useState<
    AIPlanLessonResponse[]
  >([]);
  const [selectedTopic, setSelectedTopic] = useState<{
    topic: SyllabusTopic;
    index: number;
  }>();
  const [material, setMaterial] = useState<string>('');
  const [img, setImg] = useState('');
  const [tags, setTags] = useState<{ name: string; color: string }[]>([]);

  const [courseNodes, setCourseNodes] = useState<PlanLessonNode[][]>([]);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;
  const nextStep = () => {
    if (step === 2 && uploadMethod === 'selected') {
      setProgressStep(() => Math.min(step + 2.5, stepComponents.length - 1));
    } else {
      setProgressStep(() => Math.min(step + 1, stepComponents.length - 1));
    }

    if (step === 2 && uploadMethod === 'selected') {
      setStep((s) => Math.min(s + 3, stepComponents.length - 1));
    } else {
      setStep((s) => Math.min(s + 1, stepComponents.length - 1));
    }
  };
  const prevStep = () => {
    if (step === 5 && uploadMethod === 'selected') {
      setStep((s) => Math.min(s - 3, stepComponents.length - 1));
      setProgressStep(() => Math.min(step - 2.5, stepComponents.length - 1));
    } else {
      setStep((s) => Math.max(s - 1, 0));
      setProgressStep((p) =>
        Math.max(p - (step === 4 || step === 2 ? 0.5 : 1), 0)
      );
    }
  };

  const stepComponents = [
    <StepDefineSyllabus
      key={'define-syllabus'}
      additionalInformationState={[additionalInfo, setAdditionalInfo]}
      generalsSubject={[generalSubject, setGeneralSubject]}
      definedSyllabusState={[definedSyllabus, setDefinedSyllabus]}
      selectedTopicState={[selectedTopic, setSelectedTopic]}
    />, // 0
    <StepCourseContent
      key={'course-details'}
      classContextState={[context, setContext]}
      selectedTopicState={[selectedTopic, setSelectedTopic]}
      durationState={[duration, setDuration]}
      prerequisitesState={[
        definedSyllabus?.prerequisites ?? [],
        (val: React.SetStateAction<string[]>) => {
          const newVal =
            typeof val === 'function'
              ? val(definedSyllabus?.prerequisites ?? [])
              : val;
          setDefinedSyllabus((prev) => ({
            ...prev!,
            prerequisites: newVal,
          }));
        },
      ]}
      goalsState={[
        definedSyllabus?.goals ?? [],
        (val: React.SetStateAction<string[]>) => {
          const newVal =
            typeof val === 'function' ? val(definedSyllabus?.goals ?? []) : val;
          setDefinedSyllabus((prev) => ({
            ...prev!,
            goals: newVal,
          }));
        },
      ]}
      targetAudienceState={[
        definedSyllabus?.additional_information ?? '',
        (val: React.SetStateAction<string>) =>
          setDefinedSyllabus((prev) => ({
            ...prev!,
            additional_information:
              typeof val === 'function'
                ? val(prev?.additional_information ?? '')
                : val,
          })),
      ]}
      titleState={[
        definedSyllabus?.title ?? '',
        (val: React.SetStateAction<string>) =>
          setDefinedSyllabus((prev) => ({
            ...prev!,
            title: typeof val === 'function' ? val(prev?.title ?? '') : val,
          })),
      ]}
      subjectAreaState={[
        definedSyllabus?.general_subject ?? '',
        (val: React.SetStateAction<string>) =>
          setDefinedSyllabus((prev) => ({
            ...prev!,
            general_subject:
              typeof val === 'function'
                ? val(prev?.general_subject ?? '')
                : val,
          })),
      ]}
      descriptionState={[
        definedSyllabus?.description ?? '',
        (val: React.SetStateAction<string>) =>
          setDefinedSyllabus((prev) => ({
            ...prev!,
            description:
              typeof val === 'function' ? val(prev?.description ?? '') : val,
          })),
      ]}
      imgState={[img, setImg]}
      tagsState={[tags, setTags]}
    />, // 1 (intermedio)

    <StepContentUpload
      key={'content-upload'}
      selection={[uploadMethod, setUploadMethod]}
    />, // 2
    <StepContentForm
      key={'content-form'}
      materialProp={[material, setMaterial]}
      setAnalysedMaterial={setAnalysedMaterial}
      method={uploadMethod}
    />, // 3 (intermedio)
    <StepAIGeneration
      key={'ai-generation'}
      language={definedSyllabus?.language ?? ''}
      material={material}
      context={context ?? ''}
      definedSyllabus={definedSyllabus}
      selectedTopic={selectedTopic?.topic}
      GeneratedLessonsProp={[generatedLessons, setGeneratedLessons]}
      analysedMaterialProp={[analysedMaterial, setAnalysedMaterial]}
      plannedCourseProp={[plannedCourse, setPlannedCourse]}
      title={definedSyllabus?.title ?? ''}
      CoursesNodesProp={[courseNodes, setCourseNodes]}
    />, // 4
    <StepGamification key={'gamification'} />, // 5
    <StepPublishing
      key={'publishing'}
      publishMethod={[publishMethod, setPublishMethod]}
      accessCode={[accessCode, setAccessCode]}
      materialMethod={uploadMethod}
    />, // 6
    <StepComplete
      key={'complete'}
      title={definedSyllabus?.title ?? ''}
      subjectArea={definedSyllabus?.general_subject ?? ''}
      educationLevel={
        definedSyllabus?.educational_level ?? EducationLevel.HighSchool
      }
      language={definedSyllabus?.language ?? ''}
      description={definedSyllabus?.description ?? ''}
      learningObjectives={
        selectedTopic?.topic.learning_objectives ?? ({} as LearningObjectives)
      }
      duration={duration}
      goals={definedSyllabus?.goals ?? []}
      prerequisites={definedSyllabus?.prerequisites ?? []}
      classContext={definedSyllabus?.additional_information ?? ''}
      context={context ?? ''}
      accessCode={accessCode}
      analysedMaterial={analysedMaterial}
      sourceMaterial={material}
      img={img}
      tags={tags}
      generatedLessons={generatedLessons}
      coursesNodes={courseNodes}
    />, // 7
  ];

  function nextDisable(): boolean {
    if (step === stepComponents.length - 1) return true;
    else if ((step === 0 && !definedSyllabus) || !selectedTopic) return true;
    else if (step === 2 && uploadMethod == '') return true;
    else if (step === 3 && !analysedMaterial) return true;
    else if (
      step === 4 &&
      courseNodes.length == 0 &&
      generatedLessons.length == 0
    )
      return true;
    return false;
  }

  return (
    <Flex direction="column" w="100%" h="100%" bg="purple.50" p={6}>
      <Heading as="h2" size="lg" mb={4} textAlign="left">
        Create New Course
      </Heading>
      <Heading as="h3" size="md" mb={4} textAlign="left">
        {' '}
        Manage the details and specifics of your custom course.{' '}
      </Heading>
      <StepProgressBar
        currentStep={progressStep}
        steps={[
          { name: 'Syllabus Definition', icon: HamburgerIcon as IconType },
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
        <Box flex="1" overflowY="auto" mt={4} mb={4}>
          {stepComponents[step]}
        </Box>

        <Flex mt={8} justify="space-between" py={2} hidden={step === 7}>
          <Box flex="1" display="flex" justifyContent="center">
            <Button onClick={() => (step === 0 ? router.back() : prevStep())}>
              {step === 0 ? 'Cancel' : 'Back'}
            </Button>
          </Box>
          <Box flex="1" display="flex" justifyContent="center"></Box>
          <Box flex="1" display="flex" justifyContent="center">
            <Button
              colorScheme="purple"
              onClick={nextStep}
              isDisabled={nextDisable()}
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
