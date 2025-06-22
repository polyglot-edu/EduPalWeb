import { Box, Button, Input, Text, VStack } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import StepHeading from '../../UtilityComponents/StepHeading';

interface StepContentFormProps {
  analysedMaterial: [any, React.Dispatch<React.SetStateAction<any>>];
}

const StepContentForm = ({ analysedMaterial }: StepContentFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState('');

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box p={8}>
      <StepHeading
        title="Content Upload"
        subtitle="Upload and organize your materials"
      />

      <Box
        border="2px dashed"
        borderColor="gray.300"
        borderRadius="xl"
        p={10}
        textAlign="center"
        mb={6}
      >
        <Text mb={4}>Drag and drop files or click to browse.</Text>
        <Text fontSize="sm" color="gray.500">
          Supported formats: PDF, DOCX, PPTX, TXT
        </Text>
        <Button mt={4} onClick={handleFileUpload}>
          File Upload
        </Button>
        <Input type="file" ref={fileInputRef} hidden />
      </Box>

      <Text fontSize="sm" textAlign="center" my={4} color="gray.500">
        OR
      </Text>

      <VStack spacing={3} align="stretch">
        <Text>Paste the resource URL of the content</Text>
        <Input
          placeholder="Enter URL here"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Text fontSize="xs" color="gray.500">
          Make sure the page is public and doesn’t require a login
        </Text>
      </VStack>
    </Box>
  );
};

export default StepContentForm;
