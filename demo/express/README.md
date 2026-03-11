## Demo
```
$ docker-compose up -d
$ npm start or PINPOINT_AGENT_ID=${HOSTNAME} pm2 start ecosystem.config.js
```
The sample app is a simple express web app using redis. You can start using npm or pm2. The address of the collector server must be added to the ecosystem.config.js file or environment variable (PINPOINT_COLLECTOR_IP).

### URI Stats demo routes
- URI pattern case (custom URI template)
	- `GET /uri-stats/pattern/:userId`
	- Example: `curl http://localhost:3000/uri-stats/pattern/1001`
- Failure case (HTTP 500)
	- `GET /uri-stats/pattern/:userId/failure`
	- Example: `curl -i http://localhost:3000/uri-stats/pattern/1001/failure`

In Express, URI stats uses route patterns (for example `/uri-stats/pattern/:userId`) from `req.route.path`.