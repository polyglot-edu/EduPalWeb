import {
  Box,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
export type NumberFieldProps = {
  label: string;
  name: string;
  defaultValue: number;
  min: number;
  max: number;
  width?: string;
};

const NumberField = ({
  label,
  name,
  defaultValue,
  min,
  max,
  width,
}: NumberFieldProps) => {
  const { register, getFieldState, setValue, getValues } = useFormContext();
  const { error } = getFieldState(name);

  return (
    <Box p={2} width={width}>
      {label}
      <NumberInput defaultValue={defaultValue} min={min} max={max}>
        <NumberInputField {...register(name)} name={name} />
        <NumberInputStepper>
          <NumberIncrementStepper
            onClick={() => {
              let c = getValues(name);
              c++;
              setValue(name, c);
            }}
          />
          <NumberDecrementStepper
            onClick={() => {
              let c = getValues(name);
              c--;
              setValue(name, c);
            }}
          />
        </NumberInputStepper>
      </NumberInput>
    </Box>
  );
};

export default NumberField;
