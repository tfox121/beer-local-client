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
  ADD_PROMOTION,
  ADD_PROMOTION_SUCCESS,
  ADD_PROMOTION_ERROR,
  DELETE_PROMOTION,
  DELETE_PROMOTION_SUCCESS,
  DELETE_PROMOTION_ERROR,
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
  addingPromotion: false,
  addingPromotionError: false,
  deletingPromotion: false,
  deletingPromotionError: false,
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
      draftState.updatingProfile = false;
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
        draftState.postBlogError = false;
      }
      draftState.postingBlog = false;
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
        draftState.editBlogError = false;
      }
      draftState.editingBlog = false;
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
        draftState.updatingStockError = false;
      }
      draftState.updatingStock = false;
      break;
    case UPDATE_STOCK_ERROR:
      draftState.updatingStockError = true;
      draftState.updatingStock = false;
      break;
    case ADD_PROMOTION:
      draftState.addingPromotionError = false;
      draftState.addingPromotion = true;
      break;
    case ADD_PROMOTION_SUCCESS:
      if (action.promotions) {
        draftState.profile.promotions = [...action.promotions];
        draftState.addingPromotionError = false;
      }
      draftState.addingPromotion = false;
      break;
    case ADD_PROMOTION_ERROR:
      draftState.addingPromotionError = true;
      draftState.addingPromotion = false;
      break;
    case DELETE_PROMOTION:
      draftState.deletingPromotionError = false;
      draftState.deletingPromotion = true;
      break;
    case DELETE_PROMOTION_SUCCESS:
      if (action.promotions) {
        draftState.profile.promotions = [...action.promotions];
        draftState.deletingPromotionError = false;
      }
      draftState.deletingPromotion = false;
      break;
    case DELETE_PROMOTION_ERROR:
      draftState.deletingPromotionError = true;
      draftState.deletingPromotion = false;
      break;
  }
});

export default producerProfilePageReducer;
