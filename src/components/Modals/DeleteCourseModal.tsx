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

export type DeleteFlowModalProps = {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  deleteFunc: (courseId: string) => Promise<void>;
  title?: string;
};

const DeleteCourseModal = ({
  isOpen,
  onClose,
  courseId,
  deleteFunc,
  title = 'this course',
}: DeleteFlowModalProps) => {
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
              This will remove <strong>all associated data and components</strong> of this course and <strong>cannot be undone</strong>.
            </Text>
            <Text>
              Please confirm that you want to proceed.
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="red"
            ml="auto"
            onClick={async () => {
              onClose();
              await deleteFunc(courseId);
            }}
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteCourseModal;
