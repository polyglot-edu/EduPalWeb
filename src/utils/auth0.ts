import { initAuth0 } from '@auth0/nextjs-auth0';

const auth0Config =
  process.env.TEST_MODE === 'true'
    ? {
        secret: 'testSecret',
        issuerBaseURL: 'http://localhost:3000',
        baseURL: 'http://localhost:3000',
        clientID: 'testClientID',
        clientSecret: 'testClientSecret',
      }
    : {
        baseURL: process.env.AUTH0_BASE_URL || process.env.DEPLOY_URL,
      };

export default initAuth0(auth0Config);
