import {
  Button,
  LinkBox,
  LinkOverlay,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { PolyglotFlow } from '../../types/polyglotElements';

export type ModaTemplateProps = {
  isOpen: boolean;
  onClose: () => void;
  flow: Nullable<PolyglotFlow>;
};

const RunExecutionModal = ({ isOpen, onClose, flow }: ModaTemplateProps) => {
  if (!flow) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Run on vscode</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Download the generated notebook and open it in vscode</Text>
        </ModalBody>

        <ModalFooter>
          <LinkBox>
            <Button colorScheme="blue">Download</Button>
            <LinkOverlay
              href={`${process.env.BACK_URL}/api/flows/${flow._id}/runFirst`}
            />
          </LinkBox>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RunExecutionModal;
