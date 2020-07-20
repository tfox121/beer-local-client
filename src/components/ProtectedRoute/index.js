import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ isEnabled, ...props }) => (isEnabled) ? <Route {...props} /> : <Redirect to="/" />;

ProtectedRoute.propTypes = {
  isEnabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};

export default ProtectedRoute;
