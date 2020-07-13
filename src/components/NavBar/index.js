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
import { push } from 'connected-react-router';

import ProducerMenuItems from './ProducerMenuItems';
import RetailerMenuItems from './RetailerMenuItems';
import UserMenuItems from './UserMenuItems';
import Can from '../Can';

import messages from './messages';
import { makeSelectUser } from './selectors';

function NavBar({ userProfile, pushRoute }) {
  const [activeItem, setActiveItem] = useState('');

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
    switch (name) {
      case '/':
        setActiveItem('');
        pushRoute('/');
        break;
      case '/brewery/profile':
        pushRoute(`/brewery/${userProfile.businessId}`);
        break;
      case '/sales/orders':
        pushRoute('/sales/orders');
        break;
      case '/breweries':
        pushRoute('/breweries');
        break;
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
            header
          >
            <FormattedMessage {...messages.home} />
          </Menu.Item>
          {userProfile && (
            <>
              <Can
                role={userProfile.role}
                perform="producer-menu:visit"
                yes={() => (
                  <ProducerMenuItems
                    activeItem={activeItem}
                    handleItemClick={handleItemClick}
                  />
                )}
              />
              <Can
                role={userProfile.role}
                perform="retailer-menu:visit"
                yes={() => (
                  <RetailerMenuItems
                    activeItem={activeItem}
                    handleItemClick={handleItemClick}
                  />
                )}
              />
            </>
          )}
          <Menu.Menu position="right">
            <UserMenuItems
              notifications={userProfile.notifications}
              avatarSource={userProfile.avatarSource}
              businessName={userProfile.businessName}
            />
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
    pushRoute: (path) => dispatch(push(path)),
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
