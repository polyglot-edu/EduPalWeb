import {
  Box,
  Button,
  Flex,
  FormLabel,
  SimpleGrid,
  Text,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { API } from '../../../data/api';
import {
  AIDefineSyllabusResponse,
  EducationLevel,
  SyllabusTopic,
} from '../../../types/polyglotElements';
import ArrayField from '../../Forms/Fields/ArrayField';
import EnumField from '../../Forms/Fields/EnumField';
import InputTextField from '../../Forms/Fields/InputTextField';
import MarkDownField from '../../Forms/Fields/MarkDownField';
import SyllabusTopicsField from '../../Forms/Fields/SyllabusTopicsField';
import StepHeading from '../../UtilityComponents/StepHeading';

type StepCourseDetailsProps = {
  generalsSubject: [string, React.Dispatch<React.SetStateAction<string>>];
  additionalInformationState: [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ];
  definedSyllabusState: [
    AIDefineSyllabusResponse | undefined,
    React.Dispatch<React.SetStateAction<AIDefineSyllabusResponse | undefined>>
  ];
  selectedTopicState: [
    { topic: SyllabusTopic; index: number } | undefined,
    React.Dispatch<
      React.SetStateAction<{ topic: SyllabusTopic; index: number } | undefined>
    >
  ];
};

const StepDefineSyllabus = ({
  generalsSubject,
  additionalInformationState,
  definedSyllabusState,
  selectedTopicState,
}: StepCourseDetailsProps) => {
  const toast = useToast();
  const [generalSubject, setGeneralSubject] = generalsSubject;
  const [selectedTopic, setSelectedTopic] = selectedTopicState;
  const [eduLevel, setEduLevel] = useState<EducationLevel>(
    EducationLevel.HighSchool
  );
  const [language, setLanguage] = useState('english');
  const [additionalInformation, setAdditionalInformation] =
    additionalInformationState;

  const [isLoadingSyllabus, setIsLoadingSyllabus] = useState(false);

  const [definedSyllabus, setDefinedSyllabus] = definedSyllabusState;

  const educationOptions = Object.entries(EducationLevel).map(
    ([key, value]) => ({
      label: key.replace(/([A-Z])/g, ' $1').trim(),
      value,
    })
  );

  const handleDefineSyllabus = () => {
    if (!generalSubject || generalSubject == '') {
      toast({
        title: 'General subject is mandatory!',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left',
      });
      return;
    }
    setIsLoadingSyllabus(true);
    API.defineSyllabus({
      general_subject: generalSubject,
      additional_information: additionalInformation,
      education_level: eduLevel || 'high school',
      language: language || 'english',
    })
      .then((res) => {
        toast({
          title:
            'Syllabus generated successfully! Feel free to customize it as needed.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'bottom-left',
        });
        setDefinedSyllabus(res.data as AIDefineSyllabusResponse);
        console.log(res.data);
      })
      .catch((err) => {
        toast({
          title: 'Something went wrong try against later!',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'bottom-left',
        });
        console.log(err);
      })
      .finally(() => setIsLoadingSyllabus(false));
  };

  return (
    <Box>
      <Box hidden={definedSyllabus != undefined}>
        <StepHeading
          title="Define Syllabus"
          subtitle="Provide basic information about your course."
        />
        <InputTextField
          label="General Subject"
          placeholder="Enter course subject."
          value={generalSubject}
          setValue={setGeneralSubject}
          infoTitle="Title"
          infoDescription="Enter the title you want to give to your course."
          infoPlacement="right"
        />
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <EnumField
            label="Educational Level"
            value={eduLevel}
            setValue={(value: string) => setEduLevel(value as EducationLevel)}
            options={educationOptions}
            infoTitle="Educational Level"
            infoDescription="Specify the academic level of the target audience."
            infoPlacement="right"
          />

          <EnumField
            label="Language"
            value={language}
            setValue={setLanguage}
            options={[
              { label: 'English', value: 'english' },
              { label: 'Italiano', value: 'italian' },
              { label: 'Français', value: 'french' },
              { label: 'Español', value: 'spanish' },
              { label: 'Deutsch', value: 'german' },
            ]}
            infoTitle="Language"
            infoDescription="Choose the language of the learning materials."
            infoPlacement="right"
          />
        </SimpleGrid>

        <Box width="100%" mt={6}>
          <MarkDownField
            label="Additional Information"
            value={additionalInformation}
            setValue={setAdditionalInformation}
            infoTitle="Additional Info"
            infoDescription="Provide more details about the course you want to create to help centralize and define its syllabus."
            infoPlacement="right"
          />
        </Box>
        <Box mt={6}>
          <Button
            colorScheme="teal"
            onClick={handleDefineSyllabus}
            isLoading={isLoadingSyllabus}
            isDisabled={definedSyllabus != undefined}
          >
            Define Syllabus
          </Button>
        </Box>
      </Box>

      {definedSyllabus && (
        <Box>
          <StepHeading
            title="Edit Generated Syllabus"
            subtitle="You can customize the generated content below."
          />

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
            <InputTextField
              label="Title"
              value={definedSyllabus.title}
              setValue={(val) =>
                setDefinedSyllabus({ ...definedSyllabus, title: val })
              }
            />
            <InputTextField
              label="General Subject"
              value={definedSyllabus.general_subject}
              setValue={(val) =>
                setDefinedSyllabus({ ...definedSyllabus, general_subject: val })
              }
            />
            <EnumField
              label="Education Level"
              value={definedSyllabus.educational_level}
              setValue={(val) =>
                setDefinedSyllabus({
                  ...definedSyllabus,
                  educational_level: val as EducationLevel,
                })
              }
              options={educationOptions}
            />
            <EnumField
              label="Language"
              value={definedSyllabus.language}
              setValue={(val) =>
                setDefinedSyllabus({ ...definedSyllabus, language: val })
              }
              options={[
                { label: 'English', value: 'english' },
                { label: 'Italiano', value: 'italian' },
                { label: 'Français', value: 'french' },
                { label: 'Español', value: 'spanish' },
                { label: 'Deutsch', value: 'german' },
              ]}
            />
          </SimpleGrid>

          <InputTextField
            label="Additional Information"
            value={definedSyllabus.additional_information}
            setValue={(val) =>
              setDefinedSyllabus({
                ...definedSyllabus,
                additional_information: val,
              })
            }
          />
          <InputTextField
            label="Description"
            value={definedSyllabus.description}
            setValue={(val) =>
              setDefinedSyllabus({ ...definedSyllabus, description: val })
            }
          />
          <FormLabel>
            Choose the specific topic you want to explore. You can, also, edit
            it or create a new one
          </FormLabel>
          <SyllabusTopicsField
            topics={definedSyllabus.topics}
            updateTopics={(val) =>
              setDefinedSyllabus({ ...definedSyllabus, topics: val })
            }
            selectedTopicState={[selectedTopic, setSelectedTopic]}
          />
          <Flex
            gap={6}
            direction={'row'}
            wrap={{ base: 'wrap', md: 'nowrap' }}
            justify="space-between"
          >
            <Box w={{ base: '100%', md: '48%' }}>
              <ArrayField
                label="Goals"
                value={definedSyllabus.goals}
                setValue={(val) =>
                  setDefinedSyllabus({
                    ...definedSyllabus,
                    goals: val,
                  })
                }
              />
            </Box>
            <Box w={{ base: '100%', md: '48%' }}>
              <ArrayField
                label="Prerequisites"
                value={definedSyllabus.prerequisites}
                setValue={(val) =>
                  setDefinedSyllabus({
                    ...definedSyllabus,
                    prerequisites: val,
                  })
                }
              />
            </Box>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default StepDefineSyllabus;
