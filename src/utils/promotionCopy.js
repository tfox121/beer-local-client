/* eslint-disable no-nested-ternary */
import React from 'react';

import { PACK_SIZES } from './constants';

const minSpendPromoCopy = (value) => (
  <>
    If you spend at least
    {' '}
    <strong>
      £
      {Number(value).toFixed(2)}
    </strong>
    ,
  </>
);

const multibuyPromoCopy = (quantity, item) => (
  <>
    If you buy at least
    {' '}
    <strong>
      {quantity}
      x
      {' '}
      {item}
    </strong>
    ,
  </>
);

const moneyOffDiscountCopy = (value) => (
  <>
    {' '}
    you will get a
    {' '}
    <strong>
      £
      {Number(value).toFixed(2)}
    </strong>
    {' '}
    discount.
  </>
);

const freeItemDiscountCopy = (quantity, item) => (
  <>
    {' '}
    you will get
    {' '}
    <strong>
      {quantity}
      x
      {' '}
      {item}
    </strong>
    {' '}
    for free.
  </>
);

const percentageOffDiscountCopy = (percentage) => (
  <>
    {' '}
    you will get a
    {' '}
    <strong>
      {Number(percentage).toFixed(1)}
      %
    </strong>
    {' '}
    discount.
  </>
);

const promotionCopySelection = (promotionObj, availableStockArr) => {
  if (promotionObj.multibuyType === 'product' && !availableStockArr.filter((stockItem) => stockItem.key === promotionObj.multibuyProduct).length) {
    return null;
  }
  if (promotionObj.multibuyType === 'packageType' && !PACK_SIZES[promotionObj.multibuyPackageType]) {
    return null;
  }
  if (promotionObj.discountType === 'freeItems' && !availableStockArr.filter((stockItem) => stockItem.key === promotionObj.freeItemProduct).length) {
    return null;
  }
  return (
    <>
      {promotionObj.condition === 'multibuy' ? (
        promotionObj.multibuyType === 'product'
          ? multibuyPromoCopy(promotionObj.multibuyQuantity, availableStockArr.filter((stockItem) => stockItem.key === promotionObj.multibuyProduct)[0].text)
          : multibuyPromoCopy(promotionObj.multibuyQuantity, PACK_SIZES[promotionObj.multibuyPackageType])
      ) : (
        minSpendPromoCopy(promotionObj.minSpend)
      )}
      {promotionObj.discountType === 'moneyOff' && (
        moneyOffDiscountCopy(promotionObj.moneyOff)
      )}
      {promotionObj.discountType === 'percentageOff' && (
        percentageOffDiscountCopy(promotionObj.percentageOff)
      )}
      {promotionObj.discountType === 'freeItems' && (
        freeItemDiscountCopy(promotionObj.freeItemQuantity, availableStockArr.filter((stockItem) => stockItem.key === promotionObj.freeItemProduct)[0].text)
      )}
    </>
  );
};

export default promotionCopySelection;
