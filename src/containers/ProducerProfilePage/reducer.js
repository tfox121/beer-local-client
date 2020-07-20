/*
 *
 * ProducerProfilePage reducer
 *
 */
import produce from 'immer';
import {
  FETCH_PROFILE,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_ERROR,
  UPDATE_PROFILE,
  UPDATE_PROFILE_OPTIONS,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_ERROR,
  CLEAR_PROFILE,
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
} from './constants';

export const initialState = {
  fetchingProfile: false,
  fetchProfileError: false,
  updatingProfile: false,
  updateProfileError: false,
  profile: false,
  sendingOrder: false,
  sendOrderError: false,
  postingBlog: false,
  postBlogError: false,
  editingBlog: false,
  editBlogError: false,
  updatingStock: false,
  updatingStockError: false,
};

/* eslint-disable default-case, no-param-reassign */
const producerProfilePageReducer = (state = initialState, action) => produce(state, (draftState) => {
  switch (action.type) {
    default:
      break;
    case FETCH_PROFILE:
      draftState.fetchProfileError = false;
      draftState.fetchingProfile = true;
      break;
    case FETCH_PROFILE_SUCCESS:
      if (action.profile) {
        draftState.profile = action.profile;
        draftState.fetchProfileError = false;
        draftState.fetchProfileError = false;
      }
      draftState.fetchingProfile = false;
      break;
    case FETCH_PROFILE_ERROR:
      draftState.fetchProfileError = true;
      draftState.fetchingProfile = false;
      break;
    case CLEAR_PROFILE:
      draftState.profile = false;
      break;
    case UPDATE_PROFILE:
      draftState.updateProfileError = false;
      draftState.updatingProfile = true;
      break;
    case UPDATE_PROFILE_OPTIONS:
      draftState.updateProfileError = false;
      draftState.updatingProfile = true;
      break;
    case UPDATE_PROFILE_SUCCESS:
      if (action.profile) {
        draftState.profile = action.profile;
        draftState.updateProfileError = false;
      }
      break;
    case UPDATE_PROFILE_ERROR:
      if (action.error) {
        draftState.updateProfileError = action.error;
        draftState.updatingProfile = false;
      }
      break;
    case SEND_ORDER:
      draftState.sendOrderError = false;
      draftState.sendingOrder = true;
      break;
    case SEND_ORDER_SUCCESS:
      draftState.sendingOrder = false;
      break;
    case SEND_ORDER_ERROR:
      draftState.sendOrderError = true;
      draftState.sendingOrder = false;
      break;
    case BLOG_POST:
      draftState.postBlogError = false;
      draftState.postingBlog = true;
      break;
    case BLOG_POST_SUCCESS:
      if (action.blogPosts) {
        draftState.profile.blog = [...action.blogPosts];
      }
      draftState.postingBlog = false;
      draftState.postBlogError = false;
      break;
    case BLOG_POST_ERROR:
      draftState.postBlogError = true;
      draftState.postingBlog = false;
      break;
    case BLOG_EDIT:
      draftState.editBlogError = false;
      draftState.editingBlog = true;
      break;
    case BLOG_EDIT_SUCCESS:
      if (action.blogPosts) {
        draftState.profile.blog = [...action.blogPosts];
      }
      draftState.editingBlog = false;
      draftState.editBlogError = false;
      break;
    case BLOG_EDIT_ERROR:
      draftState.editBlogError = true;
      draftState.editingBlog = false;
      break;
    case UPDATE_STOCK:
      draftState.updatingStockError = false;
      draftState.updatingStock = true;
      break;
    case UPDATE_STOCK_SUCCESS:
      if (action.stock) {
        draftState.profile.stock = [...action.stock];
      }
      draftState.updatingStockError = false;
      draftState.updatingStock = false;
      break;
    case UPDATE_STOCK_ERROR:
      draftState.updatingStockError = true;
      draftState.updatingStock = false;
      break;
  }
});

export default producerProfilePageReducer;
