import { Box, FormControl, FormLabel, Input } from '@chakra-ui/react';
import InfoButton from '../../UtilityComponents/InfoButton';

type TextFieldProps = {
  label: string;
  value: string;
  setValue: (value: string) => void;
  width?: string;
  placeholder?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  infoTitle?: string;
  infoDescription?: string;
  infoPlacement?: 'top' | 'right' | 'bottom' | 'left';
};

const InputTextField = ({
  label,
  value,
  setValue,
  width,
  placeholder,
  isDisabled,
  isReadOnly,
  infoTitle,
  infoDescription,
  infoPlacement = 'right',
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
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          isDisabled={isDisabled}
          isReadOnly={isReadOnly}
          borderColor="grey"
        />
      </FormControl>
    </Box>
  );
};

export default InputTextField;
