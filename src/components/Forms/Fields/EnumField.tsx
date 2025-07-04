import { Box, FormControl, FormLabel, Select } from '@chakra-ui/react';
import InfoButton from '../../UtilityComponents/InfoButton';

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
};

const EnumField = ({
  hidden,
  label,
  value,
  setValue,
  options,
  width,
  infoTitle,
  infoDescription,
  infoPlacement = 'right',
}: EnumFieldProps) => {
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
          value={value}
          onChange={(e) => setValue(e.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default EnumField;
