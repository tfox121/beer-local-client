import produce from 'immer';
import {
  FETCH_PRODUCER_FEED,
  FETCH_PRODUCER_FEED_SUCCESS,
  FETCH_PRODUCER_FEED_ERROR,
} from './constants';

export const initialState = {
  fetchingProducerFeed: false,
  fetchingProducerFeedError: false,
  producerFeed: false,
};

/* eslint-disable default-case, no-param-reassign */
const RetailerDashboardPageReducer = (state = initialState, action) => produce(state, (draftState) => {
  switch (action.type) {
    default:
      break;
    case FETCH_PRODUCER_FEED:
      draftState.fetchingProducerFeedError = false;
      draftState.fetchingProducerFeed = true;
      break;
    case FETCH_PRODUCER_FEED_SUCCESS:
      if (action.producerFeed) {
        const { followedProducers, nearbyProducers } = action.producerFeed;
        const producerInfo = followedProducers.map((producer) => [...producer.stock, ...producer.blog]);

        const withProducerProps = producerInfo
          .map((producerItems, index) => producerItems
            .map((producerItem) => ({
              producer: followedProducers[index].businessName, producerId: followedProducers[index].businessId, avatarSource: followedProducers[index].avatarSource, ...producerItem,
            })))
          .flat()
          .sort((a, b) => (a.createdAt > b.createdAt) ? -1 : ((a.createdAt < b.createdAt) ? 1 : 0));
        const groupedBeers = withProducerProps.reduce((groups, producerItem) => {
          const groupsObj = groups;
          if (producerItem.price && producerItem.display === 'Show') {
            const date = producerItem.firstDisplayed.split('T')[0];
            if (!groups[`${date}:${producerItem.producerId}`]) {
              groupsObj[`${date}:${producerItem.producerId}`] = [];
            }
            groupsObj[`${date}:${producerItem.producerId}`].push(producerItem);
          }
          return groupsObj;
        }, {});
        const groupedBeersArray = Object.keys(groupedBeers).map((date) => ({
          createdAt: date.split(':')[0],
          producerItems: groupedBeers[date],
        }));

        const fullArrayWithBeerGrouped = [...withProducerProps.filter((producerItem) => !producerItem.price), ...groupedBeersArray, ...nearbyProducers];
        const dateSorted = fullArrayWithBeerGrouped.sort((a, b) => {
          if (a.createdAt > b.createdAt) return -1;
          if (a.createdAt < b.createdAt) return 1;
          return 0;
        });
        console.log('SORTED', dateSorted);

        draftState.producerFeed = dateSorted;
        draftState.fetchingProducerFeedError = false;
      }
      draftState.fetchingProducerFeed = false;
      break;
    case FETCH_PRODUCER_FEED_ERROR:
      draftState.fetchingProducerFeedError = true;
      draftState.fetchingProducerFeed = false;
      break;
  }
});

export default RetailerDashboardPageReducer;
