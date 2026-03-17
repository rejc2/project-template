# @rejc2’s Project Template

- **apps/server** – back end server project
- **apps/web** – web project
- **packages/\*** – other packages to be imported
- **test-packages/playwright-test** – E2E Playwright tests

## Server

To develop locally:

```bash
docker compose up -d
yarn workspace @rejc2/project-template-server exec prisma migrate dev --name init
yarn workspace @rejc2/project-template-server dev
```
