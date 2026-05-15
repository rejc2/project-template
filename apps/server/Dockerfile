# `@rejc2/projecttemplate-server`

# Build BE server:
FROM rejc2/projecttemplate-base-image AS build

WORKDIR /repo

COPY packages ./packages
COPY apps/server ./apps/server
RUN yarn workspace @rejc2/projecttemplate-server build

WORKDIR /repo/apps/server

EXPOSE 3000

CMD ["yarn", "start"]
