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
          .sort((a, b) => {
            if (a.createdAt > b.createdAt) return -1;
            if (a.createdAt < b.createdAt) return 1;
            return 0;
          });
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
        const groupedBeersArray = Object.keys(groupedBeers).map((dateKey) => {
          const groupItems = groupedBeers[dateKey];
          // Use the most recent createdAt from items in the group, or firstDisplayed if available
          const mostRecentDate = groupItems.reduce((latest, item) => {
            const itemDate = item.createdAt || item.firstDisplayed || item.updatedAt;
            return itemDate > latest ? itemDate : latest;
          }, '');
          return {
            createdAt: mostRecentDate || dateKey.split(':')[0],
            producerItems: groupItems,
          };
        });

        // Ensure nearbyProducers have createdAt for consistent sorting
        const nearbyProducersWithDate = (nearbyProducers || []).map((producer) => ({
          ...producer,
          createdAt: producer.createdAt || producer.updatedAt || producer.firstDisplayed || new Date(0).toISOString(),
        }));

        const fullArrayWithBeerGrouped = [
          ...withProducerProps.filter((producerItem) => !producerItem.price),
          ...groupedBeersArray,
          ...nearbyProducersWithDate,
        ];
        const dateSorted = fullArrayWithBeerGrouped.sort((a, b) => {
          // Ensure we're comparing dates properly - convert to Date objects for reliable comparison
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          // Sort newest first (descending order)
          return dateB - dateA;
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
    default:
      break;
  }
});

export default RetailerDashboardPageReducer;
