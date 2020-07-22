const checkUserStatus = (authLoading, authError, authenticated, userLoading, userLoadingError, userData) => {
  const userStatusObj = {
    authenticated: false, registered: false, loading: false, error: false,
  };
  if (authLoading) {
    userStatusObj.loading = true;
  }
  if (authError) {
    userStatusObj.error = authError;
    userStatusObj.loading = false;
    return userStatusObj;
  }
  if (authenticated) {
    userStatusObj.authenticated = true;
    // necessary in order to prevent routes from rendering before user retrieved.
    userStatusObj.loading = true;
  }
  if (userLoading) {
    userStatusObj.loading = true;
  }
  if (userLoadingError) {
    if (userLoadingError.response && userLoadingError.response.status === 404) {
      userStatusObj.loading = false;
    } else {
      userStatusObj.error = userLoadingError;
      return userStatusObj;
    }
  }
  if (userData) {
    userStatusObj.loading = false;
    userStatusObj.registered = true;
  }
  return userStatusObj;
};

export default checkUserStatus;
