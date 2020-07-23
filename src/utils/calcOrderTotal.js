/* eslint-disable no-param-reassign */
const calcOrderTotal = (orderItems) => orderItems.reduce((acc, val) => { acc += (val.orderChange !== 'delete' && val.price * val.orderQuant); return acc; }, 0);

export default calcOrderTotal;
