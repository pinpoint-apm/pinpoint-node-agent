import 'dotenv/config'
import 'pinpoint-node-agent';
import http from 'http';
import axios from 'axios';

const host = 'localhost';
const port = 8000;

const requestListener = function (req, res) {
    (async () => {
        try {
            axios.get('http://localhost:7010/api')
                .then(function (response) {
                    // handle success
                    console.log(response);
                    res.writeHead(200);
                    res.end(response.data);
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
                .finally(function () {
                    // always executed
                });
        } catch (error) {
            res.status(500).send(response);
            res.writeHead(500);
            res.end("My first server!");
        }
    })();
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});