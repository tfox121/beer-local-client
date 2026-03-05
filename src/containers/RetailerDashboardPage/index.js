/* eslint-disable no-nested-ternary */
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Header, Segment, Feed, Dimmer, Loader } from 'semantic-ui-react';

import PageWrapper from '../../components/PageWrapper';
import RetailerDashboardStyle from './RetailerDashboardStyle';
import FeedItem from './FeedItem';
import { useRetailerFeedQuery } from '../../queries/retailerFeed';
import { useUserQuery } from '../../queries/user';

const RetailerDashboardPage = () => {
  const { isAuthenticated } = useAuth0();
  const { data: userProfile } = useUserQuery({ enabled: isAuthenticated });
  const { data: producerFeed = [], isLoading: producerFeedFetching } =
    useRetailerFeedQuery();

  if (!producerFeed) {
    return null;
  }

  return (
    <PageWrapper>
      {producerFeedFetching && (
        <Dimmer inverted active page>
          <Loader inverted />
        </Dimmer>
      )}
      <Segment basic className='primary wrapper'>
        <Header as='h1'>Updates</Header>
        <RetailerDashboardStyle>
          <Feed size='large'>
            {producerFeed.map((producerItem, index) => {
              // Create a stable key - use _id if available, or index as fallback
              const key =
                producerItem._id ||
                producerItem.producerItems?.[0]?._id ||
                `feed-item-${index}`;
              return (
                <React.Fragment key={key}>
                  <FeedItem
                    producerItem={producerItem}
                    userProfile={userProfile}
                  />
                </React.Fragment>
              );
            })}
          </Feed>
        </RetailerDashboardStyle>
      </Segment>
    </PageWrapper>
  );
};

export default RetailerDashboardPage;
