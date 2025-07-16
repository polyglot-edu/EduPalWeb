import { AddIcon } from '@chakra-ui/icons';
import {
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Tag,
  TagCloseButton,
  TagLabel,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';

interface StringListInputProps {
  label?: string;
  value: string[];
  setValue: (val: string[]) => void;
  placeholder?: string;
}

const ArrayField = ({
  label,
  value,
  setValue,
  placeholder,
}: StringListInputProps) => {
  const [input, setInput] = useState('');

  const addItem = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      setValue([...value, trimmed]);
      setInput('');
    }
  };

  const removeItem = (index: number) => {
    const updated = [...value];
    updated.splice(index, 1);
    setValue(updated);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    }
  };

  const borderColor = useColorModeValue('gray.300', 'gray.600');

  return (
    <FormControl>
      {label && <FormLabel fontWeight="semibold">{label}</FormLabel>}

      <VStack align="stretch" spacing={3}>
        {value.map((item, index) => (
          <Flex key={index} align="center" gap={2}>
            <Tag
              key={index}
              size="md"
              variant="solid"
              bgColor="purple.400"
              borderRadius="full"
            >
              <TagLabel>{item}</TagLabel>
              <TagCloseButton onClick={() => removeItem(index)} />
            </Tag>
          </Flex>
        ))}

        <Flex gap={2}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder || 'Aggiungi un elemento...'}
            borderColor={borderColor}
          />
          <IconButton
            icon={<AddIcon />}
            aria-label="Aggiungi"
            colorScheme="purple"
            onClick={addItem}
          />
        </Flex>
      </VStack>
    </FormControl>
  );
};

export default ArrayField;
