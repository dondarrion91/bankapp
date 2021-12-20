FROM node:15

WORKDIR /app

COPY package.json .

ARG NODE_ENV

RUN npm install

COPY . .

ENV PORT 3000

EXPOSE $PORT

CMD ["npm", "run", "dev"]
