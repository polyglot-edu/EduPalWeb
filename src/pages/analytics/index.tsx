import { AddIcon, RepeatIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  IconButton,
  Image,
  SpaceProps,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { useEffect, useMemo, useState } from 'react';
import CourseCardSemplified from '../../components/Card/CourseCardSimplified';
import CreateCourseModal from '../../components/Modals/CreateCourseModal';
import { API, APIV2 } from '../../data/api';
import cardImage from '../../public/collaborative_icon.png';
import flowImage from '../../public/test_card.png';
import {
  PolyglotCourse,
  PolyglotFlow,
  PolyglotNodeValidation,
  UserBaseInfo,
} from '../../types/polyglotElements';
import auth0 from '../../utils/auth0';

type UserCardProps = {
  py?: SpaceProps['py'];
  px?: SpaceProps['px'];
  user: UserBaseInfo;
  setUser: any;
};

const UserCard = ({ user, setUser }: UserCardProps) => {
  const [nodeInfo, setNodeInfo] = useState<PolyglotNodeValidation>();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    API.getActualNodeInfo({ ctxId: user.key }).then((resp) => {
      setNodeInfo(resp.data);
    });
  }, [API]);

  const completeHidden = !nodeInfo?.validation[0];
  console.log('cicle: ');
  console.log(nodeInfo?.validation);
  return (
    <Card
      direction={{ base: 'column', sm: 'row' }}
      variant="outline"
      height={'120px'}
      mt={5}
    >
      <Image objectFit="cover" src={cardImage.src} alt="Flow card" />

      <Stack>
        <CardBody>
          <Box float={'right'} textAlign="right">
            <IconButton
              marginRight={'5px'}
              aria-label="Reset Execution"
              icon={<RepeatIcon />}
              onClick={() =>
                API.resetProgress({
                  ctxId: user.key,
                  authorId: 'admin',
                }).then((resp) => {
                  setUser((prev: any) =>
                    prev.filter((localUser: any) => localUser.key !== user.key)
                  );
                  console.log(resp.data);
                })
              }
            />
            {nodeInfo &&
              nodeInfo.validation.map((validation) => {
                console.log('id: ' + validation.id);
                if (validation.type != 'manuallyProgressEdge')
                  return (
                    <Heading
                      size="xs"
                      color="#bd7342"
                      hidden={!nodeInfo?.validation}
                    >
                      validation: {validation.title}
                    </Heading>
                  );
                return (
                  // eslint-disable-next-line react/jsx-key
                  <Button
                    backgroundColor={
                      validation.data.conditionKind == 'pass'
                        ? 'green.300'
                        : 'red.300'
                    }
                    height={'6'}
                    marginRight={'5px'}
                    isLoading={isLoading}
                    onClick={() => {
                      setIsLoading(true);
                      API.manualProgress({
                        ctxId: user.key,
                        satisfiedConditions: [validation.id],
                        flowId: user.ctx.flowId,
                        authorId: 'admin', //userId with authentication enabled
                      }).then((resp) => {
                        setIsLoading(false);
                        console.log(resp.data);
                        setNodeInfo(resp.data);
                        toast({
                          title: 'Progress registered',
                          description:
                            'The progress had been registered correctly.',
                          status: 'success',
                          duration: 3000,
                          position: 'bottom-left',
                          isClosable: true,
                        });
                      });
                    }}
                  >
                    {validation.title ? validation.title : 'continue'}
                  </Button>
                );
              })}
            <Heading size="xs" color="#3c9e56" hidden={!completeHidden}>
              completed
            </Heading>
          </Box>
          <Box>
            <Heading size="md">{user.ctx.username}</Heading>
            <Text pt={2} whiteSpace={'pre-wrap'}>
              Actual node: <br />
              {nodeInfo?.title}
            </Text>
          </Box>
        </CardBody>
      </Stack>
    </Card>
  );
};

type FlowCardProps = {
  py?: SpaceProps['py'];
  px?: SpaceProps['px'];
  setSelected: (flowId: string) => void;
  setUsers: (arg0: any) => void;
  flow: PolyglotFlow;
};

const SimpleFlowCard = ({
  flow,
  px,
  py,
  setSelected,
  setUsers,
}: FlowCardProps) => {
  return (
    <Card
      direction={{ base: 'column', sm: 'row' }}
      overflow="hidden"
      variant="outline"
      px={px}
      py={py}
      onClick={async () => {
        const response = await API.progressInfo({
          flowId: flow._id ?? '',
          userId: 'admin',
        });
        setUsers(response.data);
        setSelected(flow._id ?? '');
      }}
    >
      <Image
        objectFit="cover"
        maxW={{ base: '100%', sm: '200px' }}
        src={flowImage.src}
        alt="Flow card"
      />

      <Stack w="full">
        <CardBody>
          <Heading size="md">{flow.title}</Heading>
          <Text pt={2} whiteSpace={'pre-wrap'} noOfLines={3}>
            {flow.description}
          </Text>
          <Text pt={2} whiteSpace={'pre-wrap'} noOfLines={3}>
            In this Learning Path there are: {flow.nodes.length} learning
            activities
          </Text>
        </CardBody>
      </Stack>
    </Card>
  );
};

type FlowIndexProps = {
  accessToken: string | undefined;
};

