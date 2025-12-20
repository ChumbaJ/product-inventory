FROM node:18-alpine AS build

ARG BUILD_API_URL
ENV VITE_BASE_API_URL=${BUILD_API_URL}

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:latest

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
