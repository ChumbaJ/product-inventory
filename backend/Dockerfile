FROM node:18-alpine

WORKDIR /app

COPY package.json /app/
RUN npm install

COPY . /app/

RUN npm run build

EXPOSE 5000

CMD ["sh", "-c", "npm run migration:run && npm start"]