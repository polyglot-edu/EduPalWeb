import {
  ArrowBackIcon,
  ArrowForwardIcon,
  CheckIcon,
  CloseIcon,
} from '@chakra-ui/icons';
import { Box, Flex, IconButton, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { PolyglotFlow } from '../../types/polyglotElements';

interface FlowCarouselProps {
  flows: PolyglotFlow[];
  selectedFlowsId?: string[];
  setSelectedFlowsId?: (flows: string[]) => void;
  selectedFlows?: PolyglotFlow[];
  setSelectedFlows?: (flows: PolyglotFlow[]) => void;
}

const FlowCarousel: React.FC<FlowCarouselProps> = ({
  flows,
  selectedFlowsId,
  setSelectedFlowsId,
  setSelectedFlows,
  selectedFlows,
}) => {
  const perPage = 4;
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxIndex = Math.max(0, flows.length - perPage);

  const visibleFlows = flows.slice(currentIndex, currentIndex + perPage);

  const toggleFlowSelection = (flow: PolyglotFlow) => {
    if (setSelectedFlowsId && selectedFlowsId)
      if (selectedFlowsId.includes(flow._id)) {
        setSelectedFlowsId(
          selectedFlowsId.filter((flowId) => flowId !== flow._id)
        );
      } else {
        setSelectedFlowsId([...selectedFlowsId, flow._id]);
      }
    if (setSelectedFlows && selectedFlows)
      if (selectedFlows.find((f) => f._id === flow._id)) {
        setSelectedFlows(selectedFlows.filter((f) => flow._id !== f._id));
      } else {
        setSelectedFlows([...selectedFlows, flow]);
      }
  };

  return (
    <Flex align="center" justify="center">
      <IconButton
        icon={<ArrowBackIcon />}
        aria-label="Prev"
        onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
        isDisabled={currentIndex === 0}
        variant="ghost"
        mr={2}
      />
      <Flex gap={3} overflow="hidden">
        {visibleFlows.map((flow) => {
          const isSelected =
            (selectedFlowsId && selectedFlowsId.includes(flow._id)) ||
            (selectedFlows && selectedFlows.find((f) => f._id === flow._id));

          return (
            <Box
              key={flow._id}
              position="relative" 
              border="2px"
              borderColor={isSelected ? 'purple.500' : 'gray.200'}
              bgColor={isSelected ? 'purple.50' : 'white'}
              borderRadius="3xl"
              p={5}
              minW="240px"
              maxW="240px"
              flexShrink={0}
              cursor="pointer"
              _hover={{ bg: 'purple.50' }}
              onClick={() => toggleFlowSelection(flow)}
              boxShadow={isSelected ? 'md' : 'sm'}
              transition="all 0.2s ease"
            >
              <IconButton
                icon={flow.publish ? <CheckIcon /> : <CloseIcon />}
                aria-label={flow.publish ? 'Published' : 'Not published'}
                size="xs"
                backgroundColor={flow.publish ? 'green.500' : 'red.500'}
                color="white"
                position="absolute"
                top="10px"
                right="10px"
                isRound
                _hover={{ bg: flow.publish ? 'green.600' : 'red.600' }}
                pointerEvents="none"
              />

              <Text fontWeight="semibold" fontSize="lg" mb={1}>
                {flow.title}
              </Text>
              <Text fontSize="sm" color="gray.600" mb={3}>
                {flow.description}
              </Text>
              <Flex wrap="wrap" gap={2}>
                {flow.tags.map((tag, idx) => (
                  <Box
                    key={idx}
                    fontSize="xs"
                    px={2}
                    py={0.5}
                    borderRadius="md"
                    bg={tag.color ?? 'gray.100'}
                    color="white"
                    fontWeight="medium"
                  >
                    {tag.name}
                  </Box>
                ))}
              </Flex>
            </Box>
          );
        })}
      </Flex>

      <IconButton
        icon={<ArrowForwardIcon />}
        aria-label="Next"
        onClick={() => setCurrentIndex((i) => Math.min(i + 1, maxIndex))}
        isDisabled={currentIndex >= maxIndex}
        variant="ghost"
        ml={2}
      />
    </Flex>
  );
};

export default FlowCarousel;
