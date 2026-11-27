FROM node:22.15-bookworm

RUN mkdir -p /home/node/.npm /workspaces/civic-dashboard-web/node_modules \
    && chown -R node:node /home/node/.npm /workspaces/civic-dashboard-web

WORKDIR /workspaces/civic-dashboard-web

COPY --chown=node:node package.json package-lock.json ./

USER node
RUN npm ci
