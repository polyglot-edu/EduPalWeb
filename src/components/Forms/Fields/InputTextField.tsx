import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Textarea,
} from '@chakra-ui/react';
import InfoButton from '../../UtilityComponents/InfoButton';

type TextFieldProps = {
  label: string;
  value: string;
  setValue: (value: string) => void;
  width?: string;
  height?: string;
  placeholder?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  infoTitle?: string;
  infoDescription?: string;
  infoPlacement?: 'top' | 'right' | 'bottom' | 'left';
  suggestion?: string;
};

const InputTextField = ({
  label,
  value,
  setValue,
  width,
  height = 'auto',
  placeholder,
  isDisabled,
  isReadOnly,
  infoTitle,
  infoDescription,
  infoPlacement = 'right',
  suggestion,
}: TextFieldProps) => {
  return (
    <Box p={2} width={width}>
      <FormControl>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <FormLabel m={0}>{label}</FormLabel>
          {infoTitle && infoDescription && (
            <InfoButton
              title={infoTitle}
              description={infoDescription}
              placement={infoPlacement}
            />
          )}
        </Box>
        <Textarea
          value={value}
          height={'autoar'}
          minHeight="2.5rem"
          padding="0.375rem 0.75rem"
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          isDisabled={isDisabled}
          isReadOnly={isReadOnly}
          borderColor="grey"
        />
        <Button
          hidden={!suggestion}
          onClick={() => setValue(suggestion || value)}
        >
          Suggestion
        </Button>
      </FormControl>
    </Box>
  );
};

export default InputTextField;
