const sortByCreatedAtDesc = (a, b) => {
  const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
  const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
  return dateB - dateA;
};

export default function normalizeProducerFeed(producerFeed) {
  if (!producerFeed) {
    return [];
  }

  const { followedProducers = [], nearbyProducers = [] } = producerFeed;
  const producerInfo = followedProducers.map(producer => [...producer.stock, ...producer.blog]);

  const withProducerProps = producerInfo
    .map((producerItems, index) => producerItems
      .map(producerItem => ({
        producer: followedProducers[index].businessName,
        producerId: followedProducers[index].businessId,
        avatarSource: followedProducers[index].avatarSource,
        ...producerItem,
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

  const groupedBeersArray = Object.keys(groupedBeers).map(dateKey => {
    const groupItems = groupedBeers[dateKey];
    const mostRecentDate = groupItems.reduce((latest, item) => {
      const itemDate = item.createdAt || item.firstDisplayed || item.updatedAt;
      return itemDate > latest ? itemDate : latest;
    }, '');

    return {
      createdAt: mostRecentDate || dateKey.split(':')[0],
      producerItems: groupItems,
    };
  });

  const nearbyProducersWithDate = nearbyProducers.map(producer => ({
    ...producer,
    createdAt: producer.createdAt || producer.updatedAt || producer.firstDisplayed || new Date(0).toISOString(),
  }));

  return [
    ...withProducerProps.filter(producerItem => !producerItem.price),
    ...groupedBeersArray,
    ...nearbyProducersWithDate,
  ].sort(sortByCreatedAtDesc);
}
