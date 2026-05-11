export const CORE_USERS = {
  admin: {
    username: 'alexandru.enachi',
    password: 'Test123!',
  },
  noRoleMapping: {
    username: 'test.hello',
    password: 'Qwertyzxc123!',
  },
  noEmployee1C: {
    username: 'testuser',
    password: 'Account1!',
  },
  invalidCredentials: {
    username: 'testalex',
    password: 'Account1!',
  },
} as const;

export const CORE_ERRORS = {
  noRoleMapping: 'Authentication failed: Your position has no role mapping configured. Contact your administrator.',
  noEmployee1C:  'Authentication failed: No matching employee found in 1C.',
  invalidCreds:  'Invalid credentials',
} as const;

export const CORE_URL = 'https://admin.micb.dev.devebs.net';