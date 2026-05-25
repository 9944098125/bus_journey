import { api as GlobalApi } from 'app/slice/index';

import { registerApi } from 'app/pages/Register/slice';

export const rtkQueryMiddleware = [
  GlobalApi.middleware,
  registerApi.middleware,
];
