/*
 * NavBar Messages
 *
 * This contains all the text for the NavBar component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.NavBar';

export default defineMessages({
  home: {
    id: `${scope}.navbar.home`,
    defaultMessage: 'Home',
  },
  logIn: {
    id: `${scope}.navbar.logIn`,
    defaultMessage: 'Log In',
  },
  logOut: {
    id: `${scope}.navbar.logOut`,
    defaultMessage: 'Log Out',
  },
  signedInAs: {
    id: `${scope}.navbar.signed_in_as`,
    defaultMessage: 'Signed in as ',
  },
  yourProfile: {
    id: `${scope}.navbar.your_profile`,
    defaultMessage: 'Your profile',
  },
  settings: {
    id: `${scope}.navbar.settings`,
    defaultMessage: 'Settings',
  },
});
