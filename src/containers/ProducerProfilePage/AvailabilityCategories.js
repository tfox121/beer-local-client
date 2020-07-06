/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useRef } from 'react';
import { useTable, useSortBy } from 'react-table';
import {
  Table, Input, Menu, Modal, Header, Button,
} from 'semantic-ui-react';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';

import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { push } from 'connected-react-router';
import Select from 'react-select';
import { PACK_SIZES } from '../../utils/constants';
import { getPrivateRoute } from '../../utils/api';

import AvailabilityStyle from './AvailabilityStyle';
import { makeSelectProducerProfile, makeSelectUser } from './selectors';
import OrderModalContent from '../../components/OrderModalContent';
import { updateProfile } from './actions';

const TableRows = ({
  rows, prepareRow, storedCategory, index, categories, handleCategoryChange, producerProfile, user,
}) => {
  const [category, setCategory] = useState(storedCategory);
  const onSelectChange = (selectedOption) => {
    console.log(selectedOption, index);
    setCategory(selectedOption.value);
    handleCategoryChange(index, selectedOption.value);
  };

  return (
    <>
      <Table.Row>
        <Table.Cell colSpan={2}>
          {(user && user.producerId === producerProfile.producerId)
            ? (
              <Select
                options={[...categories, { value: '', label: 'All' }]}
                onChange={onSelectChange}
                value={categories.filter((categoryObj) => categoryObj.value === category)[0]}
                placeholder="All"
                menuPortalTarget={document.body}
              />
            )
            : <Header>{category}</Header>}
        </Table.Cell>
      </Table.Row>
      {rows.map(
        (row) => {
          if (row.original.display === 'Show' && (row.original.category === category || category === '')) {
            prepareRow(row);
            return (
              <Table.Row {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <Table.Cell {...cell.getCellProps()}>
                    {cell.column.id === 'orderQuant'
                      ? cell.render('Cell', { editable: true })
                      : cell.render('Cell')}
                  </Table.Cell>
                ))}
              </Table.Row>
            );
          }
          return null;
        },
      )}
    </>
  );
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
  columns, data, updateMyData, skipReset, handleSubmit, producerProfile, user, stockCategoryNum, profileUpdate,
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

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      const newLength = Number(stockCategoryNum);
      const originalCatLength = stockCategories.length;
      if (newLength < stockCategories.length) {
        setStockCategories(stockCategories.slice(0, newLength));
      }
      if (newLength > stockCategories.length) {
        const newCats = [];
        for (let i = 0; i < newLength - originalCatLength; i += 1) {
          newCats.push('');
        }
        setStockCategories([...stockCategories, ...newCats]);
      }
    }
  }, [stockCategoryNum]);

  const handleCategoryChange = (index, value) => {
    const newCats = stockCategories;
    newCats[index] = value;
    setStockCategories([...newCats]);
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      profileUpdate({ name: 'stockCategories', payload: stockCategories });
    }
  }, [stockCategories]);

  useEffect(() => {
    setCategories([...new Set(data.map((stockItem) => stockItem.category))].filter((category) => !!category).map((category) => ({ value: category, label: category })));
  }, [data]);

  return (
    <Table {...getTableProps()}>
      <Table.Header>
        {headerGroups.map((headerGroup) => (
          <Table.Row {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              // Add the sorting props to control sorting. For this example
              // we can add them into the header props
              <Table.HeaderCell {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
                {/* Add a sort direction indicator */}
                <span>
                  {column.isSorted
                    ? column.isSortedDesc
                      ? ' 🔽'
                      : ' 🔼'
                    : ''}
                </span>
              </Table.HeaderCell>
            ))}
          </Table.Row>
        ))}
      </Table.Header>
      <Table.Body {...getTableBodyProps()}>
        {stockCategories.map((storedCategory, index) => (
          <React.Fragment key={index}>
            <TableRows rows={rows} prepareRow={prepareRow} producerProfile={producerProfile} user={user} storedCategory={storedCategory} index={index} categories={categories} handleCategoryChange={handleCategoryChange} />
          </React.Fragment>
        ))}
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan="16">
            <Menu floated="right">
              <Modal
                trigger={<Menu.Item color="blue" name="Place Order" onClick={() => setModalOpen(true)} />}
                open={modalOpen}
              >
                <Modal.Header>Confirm Order</Modal.Header>
                <OrderModalContent orderItems={data} businessName={producerProfile.businessName} type="draftOrder" />
                <Modal.Actions>
                  <Button content="Cancel" onClick={() => setModalOpen(false)} />
                  <Button primary content="Confirm" onClick={handleSubmit} />
                </Modal.Actions>
              </Modal>
            </Menu>
          </Table.HeaderCell>
        </Table.Row>
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
};

const AvailabilityCategories = ({
  data, producerProfile, stockCategoryNum, profileUpdate, user,
}) => {
  const [orderItems, setOrderItems] = useState([...data].map((stockItem) => ({ ...stockItem, orderQuant: 0 })));

  const handleSubmit = async () => {
    const order = orderItems.filter((stockItem) => stockItem.orderQuant);
    const privateRoute = await getPrivateRoute();
    try {
      const response = await privateRoute.post('retailer/order', {
        orderItems: order,
        producerSub: producerProfile.sub,
      });
      if (response.data) {
        push('/');
      }
    } catch (err) {
      console.error(err);
    }
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
        stockCategoryNum={stockCategoryNum}
        profileUpdate={profileUpdate}
      />
    </AvailabilityStyle>
  );
};

AvailabilityCategories.propTypes = {
  data: PropTypes.array,
  producerProfile: PropTypes.object,
  profileUpdate: PropTypes.func,
  user: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

const mapStateToProps = createStructuredSelector({
  producerProfile: makeSelectProducerProfile(),
  user: makeSelectUser(),
});

function mapDispatchToProps(dispatch) {
  return {
    profileUpdate: (updateObj) => dispatch(updateProfile(updateObj)),

  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(AvailabilityCategories);
