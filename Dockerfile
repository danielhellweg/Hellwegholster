FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN npm install --global pnpm@11.19.0 && pnpm install --prod --frozen-lockfile --ignore-scripts
COPY scripts ./scripts
COPY public ./public
COPY content ./content
ARG HELLWEG_PUBLIC_ORIGIN=https://www.hellweg.eu
ARG HELLWEG_INDEXING=enabled
ARG HELLWEG_PREVIEW=disabled
ENV HELLWEG_PUBLIC_ORIGIN=$HELLWEG_PUBLIC_ORIGIN HELLWEG_INDEXING=$HELLWEG_INDEXING HELLWEG_PREVIEW=$HELLWEG_PREVIEW
RUN pnpm run build

FROM node:24-bookworm-slim AS runtime
ENV NODE_ENV=production PORT=8080
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY server ./server
USER node
EXPOSE 8080
CMD ["node", "server/index.mjs"]
