/**
 *
 * NavBar
 *
 */

import React, { useState, memo } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import { Menu } from 'semantic-ui-react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useAuth0 } from '@auth0/auth0-react';
import { push } from 'connected-react-router';

import ProducerMenuItems from './ProducerMenuItems';
import RetailerMenuItems from './RetailerMenuItems';
import UserMenuItems from './UserMenuItems';
import Can from '../Can';

import messages from './messages';
import { makeSelectUser } from './selectors';

function NavBar({ userProfile, pushRoute }) {
  const [activeItem, setActiveItem] = useState('home');
  const { user } = useAuth0();

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
    switch (name) {
      case '/':
        pushRoute('/');
        break;
      case '/brewery/profile':
        pushRoute(`/brewery/${userProfile.producerId}`);
        break;
      // case '/brewery/profile/stock':
      //   pushRoute(`/brewery/profile/stock`);
      //   break;
      // case '/breweries':
      //   pushRoute({
      //     pathname: '/breweries',
      //     query: {
      //       lat: accountInfo.location.lat,
      //       lng: accountInfo.location.lng,
      //     },
      //   });
      //   break;
      default:
        break;
    }
  };
  return (
    <>
      <header>
        <Menu fixed="top">
          <Menu.Item
            name="/"
            active={activeItem === '/'}
            onClick={handleItemClick}
          >
            <FormattedMessage {...messages.home} />
          </Menu.Item>
          {user && (
            <>
              <Can
                role={user['https://beerlocal/apiroles'][0]}
                perform="producer-menu:visit"
                yes={() => (
                  <ProducerMenuItems
                    activeItem={activeItem}
                    handleItemClick={handleItemClick}
                  />
                )}
              />
              <Can
                role={user['https://beerlocal/apiroles'][0]}
                perform="retailer-menu:visit"
                yes={() => (
                  <RetailerMenuItems
                    accountInfo={userProfile}
                    activeItem={activeItem}
                    handleItemClick={handleItemClick}
                  />
                )}
              />
            </>
          )}
          <Menu.Menu position="right">
            <UserMenuItems avatarSource={userProfile.avatarSource} />
          </Menu.Menu>
        </Menu>
      </header>
    </>
  );
}

NavBar.propTypes = {
  userProfile: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  pushRoute: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  userProfile: makeSelectUser(),
});

export function mapDispatchToProps(dispatch) {
  return {
    pushRoute: path => dispatch(push(path)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(NavBar);

// export default NavBar;
