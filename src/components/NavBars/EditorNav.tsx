import {
  ArrowBackIcon,
  ArrowForwardIcon,
  CheckIcon,
  CloseIcon,
  CopyIcon,
  EditIcon,
  ExternalLinkIcon,
  ViewIcon,
} from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Image,
  Spacer,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import Router from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import brandLogo from '../../public/solo_logo.png';
import useStore from '../../store';
import { useHasHydrated } from '../../utils/utils';
import Nav from '../Layout/NavBar';
import EditFlowModal from '../Modals/EditFlowModal';
import ExportJsonModal from '../Modals/ExportJsonModal';
import SaveFlowModal from '../Modals/SaveFlowModal';
import SummarizerModal from '../Modals/SummarizerModal';
type EditorNavProps = {
  saveFunc: () => Promise<void>;
};

export default function EditorNav({ saveFunc }: EditorNavProps) {
  const hydrated = useHasHydrated();
  const [
    updateFlowInfo,
    checkSave,
    checkForwardAction,
    checkBackAction,
    flow,
    backAction,
    forwardAction,
  ] = useStore((state) => [
    state.updateFlowInfo,
    state.checkSave(),
    state.checkForwardAction(),
    state.checkBackAction(),
    state.getFlow(),
    state.backAction,
    state.forwardAction,
  ]);

  const [saveLoading, setSaveLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [publish, setPublish] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
  const {
    isOpen: isOpenSave,
    onOpen: onOpenSave,
    onClose: onCloseSave,
  } = useDisclosure();
  const {
    isOpen: isOpenAITool,
    onOpen: onOpenSummarizeTool,
    onClose: onCloseAITool,
  } = useDisclosure();

  const toast = useToast();

  useEffect(() => {
    const isMac =
      typeof window !== 'undefined'
        ? navigator.platform.toUpperCase().indexOf('MAC') >= 0
        : false;

    async function onKeyDown(e: KeyboardEvent) {
      if (e.key.toLowerCase() === 's' && (isMac ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        setSaveLoading(true);
        await saveFunc();
        setSaveLoading(false);
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [saveFunc]);
  useEffect(() => {
    if (flow != null) setPublish(flow.publish);
  }, []);

  const isValidField = (value: any): boolean => {
    if (value === null || value === undefined) return false;

    if (typeof value === 'string') return value.trim() !== '';
    if (Array.isArray(value))
      return value.length > 0 && value.every(isValidField);
    if (typeof value === 'object')
      return (
        Object.keys(value).length > 0 &&
        Object.values(value).every(isValidField)
      );

    return true;
  };

  const allowedEmptyFields = [
    'link',
    'isAnswerCorrect',
    'context',
    'mandatoryTopics',
    'textToFill',
    'material',
    'negativePoints',
    'positivePoints',
  ];

  //check for specific types
  const typeSpecificChecks: Record<string, (data: any) => boolean> = {
    WatchVideoNode: (data) => isValidField(data.link),
  };

  const checkPublish = (): boolean => {
    if (flow == null) return false;
    if (!flow.nodes) {
      toast({
        title: 'Flow not published',
        description: 'Something is off with your flow! Error: no nodes found',
        status: 'warning',
        duration: 4000,
        position: 'bottom-left',
        isClosable: true,
      });
      return false;
    }

    let missingData = '';

    if (flow.description === '') missingData += 'description; ';
    if (flow.duration === '') missingData += 'duration; ';
    if (flow.learningContext === '') missingData += 'learning context; ';

    let startingNode = 0;

    for (const node of flow.nodes) {
      let infoCheck = true;
      if (!node.description) infoCheck = false;

      const data = node.data;
      for (const key in data) {
        if (allowedEmptyFields.includes(key)) continue;
        if (!isValidField(data[key])) {
          infoCheck = false;
          break;
        }
      }
      if (
        typeSpecificChecks[node.type] &&
        !typeSpecificChecks[node.type](data)
      ) {
        infoCheck = false;
      }

      if (!infoCheck) {
        missingData += node.title + '; ';
        continue;
      }

      // Check if node has at least one incoming edge
      const hasIncomingEdge = flow.edges.some(
        (edge: { reactFlow: { target: any } }) =>
          edge.reactFlow.target === node._id
      );
      if (!hasIncomingEdge) startingNode++;
    }

    if (missingData !== '') {
      toast({
        title: 'Flow not published',
        description:
          'Something is off with your flow! Missing data for: ' + missingData,
        status: 'warning',
        duration: 4000,
        position: 'bottom-left',
        isClosable: true,
      });
      return false;
    }

    if (startingNode !== 1) {
      toast({
        title: 'Flow not published',
        description: `Something is off with your flow! Detected ${startingNode} starting nodes, exactly 1 must have no incoming edges.`,
        status: 'warning',
        duration: 4000,
        position: 'bottom-left',
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  return (
    <Nav p={2} bg="gray.200" justify="start">
      <Stack align="start" w="full">
        <HStack w="full">
          <Image
            src={brandLogo.src}
            width={['30px']}
            className="mr-3"
            alt="Polyglot Logo"
            onClick={() => {
              Router.push('/flows');
            }}
          />
          <ActionButton
            label="Back"
            disabled={hydrated ? !checkBackAction : true}
            onClick={backAction}
            icon={<ArrowBackIcon w={6} h={6} color="blue.500" />}
          />
          <ActionButton
            label="Forward"
            disabled={hydrated ? !checkForwardAction : true}
            onClick={forwardAction}
            icon={<ArrowForwardIcon w={6} h={6} color="blue.500" />}
          />
          <ActionButton
            label="Save"
            disabled={hydrated ? !checkSave : true}
            onClick={async () => {
              setSaveLoading(true);
              await saveFunc();
              setSaveLoading(false);
            }}
            icon={<CopyIcon w={6} h={6} color="blue.500" />}
            isLoading={saveLoading}
          />

          <DropDown
            name="File"
            options={[
              {
                name: 'Save',
                shortcut: 'Ctrl+S',
                icon: <CopyIcon mr={2} />,
                onClick: async () => {
                  setSaveLoading(true);
                  await saveFunc();
                  setSaveLoading(false);
                },
              },
              {
                name: 'Export JSON',
                shortcut: '',
                icon: <ExternalLinkIcon mr={2} />,
                onClick: onOpen,
              },
            ]}
          />
          <DropDown
            name="Project"
            options={[
              {
                name: 'Edit Flow',
                icon: <EditIcon mr={2} />,
                onClick: onOpenEdit,
              },
            ]}
          />
          <ActionButton
            label="Summarizer tool"
            disabled={false}
            onClick={onOpenSummarizeTool}
            icon={<ViewIcon color="blue.500" />}
          />
          <Box color="gray.600">
            <strong>{publish ? 'Published' : 'Not published'} </strong>
            <IconButton
              size="xs"
              isLoading={publishLoading}
              backgroundColor={publish ? 'green.500' : 'red.500'}
              _hover={{ bg: 'gray.300' }}
              onClick={() => {
                setPublishLoading(true);
                if (!publish) {
                  const check = checkPublish();
                  setPublish(check);
                  updateFlowInfo({
                    publish: check,
                  });
                } else {
                  setPublish(false);
                  updateFlowInfo({
                    publish: publish,
                  });
                }
                setPublishLoading(false);
              }}
              aria-label={'publish'}
            >
              {publish ? <CheckIcon /> : <CloseIcon />}
            </IconButton>
          </Box>
          <Spacer />
          <Button
            leftIcon={<CloseIcon />}
            size="sm"
            colorScheme="red"
            variant="solid"
            onClick={async () => {
              if (checkSave) onOpenSave();
              else {
                localStorage.removeItem('flow');
                await Router.push('/flows');
              }
            }}
          >
            Leave editor
          </Button>
        </HStack>
      </Stack>
      <ExportJsonModal isOpen={isOpen} onClose={onClose} flow={flow} />
      {flow && (
        <>
          <EditFlowModal
            isOpen={isOpenEdit}
            onClose={onCloseEdit}
            flow={flow}
            updateInfo={updateFlowInfo}
          />
          <SummarizerModal isOpen={isOpenAITool} onClose={onCloseAITool} />
        </>
      )}
      <SaveFlowModal
        isOpen={isOpenSave}
        onClose={onCloseSave}
        saveFunc={saveFunc}
      />
    </Nav>
  );
}

const ActionButton = ({
  label,
  disabled,
  onClick,
  icon,
  isLoading,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  icon: ReactNode;
  isLoading?: boolean;
}) => {
  return (
    <Tooltip label={label}>
      <Button
        isLoading={isLoading}
        disabled={disabled}
        padding={0}
        background="transparent"
        onClick={onClick}
      >
        {icon}
      </Button>
    </Tooltip>
  );
};

const DropDown = ({
  name,
  options,
}: {
  name: string;
  options: {
    name: string;
    shortcut?: string;
    icon?: React.ReactElement;
    onClick?: () => void;
  }[];
}) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <Box>
      <Box
        width="100vw"
        height="100vh"
        position="absolute"
        left={0}
        top={0}
        onClick={onClose}
        zIndex={9}
        hidden={!isOpen}
      />
      <Button
        p={0}
        color="gray.600"
        bg={isOpen ? 'gray.300' : 'transparent'}
        _hover={{ bg: 'gray.300' }}
        onClick={() => onToggle()}
      >
        {name}
      </Button>
      <Box
        shadow={'lg'}
        position={'fixed'}
        bg="white"
        hidden={!isOpen}
        rounded="md"
        roundedTopLeft={'none'}
        zIndex={10}
      >
        {options.map((val, id) => (
          <Box
            key={id}
            color="black"
            bg={'transparent'}
            p={2}
            _hover={{ bg: 'gray.200' }}
            onClick={() => {
              val.onClick?.();
              onToggle();
            }}
          >
            <Flex align={'center'}>
              {val?.icon}
              <Text>{val.name}</Text>
              <Spacer minW={10} />
              <Text fontSize={'sm'} fontWeight={'semibold'} color="gray.500">
                {val.shortcut}
              </Text>
            </Flex>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
