/**
 *
 * StockModal
 *
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import shortid from 'shortid';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  Modal, Button, Confirm, Loader, Icon,
} from 'semantic-ui-react';
import { withRouter } from 'react-router';

import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import { getPrivateRoute } from '../../utils/api';
import arrayMove from '../../utils/arrayMove';
import { fetchProfile } from '../ProducerProfilePage/actions';
import reducer from '../ProducerProfilePage/reducer';
import saga from '../ProducerProfilePage/saga';

import makeSelectProducerProfilePage from '../ProducerProfilePage/selectors';
import StockModalStyle from './StockModalStyle';
import StockModalMenu from './StockModalMenu';
import StockManager from './StockManager';

export function StockModal({ producerProfilePage, profileFetch, location }) {
  useInjectReducer({ key: 'producerProfilePage', reducer });
  useInjectSaga({ key: 'producerProfilePage', saga });

  const { stock } = producerProfilePage.profile;

  const { fetchingProfile } = producerProfilePage;

  const stockDataTemplate = {
    id: shortid.generate(),
    name: '',
    sku: '',
    style: '',
    category: '',
    abv: 0.0,
    packSize: '',
    price: 0.0,
    availability: '',
    display: 'Hide',
  };

  const [stockData, setStockData] = useState([stockDataTemplate]);
  const [selected, setSelected] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [stockEditPending, setStockEditPending] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (fetchingProfile && !loadingData) {
      setDataLoaded(false);
      setLoadingData(true);
      console.log('LOADING');
      return;
    }
    if (!fetchingProfile && loadingData) {
      setLoadingData(false);
      setDataLoaded(true);
      setTimeout(() => {
        setDataLoaded(false);
      }, 3000);
    }
  }, [fetchingProfile, loadingData]);

  useEffect(() => {
    if (stock && stock.length) {
      setStockData(stock);
    }
  }, [stock]);

  const moveStockLineUp = () => {
    const rows = Object.keys(selected);
    if (rows.includes('0')) {
      return;
    }
    let tempArr = [...stockData];
    rows.forEach((row) => {
      tempArr = arrayMove(tempArr, Number(row), Number(row) - 1);
    });
    // const newSelected = rows.reduce((obj, val) => { obj[Number(val) - 1] = true; return obj; }, {});
    setStockData(tempArr);
  };

  const moveStockLineDown = () => {
    console.log(selected);
    const rows = Object.keys(selected);
    if (rows.includes(rows.length.toString())) {
      return;
    }
    let tempArr = [...stockData];
    rows.reverse().forEach((row) => {
      tempArr = arrayMove(tempArr, Number(row), Number(row) + 1);
    });
    setStockData(tempArr);
  };

  const addNewStockLine = async () => {
    setStockData([stockDataTemplate, ...stockData]);
  };

  const deleteStockItems = async () => {
    const rows = Object.keys(selected);
    const deleteIds = [];
    const newData = stockData.filter((row, index) => {
      if (rows.includes(index.toString())) {
        deleteIds.push(row.id);
        return false;
      }
      return true;
    });
    setStockData(newData);
  };

  const copyStockItems = async () => {
    const rows = Object.keys(selected);
    const filteredData = stockData.filter((row, index) => rows.includes(index.toString()));
    const duplicateRows = filteredData.map((row) => ({
      ...row,
      id: shortid.generate(),
    }));
    setStockData([...duplicateRows, ...stockData]);
  };

  const updateStock = async () => {
    const privateRoute = await getPrivateRoute();
    await privateRoute.patch('/producer/stock', stockData);
    setStockEditPending(false);
    profileFetch(location);
  };

  const handleModalClose = () => {
    if (stockEditPending) {
      return setConfirmOpen(true);
    }
    return setModalOpen(false);
  };

  const handleCloseCancel = () => {
    setConfirmOpen(false);
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
    setModalOpen(false);
    setStockEditPending(false);
    if (stock && stock.length) {
      return setStockData(stock);
    }
    return setStockData([stockDataTemplate]);
  };

  return (
    <>
      <Modal
        size="large"
        open={modalOpen}
        onClose={handleModalClose}
        closeOnDimmerClick={!stockEditPending}
        closeIcon
        trigger={<Button primary onClick={() => setModalOpen(true)}>Edit Stock</Button>}
      >
        <Modal.Header>
          <StockModalMenu
            addNewStockLine={addNewStockLine}
            deleteStockItems={deleteStockItems}
            copyStockItems={copyStockItems}
            moveStockLineUp={moveStockLineUp}
            moveStockLineDown={moveStockLineDown}
          />
        </Modal.Header>
        <StockModalStyle>
          <Modal.Content>
            <StockManager
              data={stockData}
              setData={setStockData}
              setSelected={setSelected}
              setStockEditPending={setStockEditPending}
            />
          </Modal.Content>
        </StockModalStyle>
        <Modal.Actions>
          <Button onClick={handleModalClose} content="Close" />
          <Button
            className="stock-save"
            onClick={updateStock}
            primary={!dataLoaded}
            positive={dataLoaded}
          >
            {loadingData && <Loader active inline="centered" size="mini" />}
            {dataLoaded && <Icon name="check" />}
            {!dataLoaded && !loadingData && 'Save'}
          </Button>
        </Modal.Actions>
      </Modal>
      <Confirm
        size="tiny"
        open={confirmOpen}
        onCancel={handleCloseCancel}
        onConfirm={handleCloseConfirm}
        content="Close stock manager without saving?"
      />
    </>
  );
}

StockModal.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  producerProfilePage: PropTypes.object,
  profileFetch: PropTypes.func,
  location: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  producerProfilePage: makeSelectProducerProfilePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    profileFetch: (location) => dispatch(fetchProfile(location.pathname)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default withRouter(compose(withConnect)(StockModal));
