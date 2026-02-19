const handler = function(req, res) {
  req['pinpoint.metric.uri-template'] = '/user/input/uri/from/pages'
  res.status(200).json({ name: 'custom-uri' })
}

module.exports = handler
module.exports.default = handler

