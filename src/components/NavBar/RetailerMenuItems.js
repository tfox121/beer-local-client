import React from 'react';
import { Menu } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export default function RetailerMenuItems({
  accountInfo,
  activeItem,
  handleItemClick,
}) {
  if (accountInfo && accountInfo.type === 'retailer') {
    return (
      <Menu.Item
        name="/breweries"
        content="Breweries"
        active={activeItem === '/breweries'}
        onClick={handleItemClick}
      />
    );
  }
  return null;
}

RetailerMenuItems.propTypes = {
  accountInfo: PropTypes.object,
  activeItem: PropTypes.string,
  handleItemClick: PropTypes.func,
};
