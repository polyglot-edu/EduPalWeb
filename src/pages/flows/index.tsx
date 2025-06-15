import { useUser } from '@auth0/nextjs-auth0/client';
import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Heading,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import FlowCard from '../../components/Card/FlowCard';
import CreateFlowModal from '../../components/Modals/CreateFlowModal';
import DeleteFlowModal from '../../components/Modals/DeleteFlowModal';
import Navbar from '../../components/NavBars/NavBar';
import SearchBar from '../../components/SearchBar/SearchBar';
import { APIV2 } from '../../data/api';
import { PolyglotFlow } from '../../types/polyglotElements';
import auth0 from '../../utils/auth0';

type FlowIndexPageProps = {
  accessToken: string | undefined;
};

const FlowIndexPage = ({ accessToken }: FlowIndexPageProps) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [flows, setFlows] = useState<PolyglotFlow[]>([]);
  const [selectedFlowId, setSelectedFlowId] = useState<string | undefined>();
  const { user, isLoading, error } = useUser();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const {
    isOpen: cfOpen,
    onClose: cfOnClose,
    onOpen: cfOnOpen,
  } = useDisclosure();
  const {
    isOpen: dfOpen,
    onClose: dfOnClose,
    onOpen: dfOnOpen,
  } = useDisclosure();

  // User need to be loaded
  const API = useMemo(() => new APIV2(accessToken), [accessToken]);

  const deleteFlow = useCallback(
    async (flowId: string) => {
      await API.deleteFlow(flowId);
      setFlows((prev) => prev.filter((flow) => flow._id !== flowId));
    },
    [API]
  );

  useEffect(() => {
    if (user || process.env.TEST_MODE === 'true') {
      let queryparams = '';
      if (currentTab === 0) queryparams = '?me=true&';
      else if (searchValue) queryparams = '?';
      if (searchValue) queryparams += 'q=' + searchValue;
      API.loadFlowList(queryparams).then((resp) => {
        setFlows(resp.data);
        setSuggestions([...new Set(resp.data.map((flow) => flow.title))]);
      });
    }
  }, [user, searchValue, API, currentTab]);

  useEffect(() => {
    if (!selectedFlowId) return;
    dfOnOpen();
  }, [dfOnOpen, selectedFlowId]);

  if (isLoading) return null;

  if (error) console.error(error);

  return (
    <>
      <Navbar user={user} />
      <Box px="10%">
        <Heading py="5%">Learning Paths</Heading>
        <SearchBar
          inputValue={searchValue}
          setInputValue={setSearchValue}
          items={suggestions}
          placeholder="Search learning paths..."
        />
        <Tabs pt="3%" onChange={(index) => setCurrentTab(index)}>
          <TabList>
            <Tab>My Learning Paths: {flows.length}</Tab>
            <Tab>All</Tab>
          </TabList>
          <TabPanels>
            <TabPanel pt="3%">
              {flows.length ? (
                flows.map((flow, id) => (
                  <FlowCard
                    key={id}
                    flow={flow}
                    py={1}
                    canDelete={true}
                    setSelected={setSelectedFlowId}
                  />
                ))
              ) : (
                <Heading size={'md'} textAlign="center">
                  You have 0 Learning paths available! <br />
                  Create one with the + button ;)
                </Heading>
              )}
              <Tooltip label="Create Flow">
                <IconButton
                  hidden={!(user || process.env.TEST_MODE === 'true')}
                  aria-label="Create Flow"
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
              </Tooltip>
            </TabPanel>
            <TabPanel>
              {flows.length ? (
                flows.map((flow, id) => (
                  <FlowCard key={id} flow={flow} py={1} />
                ))
              ) : (
                <Heading size={'md'} textAlign="center">
                  No flows found! <br />
                  Search something different ;)
                </Heading>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
        <CreateFlowModal isOpen={cfOpen} onClose={cfOnClose} API={API} />
        {selectedFlowId && (
          <DeleteFlowModal
            isOpen={dfOpen}
            onClose={() => {
              dfOnClose();
              setSelectedFlowId(undefined);
            }}
            deleteFunc={deleteFlow}
            flowId={selectedFlowId}
          />
        )}
      </Box>
    </>
  );
};

export default FlowIndexPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await auth0.getSession(ctx.req, ctx.res);

  if (!session) return { props: {} };

  return {
    props: {
      accessToken: session.accessToken,
    },
  };
};
