import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

export default function ProducerMenuItems({ activeItem, handleItemClick }) {
  return (
    <Dropdown item simple text="Store">
      <Dropdown.Menu>
        <Dropdown.Item
          content="Preview Store"
          active={activeItem === '/brewery/profile'}
          onClick={handleItemClick}
          name="/brewery/profile"
        />
        <Dropdown.Item content="Edit Store" />
      </Dropdown.Menu>
    </Dropdown>
  );
}

ProducerMenuItems.propTypes = {
  handleItemClick: PropTypes.func,
  activeItem: PropTypes.string,
};
