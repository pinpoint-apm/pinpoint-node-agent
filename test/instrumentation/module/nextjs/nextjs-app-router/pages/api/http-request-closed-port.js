const http = require('http')

const handler = function (req, res) {
  http.request(`http://127.0.0.1:${req.query.port}/`, (outgoingResponse) => {
    outgoingResponse.resume()
    outgoingResponse.on('end', () => res.status(200).json({ ok: true }))
  }).on('error', (error) => {
    res.status(502).json({ code: error.code })
  }).end()
}

module.exports = handler
module.exports.default = handler
