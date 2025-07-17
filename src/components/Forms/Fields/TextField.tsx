import {
  Box,
  ChakraProvider,
  extendTheme,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react';

export type TextFieldProps = {
  label: string;
  value: string;
  setValue: (val: string) => void;
  isTextArea?: boolean;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  placeholder?: string;
  width?: string;
  height?: string;
};

const TextField = ({
  label,
  value,
  setValue,
  isTextArea,
  isReadOnly,
  isDisabled,
  isRequired,
  placeholder,
  width = '100%',
  height = '2.25rem',
}: TextFieldProps) => {
  const Component = isTextArea ? Textarea : Input;
  const _placeholder = placeholder || ' ';

  return (
    <ChakraProvider>
      <Box p={1} width={width}>
        <FormControl variant="floating" isRequired={isRequired}>
          <FormLabel m={0}>{label}</FormLabel>
          <Component
            value={value}
            onChange={(e) => setValue(e.target.value)}
            isReadOnly={isReadOnly}
            isDisabled={isDisabled}
            placeholder={_placeholder}
            size="sm"
          borderColor="grey"
          />
        </FormControl>
      </Box>
    </ChakraProvider>
  );
};

export default TextField;
