import '@fontsource/inter';
import '@fontsource/work-sans';
import '../components/AppMain.css';
import '../components/Card.css';
import '../styles/globals.css';

import { UserProvider } from '@auth0/nextjs-auth0/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { withProse } from '@nikolovlazar/chakra-ui-prose';
import { Analytics } from '@vercel/analytics/react';
import type { AppProps } from 'next/app';
import reportWebVitals from '../reportWebVitals';

const theme = extendTheme(
  {
    fonts: {
      heading: `Work Sans, system-ui, sans-serif`,
      body: `Inter, system-ui, sans-serif`,
    },
  },
  withProse()
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
        <Analytics />
      </ChakraProvider>
    </UserProvider>
  );
}

initializeIcons();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
