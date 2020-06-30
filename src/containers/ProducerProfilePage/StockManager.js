/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-expressions */
/**
 *
 * StockManager
 *
 */

import React from 'react';
import NumberFormat from 'react-number-format';
import Dropdown from 'react-dropdown';
import Select from 'react-select';

import {
  useTable,
  usePagination,
  useSortBy,
  useFilters,
  useGroupBy,
  useExpanded,
  useRowSelect,
} from 'react-table';
import matchSorter from 'match-sorter';
import { Table, Button, Icon } from 'semantic-ui-react';
// import PropTypes from 'prop-types';

// import { FormattedMessage } from 'react-intl';
import StockTableStyle from './StockTableStyle';
import 'react-dropdown/style.css';

// Create an editable cell renderer
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

  const onCheckboxChange = () => {
    value === 'Show' ? setValue('Hide') : setValue('Show');
    setValue('Show');
    updateMyData(index, id, value === 'Show' ? 'Hide' : 'Show' || 0);
  };

  const onValueChange = (values) => {
    setValue(values.floatValue || 0);
  };

  const onSelectChange = (selectedOption) => {
    setValue(selectedOption);
    updateMyData(index, id, selectedOption.value || 0);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value || 0);
  };

  // If the initialValue is changed externall, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  if (!editable) {
    return `${initialValue}`;
  }

  let element = (
    <input
      className="table-input"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    />
  );

  if (id === 'price') {
    element = (
      <NumberFormat
        className="table-input"
        thousandSeparator
        decimalScale={2}
        fixedDecimalScale
        prefix="£"
        value={value}
        onValueChange={onValueChange}
        onBlur={onBlur}
      />
    );
  }

  if (id === 'abv') {
    element = (
      <NumberFormat
        className="table-input"
        decimalScale={1}
        fixedDecimalScale
        suffix="%"
        value={value}
        onValueChange={onValueChange}
        onBlur={onBlur}
      />
    );
  }

  if (id === 'packSize') {
    const customStyles = {
      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
      dropdownIndicator: (base) => ({ ...base, padding: '4px' }),
      indicatorSeparator: () => ({ display: 'none' }),
      container: (base) => ({ ...base, border: 'none' }),
      control: (base) => ({ ...base, minHeight: 'unset', border: 'none' }),
      valueContainer: (base) => ({ ...base, justifyContent: 'center' }),
      singleValue: (base) => ({ ...base, padding: '3px' }),
    };

    const options = [
      { value: '30l', label: '30L' },
      { value: '50l', label: '50L' },
      { value: '9g', label: '9g' },
      { value: '12x330', label: '12x330ml' },
      { value: '24x330', label: '24x330ml' },
      { value: '24x440', label: '24x440ml' },
    ];

    element = (
      <Select
        options={options}
        onChange={onSelectChange}
        value={options.filter((option) => option.value === value)[0]}
        placeholder="Select size"
        menuPortalTarget={document.body}
        styles={customStyles}
      />
    );
  }

  if (id === 'display') {
    element = (
      <input
        type="checkbox"
        id="display"
        name="display"
        value="Show"
        checked={value === 'Show'}
        onClick={onCheckboxChange}
        onChange={() => {}}
      />
    );
  }

  return element;
};

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  return (
    <input
      className="filter-input"
      style={{ maxWidth: '160px' }}
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({
  column: {
    filterValue, setFilter, preFilteredRows, id,
  },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const filterOptions = new Set();
    preFilteredRows.forEach((row) => {
      filterOptions.add(row.values[id]);
    });
    const filteredArr = [...filterOptions.values()].map((value) => ({ value, label: value }));
    filteredArr.unshift({ label: 'All', value: '' });

    return filteredArr;
  }, [id, preFilteredRows]);

  const customStyles = {
    dropdownIndicator: (base) => ({ ...base, padding: '4px' }),
    indicatorSeparator: () => ({ display: 'none' }),
    container: (base) => ({
      ...base, border: 'none', width: '100%', minWidth: '100px',
    }),
    control: (base) => ({ ...base, minHeight: 'unset' }),
    valueContainer: (base) => ({ ...base, justifyContent: 'center' }),
    singleValue: (base) => ({ ...base, padding: '3px' }),
  };
  // Render a multi-select box
  return (
    <Select
      className="select-filter"
      options={options}
      defaultValue={options[0]}
      styles={customStyles}
      value={options.filter((option) => option.value === filterValue)[0]}
      onChange={(e) => {
        setFilter(e.value || undefined);
      }}
    />
  );
}

