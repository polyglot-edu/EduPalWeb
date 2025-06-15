import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import Editor from '@monaco-editor/react';
import { PolyglotFlow } from '../../types/polyglotElements';

export type ExportJsonModalProps = {
  isOpen: boolean;
  onClose: () => void;
  flow: Nullable<PolyglotFlow>;
};

const ExportJsonModal = ({ isOpen, onClose, flow }: ExportJsonModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Download JSON flow:</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Editor
            height="500px"
            defaultValue={JSON.stringify(flow, null, 2)}
            language="json"
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue">Download</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ExportJsonModal;
