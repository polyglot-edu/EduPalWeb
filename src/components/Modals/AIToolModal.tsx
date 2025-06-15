import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { API } from '../../data/api';
import {
  AIExerciseGenerated,
  AIMaterialGenerated,
  EducationLevel,
  LearningOutcome,
  QuestionTypeMap,
  Topic,
} from '../../types/polyglotElements';
import InfoButton from '../UtilityComponents/InfoButton';

export type ModaTemplateProps = {
  isOpen: boolean;
  onClose: () => void;
  exType: string;
  action?: (i: boolean) => void;
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shuffleArray<T>(array: T[]) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const AIToolModal = ({
  isOpen,
  onClose,
  exType,
  action,
}: ModaTemplateProps) => {
  const [generatingLoading, setGeneratingLoading] = useState(false);
  const [sourceMaterial, setSourceMaterial] = useState('');
  const [titleGen, setTitle] = useState('');
  const [macroSubjectGen, setMacroSubject] = useState('');
  const [learningOutcome, setLearningOutcome] = useState<LearningOutcome>();
  const [choosingLearningOutcome, setChoosingLearningOutcome] =
    useState<LearningOutcome>();
  const [language, setLanguage] = useState('');
  const [duration, setDuration] = useState(0);
  const [eduLevel, setEduLevel] = useState<EducationLevel>();
  const [topicGen, setTopicGen] = useState<Topic[]>([
    { topic: 'prova', explanation: '' },
  ]);

  const [topicIndex, setTopicIndex] = useState(0);
  let exerciseTypeKey = QuestionTypeMap.find(
    (elem) => elem.nodeType == exType
  )?.key;
  if (!exerciseTypeKey) exerciseTypeKey = 'ReadMaterial';
  const [ca_n, setCA_N] = useState(1);
  const [da_n, setDA_N] = useState(1);
  const [eda_n, setEDA_N] = useState(1);
  const [screen1, setScreen1] = useState(true);
  const [screen2, setScreen2] = useState(false);
  const [screen3, setScreen3] = useState(false);
  const toast = useToast();
  const { setValue } = useFormContext();
  const word = exType == 'TrueFalseNode' ? 'Statements' : 'Answers';
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (action) action(false);
        onClose();
      }}
      size={'2xl'}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Do you need help to generate your learning activity?
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody hidden={!screen1}>
          <Text>
            STEP 1: Submit your material in this box to use our analyser.
          </Text>
          <FormLabel mb={2} fontWeight={'bold'}>
            Your material:
            <InfoButton
              title="Material to Analyze"
              description="Provide the source content you want the learning path to be built upon. This could be a text, article, lesson plan, or any other educational material."
              placement="right"
            />
          </FormLabel>
          <Textarea
            maxHeight={'200px'}
            placeholder="Insert your material here, you can put your plain text or the link (attention some websites are crypted, sometimes the tool cannot access the actual text)..."
            value={sourceMaterial}
            overflowY={'auto'}
            onChange={(e) => {
              setGeneratingLoading(false);
              setSourceMaterial(e.currentTarget.value);
            }}
          />
          <Button
            marginTop={'15px'}
            onClick={async () => {
              try {
                setGeneratingLoading(true);
                if (!sourceMaterial) {
                  //
                  throw ': no text given';
                }
                const response: AxiosResponse = await API.analyseMaterial({
                  text: sourceMaterial,
                });
                console.log(response);
                setTitle(response.data.title);
                setLanguage(response.data.language);
                setMacroSubject(response.data.macro_subject);
                setLearningOutcome(
                  response.data.learning_outcome as LearningOutcome
                );
                setChoosingLearningOutcome(
                  response.data.learning_outcome as LearningOutcome
                );
                setEduLevel(response.data.education_level as EducationLevel);
                setLanguage(response.data.language);
                setDuration(response.data.estimated_duration);
                setTopicGen(response.data.topics);
                setScreen1(false);
                setScreen2(true);
              } catch (error: any) {
                console.log(error);
                if ((error as Error).name === 'SyntaxError') {
                  toast({
                    title: 'Invalid syntax',
                    description: (error as Error).toString(),
                    status: 'error',
                    duration: 3000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                  return;
                }
                if (error.response)
                  if (error.response.status) {
                    if (error.response.status == 500)
                      toast({
                        title: 'Material Error',
                        description:
                          'We are sorry, the resource is not analyzable, try with different material. Do not provide pages that are too long (e.g. Wikipedia pages) or too short, as they can not be analyzed correctly',
                        status: 'error',
                        duration: 5000,
                        position: 'bottom-left',
                        isClosable: true,
                      });
                    else if (error.response.status != 200)
                      toast({
                        title: 'AI API Error',
                        description:
                          'Internal Server error, try again. If the error persists try change material.',
                        status: 'error',
                        duration: 5000,
                        position: 'bottom-left',
                        isClosable: true,
                      });
                  } else
                    toast({
                      title: 'Generic Error',
                      description: 'Try later ' + (error as Error),
                      status: 'error',
                      duration: 5000,
                      position: 'bottom-left',
                      isClosable: true,
                    });
              } finally {
                setGeneratingLoading(false);
              }
            }}
            isLoading={generatingLoading}
          >
            Analyse Material
          </Button>
        </ModalBody>
        <ModalBody hidden={!screen2}>
          <Text>STEP 2: Choose the Level and Topic you want to use.</Text>
          <FormControl label="Level">
            <FormLabel
              mb={2}
              fontWeight={'bold'}
              paddingTop={'5px'}
              paddingBottom={'-5px'}
            >
              Educational Level:
              <InfoButton
                title="Educational Level"
                description="Specify the academic level of the target audience, such as elementary school, high school, or college, to tailor the learning path appropriately."
                placement="right"
              />
            </FormLabel>
            <Select
              borderColor={'grey'}
              onChange={(event) =>
                setEduLevel(event.currentTarget.value as EducationLevel)
              }
            >
              {Object.values(EducationLevel).map((level) => (
                <option key={level} value={level} selected={eduLevel === level}>
                  {level}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl label="Topic" paddingTop={'5px'}>
            <FormLabel
              mb={2}
              fontWeight={'bold'}
              paddingTop={'5px'}
              paddingBottom={'-5px'}
            >
              Topic:
            </FormLabel>
            <Select
              borderColor={'grey'}
              onChange={(event) =>
                setTopicIndex(Number(event.currentTarget.value))
              }
            >
              {
                <>
                  {topicGen.map((p, id) => {
                    return (
                      <option key={id} value={id}>
                        <Box width={'100px'}>{p.topic}</Box>
                      </option>
                    );
                  })}
                </>
              }
            </Select>
          </FormControl>
          <FormLabel
            mb={2}
            fontWeight={'bold'}
            paddingTop={'5px'}
            paddingBottom={'-5px'}
          >
            Topic Description:
          </FormLabel>
          <Text>{topicGen[topicIndex].explanation}</Text>
          <Button
            marginTop={'15px'}
            onClick={async () => {
              try {
                if (!topicGen) throw ': No topic generated';
                setScreen2(false);
                setScreen3(true);
              } catch (error: any) {
                if ((error as Error).name === 'SyntaxError') {
                  toast({
                    title: 'Invalid syntax',
                    description: (error as Error).toString(),
                    status: 'error',
                    duration: 3000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                  return;
                }
                if (error.response.status)
                  toast({
                    title: 'LearningObjective Error',
                    description:
                      'We are sorry, server was not able to generate the learning objective. Please, try again, if the error persists try a different topic',
                    status: 'error',
                    duration: 5000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                else
                  toast({
                    title: 'Generic Error',
                    description: 'Try later ' + (error as Error),
                    status: 'error',
                    duration: 5000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
              } finally {
                setGeneratingLoading(false);
              }
            }}
            isLoading={generatingLoading}
          >
            Select Educational Level and Topic
          </Button>
        </ModalBody>
        <ModalBody hidden={!screen3}>
          <Text>STEP 3: Define the specifics for the activity.</Text>
          <FormLabel paddingTop={'5px'}>
            Learning Objective
            <InfoButton
              title="Learning Outcome"
              description="Describe the intended educational goal of the learning path. For example: 'the ability to recall or recognize simple facts and definitions.'"
              placement="right"
            />
          </FormLabel>
          <FormControl label="Learning Outcome">
            <Select
              value={choosingLearningOutcome}
              borderColor="grey"
              onChange={(event) =>
                setChoosingLearningOutcome(
                  event.currentTarget.value as LearningOutcome
                )
              }
            >
              {Object.entries(LearningOutcome).map(([key, value]) => (
                <option key={key} value={value}>
                  {learningOutcome === value ? '*' : ''}
                  {value}
                  {learningOutcome === value ? '*' : ''}
                </option>
              ))}
            </Select>
          </FormControl>
          {/*<Flex hidden={exerciseType != 8}></Flex>*/}
          <Flex
            paddingTop={'5px'}
            alignItems={'center'}
            hidden={
              exerciseTypeKey != 'true or false' &&
              exerciseTypeKey != 'multiple choice'
            }
          >
            N° Correct {word}:
            <NumberInput
              float={'right'}
              defaultValue={ca_n}
              min={1}
              width={'80px'}
              title="soon: multiple correct answer"
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper onClick={() => setCA_N(ca_n + 1)} />
                <NumberDecrementStepper onClick={() => setCA_N(ca_n - 1)} />
              </NumberInputStepper>
            </NumberInput>
            N° Wrong {word}:
            <NumberInput defaultValue={da_n} min={0} max={6} width={'80px'}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper onClick={() => setDA_N(da_n + 1)} />
                <NumberDecrementStepper onClick={() => setDA_N(da_n - 1)} />
              </NumberInputStepper>
            </NumberInput>
            N° Easy Discardable {word}:
            <NumberInput defaultValue={eda_n} min={0} max={6} width={'80px'}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper onClick={() => setEDA_N(eda_n + 1)} />
                <NumberDecrementStepper onClick={() => setEDA_N(eda_n - 1)} />
              </NumberInputStepper>
            </NumberInput>
          </Flex>
          <Button
            hidden={exerciseTypeKey == 'ReadMaterial'}
            marginTop={'15px'}
            onClick={async () => {
              try {
                setGeneratingLoading(true);
                setLearningOutcome(choosingLearningOutcome);
                if (!topicGen) throw ': no topic generated';
                if (eduLevel == undefined || learningOutcome == undefined)
                  throw ': error in eduLevel and learningOutcome';
                if (exerciseTypeKey != 'ReadMaterialNode') {
                  const response: AxiosResponse = await API.generateNewExercise(
                    {
                      macro_subject: macroSubjectGen,
                      topic: topicGen[topicIndex].topic,
                      education_level: eduLevel,
                      learning_outcome: learningOutcome,
                      material: sourceMaterial,
                      solutions_number: ca_n,
                      distractors_number: da_n,
                      easily_discardable_distractors_number: eda_n,
                      type: exerciseTypeKey as string,
                      language: language,
                      model: 'Gemini',
                    }
                  );
                  console.log(response.data);
                  const dataGen: AIExerciseGenerated = response.data;
                  let adaptedData;
                  switch (exerciseTypeKey) {
                    case 'open question':
                      adaptedData = {
                        question: dataGen.assignment,
                        material: dataGen.material,
                        aiQuestion: false,
                        possibleAnswer: dataGen.solutions[0],
                      };
                      break;
                    case 'short answer question':
                      adaptedData = {
                        question: dataGen.assignment + ' ' + dataGen.plus,
                        correctAnswers: dataGen.solutions,
                      };
                      break;
                    case 'multiple choice':
                      const answers = [
                        ...dataGen.solutions.slice(0, ca_n),
                        ...dataGen.distractors.slice(0, da_n),
                        ...dataGen.easily_discardable_distractors.slice(
                          0,
                          eda_n
                        ),
                      ].filter((statement) => statement !== 'empty');
                      const shuffleAnswers = shuffleArray(answers);

                      const isAnswerCorrect = new Array(
                        shuffleAnswers.length
                      ).fill(false);
                      shuffleAnswers.forEach((value, index) => {
                        if (dataGen.solutions.includes(value))
                          isAnswerCorrect[index] = true;
                      });
                      adaptedData = {
                        question: dataGen.assignment,
                        choices: shuffleAnswers,
                        isChoiceCorrect: isAnswerCorrect,
                      };
                      if (
                        !dataGen.distractors[0] &&
                        !dataGen.easily_discardable_distractors[0]
                      ) {
                        toast({
                          title: 'Generating Error',
                          description:
                            'The AI was not able to generate a complete multichoice exercise, we suggest to generate an Open Question or a Close Ended Question for this topic',
                          status: 'warning',
                          duration: 4000,
                          position: 'bottom-left',
                          isClosable: false,
                        });
                        await delay(3000);
                      }
                      break;
                    case 'true or false':
                      console.log('creating true or false');
                      const solutions = dataGen.solutions.map((s) => {
                        const splitIndex = s.indexOf('. ');
                        return splitIndex !== -1 ? s.slice(splitIndex + 2) : s;
                      });
                      const statements = [
                        ...solutions.slice(0, ca_n),
                        ...dataGen.distractors.slice(0, da_n),
                        ...dataGen.easily_discardable_distractors.slice(
                          0,
                          eda_n
                        ),
                      ].filter((statement) => statement !== 'empty');
                      const shuffleTFAnswers = shuffleArray(statements);
                      const isStatementCorrect = new Array(
                        shuffleTFAnswers.length
                      ).fill(false);
                      shuffleTFAnswers.map((value, index) => {
                        console.log(index);
                        if (dataGen.solutions.includes(value))
                          isStatementCorrect[index] = true;
                      });
                      adaptedData = {
                        instructions: 'Argument: ' + dataGen.assignment,
                        questions: shuffleTFAnswers,
                        isQuestionCorrect: isStatementCorrect,
                      };
                      if (
                        !dataGen.distractors[0] &&
                        !dataGen.easily_discardable_distractors[0]
                      ) {
                        toast({
                          title: 'Generating Error',
                          description:
                            'The AI was not able to generate a complete true or false exercise, we suggest to generate an Open Question or a Close Ended Question for this topic',
                          status: 'warning',
                          duration: 4000,
                          position: 'bottom-left',
                          isClosable: false,
                        });
                        await delay(3000);
                      }
                      break;
                    default:
                      console.log('error in exerciseType');
                      throw ': generated type error';
                  }
                  console.log(adaptedData);
                  setValue('data', adaptedData);
                  setValue('title', titleGen);
                }
                setScreen1(true);
                setScreen3(false);
                if (action) action(false);
                onClose();
              } catch (error: any) {
                if ((error as Error).name === 'SyntaxError') {
                  toast({
                    title: 'Invalid syntax',
                    description: (error as Error).toString(),
                    status: 'error',
                    duration: 3000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                  return;
                }
                if (error.response.status)
                  toast({
                    title: 'Exercise Error',
                    description:
                      'We are sorry, server was not able to generate the exercise. Please, try again, if the error persists, you should restart.',
                    status: 'error',
                    duration: 5000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                else
                  toast({
                    title: 'Generic Error',
                    description: 'Try later ' + (error as Error),
                    status: 'error',
                    duration: 5000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
              } finally {
                setGeneratingLoading(false);
              }
            }}
            isLoading={generatingLoading}
          >
            Generate Learning Activity
          </Button>
          <Button
            hidden={exerciseTypeKey != 'ReadMaterial'}
            marginTop={'15px'}
            onClick={async () => {
              try {
                if (exerciseTypeKey != 'ReadMaterial') return;
                if (eduLevel == undefined || learningOutcome == undefined)
                  throw ': error in eduLevel and learningOutcome';
                setGeneratingLoading(true);
                if (!topicGen) throw ': no topic generated';
                const response: AxiosResponse = await API.generateMaterial({
                  title: titleGen,
                  macro_subject: macroSubjectGen,
                  topics: [
                    {
                      title: titleGen,
                      learning_outcome: learningOutcome,
                      topics: topicGen,
                    },
                  ],
                  education_level: eduLevel,
                  learning_outcome: learningOutcome,
                  duration: duration,
                  language: language,
                  model: 'Gemini',
                });
                setScreen1(true);
                setScreen3(false);
                console.log(response.data);
                const dataGen: AIMaterialGenerated = response.data;
                let adaptedData;
                switch (exerciseTypeKey) {
                  case 'ReadMaterial':
                    console.log('creating readMaterial');
                    adaptedData = {
                      text: dataGen.material,
                      link: '',
                    };
                    break;
                  default:
                    console.log('error in exerciseType');
                    throw ': generated type error';
                }
                console.log(adaptedData);
                setValue('data', adaptedData);
                setValue('title', titleGen);
                if (action) action(false);
                onClose();
              } catch (error: any) {
                if ((error as Error).name === 'SyntaxError') {
                  toast({
                    title: 'Invalid syntax',
                    description: (error as Error).toString(),
                    status: 'error',
                    duration: 3000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                  return;
                }
                if (error.response.status)
                  toast({
                    title: 'Generation Error',
                    description:
                      'We are sorry, server was not able to generate the material. Please, try again, if the error persists, you should restart.',
                    status: 'error',
                    duration: 5000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                else
                  toast({
                    title: 'Generic Error',
                    description: 'Try later ' + (error as Error),
                    status: 'error',
                    duration: 5000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
              } finally {
                setGeneratingLoading(false);
              }
            }}
            isLoading={generatingLoading}
          >
            Generate Material
          </Button>
        </ModalBody>
        <Button
          onClick={() => {
            setScreen1(true);
            setScreen2(false);
            setScreen3(false);
            setSourceMaterial('');
          }}
          width={'80px'}
          bottom={'12'}
          alignSelf={'center'}
        >
          Restart
        </Button>
      </ModalContent>
    </Modal>
  );
};

export default AIToolModal;
