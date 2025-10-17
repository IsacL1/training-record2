# Dockerfile
FROM node:23
WORKDIR /usr/src/web/training-record/backend
COPY package*.json /usr/src/web/training-record/backend
RUN yarn install
COPY . /usr/src/web/training-record/backend
#COPY . .
RUN yarn build
# backend port
EXPOSE 3001 
#CMD ["yarn", "start:backend", "--port", "3001"]