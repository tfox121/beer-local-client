/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { useAuth0 } from '@auth0/auth0-react';

import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import PageWrapper from '../../components/PageWrapper';
// import { loadSession, closeSession } from './actions';
import reducer from './reducer';
import saga from './saga';

const key = 'global';

const ProducerListPage = ({ userFetch, userClear }) => {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  const { isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      userFetch();
      return;
    }
    userClear();
  }, [isAuthenticated]);

  return (
    <PageWrapper>
      <div>Breweries Available</div>
    </PageWrapper>
  );
};

ProducerListPage.propTypes = {
  // userProfile: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  userFetch: PropTypes.func,
  userClear: PropTypes.func,
};

// const mapStateToProps = createStructuredSelector({
//   userProfile: makeSelectUser(),
//   loading: makeSelectFetchingUser(),
//   error: makeSelectUserFetchError(),
// });

// export function mapDispatchToProps(dispatch) {
//   return {
//     dispatch
//   };
// }

// const withConnect = connect(
//   mapStateToProps,
//   mapDispatchToProps,
// );

// export default compose(
//   withConnect,
//   memo,
// )(ProducerListPage);

export default ProducerListPage;
