const http = require('http')

const handler = function(req, res) {
  http.request(req.query.target, (outgoingResponse) => {
    outgoingResponse.resume()
    outgoingResponse.on('end', () => res.status(200).json({ name: 'parent-service-name' }))
  }).on('error', (error) => {
    res.status(500).json({ error: error.message })
  }).end()
}

module.exports = handler
module.exports.default = handler
