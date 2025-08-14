import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Flex,
  IconButton,
  Input,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
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
import EnumField from '../Forms/Fields/EnumField';

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
  const [input, setInput] = useState('');
  const [genData, setGenData] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);
  const [model, setModel] = useState('Gemini');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0)
      API.getChatTeacher('685c1412a384900b286d29aa').then((res) => {
        if (res.data.messages[0])
          API.resetChatTeacher('685c1412a384900b286d29aa');
      });
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

  if (!currentConfig) {
    return <Text>Invalid usage configuration.</Text>;
  }
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
      resources: [],
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

      data.forEach((msg) => {
        if (msg.role === 'planner' || msg.role === 'grounding') {
          setPlannerMessages((prev) => [...prev, msg]);
        } else if (msg.role === 'tool') {
          const typedContent = JSON.parse(msg.content) as InferResource<
            typeof usage
          >;
          setGenData(typedContent);
        } else if (msg.role === 'assistant') {
          //assistant
          setMessages((prev) => [...prev, msg]);
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

  const insertDatas = () => {
    if (genData) {
      setResponseData(genData);
      setIsOpen(false);
      setGenData(undefined);
    }
  };

  return (
    <Box position="fixed" bottom="20px" right="20px" zIndex={999} maxW="sm">
      {/* Toggle button */}{' '}
      <IconButton
        aria-label="Toggle chat"
        icon={<HiOutlineChatBubbleLeftRight size="24px" />}
        colorScheme="purple"
        borderRadius="full"
        boxShadow="md"
        mb={isOpen ? 4 : 0}
        onClick={() => setIsOpen(!isOpen)}
        bg={'purple.500'}
        _hover={{ bg: messagesColorGrey }}
        hidden={isOpen}
      />
      {/* Chat box */}
      <Collapse in={isOpen} animateOpacity>
        <Box
          borderWidth="1px"
          borderRadius="lg"
          p={4}
          bg={messagesColorGrey2}
          boxShadow="xl"
        >
          <IconButton
            aria-label="Toggle chat"
            position="absolute"
            left={1}
            top={1}
            icon={<ChevronDownIcon />}
            size="sm"
            backgroundColor="transparent"
            onClick={() => setIsOpen(!isOpen)}
          />
          <VStack spacing={4} align="stretch">
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
                <Text fontWeight="bold">Hola! I am NOVA.</Text>
                <Text fontSize="sm" color="gray.500">
                  Your AI teaching assistant for {currentConfig.title}
                </Text>
              </Box>
            </Flex>

            <Box maxH="300px" overflowY="auto" px={2} py={1} alignSelf="center">
              <Text fontSize="sm" textAlign="center">
                Hi, I&apos;m NOVA, your EduPal AI companion! Ready to build an
                inspiring course? {currentConfig.startingMessages}
              </Text>

              <VStack spacing={2} hidden={usage !== 'general'}>
                <Button
                  size="sm"
                  colorScheme="purple"
                  onClick={() => setInput('Generate a course title')}
                  w="100%"
                >
                  📘 Generate a course title
                </Button>
                <Button
                  size="sm"
                  colorScheme="purple"
                  onClick={() => setInput('Draft a course description')}
                  w="100%"
                >
                  📝 Draft a course description
                </Button>
                <Button
                  size="sm"
                  colorScheme="purple"
                  onClick={() => setInput('Suggest learning objectives')}
                  w="100%"
                >
                  🎯 Suggest learning objectives
                </Button>
                <Button
                  size="sm"
                  colorScheme="purple"
                  onClick={() => setInput('Create a syllabus outline')}
                  w="100%"
                >
                  📚 Create a syllabus outline
                </Button>
              </VStack>

              <VStack spacing={2} pt={4} align="stretch">
                {messages.map((msg, idx) => (
                  <Flex
                    key={idx}
                    justify={msg.role === 'user' ? 'flex-end' : 'flex-start'}
                    w="100%"
                  >
                    <Box
                      bg={
                        msg.role === 'user'
                          ? messagesColorGrey
                          : messagesColorPurple
                      }
                      color={messagesColorWhiteBlack}
                      px={3}
                      py={2}
                      borderRadius="md"
                      maxW="80%"
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
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </Box>
                  </Flex>
                ))}
              </VStack>
              <div ref={messagesEndRef} />
            </Box>

            <Flex mt={2} alignSelf="center" w="100%" maxW="80%">
              <Input
                placeholder="Ask anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleUserMessage();
                }}
              />
              <IconButton
                aria-label="Send"
                icon={<FaPaperPlane />}
                colorScheme="purple"
                ml={2}
                isLoading={isLoading}
                onClick={handleUserMessage}
              />
            </Flex>

            {/* Bottone Insert Data */}
            <Button
              hidden={genData === undefined}
              size="sm"
              backgroundColor="purple.200"
              onClick={() => insertDatas()}
              w="100%"
              maxW="80%"
              alignSelf="center"
            >
              📝 Insert Generated Data
            </Button>
          </VStack>
        </Box>
      </Collapse>
    </Box>
  );
};

export default EduChat;
