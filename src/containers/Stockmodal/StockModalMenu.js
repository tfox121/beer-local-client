import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const StockModalMenu = ({
  moveStockLineUp,
  moveStockLineDown,
  addNewStockLine,
  deleteStockItems,
  copyStockItems,
}) => (
  <Menu secondary>
    <Menu.Item as="h2">Edit Stock</Menu.Item>
    <Menu.Menu position="right">
      <Menu.Item name="Up" onClick={moveStockLineUp}>
        <Icon name="angle up" />
        Up
      </Menu.Item>
      <Menu.Item name="Down" onClick={moveStockLineDown}>
        <Icon name="angle down" />
        Down
      </Menu.Item>
      <Menu.Item name="Add Item" onClick={addNewStockLine}>
        <Icon name="plus" />
        Add Item
      </Menu.Item>
      <Menu.Item name="Delete Selected" onClick={deleteStockItems}>
        <Icon name="trash" />
        Delete Selected
      </Menu.Item>
      <Menu.Item name="Copy Selected" onClick={copyStockItems}>
        <Icon name="copy" />
        Copy Selected
      </Menu.Item>
    </Menu.Menu>
  </Menu>
);

StockModalMenu.propTypes = {
  addNewStockLine: PropTypes.func,
  deleteStockItems: PropTypes.func,
  copyStockItems: PropTypes.func,
  moveStockLineUp: PropTypes.func,
  moveStockLineDown: PropTypes.func,
};

export default StockModalMenu;
