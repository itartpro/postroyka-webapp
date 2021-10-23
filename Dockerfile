FROM node:alpine
WORKDIR /home/appuser/webapp
COPY . .
RUN npm install
CMD npm run dev