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

export type ModaTemplateProps = {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  saveFunc: (flowId: string) => Promise<void>;
};

const SaveFlowModal = ({
  isOpen,
  onClose,
  courseId,
  saveFunc: saveFunc,
}: ModaTemplateProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Save Course edits</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Are you sure? <br /> This action is irreversable!
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="red"
            onClick={async () => {
              onClose();
            }}
          >
            Do not Save
          </Button>
          <Button
            colorScheme="blue"
            onClick={async () => {
              onClose();
              await saveFunc(courseId);
            }}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SaveFlowModal;
