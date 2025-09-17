import { createContext, useContext, useState, ReactNode } from "react";
import { Box, Spinner } from "@chakra-ui/react";

type LoadingContextType = {
  isLoading: boolean;
  setLoading: (value: boolean) => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) throw new Error("useLoading must be used within LoadingProvider");
  return context;
};

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}

      {isLoading && (
        <Box
          position="fixed"
          top={0}
          left={0}
          width="100vw"
          height="100vh"
          bg="blackAlpha.300" // overlay leggermente scuro
          zIndex={9999}
          display="flex"
          alignItems="center"
          justifyContent="center"
          pointerEvents="none" // non blocca interazioni
        >
          <Spinner
            size="lg"
            color="teal.500"
            thickness="4px"
            speed="0.65s"
          />
        </Box>
      )}
    </LoadingContext.Provider>
  );
};
