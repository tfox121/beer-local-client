import React from 'react';
import { Table } from 'semantic-ui-react';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import { STOCK_HEADERS, PACK_SIZES } from '../../utils/constants';

const AvailabilityBasic = ({ stock }) => (
  <Table>
    <Table.Header>
      <Table.Row>
        {STOCK_HEADERS.map((header) => (
          <Table.HeaderCell key={header}>{header}</Table.HeaderCell>
        ))}
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {stock.map((stockItem) => {
        if (stockItem.display && stockItem.display === 'Show') {
          return (
            <Table.Row key={stockItem.id}>
              <Table.Cell width={4}>{stockItem.name}</Table.Cell>
              <Table.Cell>{stockItem.style}</Table.Cell>
              <Table.Cell>
                <NumberFormat
                  displayType="text"
                  decimalScale={1}
                  fixedDecimalScale
                  suffix="%"
                  value={stockItem.abv}
                />
              </Table.Cell>
              <Table.Cell>
                {PACK_SIZES[stockItem.packSize]}
              </Table.Cell>
              <Table.Cell>
                <NumberFormat
                  displayType="text"
                  thousandSeparator
                  decimalScale={2}
                  fixedDecimalScale
                  prefix="£"
                  value={stockItem.price}
                />
              </Table.Cell>
              <Table.Cell>{stockItem.availability}</Table.Cell>
            </Table.Row>
          );
        }
        return null;
      })}
    </Table.Body>
  </Table>
);

AvailabilityBasic.propTypes = {
  stock: PropTypes.array,
};

export default AvailabilityBasic;
