# syntax=docker/dockerfile:1.7-labs
# `@rejc2/projecttemplate-web`

# Build web FE:
FROM rejc2/projecttemplate-base-image AS build

WORKDIR /repo

COPY packages ./packages
COPY apps/web ./apps/web
RUN yarn workspace @rejc2/projecttemplate-web build

# Serve with Nginx:
FROM nginx:trixie

COPY apps/web/default.nginxconf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/web/dist /usr/share/nginx/html

EXPOSE 80
