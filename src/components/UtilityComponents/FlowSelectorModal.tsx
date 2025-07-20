import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { API } from '../../data/api';
import { PolyglotFlow } from '../../types/polyglotElements';
import FlowCarousel from '../Carousel/FlowCarousel';

type Props = {
  selectedFlowsState: [
    PolyglotFlow[],
    React.Dispatch<React.SetStateAction<PolyglotFlow[]>>
  ];
  isOpen: boolean;
  onClose: () => void;
};
const FlowSelectorModal = ({ selectedFlowsState, isOpen, onClose }: Props) => {
  const [selectedFlows, setSelectedFlows] = selectedFlowsState;
  const [flows, setFlows] = useState<PolyglotFlow[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    API.loadFlowList().then((resp) => {
      setFlows(resp.data);
    });
  }, [isOpen]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="5xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent h="70vh">
          <ModalHeader>Select from Existing Flows</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2} fontSize="sm" color="gray.600">
              {selectedFlows.length} learning path
              {selectedFlows.length !== 1 && 's'} selected
            </Text>

            <FlowCarousel
              flows={flows}
              selectedFlows={selectedFlows}
              setSelectedFlows={setSelectedFlows}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FlowSelectorModal;
