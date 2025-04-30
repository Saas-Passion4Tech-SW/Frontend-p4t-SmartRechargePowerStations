FROM node:23

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install axios

RUN npm install browser

RUN npm install bootstrap

RUN npm install leaflet

COPY . .

RUN chmod +x start.sh

EXPOSE 1810

CMD ["/bin/sh", "./start.sh"]
