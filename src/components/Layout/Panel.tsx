import { Box, Fade } from '@chakra-ui/react';

export type PanelProps = {
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  children?: React.ReactNode;
};

const Panel = ({ children, isOpen }: PanelProps) => {
  return (
    <Fade
      in={isOpen}
      style={{
        minWidth: isOpen ? '40%' : '0',
      }}
    >
      <Box
        hidden={!isOpen}
        p="5"
        height={'full'}
        overflowY="auto"
        overflowX="hidden"
        shadow={'md'}
      >
        {children}
      </Box>
    </Fade>
  );
};

export default Panel;
