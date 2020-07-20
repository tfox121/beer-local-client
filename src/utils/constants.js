export const RESTART_ON_REMOUNT = '@@saga-injector/restart-on-remount';
export const DAEMON = '@@saga-injector/daemon';
export const ONCE_TILL_UNMOUNT = '@@saga-injector/once-till-unmount';
export const ACCEPTED_IMAGE_FORMATS = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/svg+xml': 'svg',
  'image/webp': 'webp',
  'image/gif': 'gif',
};
export const PROFILE_CREATION_STAGES = 2;
export const STOCK_HEADERS = [
  'Name',
  'Style',
  'ABV',
  'Pack Size',
  'List Price',
  'Availability',
];
export const PACK_SIZES = {
  '30l': '30L',
  '50l': '50L',
  '9g': '9g',
  '12x330': '12x330ml',
  '24x330': '24x330ml',
  '24x440': '24x440ml',
};

export const BLOG_ITEMS_PER_PAGE = 2;
export const INTRO_CHARACTER_LIMIT = 350;
export const BLOG_CHARACTER_LIMIT = 1500;

export const notificationTypes = {
  newOrder: 'new_order',
  orderStatusChange: 'order_status_change',
  newOrderMessage: 'new_order_message',
};