const FlowsListWorkadventure = ({ accessToken }: FlowIndexProps) => {
  const [users, setUsers] = useState<UserBaseInfo[]>([]);
  const [flowId, setFlowId] = useState('');
  const [flows, setFlows] = useState<PolyglotFlow[]>([]);
  const [courses, setCourses] = useState<PolyglotCourse[]>([]);
  const [showCourse, setShowCourse] = useState('');

  const API = useMemo(() => new APIV2(accessToken), [accessToken]);

  const {
    isOpen: cfOpen,
    onClose: cfOnClose,
    onOpen: cfOnOpen,
  } = useDisclosure();

  useEffect(() => {
    API.loadFlowList().then((resp) => {
      setFlows(resp.data);
      setFlowId(resp.data[0]._id ?? '');
    });
    API.loadCourses().then((resp) => {
      setCourses(resp.data);
    });
  }, [API]);

  if (!users) return;
  return (
    <>
      <Box px="10%" paddingBottom={'10px'}>
        <Heading py="3%">Learners doing your Learning paths</Heading>
        {/*
          <SearchBar
            inputValue={searchValue}
            setInputValue={setSearchValue}
            items={suggestions}
            placeholder="Search learning paths..."
          />
        */}
        <Tabs>
          <TabList>
            <Tab>All</Tab>
          </TabList>

          <TabPanels>
            <TabPanel alignItems={'center'}>
              <Heading py="3%">Accessible Courses</Heading>
              {courses.length ? (
                courses.map((course) => {
                  console.log(course.flows.length);
                  return (
                    <Box key={course._id} paddingBottom={'5px'}>
                      <CourseCardSemplified
                        canDelete={true}
                        course={course}
                        openChildren={() => {
                          if (course._id != showCourse)
                            setShowCourse(course._id ?? '');
                          else setShowCourse('');
                        }}
                        API={API}
                        setCourses={setCourses}
                      />
                      <Box key={course._id} hidden={course._id != showCourse}>
                        {course.flows.length ? (
                          course.flows.map((flow: PolyglotFlow) => (
                            <Box key={flow._id} marginTop={'5px'} width={'90%'}>
                              <SimpleFlowCard
                                key={flow._id}
                                flow={flow}
                                py={1}
                                setSelected={setFlowId}
                                setUsers={setUsers}
                              />
                              <Box
                                style={{
                                  padding: '5px',
                                  flexWrap: 'wrap',
                                  justifyContent: 'space-evenly',
                                  display: 'flex',
                                }}
                                hidden={flowId != flow._id}
                              >
                                {users.length ? (
                                  users.map((user, id) => (
                                    <UserCard
                                      key={id}
                                      user={user}
                                      setUser={setUsers}
                                      py={1}
                                      px={1}
                                    />
                                  ))
                                ) : (
                                  <Heading size={'md'} textAlign="center">
                                    No Learner found! Look in another flow ;)
                                  </Heading>
                                )}
                              </Box>
                            </Box>
                          ))
                        ) : (
                          <Heading size={'md'} textAlign="center">
                            You have created 0 Learning paths! <br />
                            Go create one ;)
                          </Heading>
                        )}
                      </Box>
                    </Box>
                  );
                })
              ) : (
                <Heading size={'md'} textAlign="center">
                  There are 0 courses yet! <br />
                  Create one ;)
                </Heading>
              )}
              {/* disabled to show only courses-> decomment if we want to show also single Learning paths
                <Box>
                  <Heading py="3%">Single Learning Paths</Heading>
                  {flows.length ? (
                    flows.map((flow) => (
                      <Box key={flow._id} marginBottom={'5px'}>
                        <SimpleFlowCard
                          key={flow._id}
                          flow={flow}
                          py={1}
                          setSelected={setFlowId}
                          setUsers={setUsers}
                        />
                        <Box
                          style={{
                            padding: '5px',
                            flexWrap: 'wrap',
                            justifyContent: 'space-around',
                            display: 'flex',
                          }}
                          hidden={flowId != flow._id}
                        >
                          {users.length ? (
                            users.map((user, id) => (
                              <UserCard key={id} user={user} py={1} px={1} />
                            ))
                          ) : (
                            <Heading size={'md'} textAlign="center">
                              No Learner found! Look in another flow ;)
                            </Heading>
                          )}
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Heading size={'md'} textAlign="center">
                      You have created 0 Learning paths! <br />
                      Go create one ;)
                    </Heading>
                  )}
                </Box>
              */}
            </TabPanel>
          </TabPanels>
        </Tabs>
        <IconButton
          aria-label="Create Course"
          position={'fixed'}
          right={10}
          bottom={10}
          isRound={true}
          h={12}
          w={12}
          bg={'blue.400'}
          _hover={{ bg: 'blue.600' }}
          icon={<AddIcon fontSize={'xl'} color="white" />}
          onClick={cfOnOpen}
        />
        <CreateCourseModal
          isOpen={cfOpen}
          onClose={cfOnClose}
          API={API}
          setCourses={setCourses}
        />
      </Box>
    </>
  );
};

export default FlowsListWorkadventure;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await auth0.getSession(ctx.req, ctx.res);

  if (!session) return { props: {} };

  return {
    props: {
      accessToken: session.accessToken,
    },
  };
};
