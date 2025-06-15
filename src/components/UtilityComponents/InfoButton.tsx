import { InfoIcon } from '@chakra-ui/icons';
import {
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

type InfoButtonProps = {
  title: string;
  description: string;
  iconSize?: string; // default: 18px
  placement?: 'top' | 'right' | 'bottom' | 'left'; // default: right
};

const InfoButton = ({
  title,
  description,
  iconSize = '18px',
  placement = 'right',
}: InfoButtonProps) => {
  const { onOpen, onClose, isOpen } = useDisclosure();

  return (
    <Popover
      arrowPadding={-10}
      arrowSize={12}
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      placement={placement}
      closeOnBlur={true}
    >
      <PopoverTrigger>
        <IconButton
          aria-label="Info"
          icon={<InfoIcon />}
          isRound
          variant="outline"
          color="blue.600"
          boxSize={iconSize}
          padding="2px"
          minW="auto"
          minH="auto"
          transform="translateY(-50%)"
        />
      </PopoverTrigger>
      <PopoverContent
        bg="rgba(66, 153, 225, 0.2)"
        color="black"
        backdropFilter="blur(5px)"
        boxShadow="lg"
        borderRadius="md"
        maxW="250px"
      >
        {/*<PopoverArrow />*/}
        <PopoverCloseButton />
        <PopoverHeader fontWeight="bold">{title}</PopoverHeader>
        <PopoverBody>
          <Text fontSize="sm">{description}</Text>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default InfoButton;
