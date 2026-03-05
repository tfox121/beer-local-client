import createAuth0Client from '@auth0/auth0-spa-js';

const getToken = (authSession) => authSession.getTokenSilently();

export default function getAuthToken() {
  return createAuth0Client({
    domain: process.env.REACT_APP_AUTH0_DOMAIN,
    client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    cacheLocation: 'localstorage',
  }).then(getToken);
}
