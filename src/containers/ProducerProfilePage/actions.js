/*
 *
 * ProducerProfilePage actions
 *
 */

import {
  FETCH_PROFILE,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_ERROR,
  CLEAR_PROFILE,
  UPDATE_PROFILE,
  UPDATE_PROFILE_OPTIONS,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_ERROR,
  SEND_ORDER,
  SEND_ORDER_SUCCESS,
  SEND_ORDER_ERROR,
  BLOG_POST,
  BLOG_POST_SUCCESS,
  BLOG_POST_ERROR,
  BLOG_EDIT,
  BLOG_EDIT_SUCCESS,
  BLOG_EDIT_ERROR,
  UPDATE_STOCK,
  UPDATE_STOCK_SUCCESS,
  UPDATE_STOCK_ERROR,
  ADD_PROMOTION,
  ADD_PROMOTION_SUCCESS,
  ADD_PROMOTION_ERROR,
  DELETE_PROMOTION,
  DELETE_PROMOTION_SUCCESS,
  DELETE_PROMOTION_ERROR,
} from './constants';

export const fetchProfile = (pathName) => ({
  type: FETCH_PROFILE,
  pathName,
});

export const profileFetched = (profile) => ({
  type: FETCH_PROFILE_SUCCESS,
  profile,
});

export const profileFetchError = (error) => ({
  type: FETCH_PROFILE_ERROR,
  error,
});

export const clearProfile = () => ({
  type: CLEAR_PROFILE,
});

export const updateProfile = (updateObj) => ({
  type: UPDATE_PROFILE,
  updateObj,
});

export const updateProfileOptions = (updateObj) => ({
  type: UPDATE_PROFILE_OPTIONS,
  updateObj,
});

export const profileUpdated = (profile) => ({
  type: UPDATE_PROFILE_SUCCESS,
  profile,
});

export const profileUpdateError = (error) => ({
  type: UPDATE_PROFILE_ERROR,
  error,
});

export const sendOrder = (orderInfo) => ({
  type: SEND_ORDER,
  orderInfo,
});

export const orderSent = () => ({
  type: SEND_ORDER_SUCCESS,
});

export const orderSendError = (error) => ({
  type: SEND_ORDER_ERROR,
  error,
});

export const postBlog = (blogPostData) => ({
  type: BLOG_POST,
  blogPostData,
});

export const blogPosted = (blogPosts) => ({
  type: BLOG_POST_SUCCESS,
  blogPosts,
});

export const blogPostError = (error) => ({
  type: BLOG_POST_ERROR,
  error,
});

export const editBlog = (blogEditData) => ({
  type: BLOG_EDIT,
  blogEditData,
});

export const blogEdited = (blogPosts) => ({
  type: BLOG_EDIT_SUCCESS,
  blogPosts,
});

export const blogEditError = (error) => ({
  type: BLOG_EDIT_ERROR,
  error,
});

export const updateStock = (stockEditData) => ({
  type: UPDATE_STOCK,
  stockEditData,
});

export const stockUpdated = (stock) => ({
  type: UPDATE_STOCK_SUCCESS,
  stock,
});

export const stockUpdateError = (error) => ({
  type: UPDATE_STOCK_ERROR,
  error,
});

export const addPromotion = (promotionAddData) => ({
  type: ADD_PROMOTION,
  promotionAddData,
});

export const promotionAdded = (promotions) => ({
  type: ADD_PROMOTION_SUCCESS,
  promotions,
});

export const promotionAddError = (error) => ({
  type: ADD_PROMOTION_ERROR,
  error,
});

export const deletePromotion = (promotionId) => ({
  type: DELETE_PROMOTION,
  promotionId,
});

export const promotionDeleted = (promotions) => ({
  type: DELETE_PROMOTION_SUCCESS,
  promotions,
});

export const promotionDeleteError = (error) => ({
  type: DELETE_PROMOTION_ERROR,
  error,
});
