import { Box, Button, Text, VStack } from '@chakra-ui/react';
import { AxiosResponse } from 'axios';
import { useRef, useState } from 'react';
import { API } from '../../../data/api';
import { AnalyzedMaterial } from '../../../types/polyglotElements';
import InputTextField from '../../Forms/Fields/InputTextField';
import MarkDownField from '../../Forms/Fields/MarkDownField';
import StepHeading from '../../UtilityComponents/StepHeading';

interface StepContentFormProps {
  setAnalysedMaterial: React.Dispatch<
    React.SetStateAction<AnalyzedMaterial | undefined>
  >;
  materialProp: [string, React.Dispatch<React.SetStateAction<string>>];
  method: string;
}

const StepContentForm = ({
  setAnalysedMaterial,
  materialProp,
  method,
}: StepContentFormProps) => {
  const [material, setMaterial] = materialProp;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState('');
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };
  const [isLoading, setIsLoading] = useState(false);
  const [hasAnalysedMaterial, setHasAnalysedMaterial] = useState(false);

  const handleAnalyse = async () => {
    setIsLoading(true);

    try {
      const response: AxiosResponse = await API.analyseMaterial({
        text: material,
      });

      setAnalysedMaterial(response.data as AnalyzedMaterial);
      setHasAnalysedMaterial(true);
    } catch (error) {
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

      {method === 'selected' ? (
        <>
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
            <input type="file" ref={fileInputRef} hidden />
          </Box>

          <Text fontSize="sm" textAlign="center" my={4} color="gray.500">
            OR
          </Text>

          <VStack spacing={3} align="stretch">
            <Text>Paste the resource URL of the content</Text>
            <InputTextField
              label=""
              value={url}
              setValue={setUrl}
              placeholder="Enter URL here"
              infoTitle="Public URL"
              infoDescription="Make sure the page is public and doesn’t require a login"
            />
          </VStack>
        </>
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

      <Box mt={6}>
        <Button
          colorScheme="blue"
          isLoading={isLoading}
          isDisabled={hasAnalysedMaterial || material === ''}
          onClick={handleAnalyse}
        >
          Analyse
        </Button>
      </Box>
    </Box>
  );
};

export default StepContentForm;
