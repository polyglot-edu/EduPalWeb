import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';
import Editor from '@monaco-editor/react';
import { useController, useFormContext } from 'react-hook-form';

export type CodeFieldProps = {
  label: string;
  name: string;
  language: string;
};

const CodeField = ({ label, name, language }: CodeFieldProps) => {
  const { control, getFieldState } = useFormContext();
  const { error } = getFieldState(name);

  const { field } = useController({
    name,
    control,
  });

  return (
    <FormControl isInvalid={error !== undefined}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Editor
        height={400}
        language={language}
        {...field}
        onChange={(value) => {
          field.onChange({ target: { value: value } });
        }}
      />
      <FormErrorMessage>{error && error.message}</FormErrorMessage>
    </FormControl>
  );
};

export default CodeField;
