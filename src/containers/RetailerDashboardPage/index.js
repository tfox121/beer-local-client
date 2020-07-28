/* eslint-disable no-nested-ternary */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { createStructuredSelector } from 'reselect';
import {
  Header, Segment, Feed, Dimmer, Loader,
} from 'semantic-ui-react';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import reducer from './reducer';
import saga from './saga';

import PageWrapper from '../../components/PageWrapper';
import { makeSelectUser } from '../App/selectors';
import RetailerDashboardStyle from './RetailerDashboardStyle';
import FeedItem from './FeedItem';
import { fetchProducerFeed } from './actions';
import { makeSelectProducerFeed, makeSelectProducerFeedFetching } from './selectors';

const RetailerDashboardPage = ({
  userProfile,
  producerFeedFetch,
  producerFeed,
  producerFeedFetching,
}) => {
  useInjectReducer({ key: 'RetailerDashboardPage', reducer });
  useInjectSaga({ key: 'RetailerDashboardPage', saga });

  useEffect(() => {
    producerFeedFetch();
  }, [producerFeedFetch]);

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
      <Segment basic className="primary wrapper">
        <Header as="h1">Updates</Header>
        <RetailerDashboardStyle>
          <Feed size="large">
            {producerFeed.map((producerItem) => (
              <React.Fragment key={`producerItem._id-${Math.random()}`}>
                <FeedItem producerItem={producerItem} userProfile={userProfile} />
              </React.Fragment>
            ))}
          </Feed>
        </RetailerDashboardStyle>
      </Segment>
    </PageWrapper>
  );
};

RetailerDashboardPage.propTypes = {
  userProfile: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  producerFeedFetch: PropTypes.func,
  producerFeed: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  producerFeedFetching: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  userProfile: makeSelectUser(),
  producerFeed: makeSelectProducerFeed(),
  producerFeedFetching: makeSelectProducerFeedFetching(),
});

function mapDispatchToProps(dispatch) {
  return {
    producerFeedFetch: () => dispatch(fetchProducerFeed()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
)(RetailerDashboardPage);