// This is a custom filter UI that uses a
// slider to set the filter value between a column's
// min and max values
function SliderColumnFilter({
  column: {
    filterValue, setFilter, preFilteredRows, id,
  },
}) {
  // Calculate the min and max
  // using the preFilteredRows

  const [min, max] = React.useMemo(() => {
    let filterMin = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let filterMax = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach((row) => {
      filterMin = Math.min(row.values[id], filterMin);
      filterMax = Math.max(row.values[id], filterMax);
    });
    return [filterMin, filterMax];
  }, [id, preFilteredRows]);

  return (
    <>
      <input
        type="range"
        min={min}
        max={Math.ceil(max)}
        value={filterValue || Math.ceil(max)}
        onChange={(e) => {
          setFilter(parseFloat(e.target.value));
        }}
      />
      {/* <Button size="mini" type="button" onClick={() => setFilter(undefined)}>
        Off
      </Button> */}
      <Icon name="cancel" onClick={() => setFilter(undefined)} />
    </>
  );
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

// Be sure to pass our updateMyData and the skipReset option
const MyTable = ({
  columns, data, updateMyData, skipReset, setSelected,
}) => {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => rows.filter((row) => {
        const rowValue = row.values[id];
        return rowValue !== undefined
          ? String(rowValue)
            .toLowerCase()
            .startsWith(String(filterValue).toLowerCase())
          : true;
      }),
    }),
    [],
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
      // And also our default editable cell
      Cell: EditableCell,
    }),
    [],
  );

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, selectedRowIds },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      // updateMyData isn't part of the API, but
      // anything we put into these options will
      // automatically be available on the instance.
      // That way we can call this function from our
      // cell renderer!
      updateMyData,
      // We also need to pass this so the page doesn't change
      // when we edit the data.
      autoResetPage: !skipReset,
      autoResetSelectedRows: !skipReset,
      disableMultiSort: true,
    },
    useFilters,
    useGroupBy,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
    // Here we will use a plugin to add our selection column
    (hooks) => {
      hooks.visibleColumns.push((tableColumns) => [
        {
          id: 'selection',
          // Make this column a groupByBoundary. This ensures that groupBy columns
          // are placed after it
          groupByBoundary: true,
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div className="checkbox">
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...tableColumns,
      ]);
    },
  );

  const customStyles = {
    dropdownIndicator: (base) => ({ ...base, padding: '4px' }),
    indicatorSeparator: () => ({ display: 'none' }),
    container: (base) => ({
      ...base, border: 'none', width: '100px',
    }),
    control: (base) => ({ ...base, minHeight: 'unset' }),
    valueContainer: (base) => ({ ...base, justifyContent: 'center' }),
    singleValue: (base) => ({ ...base, padding: '3px' }),
  };

  // track selected rows
  React.useEffect(() => {
    setSelected(selectedRowIds);
  }, [selectedRowIds, setSelected]);

  // Render the UI for your table
  return (
    <>
      <StockTableStyle>
        <Table {...getTableProps()} className="stock-table" compact>
          <Table.Header className="table-header">
            {headerGroups.map((headerGroup, index) => (
              <Table.Row key={index} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, i) => (
                  <th
                    key={i}
                    className="header-cell"
                    width={column.width}
                    {...column.getHeaderProps()}
                  >
                    <div className="column-header">
                      <span {...column.getSortByToggleProps()}>
                        {column.render('Header')}
                        {/* Add a sort direction indicator */}
                        {column.isSorted
                          ? column.isSortedDesc
                            ? ' ðŸ”½'
                            : ' ðŸ”¼'
                          : ''}
                      </span>
                    </div>
                    {/* Render the columns filter UI */}
                    <div className="filter-container">
                      {column.canFilter ? column.render('Filter') : null}
                    </div>
                  </th>
                ))}
              </Table.Row>
            ))}
          </Table.Header>
          <Table.Body className="table-body" {...getTableBodyProps()}>
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <Table.Row key={index} {...row.getRowProps()}>
                  {row.cells.map((cell, i) => (
                    <Table.Cell
                      key={i}
                      className="table-cell"
                      {...cell.getCellProps()}
                    >
                      {cell.isGrouped ? (
                        // If it's a grouped cell, add an expander and row count
                        <>
                          <span {...row.getToggleRowExpandedProps()}>
                            {row.isExpanded ? 'ðŸ‘‡' : 'ðŸ‘‰'}
                          </span>
                          {' '}
                          {cell.render('Cell', { editable: false })}
                          {' '}
                          (
                          {row.subRows.length}
                          )
                        </>
                      ) : cell.isAggregated ? (
                        // If the cell is aggregated, use the Aggregated
                        // renderer for cell
                        cell.render('Aggregated')
                      ) : cell.isPlaceholder ? null : ( // For cells with repeated values, render null
                        // Otherwise, just render the regular cell
                        cell.render('Cell', { editable: true })
                      )}
                    </Table.Cell>
                  ))}
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
        {/*
        Pagination can be built however you'd like.
        This is just a very basic UI implementation:
      */}
      </StockTableStyle>

      <div className="pagination">
        <Button
          type="button"
          size="mini"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          <Icon name="angle double left" />
        </Button>
        {' '}
        <Button
          type="button"
          size="mini"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          <Icon name="angle left" />
          {' '}
        </Button>
        {' '}
        <Button
          type="button"
          size="mini"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          <Icon name="angle right" />
        </Button>
        {' '}
        <Button
          type="button"
          size="mini"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          <Icon name="angle double right" />
        </Button>
        {' '}
        <span>
          Page
          {' '}
          <strong>
            {pageIndex + 1}
            {' '}
            of
            {' '}
            {pageOptions.length}
          </strong>
          {' '}
        </span>
        <span>
          &nbsp;| Go to page:
          {' '}
          <input
            className="pagination-input"
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const toPage = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(toPage);
            }}
          />
        </span>
        &nbsp;
        <Select
          defaultValue={{ value: 10, label: 'Show 10' }}
          value={{ value: pageSize, label: `Show ${pageSize}` }}
          styles={customStyles}
          onChange={(e) => {
            setPageSize(Number(e.value));
          }}
          options={[10, 20, 30, 40, 50].map((value) => ({ value, label: `Show ${value}` }))}
        />
        {/* {[10, 20, 30, 40, 50].map((pageSizeVal) => (
            <option key={pageSizeVal} value={pageSizeVal}>
              Show
              {' '}
              {pageSizeVal}
            </option>
          ))}
        </Select> */}
      </div>
    </>
  );
};

// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
}

function filterLesserThan(rows, id, filterValue) {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue <= filterValue;
  });
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = (val) => typeof val !== 'number';

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  },
);

const StockManager = ({
  data, setData, setSelected, setStockEditPending,
}) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        filter: 'fuzzyText',
        // Use our custom `fuzzyText` filter on this column
        // Use another two-stage aggregator here to
        // first count the UNIQUE values from the rows
        // being aggregated, then sum those counts if
        // they are aggregated further
      },
      {
        Header: 'SKU',
        accessor: 'sku',
      },
      {
        Header: 'Style',
        accessor: 'style',
      },
      {
        Header: 'ABV',
        accessor: 'abv',
        Filter: SliderColumnFilter,
        filter: filterLesserThan,
        // Aggregate the average age of visitors
        aggregate: 'average',
      },
      {
        Header: 'Pack Size',
        accessor: 'packSize',
        Filter: SelectColumnFilter,
      },
      {
        Header: 'Availability',
        accessor: 'availability',
        Filter: SelectColumnFilter,
        // filter: 'includes',
      },
      {
        Header: 'List Price',
        accessor: 'price',
        Filter: SliderColumnFilter,
        filter: filterLesserThan,
        // eslint-disable-next-line react/display-name
        // Cell: EditableCell((props) => toCurrency(props.value)),
        // Use our custom roundedMedian aggregator
        // aggregate: roundedMedian,
        // Aggregated: ({ value }) => `${value} (med)`,
      },
      {
        Header: 'Display',
        accessor: 'display',
        Filter: SelectColumnFilter,
        // eslint-disable-next-line react/display-name
        // Cell: EditableCell((props) => toCurrency(props.value)),
        // Use our custom roundedMedian aggregator
        // aggregate: roundedMedian,
        // Aggregated: ({ value }) => `${value} (med)`,
      },
    ],
    [],
  );

  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.
  const skipResetRef = React.useRef(false);

  // // Update DB with new data
  // const updateSourceData = async newData => {
  //   if (newData.id) {
  //     const response = await fetch(
  //       'http://localhost:8000/api/user/brewery/stock',
  //       {
  //         method: 'PATCH',
  //         body: JSON.stringify(newData),
  //       },
  //     );
  //     console.log(response);
  //   }
  // };

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    skipResetRef.current = true;
    setStockEditPending(true);
    setData((old) => old.map((row, index) => {
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

  // After data changes, we turn the flag back off
  // so that if data actually changes when we're not
  // editing it, the page is reset
  React.useEffect(() => {
    skipResetRef.current = false;
  }, [data]);

  // const isInitialMount = React.useRef(true);

  // React.useEffect(() => {
  //   if (isInitialMount.current) {
  //     isInitialMount.current = false;
  //   } else {
  //     const updateSourceData = async (newData) => {
  //       const response = await fetch('http://localhost:8000/api/user/brewery/stock', {
  //         method: 'PATCH',
  //         body: JSON.stringify(newData),
  //       });
  //       console.log(response);
  //     };
  //     updateSourceData(data);
  //   }
  // }, [data]);

  return (
    <MyTable
      columns={columns}
      data={data}
      updateMyData={updateMyData}
      skipReset={skipResetRef.current}
      setSelected={setSelected}
    />
  );
};

export default StockManager;
