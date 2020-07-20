/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useRef } from 'react';
import { useTable, useSortBy } from 'react-table';
import {
  Table, Input, Menu, Modal, Header, Button, Icon, Popup, Image, Grid,
} from 'semantic-ui-react';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';

import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Select from 'react-select';
import { PACK_SIZES } from '../../utils/constants';

import AvailabilityStyle from './AvailabilityStyle';
import { makeSelectProducerProfile, makeSelectUser, makeSelectOrderSending } from './selectors';
import OrderModalContent from '../../components/OrderModalContent';
import { updateProfileOptions, sendOrder } from './actions';
import geoJsonContainsCoords from '../../utils/geoJsonContainsCoords';

const TableRows = ({
  rows, prepareRow, storedCategory, index, categories, handleCategoryChange, handleRemoveCategory, producerProfile, user,
}) => {
  const [category, setCategory] = useState(storedCategory);
  const onSelectChange = (selectedOption) => {
    setCategory(selectedOption.value);
    handleCategoryChange(index, selectedOption.value);
  };

  useEffect(() => {
    setCategory(storedCategory);
  }, [storedCategory]);

  return (
    <>
      <Table.Row>
        {(user && user.businessId === producerProfile.businessId)
          ? (
            <>
              <Table.Cell colSpan={2}>
                <Select
                  options={[...categories, { value: '', label: 'All' }]}
                  onChange={onSelectChange}
                  value={category ? { value: category, label: category } : { value: '', label: 'All' }}
                  placeholder="All"
                  menuPortalTarget={document.body}
                />

              </Table.Cell>
              <Table.Cell colSpan={3} />
              <Table.Cell colSpan={2} textAlign="right">
                <Button content="Remove section" icon="minus" attached basic onClick={() => handleRemoveCategory(index)} />
              </Table.Cell>
            </>
          )
          : (
            <>
              <Table.Cell colSpan={8} textAlign="left">
                <Header textAlign="left">{category || 'All'}</Header>
              </Table.Cell>
            </>
          )}
      </Table.Row>
      {rows.map(
        (row) => {
          if (row.original.display === 'Show' && (row.original.category === category || category === '')) {
            prepareRow(row);
            return (
              <Popup
                key={row.id}
                trigger={(
                  <Table.Row {...row.getRowProps()}>
                    <Table.Cell>
                      <Image src={row.original.imageSource || '/images/products/blank-product.png'} size="mini" bordered centered circular />
                    </Table.Cell>
                    {row.cells.map((cell, i) => {
                      if (cell.column.id === 'orderQuant' && user && user.role !== 'retailer') {
                        return null;
                      }
                      return (
                        <Table.Cell className={`data-cell-${i}`} {...cell.getCellProps()}>
                          {cell.column.id === 'orderQuant'
                            ? cell.render('Cell', { editable: true })
                            : cell.render('Cell')}
                        </Table.Cell>
                      );
                    })}
                  </Table.Row>
                )}
                wide
                size="tiny"
                position="bottom right"
                hoverable
              >
                <Popup.Header>{row.original.name}</Popup.Header>
                <Popup.Content>
                  <Grid with={16}>
                    <Grid.Column width={5}>
                      <Image src={row.original.imageSource || '/images/products/blank-product.png'} size="large" bordered centered />
                    </Grid.Column>
                    <Grid.Column width={11}>
                      <p>{row.original.description || 'No description'}</p>
                    </Grid.Column>
                  </Grid>
                </Popup.Content>
              </Popup>
            );
          }
          return null;
        },
      )}
    </>
  );
};

TableRows.propTypes = {
  rows: PropTypes.array,
  prepareRow: PropTypes.func,
  storedCategory: PropTypes.string,
  index: PropTypes.number,
  producerProfile: PropTypes.object,
  categories: PropTypes.array,
  user: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  handleCategoryChange: PropTypes.func,
  handleRemoveCategory: PropTypes.func,
};

const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
  editable,
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, Number(value) || 0);
  };

  // If the initialValue is changed externall, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  if (!editable) {
    return `${initialValue}`;
  }

  return (
    <Input
      className="table-input"
      value={value || ''}
      onChange={onChange}
      onBlur={onBlur}
      type="number"
      min="0"
      size="small"
      fluid
    />
  );
};

