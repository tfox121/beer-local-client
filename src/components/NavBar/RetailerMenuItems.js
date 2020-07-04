import React from 'react';
import { Menu } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export default function RetailerMenuItems({
  activeItem,
  handleItemClick,
}) {
  return (
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
  );
}

RetailerMenuItems.propTypes = {
  activeItem: PropTypes.string,
  handleItemClick: PropTypes.func,
};
