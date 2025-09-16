import { chakra } from '@chakra-ui/react';
import TextareaAutosize from 'react-textarea-autosize';

const AutoResizeChakraTextarea = chakra(TextareaAutosize, {
  baseStyle: {
    width: '100%',
    padding: '8px',
    borderRadius: '8px',
    border: '1px solid',
    borderColor: 'gray.300',
    fontSize: 'md',
    lineHeight: 'tall',
    outline: 'none',
    _focus: {
      borderColor: 'blue.500',
      boxShadow: '0 0 0 1px blue.500',
    },
    resize: 'none',
    overflowY: 'auto',
    minHeight: '40px',
    maxHeight: '120px',
    flex: 1,
    marginRight: '8px',
  },
});

export default function ChakraTextareaAutosize({
  input,
  setInput,
  handleUserMessage,
}: {
  input: string;
  setInput: (val: string) => void;
  handleUserMessage: () => void;
}) {
  return (
    <AutoResizeChakraTextarea
      minRows={1}
      maxRows={5}
      value={input}
      placeholder="Ask anything..."
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleUserMessage();
        }
      }}
    />
  );
}
