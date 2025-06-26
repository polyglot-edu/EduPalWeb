import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import React from 'react';
import InfoButton from '../../UtilityComponents/InfoButton';

const colors = [
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'blue',
  'cyan',
  'purple',
  'pink',
  'linkedin',
  'facebook',
  'messenger',
  'whatsapp',
  'twitter',
  'telegram',
];

type Tag = {
  name: string;
  color: string;
};

type TagsFieldProps = {
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;

  tagName: string;
  setTagName: React.Dispatch<React.SetStateAction<string>>;

  colorTag: string;
  setColorTag: React.Dispatch<React.SetStateAction<string>>;

  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const TagsField = ({
  tags,
  setTags,
  tagName,
  setTagName,
  colorTag,
  setColorTag,
  isOpen,
  onOpen,
  onClose,
}: TagsFieldProps) => {
  const handleAddTag = () => {
    const trimmedName = tagName.trim();
    if (!trimmedName) return;

    setTags((prev) => [
      ...prev,
      { name: trimmedName.toUpperCase(), color: colorTag },
    ]);
    setTagName('');
  };

  const handleRemoveTag = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box p={2} width="100%">
      <FormControl>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={1}
        >
          <FormLabel m={0}>Course Tags</FormLabel>
          <InfoButton
            title="Tags"
            description="Add tags to categorize your course. Choose a color and type the tag name, then press Enter or click Add."
            placement="right"
          />
        </Box>

        <Flex mb={2} gap={2} alignItems="center" flexWrap="wrap">
          <Popover isOpen={isOpen} onClose={onClose}>
            <PopoverTrigger>
              <Button
                colorScheme={colorTag}
                rounded="md"
                onClick={onOpen}
                borderWidth={2}
                borderColor={'gray.300'}
                minW="40px"
                minH="40px"
              />
            </PopoverTrigger>
            <Portal>
              <Box zIndex="popover" w="full" h="full" position={'relative'}>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverHeader>
                    <Text fontWeight={'bold'}>Select Color</Text>
                  </PopoverHeader>
                  <PopoverCloseButton />
                  <PopoverBody>
                    {colors.map((value, id) => (
                      <Button
                        key={id}
                        colorScheme={value}
                        rounded="md"
                        mr={2}
                        mb={2}
                        onClick={() => {
                          setColorTag(value);
                          onClose();
                        }}
                      />
                    ))}
                  </PopoverBody>
                </PopoverContent>
              </Box>
            </Portal>
          </Popover>

          <Tooltip label="Press Enter ↵ to add a tag" placement="top" hasArrow>
            <Input
              placeholder="Insert tag name..."
              value={tagName}
              onChange={(e) => setTagName(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              borderColor="gray.300"
              _focus={{
                borderColor: 'blue.500',
                boxShadow: '0 0 0 1px #3182ce',
              }}
              flex="1"
            />
          </Tooltip>

          <IconButton
            aria-label="Add Tag"
            disabled={!tagName.trim()}
            icon={<AddIcon />}
            rounded="md"
            onClick={handleAddTag}
            minW="40px"
            minH="40px"
          />
        </Flex>

        {/* Tags preview */}
        <Flex wrap="wrap" gap={2}>
          {tags.map((tag, i) => (
            <Button
              key={i}
              size="sm"
              colorScheme={tag.color}
              variant="solid"
              rounded="full"
              onClick={() => handleRemoveTag(i)}
              cursor="pointer"
            >
              {tag.name}
            </Button>
          ))}
        </Flex>
      </FormControl>
    </Box>
  );
};

export default TagsField;
