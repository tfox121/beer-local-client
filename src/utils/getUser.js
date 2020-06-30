import createAuth0Client from '@auth0/auth0-spa-js';

const fetchUser = (authSession) => authSession.getUser();

export default function getUser() {
  return createAuth0Client({
    domain: process.env.REACT_APP_AUTH0_DOMAIN,
    client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    cacheLocation: 'localstorage',
  }).then(fetchUser);
}
