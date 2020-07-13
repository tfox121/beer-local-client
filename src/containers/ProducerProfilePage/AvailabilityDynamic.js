/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
import React, { useState, useEffect } from 'react';
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
import { PACK_SIZES } from '../../utils/constants';
import { getPrivateRoute } from '../../utils/api';

import AvailabilityStyle from './AvailabilityStyle';
import { makeSelectProducerProfile, makeSelectOrderSending } from './selectors';
import OrderModalContent from '../../components/OrderModalContent';
import { sendOrder } from './actions';

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
  columns, data, updateMyData, skipReset, handleSubmit, producerProfile, orderSending,
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

  const handleSendOrder = () => {
    handleSubmit();
    while (orderSending) {
      console.log('Sending');
    }
    setModalOpen(false);
  };

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
        {rows.map(
          (row) => {
            if (row.original.display === 'Show') {
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
                  <Button primary content="Confirm" loading={orderSending} onClick={handleSendOrder} />
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
  orderSending: PropTypes.bool,
};

const AvailabilityDynamic = ({
  data, producerProfile, orderSend, orderSending,
}) => {
  const [orderItems, setOrderItems] = useState([...data].map((stockItem) => ({ ...stockItem, orderQuant: 0 })));

  const handleSubmit = async () => {
    const order = orderItems.filter((stockItem) => stockItem.orderQuant);
    orderSend({ orderItems: order, producerSub: producerProfile.sub });
    // const privateRoute = await getPrivateRoute();
    // try {
    //   const response = await privateRoute.post('/orders', {
    //     orderItems: order,
    //     producerSub: producerProfile.sub,
    //   });
    //   if (response.data) {
    //     push('/');
    //   }
    // } catch (err) {
    //   console.error(err);
    // }
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
        producerProfile={producerProfile}
        // handleChange={handleChange}
        handleSubmit={handleSubmit}
        orderSending={orderSending}
        updateMyData={updateMyData}
        skipReset={skipResetRef.current}
      />
    </AvailabilityStyle>
  );
};

AvailabilityDynamic.propTypes = {
  data: PropTypes.array,
  producerProfile: PropTypes.object,
  orderSend: PropTypes.func,
  orderSending: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  producerProfile: makeSelectProducerProfile(),
  orderSending: makeSelectOrderSending(),
});

function mapDispatchToProps(dispatch) {
  return {
    orderSend: (orderObj) => dispatch(sendOrder(orderObj)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(AvailabilityDynamic);
