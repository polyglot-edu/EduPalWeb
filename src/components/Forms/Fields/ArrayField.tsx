import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { Button, Flex, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useState } from 'react';
import {
  RegisterOptions,
  useFieldArray,
  useFormContext,
} from 'react-hook-form';

const ArrayField = ({
  label,
  name,
  constraints,
  option,
}: {
  label: string;
  name: string;
  option?: string;
  constraints?: RegisterOptions;
}) => {
  const [input, setInput] = useState('');
  const { register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: name, // unique name for your Field Array
  });

  return (
    <FormControl>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      {fields.map((field, index) => (
        <Flex key={field.id} paddingBottom={'13px'}>
          <Input
            {...register(`${name}.${index}`, constraints)}
            borderColor={'grey'}
          />
          <Button
            colorScheme={'red'}
            onClick={() => {
              remove(index);
            }}
          >
            <CloseIcon boxSize="0.75em" />
          </Button>
          <FormLabel
            htmlFor={name}
            style={{
              transform: 'translate(15px, -13px)',
              position: 'absolute',
              backgroundColor: 'white',
            }}
          >
            {option} {index + 1}
          </FormLabel>
        </Flex>
      ))}
      <Flex>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          borderColor={'grey'}
        />
        <Button
          colorScheme={'green'}
          onClick={() => {
            append(input);
            setInput('');
          }}
        >
          <AddIcon boxSize="0.75em" />
        </Button>
      </Flex>
    </FormControl>
  );
};

export default ArrayField;
