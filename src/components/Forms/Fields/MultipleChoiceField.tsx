import { AddIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { useState } from 'react';
import {
  Controller,
  RegisterOptions,
  useFieldArray,
  useFormContext,
} from 'react-hook-form';

const ArrayField = ({
  option,
  label,
  name,
  constraints,
}: {
  option?: string;
  label: string;
  name: string;
  constraints?: RegisterOptions;
}) => {
  const [input, setInput] = useState('');
  const [checked, setChecked] = useState(false);
  const { register, setValue, getValues } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: name, // unique name for your Field Array
  });

  return (
    <FormControl>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      {fields.map((field, index) => (
        <Flex key={field.id} paddingBottom={'13px'}>
          <Controller
            name={`data.isChoiceCorrect.${index}`}
            render={({ field }) => (
              <Checkbox
                size="lg"
                mr={2}
                {...field}
                isChecked={field.value}
                icon={
                  field.value ? (
                    <CheckIcon />
                  ) : (
                    <>
                      <Box width="20px" height="20px" backgroundColor={'red'}>
                        <CloseIcon
                          width="10px"
                          height="10px"
                          marginBottom={'8px'}
                          marginLeft={'3px'}
                        />
                      </Box>
                    </>
                  )
                }
                borderColor={'red'}
                colorScheme={'green'}
              />
            )}
          />
          <Input
            {...register(`${name}.${index}`, constraints)}
            borderColor={'grey'}
          />
          <Button
            colorScheme={'red'}
            onClick={() => {
              const c = [...getValues('data.isChoiceCorrect')];
              c.splice(index, 1);
              setValue(`data.isChoiceCorrect`, c);
              remove(index);
            }}
          >
            <CloseIcon boxSize="0.75em" />
          </Button>
          <FormLabel
            htmlFor={name}
            style={{
              transform: 'translate(40px, -13px)',
              position: 'absolute',
              backgroundColor: 'white',
            }}
          >
            {option} {index + 1}
          </FormLabel>
        </Flex>
      ))}
      <Flex>
        <Checkbox
          size="lg"
          mr={2}
          isChecked={checked}
          onChange={(e) => setChecked(e.currentTarget.checked)}
        />
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Insert new choice.."
          borderColor={'grey'}
        />
        <Button
          colorScheme={'green'}
          onClick={() => {
            // appendIsChoices(checked ? 'true' : 'false');
            setValue(`data.isChoiceCorrect.${fields.length}`, checked);
            append(input);
            setInput('');
            setChecked(false);
          }}
        >
          <AddIcon boxSize="0.75em" />
        </Button>
      </Flex>
    </FormControl>
  );
};

export default ArrayField;
