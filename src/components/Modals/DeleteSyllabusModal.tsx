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
  syllabusId: string;
  deleteFunc: (flowId: string) => Promise<void>;
};

const DeleteSyllabusModal = ({
  isOpen,
  onClose,
  syllabusId,
  deleteFunc,
}: ModaTemplateProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Syllabus</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Are you sure? <br /> This action is irreversable!
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            onClick={async () => {
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            colorScheme="red"
            onClick={async () => {
              onClose();
              await deleteFunc(syllabusId);
            }}
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteSyllabusModal;
