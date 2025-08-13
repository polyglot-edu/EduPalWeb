import { Box, Button, Text } from '@chakra-ui/react';
import { AxiosResponse } from 'axios';
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
}

const StepContentForm = ({
  setAnalysedMaterial,
  materialProp,
  method,
}: StepContentFormProps) => {
  const [material, setMaterial] = materialProp;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasAnalysedMaterial, setHasAnalysedMaterial] = useState(false);
  const [uploadedFile, setFile] = useState<File | null>(null);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleAnalyse = async () => {
    setIsLoading(true);
    //if(method=='upload' && file!=null)-> usa file al posto di material //todo
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

      {method === 'upload' ? (
        <Box
          border="2px dashed"
          borderColor="gray.300"
          borderRadius="xl"
          p={10}
          textAlign="center"
          mb={6}
          onClick={handleFileUpload}
          cursor="pointer"
        >
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
          {uploadedFile && <Text mt={2}>Selected: {uploadedFile.name}</Text>}
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

      <Box mt={6}>
        <Button
          colorScheme="blue"
          isLoading={isLoading}
          isDisabled={
            hasAnalysedMaterial || (material === '' && uploadedFile === null)
          }
          onClick={handleAnalyse}
        >
          Analyse
        </Button>
      </Box>
    </Box>
  );
};

export default StepContentForm;
