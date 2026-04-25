ARG NODE_VERSION=22.19.0
ARG PNPM_VERSION=10.20.0

FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

RUN npm install -g pnpm@${PNPM_VERSION}

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "dist/main.js"]