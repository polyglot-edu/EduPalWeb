import { Box, Flex, Text, Icon, Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/react';
import { IconType } from 'react-icons';

interface AnalyticsCardProps {
  title: string;
  value: number;
  icon: IconType;
  difference: number;
  colorScheme: string;
}

const AnalyticsCard = ({ title, value, icon, difference, colorScheme }: AnalyticsCardProps) => {
  return (
    <Box
      bg="white"
      p={4}
      rounded="lg"
      boxShadow="md"
      flex="1"
      minW="200px"
    >
      <Flex align="center" mb={2}>
        <Icon as={icon} boxSize={6} mr={2} color={`${colorScheme}.500`} />
        <Text fontWeight="bold">{title}</Text>
      </Flex>
      <Stat>
        <StatNumber>{value}</StatNumber>
        <StatHelpText color={difference >= 0 ? 'green.500' : 'red.500'}>
          {difference >= 0 ? '+' : ''}
          {difference}% from last month
        </StatHelpText>
      </Stat>
    </Box>
  );
};

export default AnalyticsCard;
