FROM node:alpine
WORKDIR /webapp
COPY . .
RUN npm install
CMD npm run dev