import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'semantic-ui-react';

export default function ProducerMenuItems({ activeItem, handleItemClick }) {
  return (
    <>
      <Menu.Item
        content="Store"
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
  );
}

ProducerMenuItems.propTypes = {
  handleItemClick: PropTypes.func,
  activeItem: PropTypes.string,
};
