/**
 *
 * NavBar
 *
 */

import React, { useState, memo } from 'react';

import { Menu, Responsive, Dropdown } from 'semantic-ui-react';
import { useAuth0 } from '@auth0/auth0-react';
import { useHistory } from 'react-router-dom';

import UserMenuItems from './UserMenuItems';
import Can from '../Can';

import { useUserQuery } from '../../queries/user';
import NavBarStyle from './NavBarStyle';

function NavBar() {
  const [activeItem, setActiveItem] = useState('');
  const { isAuthenticated } = useAuth0();
  const history = useHistory();
  const { data: userProfile } = useUserQuery({ enabled: isAuthenticated });

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
    switch (name) {
      case '/':
        setActiveItem('');
        history.push('/');
        break;
      case '/brewery/profile':
        history.push(`/brewery/${userProfile.businessId}`);
        break;
      case '/sales/orders':
        history.push('/sales/orders');
        break;
      case '/breweries':
        history.push('/breweries');
        break;
      default:
        break;
    }
  };

  return (
    <NavBarStyle>
      <Menu fixed="top">
        {userProfile ? (
          <Responsive as={Dropdown} text="BeerLocal" item maxWidth={425}>
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
              className="home-button"
            >
              BeerLocal
            </Responsive>
          )}
        <Responsive
          as={Menu.Item}
          name="/"
          active={activeItem === '/'}
          onClick={handleItemClick}
          minWidth={426}
          className="home-button"
        >
          BeerLocal
        </Responsive>
        <Responsive as={React.Fragment} minWidth={426}>
          <Can
            role={userProfile?.role}
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
            role={userProfile?.role}
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
            notifications={userProfile?.notifications}
            avatarSource={userProfile?.avatarSource}
            businessName={userProfile?.businessName}
          />
        </Menu.Menu>
      </Menu>
    </NavBarStyle>
  );
}
export default memo(NavBar);

// export default NavBar;
