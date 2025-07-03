import { EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tab,
  TabList,
  TabPanels,
  Tabs,
  Textarea,
  UnorderedList,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { APIV2 } from '../../data/api';
import {
  EducationLevel,
  PolyglotCourse,
} from '../../types/polyglotElements';
import { v4 as uuid4 } from 'uuid';

type CreateCourseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  API: APIV2;
  setCourses: any;
};

export const colors = [
  'gray',
  'yellow',
  'orange',
  'red',
  'pink',
  'purple',
  'blue',
  'cyan',
  'teal',
  'green',
];

type SelectFlowModalProps = {
  isOpen: boolean;
  onClose: () => void;
  flows: { id: string; title: string }[];
  setFlows: any;
  flowList: { id: string; title: string }[];
};

const SelectFlowsList = ({
  isOpen,
  onClose,
  flows,
  setFlows,
  flowList,
}: SelectFlowModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'xl'} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Learning Paths</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={5} overflowY={'scroll'} maxHeight={'200px'}>
            {flows.length ? (
              flows.map((flow) => (
                <Checkbox
                  defaultChecked={
                    flowList.find((flowL) => flowL.id == flow.id) != undefined
                  }
                  key={flow.id}
                  onChange={(event) => {
                    if (event.target.checked)
                      flowList.push({ id: flow.id, title: flow.title });
                    else {
                      const index = flowList.findIndex(
                        (flowToPop) => flow.id == flowToPop.id
                      );
                      if (index) flowList.splice(index);
                    }
                    console.log(flowList);
                  }}
                >
                  {flow.title}
                </Checkbox>
              ))
            ) : (
              <Heading size={'md'} textAlign="center">
                No Learning Paths found! <br /> Go to the editor to create one
                ;)
              </Heading>
            )}
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button
            type="submit"
            loadingText="Creating"
            colorScheme="blue"
            onClick={() => {
              setFlows(flowList);
              onClose();
            }}
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const CreateCourseModal = ({
  isOpen,
  onClose,
  API,
  setCourses,
}: CreateCourseModalProps) => {
  const [flows, setFlows] = useState<{ id: string; title: string }[]>([]);
  const [flowsId, setFlowsId] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<{ name: string; color: string }[]>([]);
  const [searchValue, setSearchValue] = useState('');

  const toast = useToast();

  // reset tags on reopen

  useEffect(() => {
    API.loadFlowList().then((resp) => {
      console.log(resp.data);
      setFlows([
        ...new Set(
          resp.data.map((flow) => ({
            id: flow._id ?? '',
            title: flow.title,
          }))
        ),
      ]);
    });
  }, [searchValue, API]);

  const {
    isOpen: efOpen,
    onClose: efOnClose,
    onOpen: efOnOpen,
  } = useDisclosure();

  const createCourse = async () => {
    try {
      setLoading(true);
      const flowsList = [...new Set(flowsId.map((flow) => flow.id))];
      const base_course: PolyglotCourse = {
        title: title,
        description: description,
        tags: tags,
        flowsId: flowsList,
        published: false,
        lastUpdate: new Date(),
        _id: uuid4(),
        subjectArea: '',
        macro_subject: '',
        education_level: EducationLevel.ElementarySchool,
        language: '',
        duration: '',
        topics: [],
        topicsAI: [],
        learningContext: '',
        author: {
          _id: undefined,
          username: undefined
        },
        nSubscribed: 0,
        nCompleted: 0
      };

      const response: AxiosResponse = await API.createNewCourse(base_course);

      setCourses((prev: PolyglotCourse[]) => {
        prev.push(response.data[0] as PolyglotCourse);
        return [...prev];
      });
      onClose();
      console.log('Course created');
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
      console.log(error);
      //const text=error.response.data;
      toast({
        title: 'Server Error',
        description:
          'We are sorry, server was not able to create your course. Error: ', //+text,
        status: 'error',
        duration: 5000,
        position: 'bottom-left',
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'2xl'} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Course</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs>
            <TabList>
              <Tab>Custom</Tab>
            </TabList>

            <TabPanels>
              <FormControl>
                <FormLabel my={2} fontWeight={'bold'}>
                  Title:
                </FormLabel>
                <Input
                  placeholder="Insert title..."
                  onChange={(e) => {
                    e.preventDefault();
                    setTitle(e.currentTarget.value);
                  }}
                />
                <FormLabel my={2} fontWeight={'bold'}>
                  Description:
                </FormLabel>
                <Textarea
                  placeholder="Insert description..."
                  onChange={(e) => {
                    e.preventDefault();
                    setDescription(e.currentTarget.value);
                  }}
                />
                <FormLabel my={2} fontWeight={'bold'} paddingTop={'8px'}>
                  Selected Learning paths:
                </FormLabel>
                <Box paddingTop={'8px'}>
                  <IconButton
                    float={'right'}
                    aria-label="Edit flow List"
                    icon={<EditIcon />}
                    onClick={efOnOpen}
                  />
                  {flowsId.length ? (
                    <UnorderedList>
                      {flowsId.map((flow) => (
                        <ListItem key={flow.id}>{flow.title}</ListItem>
                      ))}
                    </UnorderedList>
                  ) : (
                    <Heading size={'xs'} textAlign="center">
                      No Learning Paths selected yet! Click on the button to
                      choose.
                    </Heading>
                  )}
                </Box>
              </FormControl>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <Button
            type="submit"
            isLoading={loading}
            loadingText="Creating"
            colorScheme="blue"
            onClick={createCourse}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
      <SelectFlowsList
        isOpen={efOpen}
        onClose={efOnClose}
        flows={flows}
        setFlows={setFlowsId}
        flowList={flowsId}
      />
    </Modal>
  );
};

export default CreateCourseModal;
