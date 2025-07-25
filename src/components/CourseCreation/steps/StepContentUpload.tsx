import { Box, Flex, Icon, Text, Tooltip, VStack } from '@chakra-ui/react';
import { FiGrid, FiUpload, FiZap } from 'react-icons/fi';
import StepHeading from '../../UtilityComponents/StepHeading';

interface StepContentUploadProps {
  selection: [string, React.Dispatch<React.SetStateAction<string>>];
}

const StepContentUpload = ({ selection }: StepContentUploadProps) => {
  const [selected, setSelected] = selection;

  return (
    <Box>
      <StepHeading
        title="Content Upload"
        subtitle="Do you have existing resources?"
      />

      <Flex gap={6} direction={{ base: 'column', md: 'row' }}>
        <Box
          p={6}
          border="2px dashed"
          borderColor={selected === 'selected' ? 'purple.500' : 'gray.200'}
          bgColor={selected === 'selected' ? 'purple.50' : 'white'}
          borderRadius="xl"
          cursor="pointer"
          onClick={() => setSelected('selected')}
          flex="1"
          _hover={{ bg: 'purple.50' }}
        >
          <VStack spacing={4}>
            <Icon as={FiGrid} boxSize={6} />
            <Text fontWeight="bold">Use pregenerated learning paths</Text>
            <Text fontSize="sm" color="gray.600">
              Select from existing learning paths the material.
            </Text>
          </VStack>
        </Box>
        <Tooltip
          label="Coming soon"
          isDisabled={false}
          placement="top"
          hasArrow
        >
          <Box
            p={6}
            border="2px dashed"
            borderColor={selected === 'upload' ? 'purple.500' : 'gray.200'}
            bgColor={selected === 'upload' ? 'purple.50' : 'white'}
            borderRadius="xl"
            cursor="pointer"
            //onClick={() => setSelected('upload')}
            flex="1"
            _hover={{ bg: 'purple.50' }}
          >
            <VStack spacing={4}>
              <Icon as={FiUpload} boxSize={6} />
              <Text fontWeight="bold">I have resources</Text>
              <Text fontSize="sm" color="gray.600">
                Upload PDFs, documents, presentations, or other materials
              </Text>
            </VStack>
          </Box>
        </Tooltip>
        <Box
          p={6}
          border="2px dashed"
          borderColor={selected === 'ai' ? 'purple.500' : 'gray.200'}
          bgColor={selected === 'ai' ? 'purple.50' : 'white'}
          borderRadius="xl"
          cursor="pointer"
          onClick={() => setSelected('ai')}
          flex="1"
          _hover={{ bg: 'purple.50' }}
        >
          <VStack spacing={4}>
            <Icon as={FiZap} boxSize={6} />
            <Text fontWeight="bold">Generate with AI</Text>
            <Text fontSize="sm" color="gray.600">
              Let AI create course content based on your specifications
            </Text>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
};
export default StepContentUpload;
