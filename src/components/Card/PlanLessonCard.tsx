import {
  CheckIcon,
  ChevronDownIcon,
  CloseIcon,
  RepeatIcon,
} from '@chakra-ui/icons';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Checkbox,
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SpaceProps,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  LearningOutcome,
  PlanLessonNode,
  QuestionTypeMap,
} from '../../types/polyglotElements';
import InfoButton from '../UtilityComponents/InfoButton';

type LessonCardProps = {
  plannedNode: PlanLessonNode;
  planNode: PlanLessonNode;
  py?: SpaceProps['py'];
  px?: SpaceProps['px'];
  id: number;
  isSelected: boolean;
  setSelectedNode: (id: number) => void;
  updateNodeAt: (id: number, updatedNode: PlanLessonNode) => void;
};

type SpecificData = {
  solutions_number: number;
  distractors_number: number;
  easily_discardable_distractors_number: number;
};

const PlanLessonCard = ({
  plannedNode,
  planNode,
  px,
  py,
  id,
  setSelectedNode,
  isSelected,
  updateNodeAt,
}: LessonCardProps) => {
  const [specificData, setSpecificData] = useState<SpecificData>({
    solutions_number: 1,
    distractors_number: 2,
    easily_discardable_distractors_number: 1,
  });

  useEffect(() => {
    updateNodeAt(id, {
      type: planNode.type,
      topic: planNode.topic,
      details: planNode.details,
      learning_outcome: planNode.learning_outcome,
      duration: planNode.duration,
      data: specificData,
    });
  }, [specificData]);

  return (
    <Box px={px} py={py} paddingTop={'10px'}>
      <Card>
        <CardBody>
          <Box>
            <Text fontSize="sm">
              <strong>Topic:</strong> {plannedNode.topic}
            </Text>
            <Text fontSize="sm">
              <strong>Suggested Type:</strong> {plannedNode.type}
            </Text>
            <Text fontSize="sm">
              <strong>Details:</strong> {plannedNode.details}
            </Text>

            <Text fontSize="md" paddingTop={'5px'}>
              <strong>
                Learning outcome:
                <InfoButton
                  title="Learning Outcome"
                  description="Describe the intended educational goal of the learning path. For example: 'the ability to recall or recognize simple facts and definitions.'"
                  placement="right"
                />
              </strong>
            </Text>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                textAlign="left"
                variant="outline"
                overflow="hidden"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                width="100%"
              >
                {planNode.learning_outcome || 'Select objective'}
              </MenuButton>

              <MenuList maxH="200px" overflowY="auto" minW="unset" padding={0}>
                {Object.values(LearningOutcome).map((outcome) => (
                  <MenuItem
                    width={'3xl'}
                    key={outcome}
                    onClick={() =>
                      updateNodeAt(id, {
                        ...planNode,
                        learning_outcome: outcome,
                      })
                    }
                    whiteSpace="normal"
                    sx={{
                      overflowWrap: 'break-word',
                      wordBreak: 'break-word',
                    }}
                    _hover={{
                      backgroundColor: 'gray.100',
                    }}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      whiteSpace="normal"
                      wordBreak="break-word"
                    >
                      <Box>
                        {plannedNode?.learning_outcome === outcome ? '*' : ''}
                        {outcome}
                        {plannedNode?.learning_outcome === outcome ? '*' : ''}
                      </Box>
                      {planNode.learning_outcome === outcome && (
                        <Icon as={CheckIcon} color="green.500" boxSize={4} />
                      )}
                    </Box>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            <Text fontSize="md" paddingTop={'5px'}>
              <strong>
                Learning Task:
                <InfoButton
                  title="Learning Task Type"
                  description="Select the kind of tasks learners should perform from the list provided. Please note that the system may suggest activities not yet included in the list, as we are continuously expanding the available options."
                  placement="right"
                />
              </strong>
            </Text>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                textAlign="left"
                variant="outline"
                overflow="hidden"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                width="100%"
                border="1px solid"
                borderColor="gray.300"
              >
                {planNode.type || 'Select type'}
              </MenuButton>

              <MenuList
                width="100%"
                maxH="200px"
                overflowY="auto"
                minW="unset"
                padding={0}
              >
                {QuestionTypeMap.filter((qType) => qType.integrated).map(
                  (qType) => (
                    <MenuItem
                      key={qType.key}
                      onClick={() =>
                        updateNodeAt(id, {
                          ...planNode,
                          type: qType.key,
                        })
                      }
                      whiteSpace="normal"
                      sx={{
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word',
                        width: '100%',
                      }}
                      _hover={{
                        backgroundColor: 'gray.100',
                      }}
                    >
                      <Box
                        w="100%"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        whiteSpace="normal"
                        wordBreak="break-word"
                      >
                        <Box>
                          {plannedNode?.type === qType.key ? '*' : ''}
                          {qType.key}
                          {plannedNode?.type === qType.key ? '*' : ''}
                        </Box>
                        {planNode.type === qType.key && (
                          <Icon as={CheckIcon} color="green.500" boxSize={4} />
                        )}
                      </Box>
                    </MenuItem>
                  )
                )}
              </MenuList>
            </Menu>

            {/*
            <Text fontSize="sm">
              <strong>Duration:</strong> {planNode.duration} min
            </Text>*/}
            <Flex
              paddingTop={'5px'}
              alignItems={'center'}
              hidden={
                planNode.type != 'true or false' &&
                planNode.type != 'multiple choice'
              }
            >
              <Text textStyle="sm">
                N° Correct
                {planNode.type == 'multiple choice'
                  ? ' answers'
                  : ' statements'}
                :
              </Text>
              <NumberInput
                float="right"
                value={specificData.solutions_number}
                min={1}
                width="80px"
                title="soon: multiple correct answer"
                onChange={(valueString, valueNumber) => {
                  if (!isNaN(valueNumber) && valueNumber >= 1) {
                    setSpecificData((prev) => ({
                      ...prev,
                      solutions_number: valueNumber,
                    }));
                  }
                }}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Text textStyle="sm">
                N° Wrong
                {planNode.type == 'multiple choice'
                  ? ' answers'
                  : ' statements'}
                :
              </Text>
              <NumberInput
                value={specificData.distractors_number}
                min={0}
                max={6}
                width="80px"
                onChange={(valueString, valueNumber) => {
                  if (
                    !isNaN(valueNumber) &&
                    valueNumber >= 0 &&
                    valueNumber <= 6
                  ) {
                    setSpecificData((prev) => ({
                      ...prev,
                      distractors_number: valueNumber,
                    }));
                  }
                }}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Text textStyle="sm">
                Easy wrong
                {planNode.type == 'multiple choice'
                  ? ' answers'
                  : ' statements'}
                :
              </Text>
              <NumberInput
                value={specificData.easily_discardable_distractors_number}
                min={0}
                max={6}
                width="80px"
                onChange={(valueString, valueNumber) => {
                  if (
                    !isNaN(valueNumber) &&
                    valueNumber >= 0 &&
                    valueNumber <= 6
                  ) {
                    setSpecificData((prev) => ({
                      ...prev,
                      easily_discardable_distractors_number: valueNumber,
                    }));
                  }
                }}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Flex>
          </Box>
        </CardBody>
        <CardFooter justifyContent="center" alignItems="center" pt={4} gap={6}>
          <Flex alignItems="center" gap={2}>
            Reset this activity
            <IconButton
              size="sm"
              icon={<RepeatIcon />}
              aria-label="Reset"
              title="Reset this node"
              onClick={() => {
                updateNodeAt(id, {
                  type: plannedNode.type,
                  topic: plannedNode.topic,
                  details: plannedNode.details,
                  learning_outcome: plannedNode.learning_outcome,
                  duration: plannedNode.duration,
                  data: plannedNode.data,
                });
              }}
              backgroundColor="blue.500"
              color="white"
              _hover={{ backgroundColor: 'blue.600' }}
              borderRadius="md"
              boxShadow="sm"
            />
          </Flex>
          <Flex alignItems="center" gap={2}>
            <Box fontWeight="medium" userSelect="none">
              Select this activity
            </Box>
            <Checkbox
              isChecked={isSelected}
              onChange={() => setSelectedNode(id)}
              colorScheme="green"
              size="md"
              iconColor="white"
              icon={
                isSelected ? (
                  <CheckIcon boxSize={3} />
                ) : (
                  <CloseIcon boxSize={3} />
                )
              }
              borderRadius="md"
              sx={{
                '.chakra-checkbox__control': {
                  order: 2,
                  marginLeft: 2,
                },
                '.chakra-checkbox__label': {
                  order: 1,
                },
              }}
            />
          </Flex>
        </CardFooter>
      </Card>
    </Box>
  );
};

export default PlanLessonCard;