EditableCell.propTypes = {
  value: PropTypes.node,
  row: PropTypes.object,
  column: PropTypes.object,
  updateMyData: PropTypes.func,
  editable: PropTypes.bool,
};

const AvailibilityTable = ({
  columns, data, updateMyData, skipReset, handleSubmit, producerProfile, user, profileOptionsUpdate, orderSending,
}) => {
  const defaultColumn = React.useMemo(
    () => ({
      // And also our default editable cell
      Cell: EditableCell,
    }),
    [],
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      updateMyData,
      autoResetPage: !skipReset,
      autoResetSelectedRows: !skipReset,
    },
    useSortBy,
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [stockCategories, setStockCategories] = useState(producerProfile && producerProfile.profileOptions.stockCategories);
  const isInitialMount = useRef(true);

  const handleAddCategory = () => {
    if (stockCategories.length < [...new Set(data.map((stockItem) => stockItem.category))].length) {
      setStockCategories([...stockCategories, '']);
    }
  };

  const handleRemoveCategory = (index) => {
    const newCats = [...stockCategories];
    newCats.splice(index, 1);
    setStockCategories([...newCats]);
  };

  const handleCategoryChange = (index, value) => {
    const newCats = stockCategories;
    newCats[index] = value;
    setStockCategories([...newCats]);
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      profileOptionsUpdate({ name: 'stockCategories', payload: stockCategories });
    }
  }, [stockCategories, profileOptionsUpdate]);

  useEffect(() => {
    setCategories([...new Set(data.map((stockItem) => stockItem.category))].filter((category) => !!category && !stockCategories.includes(category)).map((category) => ({ value: category, label: category })));
  }, [data, stockCategories]);

  const handleModalOpen = () => {
    const orderQuantity = data.reduce((acc, cur) => acc + cur.orderQuant, 0);
    if (orderQuantity) {
      setModalOpen(true);
    }
  };

  const handleSendOrder = () => {
    handleSubmit();
    setTimeout(() => {
      while (orderSending) {
        console.log('Sending');
      }
      setModalOpen(false);
    }, 0);
  };

  return (
    <Table {...getTableProps()} unstackable>
      <Table.Header>
        {headerGroups.map((headerGroup) => (
          <Table.Row {...headerGroup.getHeaderGroupProps()}>
            <Table.HeaderCell />
            {headerGroup.headers.map((column, index) => {
              if (column.Header === 'Order #' && user && user.role !== 'retailer') {
                return null;
              }
              return (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <Table.HeaderCell className={`data-header-${index}`} {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? <Icon name="triangle down" />
                        : <Icon name="triangle up" />
                      : ''}
                  </span>
                </Table.HeaderCell>
              );
            })}
          </Table.Row>
        ))}
      </Table.Header>
      <Table.Body {...getTableBodyProps()}>
        {stockCategories.map((storedCategory, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <React.Fragment key={index}>
            <TableRows rows={rows} prepareRow={prepareRow} producerProfile={producerProfile} user={user} storedCategory={storedCategory} index={index} categories={categories} handleCategoryChange={handleCategoryChange} handleRemoveCategory={handleRemoveCategory} />
          </React.Fragment>
        ))}
      </Table.Body>
      <Table.Footer>
        {user && user.businessId === producerProfile.businessId && (
          <Table.Row>
            <Table.HeaderCell colSpan="16">
              <Button attached basic icon="plus" content="Add category section" onClick={handleAddCategory} />
            </Table.HeaderCell>
          </Table.Row>
        )}
        {user && user.role === 'retailer' && (
          <Table.Row>
            <Table.HeaderCell colSpan="16">
              <Menu floated="right">
                {geoJsonContainsCoords(producerProfile.distributionAreas, user.location) || producerProfile.profileOptions.distantPurchasing ? (
                  <Modal
                    trigger={<Menu.Item name="Place Order" onClick={handleModalOpen} />}
                    open={modalOpen}
                    size="large"
                  >
                    <Modal.Header>Confirm Order</Modal.Header>
                    <OrderModalContent
                      orderItems={data}
                      businessName={producerProfile.businessName}
                      type="draftOrder"
                      distancePurchase={!geoJsonContainsCoords(producerProfile.distributionAreas, user.location)}
                      distantPurchasingConditions={producerProfile.profileOptions.distantPurchasingConditions}
                    />
                    <Modal.Actions>
                      <Button content="Cancel" onClick={() => setModalOpen(false)} />
                      <Button
                        primary
                        content="Confirm"
                        disabled={producerProfile.profileOptions.distantPurchasingConditions && data.reduce((acc, val) => { acc += (val.orderChange !== 'delete' && val.price * val.orderQuant); return acc; }, 0) < producerProfile.profileOptions.distantPurchasingConditions.minSpend}
                        onClick={handleSendOrder}
                      />
                    </Modal.Actions>
                  </Modal>
                ) : (
                  <Menu.Item disabled name="Not available in your area" />
                )}
              </Menu>
            </Table.HeaderCell>
          </Table.Row>
        )}
      </Table.Footer>
    </Table>
  );
};

AvailibilityTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  handleChange: PropTypes.func,
  handleSubmit: PropTypes.func,
  updateMyData: PropTypes.func,
  producerProfile: PropTypes.object,
  skipReset: PropTypes.bool,
  user: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  profileOptionsUpdate: PropTypes.func,
  orderSending: PropTypes.bool,
};

const AvailabilityCategories = ({
  data, producerProfile, profileOptionsUpdate, user, orderSend, orderSending,
}) => {
  const [orderItems, setOrderItems] = useState([...data].map((stockItem) => ({ ...stockItem, orderQuant: 0 })));

  const handleSubmit = async () => {
    const order = orderItems.filter((stockItem) => stockItem.orderQuant);
    orderSend({ orderItems: order, producerSub: producerProfile.sub });
  };

  useEffect(() => {
    setOrderItems([...data].map((stockItem) => ({ ...stockItem, orderQuant: 0 })));
  }, [data]);

  const columns = React.useMemo(
    () => [

      {
        Header: '↕ Name',
        accessor: 'name',
      },
      {
        Header: 'Style',
        accessor: 'style',
      },
      {
        Header: 'ABV',
        accessor: 'abv',
        Cell: (properties) => (
          <NumberFormat
            displayType="text"
            decimalScale={1}
            fixedDecimalScale
            suffix="%"
            value={properties.value}
          />
        ),
      },
      {
        Header: 'Pack Size',
        accessor: 'packSize',
        Cell: (properties) => {
          if (!properties.value) {
            return '';
          }
          return PACK_SIZES[properties.value];
        },
      },
      {
        Header: 'List Price',
        accessor: 'price',
        Cell: (properties) => (
          <NumberFormat
            displayType="text"
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale
            prefix="£"
            value={properties.value}
          />
        ),
      },
      {
        Header: 'Availability',
        accessor: 'availability',
      },
      {
        Header: 'Order #',
        accessor: 'orderQuant',
      },

    ],
    [],
  );

  const skipResetRef = React.useRef(false);

  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    skipResetRef.current = true;
    setOrderItems((old) => old.map((row, index) => {
      if (index === rowIndex) {
        const newRow = {
          ...row,
          [columnId]: value,
        };
        return newRow;
      }
      return row;
    }));
  };

  React.useEffect(() => {
    skipResetRef.current = false;
  }, [orderItems]);

  if (!orderItems) {
    return null;
  }

  return (
    <AvailabilityStyle>
      <AvailibilityTable
        columns={columns}
        data={orderItems}
        user={user}
        producerProfile={producerProfile}
        // handleChange={handleChange}
        handleSubmit={handleSubmit}
        updateMyData={updateMyData}
        skipReset={skipResetRef.current}
        profileOptionsUpdate={profileOptionsUpdate}
        orderSending={orderSending}
      />
    </AvailabilityStyle>
  );
};

AvailabilityCategories.propTypes = {
  data: PropTypes.array,
  producerProfile: PropTypes.object,
  profileOptionsUpdate: PropTypes.func,
  user: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  orderSend: PropTypes.func,
  orderSending: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  producerProfile: makeSelectProducerProfile(),
  user: makeSelectUser(),
  orderSending: makeSelectOrderSending(),
});

function mapDispatchToProps(dispatch) {
  return {
    profileOptionsUpdate: (updateObj) => dispatch(updateProfileOptions(updateObj)),
    orderSend: (orderInfo) => dispatch(sendOrder(orderInfo)),

  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(AvailabilityCategories);
