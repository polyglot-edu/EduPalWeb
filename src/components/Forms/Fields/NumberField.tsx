import {
  Box,
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';
import InfoButton from '../../UtilityComponents/InfoButton';

type NumberFieldProps = {
  label: string;
  value: number;
  setValue: (value: number) => void;
  min?: number;
  max?: number;
  width?: string;
  placeholder?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  infoTitle?: string;
  infoDescription?: string;
  infoPlacement?: 'top' | 'right' | 'bottom' | 'left';
};

const NumberField = ({
  label,
  value,
  setValue,
  min,
  max,
  width,
  placeholder,
  isDisabled,
  isReadOnly,
  infoTitle,
  infoDescription,
  infoPlacement = 'right',
}: NumberFieldProps) => {
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
        <NumberInput
          value={value}
          min={min}
          max={max}
          onChange={(val) => {
            const parsed = parseInt(val);
            setValue(isNaN(parsed) ? 0 : parsed);
          }}
          isDisabled={isDisabled}
          isReadOnly={isReadOnly}
        >
          <NumberInputField placeholder={placeholder} borderColor="grey" />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
    </Box>
  );
};

export default NumberField;
