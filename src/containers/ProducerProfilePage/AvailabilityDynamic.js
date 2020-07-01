import React, { useState } from 'react';
import { useTable, useSortBy } from 'react-table';
import { Table, Input, Menu } from 'semantic-ui-react';

import AvailabilityStyle from './AvailabilityStyle';

function AvailibilityTable({
  columns, data, orderItems, handleChange, handleSubmit,
}) {
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
    },
    useSortBy,
  );

  // We don't want to render all 2000 rows for this example, so cap
  // it at 20 for this use case

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
          (row, i) => {
            prepareRow(row);
            return (
              <Table.Row {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  if (cell.column.id === 'order #') {
                    return (
                      <Table.Cell {...cell.getCellProps()}><Input name={row.id} onChange={handleChange} size="small" type="number" fluid /></Table.Cell>
                    );
                  }
                  return (
                    <Table.Cell {...cell.getCellProps()}>{cell.render('Cell')}</Table.Cell>
                  );
                })}
              </Table.Row>
            );
          },
        )}
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan="16">
            <Menu floated="right">
              <Menu.Item color="blue" name="Add to cart" onClick={handleSubmit} />
            </Menu>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>

    </Table>
  );
}

const AvailabilityDynamic = ({ data }) => {
  const [orderItems, setOrderItems] = useState({});

  const handleChange = (evt) => {
    setOrderItems({ ...orderItems, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = () => {
    const draftOrder = data.filter((stockItem, index) => orderItems[index]).map((stockItem, index) => ({ ...stockItem, orderQuantity: orderItems[index] }));
    console.log(draftOrder);
  };

  const columns = React.useMemo(
    () => [

      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Style',
        accessor: 'style',
      },
      {
        Header: 'ABV',
        accessor: 'abv',
      },
      {
        Header: 'Pack Size',
        accessor: 'packSize',
      },
      {
        Header: 'List Price',
        accessor: 'price',
      },
      {
        Header: 'Availability',
        accessor: 'availability',
      },
      {
        Header: 'Order #',
        accessor: 'order #',
      },

    ],
    [],
  );

  if (!data) {
    return null;
  }

  return (
    <AvailabilityStyle>
      <AvailibilityTable columns={columns} data={data} handleChange={handleChange} handleSubmit={handleSubmit} orderItems={orderItems} />
    </AvailabilityStyle>
  );
};

export default AvailabilityDynamic;
