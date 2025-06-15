import { AttachmentIcon } from '@chakra-ui/icons';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { useRef } from 'react';
import { Control, FieldValues, useController } from 'react-hook-form';

type FileUploadProps = {
  name: string;
  placeholder?: string;
  acceptedFileTypes?: string;
  control: Control<FieldValues, any> | undefined;
  children?: JSX.Element;
  isRequired?: boolean;
};

const FileUpload = ({
  name,
  placeholder,
  acceptedFileTypes,
  control,
  children,
  isRequired = false,
}: FileUploadProps) => {
  const inputRef = useRef<any>();
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    field: { ref, value, ...inputProps },
  } = useController({
    name,
    control,
    rules: { required: isRequired },
  });

  return (
    <FormControl>
      <FormLabel htmlFor="writeUpFile">{children}</FormLabel>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <AttachmentIcon />
        </InputLeftElement>
        <input
          type="file"
          accept={acceptedFileTypes}
          ref={inputRef}
          {...inputProps}
          //inputRef={ref}
          style={{ display: 'none' }}
        ></input>
        <Input
          placeholder={placeholder || 'Your file ...'}
          onClick={() => inputRef.current?.click()}
          readOnly={true}
          value={value}
        />
      </InputGroup>
      <FormErrorMessage></FormErrorMessage>
    </FormControl>
  );
};

export default FileUpload;
