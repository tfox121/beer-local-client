import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { tr } from '../../utils/i18nRuntime';
const StockModalMenu = ({
  moveStockLineUp,
  moveStockLineDown,
  addNewStockLine,
  deleteStockItems,
  copyStockItems,
}) => (
  <Menu secondary>
    <Menu.Item as='h2'>
      {tr('containers.stockmodal.stockmodalmenu.edit.stock', 'Edit Stock')}
    </Menu.Item>
    <Menu.Menu position='right'>
      <Menu.Item name='Up' onClick={moveStockLineUp}>
        <Icon name='angle up' />
        {tr('containers.stockmodal.stockmodalmenu.up', 'Up')}
      </Menu.Item>
      <Menu.Item name='Down' onClick={moveStockLineDown}>
        <Icon name='angle down' />
        {tr('containers.stockmodal.stockmodalmenu.down', 'Down')}
      </Menu.Item>
      <Menu.Item name='Add Item' onClick={addNewStockLine}>
        <Icon name='plus' />
        {tr('containers.stockmodal.stockmodalmenu.add.item', 'Add Item')}
      </Menu.Item>
      <Menu.Item name='Delete Selected' onClick={deleteStockItems}>
        <Icon name='trash' />
        {tr(
          'containers.stockmodal.stockmodalmenu.delete.selected',
          'Delete Selected',
        )}
      </Menu.Item>
      <Menu.Item name='Copy Selected' onClick={copyStockItems}>
        <Icon name='copy' />
        {tr(
          'containers.stockmodal.stockmodalmenu.copy.selected',
          'Copy Selected',
        )}
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
