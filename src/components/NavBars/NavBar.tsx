import { UserProfile } from "@auth0/nextjs-auth0/client";
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { MdAccessibility } from "react-icons/md";
import Image from "next/image";
import brandLogo from "../../public/solo_logo.png";

type NavBarProps = {
  user: UserProfile | undefined;
  onAccessibilityClick?: () => void;
};

export default function NavBar({ user, onAccessibilityClick }: NavBarProps) {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      as="header"
      position="fixed"
      top="0"
      left="0"
      right="0"
      w="100%"
      zIndex="110"
      bg="white"
      boxShadow="sm"
    >
      <Flex
        align="center"
        justify="space-between"
        px={{ base: 4, md: 8 }}
        py={2}
        height="60px"
      >
        {/* Logo + titolo */}
        <HStack
          spacing={3}
          onClick={() => (window.location.href = "/dashboard")}
          cursor="pointer"
        >
          <Image src={brandLogo} width={30} height={30} alt="EduCreate Logo" />
          {!isMobile && (
            <Text fontWeight="bold" fontSize="xl" color="gray.700">
              EduPal
            </Text>
          )}
        </HStack>

        <HStack spacing={4}>
          <IconButton
            aria-label="Accessibility Options"
            icon={<MdAccessibility />}
            variant="ghost"
            color="gray.600"
            fontSize="xl"
            onClick={onAccessibilityClick}
          />
          {!user ? (
            <Link href="/api/auth/login" style={{ textDecoration: "none" }}>
              <Button colorScheme="purple" size="sm">
                Sign in
              </Button>
            </Link>
          ) : (
            <HStack spacing={2}>
              <Text fontSize="sm" color="gray.700" fontWeight="medium">
                {user.name}
              </Text>
              <Link href="/api/auth/logout" style={{ textDecoration: "none" }}>
                <Button colorScheme="red" size="sm">
                  Log out
                </Button>
              </Link>
            </HStack>
          )}
        </HStack>
      </Flex>

      
      <Box height="4px" bg="purple.500" />
    </Box>
  );
}
