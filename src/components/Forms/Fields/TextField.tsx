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
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <FormLabel m={0}>{label}</FormLabel>
        </Box>
        <Component
          value={value}
          onChange={(e) => setValue(e.target.value)}
          isReadOnly={isReadOnly}
          isDisabled={isDisabled}
          placeholder={_placeholder}
          borderColor="grey"
          borderRadius="md"
          padding="0.375rem 0.75rem"
          height={!isTextArea ? height : undefined}
          minHeight={isTextArea ? '2.5rem' : undefined}
          size="sm"
        />
      </FormControl>
    </Box>
  );
};

export default TextField;
