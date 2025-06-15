import {
  Box,
  Button,
  Center,
  Input,
  Spacer,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { API } from '../../../data/api';
import useStore from '../../../store';
import { PolyglotNode } from '../../../types/polyglotElements';

const FileUploadDownload = () => {
  const [file, setFile] = useState<File>();
  const [nodeId, setNodeId] = useState<string>();
  const [filename, setFilename] = useState<string>();
  const toast = useToast();
  // Gestione del file selezionato
  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const { selectedElement } = useStore((store) => ({
    selectedElement: store.getSelectedElement,
  }));

  useEffect(() => {
    if (!selectedElement) return;
    setNodeId((selectedElement as unknown as PolyglotNode)._id);
    if (!nodeId) return;
    API.downloadFile({ nodeId })
      .then((response) => {
        if (response.data) {
          const contentDisposition = response.headers['content-disposition'];
          const filename = contentDisposition
            ?.split('filename=')?.[1]
            ?.replace(/"/g, '');
          setFilename(filename);
        }
      })
      .catch((error: AxiosResponse) => {
        console.log(error);
        setFilename('Nessun file disponibile');
      });
  }, [selectedElement]);

  const handleUpload = async () => {
    if (!nodeId) return;
    if (!file) {
      toast({
        title: 'Select a file.',
        status: 'warning',
      });
      return;
    }
    if (file.type !== 'application/pdf') {
      toast({
        title: 'Selected file must be PDF.',
        status: 'warning',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);

    try {
      API.uploadFile({
        nodeId,
        file: formData,
      })
        .then((resp) =>
          toast({
            title: 'File uploaded successfully.\n' + resp.data,
            status: 'success',
          })
        )
        .catch((error: AxiosResponse) => {
          if (error.status == 413)
            toast({
              title: 'Selected file is too Large.\n',
              status: 'error',
            });
        });
    } catch (error) {
      toast({
        title: "File's upload failed",
        status: 'error',
      });
    }
  };

  const handleDownload = async () => {
    if (!nodeId) return;
    try {
      const response = await API.downloadFile({ nodeId });
      const contentDisposition = response.headers['content-disposition'];
      const filename = contentDisposition
        ?.split('filename=')?.[1]
        ?.replace(/"/g, '');
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename || 'uploadedFile.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return;
    } catch (error: any) {
      console.log(error);
      if (error.status == 304)
        toast({
          title: 'There are no file for this node',
          status: 'info',
        });
      toast({ title: 'Errore durante il download del file.', status: 'error' });
    }
  };

  return (
    <VStack spacing={4} p={6} maxW="500px" mx="auto">
      <Box>
        <Input type="file" onChange={handleFileChange} mb={4} />
      </Box>
      <Center width={'80%'}>
        <Button colorScheme="teal" onClick={handleUpload} width="40%">
          Carica File
        </Button>
        <Spacer />
        <Button colorScheme="blue" onClick={handleDownload} width="40%">
          Scarica File
        </Button>
      </Center>
      <Text hidden={filename == null}>Existing file: {filename}</Text>
    </VStack>
  );
};

export default FileUploadDownload;
