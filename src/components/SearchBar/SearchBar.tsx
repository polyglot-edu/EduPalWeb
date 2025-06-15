import { SearchIcon } from '@chakra-ui/icons';
import { Flex, IconButton, SpaceProps, SpacerProps } from '@chakra-ui/react';
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  AutoCompleteTag,
} from '@choc-ui/chakra-autocomplete';
import { Dispatch, SetStateAction } from 'react';

type SearchItems = string[];

type SearchBarProps = {
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  placeholder?: string;
  items: SearchItems;
  px?: SpaceProps['px'];
  py?: SpaceProps['py'];
  pb?: SpacerProps['pb'];
  onSelectOption?: (value: string) => void;
  clearAfterSearch?: boolean;
  multiple?: boolean;
  removeSearchButton?: boolean;
};

export default function SearchBar({
  inputValue,
  setInputValue,
  placeholder,
  items,
  px,
  py,
  pb,
  onSelectOption,
  clearAfterSearch,
  multiple,
  removeSearchButton,
}: SearchBarProps) {
  return (
    <Flex align="center" px={px} py={py} pb={pb}>
      <AutoComplete
        openOnFocus
        value={inputValue}
        multiple={multiple}
        onSelectOption={(e) => {
          onSelectOption?.(e.item.value);
          if (clearAfterSearch) setInputValue('');
          else setInputValue(e.item.value);
        }}
      >
        <AutoCompleteInput
          variant="filled"
          placeholder={placeholder || 'Search...'}
          onChange={(e) => {
            e.preventDefault();
            setInputValue(e.currentTarget.value);
          }}
        >
          {({ tags }) =>
            tags.map((tag, tid) => (
              <AutoCompleteTag
                key={tid}
                label={tag.label}
                onRemove={tag.onRemove}
              />
            ))
          }
        </AutoCompleteInput>
        <AutoCompleteList mt={0}>
          {items.map((item, id) => (
            <AutoCompleteItem
              key={`option-${id}`}
              value={item}
              textTransform="capitalize"
              _selected={{ backgroundColor: 'lightgrey !important' }}
            >
              {item}
            </AutoCompleteItem>
          ))}
        </AutoCompleteList>
      </AutoComplete>
      {!removeSearchButton && (
        <IconButton
          aria-label="Search database"
          icon={<SearchIcon />}
          ml="1"
          onClick={(e) => {
            e.preventDefault();
          }}
        />
      )}
    </Flex>
  );
}
