/**
 *
 * Can
 *
 */

import rbacRules from '../../utils/rbac-rules';

const check = (rules, role, action, data) => {
  const permissions = rules[role];
  // console.log('CAN', rules, role, action, data);

  if (!permissions) {
    // role is not present in the rules
    return false;
  }

  const staticPermissions = permissions.static;

  if (staticPermissions && staticPermissions.includes(action)) {
    // static rule not provided for action
    return true;
  }

  const dynamicPermissions = permissions.dynamic;

  if (dynamicPermissions) {
    const permissionCondition = dynamicPermissions[action];
    if (!permissionCondition) {
      // dynamic rule not provided for action
      return false;
    }

    return permissionCondition(data);
  }
  return false;
};

const Can = ({ role, perform, data, yes, no }) =>
  // console.log('NAV', role, perform, data);
  check(rbacRules, role, perform, data) ? yes() : no();

Can.defaultProps = {
  yes: () => null,
  no: () => null,
};

export default Can;
