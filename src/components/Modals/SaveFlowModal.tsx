import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

export type ModaTemplateProps = {
  isOpen: boolean;
  onClose: () => void;
  saveFunc: (outputToast?: boolean, returnPath?: string) => Promise<void>;
};

const SaveFlowModal = ({ isOpen, onClose, saveFunc }: ModaTemplateProps) => {
  const router = useRouter();
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Do you want to save the current changes?</ModalHeader>
        <ModalBody>
          <Text>Your changes will be lost forever if you don&apos;t save</Text>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={1}
            onClick={async () => {
              await saveFunc(false, '/flows');
              localStorage.removeItem('flow');
            }}
          >
            Save
          </Button>
          <Button
            colorScheme="red"
            mr={1}
            onClick={async () => {
              localStorage.removeItem('flow');
              await router.push('/flows');
            }}
          >
            Don&apos;t save
          </Button>
          <Button
            onClick={async () => {
              onClose();
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SaveFlowModal;
