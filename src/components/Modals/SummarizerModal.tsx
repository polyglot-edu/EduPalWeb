import {
  Button,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { API } from '../../data/api';
import {
  EducationLevel,
  LearningOutcome,
  SummarizeStyle,
} from '../../types/polyglotElements';
import InfoButton from '../UtilityComponents/InfoButton';

export type ModaTemplateProps = {
  isOpen: boolean;
  onClose: () => void;
};
let generateButton = false;

const SummarizerModal = ({ isOpen, onClose }: ModaTemplateProps) => {
  const [generatingLoading, setGeneratingLoading] = useState(false);
  const [sourceMaterial, setSourceMaterial] = useState('');
  const [generatedMaterial, setGeneratedMaterial] = useState('');
  const [learningOutcome, setLearningOutcome] = useState<LearningOutcome>(
    LearningOutcome.ApplyKnowledge
  );
  const [summarizeStyle, setSummarizeStyle] = useState<SummarizeStyle>(
    SummarizeStyle.Abstractive
  );
  const [eduLevel, setEduLevel] = useState<EducationLevel>(
    EducationLevel.College
  );
  const [noW, setNoW] = useState('');
  const toast = useToast();
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setSourceMaterial('');
        setGeneratingLoading(false);
        onClose();
      }}
      size={'2xl'}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Do you need help to summarize your material?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Submit your material in this box to use our summirizer.
            <InfoButton
              title="Material to Analyze"
              description="Provide the source content you want the learning path to be built upon. This could be a text, article, lesson plan, or any other educational material."
              placement="right"
            />
          </Text>
          <Button
            marginBottom={'5px'}
            marginTop={'5px'}
            onClick={async () => {
              try {
                console.log('testing');
                if (generateButton) {
                  toast({
                    title: 'Invalid syntax',
                    description:
                      'You have already generated a summary with this setup, please change the source material or the number of words',
                    status: 'error',
                    duration: 5000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                  return;
                }
                setGeneratingLoading(true);
                if (!sourceMaterial) {
                  setGeneratedMaterial('No text given');
                  //
                  throw ': no text given';
                }
                if (!noW) setNoW('200');
                if (!summarizeStyle || !eduLevel || !learningOutcome) return;
                const response: AxiosResponse = await API.summarize({
                  text: sourceMaterial,
                  model: 'Gemini',
                  style: summarizeStyle,
                  education_level: eduLevel,
                  learning_outcome: learningOutcome,
                });
                setGeneratedMaterial(response.data.summary);
                setGeneratingLoading(false);
              } catch (error: any) {
                setGeneratingLoading(false);
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
                      'We are sorry, server was not able to generate the material, please, try with different material. Do not provide pages that are too long (e.g. Wikipedia pages) or too short, as they can not be analyzed correctly',
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
              }
            }}
            isLoading={generatingLoading}
          >
            Generate Material
          </Button>
          <FormLabel
            mb={2}
            fontWeight={'bold'}
            title="How many words do you need?"
          >
            Number of words:&nbsp;
            <Input
              maxWidth={'80px'}
              value={noW}
              onChange={(e) => {
                generateButton = false;
                setNoW(e.currentTarget.value);
              }}
            />
          </FormLabel>
          <FormLabel mb={2} fontWeight={'bold'}>
            Summarize style:
          </FormLabel>
          <Select
            paddingBottom={'5px'}
            borderColor="grey"
            onChange={(event) =>
              setSummarizeStyle(event.currentTarget.value as SummarizeStyle)
            }
          >
            {Object.values(SummarizeStyle).map((style) => (
              <option
                key={style}
                value={style}
                selected={summarizeStyle === style}
              >
                {style}
              </option>
            ))}
          </Select>
          <FormLabel mb={2} fontWeight={'bold'}>
            Educational Level:
            <InfoButton
              title="Educational Level"
              description="Specify the academic level of the target audience, such as elementary school, high school, or college, to tailor the learning path appropriately."
              placement="right"
            />
          </FormLabel>
          <Select
            paddingBottom={'5px'}
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
          <FormLabel mb={2} fontWeight={'bold'}>
            Learning outcome:
            <InfoButton
              title="Learning Outcome"
              description="Describe the intended educational goal of the learning path. For example: 'the ability to recall or recognize simple facts and definitions.'"
              placement="right"
            />
          </FormLabel>
          <Select
            paddingBottom={'5px'}
            borderColor="grey"
            onChange={(event) =>
              setLearningOutcome(event.currentTarget.value as LearningOutcome)
            }
          >
            {Object.values(LearningOutcome).map((outcome) => (
              <option
                key={outcome}
                value={outcome}
                selected={learningOutcome === outcome}
              >
                {outcome}
              </option>
            ))}
          </Select>
          <FormLabel mb={2} fontWeight={'bold'}>
            Your material:
          </FormLabel>
          <Textarea
            maxHeight={'200px'}
            placeholder="Insert your material here..."
            value={sourceMaterial}
            overflowY={'auto'}
            onChange={(e) => {
              generateButton = false;
              setSourceMaterial(e.currentTarget.value);
            }}
          />
          <FormLabel mb={2} fontWeight={'bold'} paddingTop={'5px'}>
            Generated Material:
          </FormLabel>
          <Textarea
            placeholder="The generated Material will be insert here"
            maxHeight={'200px'}
            value={generatedMaterial}
            onChange={(e) => setGeneratedMaterial(e.currentTarget.value)}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SummarizerModal;
