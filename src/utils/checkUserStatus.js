const checkUserStatus = (authLoading, authError, authenticated, userLoading, userLoadingError, userData) => {
  const userStatusObj = {
    authenticated: false, registered: false, loading: false, error: false, notFound: false, connectionError: false,
  };
  if (authLoading) {
    userStatusObj.loading = true;
  }
  if (authError) {
    userStatusObj.error = authError;
    userStatusObj.loading = false;
    return userStatusObj;
  }
  if (userLoadingError) {
    // Check for connection errors (backend unavailable)
    const isConnectionError = !userLoadingError.response
      && (userLoadingError.code === 'ECONNREFUSED'
        || userLoadingError.message?.includes('ERR_CONNECTION_REFUSED')
        || userLoadingError.message?.includes('Network Error')
        || userLoadingError.request);

    if (isConnectionError) {
      userStatusObj.loading = false;
      userStatusObj.connectionError = true;
      userStatusObj.error = userLoadingError;
      return userStatusObj;
    }

    if (userLoadingError.response && userLoadingError.response.status === 404) {
      userStatusObj.loading = false;
      userStatusObj.notFound = true;
    } else {
      userStatusObj.error = userLoadingError;
      userStatusObj.loading = false;
      return userStatusObj;
    }
  }
  if (authenticated) {
    userStatusObj.authenticated = true;
    // Only keep the app in loading while the user request is actually in flight.
    if (userLoading && !userLoadingError) {
      userStatusObj.loading = true;
    }
  }
  if (userData) {
    userStatusObj.loading = false;
    userStatusObj.registered = true;
  }
  return userStatusObj;
};

export default checkUserStatus;
