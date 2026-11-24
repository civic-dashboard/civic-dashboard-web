FROM node:22.15-bookworm

RUN apt-get update \
    && apt-get install -y --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /home/node/.npm && chown node:node /home/node/.npm
