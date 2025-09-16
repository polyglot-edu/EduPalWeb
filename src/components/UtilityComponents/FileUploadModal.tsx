import {
  Box,
  Button,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useRef } from 'react';
import { FaPaperclip } from 'react-icons/fa';

interface FileUploadModalProps {
  FileProp: [File | null, React.Dispatch<React.SetStateAction<File | null>>];
  handleUpload: (file: File) => void;
  title?: string;
  supportedFormats?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  buttonSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  colorScheme?: string;
  isHidden?: boolean;
  isLoadingState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({
  FileProp,
  handleUpload,
  title = 'Upload a file',
  supportedFormats = 'PDF, DOCX, PPTX, TXT',
  size = 'lg',
  colorScheme = 'purple',
  isHidden,
  isLoadingState,
  buttonSize,
}) => {
  const [isLoading, setIsLoading] = isLoadingState;
  const [uploadedFile, setUploadedFile] = FileProp;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onAnalyzeClick = () => {
    if (uploadedFile) {
      setIsLoading(true);
      handleUpload(uploadedFile);
      onClose();
    }
  };

  return (
    <>
      <Flex hidden={isHidden}>
        <IconButton
          size={buttonSize || 'md'}
          isLoading={isLoading}
          icon={<FaPaperclip />}
          ml={2}
          onClick={onOpen}
          colorScheme={colorScheme}
          aria-label={'UploadFile'}
        />

        <Modal isOpen={isOpen} onClose={onClose} size={size} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box
                border="2px dashed"
                borderColor="gray.300"
                borderRadius="xl"
                p={10}
                textAlign="center"
                cursor="pointer"
                onClick={handleFileSelect}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <Text mb={4}>Drag and drop files or click to browse.</Text>
                <Text fontSize="sm" color="gray.500">
                  Supported formats: {supportedFormats}
                </Text>
                <Button mt={4} onClick={handleFileSelect}>
                  Browse Files
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  onChange={handleFileChange}
                />
              </Box>

              {uploadedFile && (
                <Box
                  mt={4}
                  p={2}
                  border="1px solid"
                  borderColor="blue.300"
                  borderRadius="md"
                  display="inline-block"
                >
                  <Text fontWeight="bold">{uploadedFile.name}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {(uploadedFile.size / 1024).toFixed(2)} KB
                  </Text>
                </Box>
              )}
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme={colorScheme}
                mr={3}
                onClick={onAnalyzeClick}
                isDisabled={!uploadedFile}
              >
                Analyze File
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </>
  );
};

export default FileUploadModal;
