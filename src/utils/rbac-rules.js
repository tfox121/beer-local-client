const rbacRules = {
  visitor: {
    static: ['posts:list', 'home-page:visit'],
  },
  Producer: {
    static: [
      'producer-menu:visit',
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
  Retailer: {
    static: [
      'retailer-menu:visit',
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
