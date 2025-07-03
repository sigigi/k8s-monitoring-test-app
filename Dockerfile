FROM node:18-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install @opentelemetry/api \
    @opentelemetry/sdk-trace-node \
    @opentelemetry/resources \
    @opentelemetry/semantic-conventions \
    @opentelemetry/instrumentation \
    @opentelemetry/instrumentation-http \
    @opentelemetry/instrumentation-express \
    axios
RUN npm install
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
