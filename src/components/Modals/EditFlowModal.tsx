import { AddIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { PolyglotFlow, PolyglotFlowInfo } from '../../types/polyglotElements';
import { colors } from './CreateFlowModal';
type EditFlowModalProps = {
  isOpen: boolean;
  onClose: () => void;
  flow: PolyglotFlow;
  updateInfo: (flowInfo: PolyglotFlowInfo) => void;
};

const EditFlowModal = ({
  isOpen,
  onClose,
  flow,
  updateInfo,
}: EditFlowModalProps) => {
  if (!flow.topics) flow.topics = [];
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [learningContext, setLearningContext] = useState('');
  const [duration, setDuration] = useState('');
  const [topicName, setTopicName] = useState('');
  const [topics, setTopics] = useState([...flow.topics]);
  const [tagName, setTagName] = useState('');
  const [publish, setPublish] = useState(false);
  const [colorTag, setColorTag] = useState(colors[0]);
  const [tags, setTags] = useState([...flow.tags]);
  const { isOpen: ioPop, onClose: ocPop, onOpen: opPop } = useDisclosure();

  useEffect(() => {
    if (!flow) return;
    setTitle(flow.title);
    setDescription(flow.description);
    setLearningContext(flow.learningContext);
    setTopics([...flow.topics]);
    setColorTag(colors[0]);
    setTags([...flow.tags]);
    setPublish(flow.publish);
  }, [flow]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'2xl'} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Flow</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel mb={2} fontWeight={'bold'}>
              Title:
            </FormLabel>
            <Input
              placeholder="Insert title..."
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
            />
            <FormLabel mb={2} fontWeight={'bold'}>
              Description:
            </FormLabel>
            <Textarea
              placeholder="Insert description..."
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
            />
            <FormLabel mb={2} fontWeight={'bold'}>
              Learning context:
            </FormLabel>
            <Textarea
              placeholder="Insert learning context..."
              value={learningContext}
              onChange={(e) => setLearningContext(e.currentTarget.value)}
            />
            <Flex paddingTop={'8px'} align={'center'}>
              <FormLabel mb={2} fontWeight={'bold'}>
                Topics:
              </FormLabel>
              <Tooltip
                label="Press Enter↵ in the input box to add a topic"
                placement="top"
              >
                <Input
                  placeholder="Insert topic..."
                  w={'30%'}
                  value={topicName}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setTopics((prev) => {
                        prev.push(topicName.toUpperCase());
                        return [...prev];
                      });
                      setTopicName('');
                    }
                  }}
                  onChange={(e) => setTopicName(e.currentTarget.value)}
                />
              </Tooltip>
              <IconButton
                aria-label="Add Topic"
                disabled={!topicName}
                icon={<AddIcon />}
                rounded="md"
                onClick={() => {
                  setTopics((prev) => {
                    prev.push(topicName.toUpperCase());
                    return [...prev];
                  });
                  setTopicName('');
                }}
              />
              <FormLabel paddingLeft={'5px'} mb={2} fontWeight={'bold'}>
                Duration (Hours):
              </FormLabel>
              <Input
                width={'27%'}
                placeholder="Insert duration..."
                value={duration}
                onChange={(e) => setDuration(e.currentTarget.value)}
              />
            </Flex>
            {topics.map((topic, id) => (
              <Button
                key={topic}
                variant={'unstyled'}
                onClick={() =>
                  setTopics((prev) => {
                    prev.splice(id, 1);
                    return [...prev];
                  })
                }
              >
                <Tag mr={1} fontWeight="bold" h={2}>
                  <TagLeftIcon>
                    <CloseIcon />
                  </TagLeftIcon>
                  <TagLabel>{topic}</TagLabel>
                </Tag>
              </Button>
            ))}
          </FormControl>
          <FormLabel my={2} fontWeight={'bold'}>
            Click on the tags to add them:
          </FormLabel>
          <Flex mb={2}>
            <Popover isOpen={ioPop} onClose={ocPop}>
              <PopoverTrigger>
                <Button
                  colorScheme={colorTag}
                  rounded="md"
                  onClick={opPop}
                  borderWidth={2}
                  borderColor={'gray.300'}
                />
              </PopoverTrigger>
              <Portal>
                {/* https://github.com/chakra-ui/chakra-ui/issues/3043 */}
                <Box zIndex="popover" w="full" h="full" position={'relative'}>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverHeader>
                      <Text fontWeight={'bold'}>Select Color</Text>
                    </PopoverHeader>
                    <PopoverCloseButton />
                    <PopoverBody>
                      {colors.map((value, id) => (
                        <Button
                          key={id}
                          colorScheme={value}
                          rounded="md"
                          mr={2}
                          mb={2}
                          onClick={() => {
                            setColorTag(value);
                            ocPop();
                          }}
                        />
                      ))}
                    </PopoverBody>
                  </PopoverContent>
                </Box>
              </Portal>
            </Popover>
            <Tooltip
              label="Press Enter↵ in the input box to add a tag"
              placement="top"
            >
              <Input
                placeholder="Insert tag name..."
                w={'40%'}
                value={tagName}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setTags((prev) => {
                      prev.push({
                        name: tagName.toUpperCase(),
                        color: colorTag,
                      });
                      return [...prev];
                    });
                    setTagName('');
                  }
                }}
                onChange={(e) => setTagName(e.currentTarget.value)}
              />
            </Tooltip>
            <IconButton
              aria-label="Add Tag"
              disabled={!tagName}
              icon={<AddIcon />}
              rounded="md"
              onClick={() => {
                setTags((prev) => {
                  prev.push({
                    name: tagName.toUpperCase(),
                    color: colorTag,
                  });
                  return [...prev];
                });
                setTagName('');
              }}
            />
          </Flex>
          {tags.map((tag, id) => (
            <Button
              key={id}
              variant={'unstyled'}
              onClick={() =>
                setTags((prev) => {
                  prev.splice(id, 1);
                  return [...prev];
                })
              }
            >
              <Tag mr={1} colorScheme={tag.color} fontWeight="bold" h={2}>
                <TagLeftIcon>
                  <CloseIcon />
                </TagLeftIcon>
                <TagLabel>{tag.name}</TagLabel>
              </Tag>
            </Button>
          ))}
        </ModalBody>
        <Box position={'absolute'} bottom={'15px'} left={'27px'}>
          {publish ? 'Published' : 'Not published'}:{' '}
          <IconButton
            backgroundColor={publish ? 'green.500' : 'red.500'}
            onClick={() => {
              setPublish(!publish);
            }}
            aria-label={''}
          >
            {publish ? <CheckIcon /> : <CloseIcon />}
          </IconButton>
        </Box>

        <ModalFooter>
          <Button
            type="submit"
            loadingText="Creating"
            colorScheme="blue"
            onClick={() => {
              if (!title || !description || !tags) return;
              updateInfo({
                //aggiorna con material... ai data
                title: title,
                description: description,
                tags: tags,
                publish: publish,
                learningContext: learningContext,
                duration: duration,
                topics: topics,
                topicsAI: flow.topicsAI,
              });
              onClose();
            }}
          >
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditFlowModal;
