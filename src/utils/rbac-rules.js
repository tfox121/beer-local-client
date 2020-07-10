const rbacRules = {
  visitor: {
    static: ['posts:list', 'home-page:visit'],
  },
  producer: {
    static: [
      'producer-menu:visit',
      'orders:reject',
      'orders:confirm',
      'orders:edit',
      'posts:list',
      'posts:create',
      'users:getSelf',
      'home-page:visit',
      'dashboard-page:visit',
    ],
    dynamic: {
      'posts:edit': ({ userId, postOwnerId }) => {
        if (!userId || !postOwnerId) return false;
        return userId === postOwnerId;
      },
    },
  },
  retailer: {
    static: [
      'retailer-menu:visit',
      'orders:changes-confirm',
      'orders:cancel',
      'posts:list',
      'posts:create',
      'users:getSelf',
      'home-page:visit',
      'dashboard-page:visit',
    ],
    dynamic: {
      'posts:edit': ({ userId, postOwnerId }) => {
        if (!userId || !postOwnerId) return false;
        return userId === postOwnerId;
      },
    },
  },
  admin: {
    static: [
      'posts:list',
      'posts:create',
      'posts:edit',
      'posts:delete',
      'users:get',
      'users:getSelf',
      'home-page:visit',
      'dashboard-page:visit',
    ],
  },
};

export default rbacRules;
