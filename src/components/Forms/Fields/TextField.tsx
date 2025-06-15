import {
  Box,
  ChakraProvider,
  extendTheme,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react';
import { RegisterOptions, useFormContext } from 'react-hook-form';
export type TextFieldProps = {
  label: string;
  name: string;
  width?: string;
  constraints?: RegisterOptions;
  isTextArea?: boolean;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  placeholder?: string;
};

const activeLabelStyles = {
  transform: ' translateY(-18px)',
};

export const theme = extendTheme({
  components: {
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles,
              },
            },
            'input:not(:placeholder-shown) + label, textarea:not(:placeholder-shown) ~ label':
              {
                ...activeLabelStyles,
              },
            label: {
              font: '15px',
              top: 1,
              left: 0,
              zIndex: 1,
              position: 'absolute',
              backgroundColor: 'white',
              mx: 3,
            },
          },
        },
      },
    },
  },
});

const TextField = ({
  label,
  name,
  constraints,
  isTextArea,
  isReadOnly,
  isDisabled,
  isRequired,
  placeholder,
  width,
}: TextFieldProps) => {
  const { register, getFieldState } = useFormContext();
  const { error } = getFieldState(name);

  const Component = isTextArea ? Textarea : Input;
  const _placeholder = placeholder ? placeholder : ' ';

  return (
    <ChakraProvider theme={theme}>
      <Box p={2} width={width}>
        <FormControl variant="floating" isRequired={isRequired}>
          <Component
            {...register(name, constraints)}
            isReadOnly={isReadOnly}
            isDisabled={isDisabled}
            placeholder={_placeholder}
            borderColor={'grey'}
          />
          <FormLabel>{label}</FormLabel>
          <FormErrorMessage>{error && error.message}</FormErrorMessage>
        </FormControl>
      </Box>
    </ChakraProvider>
  );
};

export default TextField;
