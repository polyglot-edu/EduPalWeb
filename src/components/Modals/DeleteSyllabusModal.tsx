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
  VStack,
} from '@chakra-ui/react';

export type DeleteSyllabusModalProps = {
  isOpen: boolean;
  onClose: () => void;
  syllabusId: string;
  deleteFunc: (syllabusId: string) => Promise<void>;
  title?: string;
};

const DeleteSyllabusModal = ({
  isOpen,
  onClose,
  syllabusId,
  deleteFunc,
  title = 'this syllabus',
}: DeleteSyllabusModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete {title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="start" spacing={3}>
            <Text>
              You are about to permanently delete <strong>{title}</strong>.
            </Text>
            <Text>
              This will remove{' '}
              <strong>all associated data and components</strong> of this
              syllabus and <strong>cannot be undone</strong>.
            </Text>
            <Text>Please confirm that you want to proceed.</Text>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="red"
            ml="auto" // spinge il pulsante Delete a destra
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
