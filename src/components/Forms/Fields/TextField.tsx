import { Box, FormControl, FormLabel, Input, Textarea } from '@chakra-ui/react';

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
  width,
  height = '2.25rem',
}: TextFieldProps) => {
  const Component = isTextArea ? Textarea : Input;
  const _placeholder = placeholder || ' ';

  return (
    <Box p={2} width={width}>
      <FormControl isRequired={isRequired}>
        <FormLabel m={0}>{label}</FormLabel>
        <Component
          value={value}
          onChange={(e) => setValue(e.target.value)}
          isReadOnly={isReadOnly}
          isDisabled={isDisabled}
          placeholder={_placeholder}
          borderColor="grey"
          height={!isTextArea ? height : undefined}
          size="sm"
        />
      </FormControl>
    </Box>
  );
};

export default TextField;
