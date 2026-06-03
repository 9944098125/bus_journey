FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm@10.27.0

COPY . .

RUN pnpm install

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
