import { setupServer } from 'msw/node';

import { handlers } from '@rejc2/projecttemplate-api-tanstack-client/testing/handlers';

export const server = setupServer(...handlers);
