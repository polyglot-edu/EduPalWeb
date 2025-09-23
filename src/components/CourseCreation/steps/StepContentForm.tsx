import { Box, Button, Flex, Text, useToast } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { API } from '../../../data/api';
import { AnalyzedMaterial } from '../../../types/polyglotElements';
import MarkDownField from '../../Forms/Fields/MarkDownField';
import StepHeading from '../../UtilityComponents/StepHeading';

interface StepContentFormProps {
  setAnalysedMaterial: React.Dispatch<
    React.SetStateAction<AnalyzedMaterial | undefined>
  >;
  materialProp: [string, React.Dispatch<React.SetStateAction<string>>];
  method: string;
  model: string;
  nextStep: () => void;
  prevStep: () => void;
}

const StepContentForm = ({
  setAnalysedMaterial,
  materialProp,
  method,
  model,
  nextStep,
  prevStep,
}: StepContentFormProps) => {
  const [material, setMaterial] = materialProp;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAnalysedMaterial, setHasAnalysedMaterial] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const toast = useToast();

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setUploadedFile(selectedFile);
      e.target.value = '';
    }
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setUploadedFile(droppedFile);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleAnalyse = async () => {
    setIsLoading(true);

    try {
      const response = await API.analyseMaterial({
        file: method == 'upload' ? uploadedFile : null,
        url: method == 'ai' ? material : '',
        model: model,
      });

      setAnalysedMaterial(response.data as AnalyzedMaterial);
      setHasAnalysedMaterial(true);
      nextStep();
      toast({
        title: 'Material analysed successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error analysing material.',
        description: 'Please try again, or change document. Error: ',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.log('__________________________________________________');
      console.log(error);
      console.log('__________________________________________________');
      console.error('Error analyzing material:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={8}>
      <StepHeading
        title="Content Upload"
        subtitle="Upload and organize your materials"
      />

      {method === 'upload' ? (
        <Box
          border="2px dashed"
          borderColor="gray.300"
          borderRadius="xl"
          p={10}
          textAlign="center"
          mb={6}
          onClick={handleFileUpload}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          cursor="pointer"
        >
          <Box>
            <Text mb={4}>Drag and drop files or click to browse.</Text>
            <Text fontSize="sm" color="gray.500">
              Supported formats: PDF, DOCX, PPTX, TXT
            </Text>
            <Button mt={4} onClick={handleFileUpload}>
              File Upload
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
        </Box>
      ) : method === 'ai' ? (
        <MarkDownField
          label="Material"
          value={material}
          setValue={setMaterial}
          infoTitle="Material to analyse"
          infoDescription="Provide your custom material you want to base your course on."
          infoPlacement="right"
        />
      ) : null}

      <Flex mt={8} justify="space-between" py={2}>
        <Box flex="1" display="flex" justifyContent="center">
          <Button onClick={() => prevStep()}>Back</Button>
        </Box>
        <Box flex="1" display="flex" justifyContent="center"></Box>
        <Box flex="1" display="flex" justifyContent="center" gap={4}>
          <Button
            colorScheme="teal"
            isLoading={isLoading}
            isDisabled={
              hasAnalysedMaterial || (material === '' && uploadedFile === null)
            }
            onClick={handleAnalyse}
          >
            Analyse
          </Button>
          <Button pl="4" colorScheme="purple" onClick={nextStep}>
            Next
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default StepContentForm;
