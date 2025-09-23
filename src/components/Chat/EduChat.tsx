import { ChevronDownIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Flex,
  IconButton,
  Text,
  Textarea,
  Tooltip,
  useColorModeValue,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { FaCopy, FaPaperPlane } from 'react-icons/fa';
import { HiOutlineChatBubbleLeftRight } from 'react-icons/hi2';
import ReactMarkdown from 'react-markdown';
import { API } from '../../data/api';
import chatIcon from '../../public/novaChatIcon.png';
import {
  AIChatMessage,
  AIChatResponse,
  AIDefineSyllabusResponse,
  AIPlanCourseResponse,
  AIPlanLessonResponse,
} from '../../types/polyglotElements';
import ChakraTextareaAutosize from '../Forms/Fields/ChakraTextAreaAutosize';
import EnumField from '../Forms/Fields/EnumField';
import FileUploadModal from '../UtilityComponents/FileUploadModal';

type EduChatProps = {
  usage: Usage;
  responseDataState: [any, React.Dispatch<React.SetStateAction<any>>];
  knownData?: any;
};

const UsageMapping = [
  {
    usage: 'general',
    title: 'Assistant',
    startingMessages:
      'I can fill in details, generate objectives, and suggest content as you go. What do you want to work on first?',
    system_instructions:
      'The user is now in the freemode chat and can explore any topic related to education, teaching, or course design. Respond openly and creatively, offering relevant support. If the user asks about unrelated subjects, gently remind them that this assistant is specialized in educational content and course development.',
  },
  {
    usage: 'define_syllabus',
    title: 'Help define syllabus',
    startingMessages:
      'You’re working on the syllabus for your course. Let’s define the subject, level, and other key details together. What is your course about?',
    system_instructions:
      'The user is working on generating a course syllabus. Focus on helping them complete the necessary fields: { general_subject, additional_information, education_level, language?, model? }. Guide the conversation toward completing these inputs. If the user diverts to unrelated topics, kindly prompt them to finish the syllabus first, as it is required to proceed with course creation.',
  },
  {
    usage: 'plan_course',
    title: 'Help plan the course',
    startingMessages:
      'Let’s design the full course! I can help you structure lessons, define objectives, and set durations. Do you already have a course title or subject in mind?',
    system_instructions:
      'The user is designing a complete course. Assist them in structuring the course by collecting and refining the following fields: { title, macro_subject, education_level, learning_objectives, number_of_lessons, duration_of_lesson, language, model? }. Encourage clarity and coherence across components. If the user asks about something else, steer them back to completing the course plan.',
  },
  {
    usage: 'plan_lessons',
    title: 'Help plan the lesson',
    startingMessages:
      'We’re planning a specific lesson. I can help break down topics, outcomes, and structure. What’s the focus of this lesson?',
    system_instructions:
      'The user is currently planning a specific lesson. Your goal is to help them break down the lesson into clear and teachable parts using the following fields: { topics, learning_outcome, language, macro_subject, title, education_level, context, model }. Prioritize clarity, relevance, and alignment with course goals. If the user shifts to unrelated matters, gently remind them to finish the lesson plan.',
  },
];
type Usage = 'general' | 'define_syllabus' | 'plan_course' | 'plan_lessons';

type UsageResourceMap = {
  general: {};
  define_syllabus: AIDefineSyllabusResponse;
  plan_course: AIPlanCourseResponse;
  plan_lessons: AIPlanLessonResponse;
};

type InferResource<U extends Usage> = UsageResourceMap[U];

function formatKnownDataForModel(knownData: Record<string, any>): string {
  const entries = Object.entries(knownData)
    .filter(
      ([_, value]) => value !== null && value !== undefined && value !== ''
    )
    .map(([key, value]) => {
      // Convert snake_case or camelCase to readable Title Case
      const readableKey = key
        .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase -> camel Case
        .replace(/_/g, ' ') // snake_case -> snake case
        .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize words
      const readableValue = Array.isArray(value) ? value.join(', ') : value;
      return `- ${readableKey}: ${readableValue}`;
    });

  if (entries.length === 0) {
    return `No prior information is available. Please ask the user for all necessary details.`;
  }

  return `Here is the information already known about the requested content:\n${entries.join(
    '\n'
  )}\n\nIf any important detail is missing, ask the user for clarification.`;
}

const EduChat = ({ usage, responseDataState, knownData }: EduChatProps) => {
  const currentConfig = UsageMapping.find((config) => config.usage === usage);
  const [responseData, setResponseData] = responseDataState;
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<AIChatResponse[]>([]);
  const [plannerMessages, setPlannerMessages] = useState<AIChatResponse[]>([]);
  const [resources, setResources] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isTextOpen, setTextIsOpen] = useState(false);
  const [model, setModel] = useState('Gemini');

  const toast = useToast();

  const router = useRouter();

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (isOpen && messages.length === 0)
        API.getChatTeacher('685c1412a384900b286d29aa').then((res) => {
          if (res.data.messages[0])
            API.resetChatTeacher('685c1412a384900b286d29aa');
        });
    } catch (error) {
      toast({
        title: 'Error starting chat.',
        description: 'Please try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error('Error fetching chat messages:', error);
    }
  }, [isOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const messagesColorGrey = useColorModeValue('gray.200', 'gray.600');
  const messagesColorGrey2 = useColorModeValue('gray.50', 'gray.700');
  const messagesColorPurple = useColorModeValue('purple.100', 'purple.800');
  const messagesColorWhiteBlack = useColorModeValue('black', 'white');

  const [dots, setDots] = useState('.');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length === 3 ? '.' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  if (!currentConfig) {
    return <Text>Invalid usage configuration.</Text>;
  }

  const handleFileUpload = async () => {
    if (uploadedFile)
      try {
        const response = await API.chatUploadFile('685c1412a384900b286d29aa', {
          file: uploadedFile,
          db_name: uploadedFile.name,
        });

        setResources((prev) => [...prev, response.data]);
        toast({
          title: 'Material analysed successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: '✅ Material analysed.',
          } as AIChatResponse,
        ]);
        setUploadedFile(null);
      } catch (error) {
        toast({
          title: 'Error analysing material.',
          description: 'Please try again, or change document.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        console.error('Error analyzing material:', error);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: '❌ Material analysis failed.',
          } as AIChatResponse,
        ]);
      } finally {
        setIsLoading(false);
      }
  };

  const handleUserMessage = async () => {
    setIsLoading(true);
    if (!input.trim()) return;
    const userContext = input;
    setInput('');
    const userMessage = {
      role: 'user',
      content: userContext,
      timestamp: new Date(),
      in_memory: false,
      system_instructions: currentConfig.system_instructions || '',
      resources: resources,
      model: model,
    };

    setMessages((prev) => [...prev, userMessage as AIChatResponse]);

    try {
      const res = await API.chatTeacher('685c1412a384900b286d29aa', {
        ...userMessage,
        content:
          userContext + `\n\n${formatKnownDataForModel(knownData || '')}`,
      } as AIChatMessage);
      const data = res.data as AIChatResponse[];
      //look for "tool" message
      let genData: any = undefined;
      const toolMessage = data.find((msg) => msg.role === 'tool');
      if (toolMessage) {
        const typedContent = JSON.parse(toolMessage.content) as InferResource<
          typeof usage
        >;
        genData = typedContent;
      }

      data.forEach((msg) => {
        if (msg.role === 'planner' || msg.role === 'grounding') {
          setPlannerMessages((prev) => [...prev, msg]);
        } else if (msg.role === 'assistant') {
          //assistant
          setMessages((prev) => [...prev, { ...msg, toolResponse: genData }]);
        }
      });
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages((prev) => [
        ...prev,
        { content: '❌ Response Error.' } as AIChatResponse,
      ]);
    } finally {
      setInput('');
      setIsLoading(false);
    }
  };

  const insertDatas = (generatedData: any) => {
    if (generatedData) {
      setResponseData(generatedData);
      setIsOpen(false);
      setTextIsOpen(false);
    }
  };

  return (
    <Box position="fixed" bottom="20px" right="20px" zIndex={999} maxW="sm">
      {/* Toggle button or quick writing box */}
      {!isOpen ? (
        <Flex
          align="center"
          gap={2}
          bgColor={isTextOpen ? 'purple.50' : ''}
          p={3}
          borderRadius={isTextOpen ? 'lg' : ''}
          boxShadow={isTextOpen ? 'md' : ''}
        >
          <Textarea
            onClick={() => {
              setIsOpen(true);
              setTextIsOpen(true);
            }}
            hidden={!isTextOpen}
            placeholder="Write here..."
            size="sm"
            resize="none"
            minH="40px"
            maxH="120px"
            overflowY="auto"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUserMessage()}
          />
          <IconButton
            aria-label="Open chat"
            icon={
              !isTextOpen ? (
                <HiOutlineChatBubbleLeftRight size="24px" />
              ) : (
                <CloseIcon />
              )
            }
            colorScheme={'purple'}
            borderRadius="full"
            boxShadow="md"
            onClick={() => {
              if (isTextOpen) setTextIsOpen(false);
              else if (!isOpen) {
                setIsOpen(true);
                setTextIsOpen(true);
              }
            }}
            bg={'purple.500'}
            _hover={{ bg: 'purple.600' }}
          />
        </Flex>
      ) : null}

      {/* Chat box */}
      <Collapse in={isOpen} animateOpacity>
        <Box
          borderWidth="1px"
          borderRadius="lg"
          p={6}
          bg={messagesColorGrey2}
          boxShadow="xl"
          position="relative"
        >
          <Tooltip label="Close Chat" placement="right">
            <IconButton
              aria-label="Toggle chat"
              position="absolute"
              right={2}
              top={2}
              icon={<ChevronDownIcon />}
              size="sm"
              backgroundColor="transparent"
              onClick={() => setIsOpen(!isOpen)}
            />
          </Tooltip>

          <VStack spacing={5} align="stretch">
            <Box hidden={messages.length != 0}>
              <EnumField
                label="Model"
                value={model}
                setValue={setModel}
                options={[
                  { label: 'Gemini', value: 'Gemini' },
                  { label: 'OpenAI', value: 'OpenAI' },
                ]}
              />
            </Box>

            <Avatar
              name="NOVA"
              src={chatIcon.src}
              size="lg"
              alignSelf="center"
            />

            <Flex align="center" gap={3} alignSelf="center">
              <Box textAlign="center">
                <Text fontWeight="bold">Hello! I am NOVA.</Text>
                <Text fontSize="sm" color="gray.500">
                  Your AI teaching assistant for {currentConfig.title}
                </Text>
              </Box>
            </Flex>

            <Box
              maxH="350px"
              overflowY="auto"
              px={3}
              py={2}
              alignSelf="center"
              w="100%"
            >
              <Text fontSize="sm" textAlign="center" mb={4}>
                Hi, I&apos;m NOVA, your EduPal AI companion! Ready to build an
                inspiring course? {currentConfig.startingMessages}
              </Text>
              <VStack mt={4} spacing={2} hidden={usage !== 'general'}>
                <Button
                  size="sm"
                  bgColor="purple.300"
                  textColor={'white'}
                  onClick={() => router.push(`/courses/create`)}
                  w="100%"
                >
                  📘 Generate a custom course
                </Button>
                <Button
                  size="sm"
                  bgColor="purple.300"
                  textColor={'white'}
                  onClick={() => router.push(`/syllabus/create`)}
                  w="100%"
                >
                  📚 Create a syllabus outline
                </Button>
              </VStack>

              <VStack spacing={3} pt={2} align="stretch">
                {messages.map((msg, idx) => (
                  <>
                    <Flex
                      key={idx}
                      justify={msg.role === 'user' ? 'flex-end' : 'flex-start'}
                      w="100%"
                    >
                      <Avatar
                        name="NOVA"
                        src={chatIcon.src}
                        size="sm"
                        hidden={msg.role === 'user'}
                      />
                      <Box
                        bg={
                          msg.role === 'user'
                            ? messagesColorGrey
                            : messagesColorPurple
                        }
                        color={messagesColorWhiteBlack}
                        px={4}
                        py={3}
                        borderRadius="md"
                        maxW="85%"
                        boxShadow="sm"
                        textAlign={msg.role === 'user' ? 'right' : 'left'}
                      >
                        <ReactMarkdown
                          components={{
                            p: (props) => (
                              <Text
                                fontSize="sm"
                                whiteSpace="pre-wrap"
                                {...props}
                              />
                            ),
                            strong: (props) => (
                              <Text
                                as="strong"
                                fontWeight="bold"
                                display="inline"
                                {...props}
                              />
                            ),
                            code: ({ children }) => (
                              <Text
                                as="span"
                                fontFamily="mono"
                                fontSize="sm"
                                whiteSpace="pre-wrap"
                              >
                                {children}
                              </Text>
                            ),
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>

                        {/* Copy + Insert buttons */}
                        {msg.role === 'assistant' && (
                          <Flex gap={2} mt={2} justify="flex-end">
                            <IconButton
                              aria-label="Copy"
                              icon={<FaCopy />}
                              size="sm"
                              onClick={() =>
                                navigator.clipboard.writeText(msg.content)
                              }
                            />
                            <Button
                              hidden={msg.toolResponse === undefined}
                              size="sm"
                              backgroundColor="purple.200"
                              onClick={() => insertDatas(msg.toolResponse)}
                              maxW="80%"
                              alignSelf="center"
                            >
                              📝 Insert Data
                            </Button>
                          </Flex>
                        )}
                      </Box>
                    </Flex>
                  </>
                ))}

                <Flex hidden={!isLoading}>
                  <Avatar name="NOVA" src={chatIcon.src} size="sm" />
                  <Box
                    bg={messagesColorPurple}
                    color={messagesColorWhiteBlack}
                    px={3}
                    py={2}
                    ml={2}
                    borderRadius="md"
                    boxShadow="sm"
                    fontWeight="bold"
                  >
                    {dots}
                  </Box>
                </Flex>
              </VStack>
              <div ref={messagesEndRef} />
            </Box>

            {/* Dynamic textarea */}
            <Flex
              direction="column"
              w="100%"
              mt={2}
              p={2}
              borderRadius="md"
              border="1px solid"
              borderColor="gray.300"
              bg={messagesColorGrey2}
            >
              <Box>
                <ChakraTextareaAutosize
                  input={input}
                  setInput={setInput}
                  handleUserMessage={handleUserMessage}
                />
              </Box>
              <Flex justify="space-between" align="center" mb={1}>
                <FileUploadModal
                  buttonSize="xs"
                  isLoadingState={[isLoading, setIsLoading]}
                  isHidden={usage !== 'define_syllabus'}
                  FileProp={[uploadedFile, setUploadedFile]}
                  handleUpload={handleFileUpload}
                  title="Upload your document"
                  supportedFormats="PDF, DOCX, PPTX, TXT"
                  colorScheme="blue"
                />

                <IconButton
                  size="xs"
                  aria-label="Send"
                  icon={<FaPaperPlane />}
                  colorScheme="purple"
                  isLoading={isLoading}
                  onClick={handleUserMessage}
                />
              </Flex>
            </Flex>
          </VStack>
        </Box>
      </Collapse>
    </Box>
  );
};

export default EduChat;
