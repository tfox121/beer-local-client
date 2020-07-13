/**
 *
 * NavBar
 *
 */

import React, { useState, memo } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import { Menu, Responsive, Dropdown } from 'semantic-ui-react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { push } from 'connected-react-router';

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
          {userProfile ? (
            <Responsive as={Dropdown} header trigger={<FormattedMessage {...messages.home} />} item maxWidth={425}>
              <Dropdown.Menu>
                <Dropdown.Item
                  content="Home"
                  name="/"
                  active={activeItem === '/'}
                  onClick={handleItemClick}
                />
                <Can
                  role={userProfile.role}
                  perform="producer-menu:visit"
                  yes={() => (
                    <>
                      <Dropdown.Item
                        content="Your Store"
                        active={activeItem === '/brewery/profile'}
                        onClick={handleItemClick}
                        name="/brewery/profile"
                      />
                      <Dropdown.Item
                        content="Orders"
                        active={activeItem === '/sales/orders'}
                        onClick={handleItemClick}
                        name="/sales/orders"
                      />
                    </>
                  )}
                />
                <Can
                  role={userProfile.role}
                  perform="retailer-menu:visit"
                  yes={() => (
                    <>
                      <Dropdown.Item
                        name="/breweries"
                        content="Breweries"
                        active={activeItem === '/breweries'}
                        onClick={handleItemClick}
                      />
                      <Dropdown.Item
                        content="Orders"
                        active={activeItem === '/sales/orders'}
                        onClick={handleItemClick}
                        name="/sales/orders"
                      />
                    </>
                  )}
                />
              </Dropdown.Menu>
            </Responsive>
          )
            : (
              <Responsive
                as={Menu.Item}
                name="/"
                active={activeItem === '/'}
                onClick={handleItemClick}
                maxWidth={425}
              >
                <FormattedMessage {...messages.home} />
              </Responsive>
            )}
          <Responsive
            as={Menu.Item}
            name="/"
            active={activeItem === '/'}
            onClick={handleItemClick}
            minWidth={426}
          >
            <FormattedMessage {...messages.home} />
          </Responsive>
          <Responsive as={React.Fragment} minWidth={426}>
            <Can
              role={userProfile.role}
              perform="producer-menu:visit"
              yes={() => (
                <>
                  <Menu.Item
                    content="Your Store"
                    active={activeItem === '/brewery/profile'}
                    onClick={handleItemClick}
                    name="/brewery/profile"
                  />
                  <Menu.Item
                    content="Orders"
                    active={activeItem === '/sales/orders'}
                    onClick={handleItemClick}
                    name="/sales/orders"
                  />
                </>
              )}
            />
            <Can
              role={userProfile.role}
              perform="retailer-menu:visit"
              yes={() => (
                <>
                  <Menu.Item
                    name="/breweries"
                    content="Breweries"
                    active={activeItem === '/breweries'}
                    onClick={handleItemClick}
                  />
                  <Menu.Item
                    content="Orders"
                    active={activeItem === '/sales/orders'}
                    onClick={handleItemClick}
                    name="/sales/orders"
                  />
                </>
              )}
            />
          </Responsive>
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
