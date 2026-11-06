const handler = function(req, res) {
  req['pinpoint.metric.uri-template'] = '/user/input/uri/error-500'
  res.status(500).json({ error: 'Internal Server Error' })
}

module.exports = handler
module.exports.default = handler
