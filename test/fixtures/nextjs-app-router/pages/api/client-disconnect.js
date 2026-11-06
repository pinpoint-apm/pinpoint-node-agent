const handler = async function(req, res) {
  req['pinpoint.metric.uri-template'] = '/user/input/uri/client-disconnect'
  await new Promise((resolve) => res.on('close', resolve))
  res.status(200).json({ name: 'client-disconnect' })
}

module.exports = handler
module.exports.default = handler
