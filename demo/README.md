## Demo
```
$ docker-compose up -d
$ npm start or PINPOINT_AGENT_ID=${HOSTNAME} pm2 start ecosystem.config.js
```
The sample app is a simple express web app using redis. You can start using npm or pm2. The address of the collector server must be added to the ecosystem.config.js file or environment variable (PINPOINT_COLLECTOR_IP).