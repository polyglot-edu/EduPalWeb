import { Box, FormControl, FormLabel, Select, Input } from '@chakra-ui/react';
import InfoButton from '../../UtilityComponents/InfoButton';
import { useState, useEffect } from 'react';

export type EnumFieldOption = {
  label: string;
  value: string | number;
};

export type EnumFieldProps = {
  label: string;
  value: string;
  setValue: (value: string) => void;
  options: EnumFieldOption[];
  width?: string;
  hidden?: boolean;
  infoTitle?: string;
  infoDescription?: string;
  infoPlacement?: 'top' | 'right' | 'bottom' | 'left';
  allowCustom?: boolean;
};

const EnumFieldWithCustom = ({
  hidden,
  label,
  value,
  setValue,
  options,
  width,
  infoTitle,
  infoDescription,
  infoPlacement = 'right',
  allowCustom = true,
}: EnumFieldProps) => {
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState('');

  useEffect(() => {
    const isValueInOptions = options.some((opt) => opt.value === value);
    if (!isValueInOptions && value !== '') {
      setIsCustom(true);
      setCustomValue(value);
    } else {
      setIsCustom(false);
      setCustomValue('');
    }
  }, [value, options]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected === '__custom__') {
      setIsCustom(true);
      setValue(''); // oppure lasciare il valore precedente
    } else {
      setIsCustom(false);
      setCustomValue('');
      setValue(selected);
    }
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setCustomValue(newValue);
    setValue(newValue);
  };

  return (
    <Box p={2} width={width} hidden={hidden}>
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
        <Select
          borderColor="grey"
          value={isCustom ? '__custom__' : value}
          onChange={handleSelectChange}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
          {allowCustom && <option value="__custom__">Altro...</option>}
        </Select>
        {isCustom && (
          <Input
            mt={2}
            borderColor="grey"
            placeholder="Inserisci valore personalizzato"
            value={customValue}
            onChange={handleCustomChange}
          />
        )}
      </FormControl>
    </Box>
  );
};

export default EnumFieldWithCustom;
