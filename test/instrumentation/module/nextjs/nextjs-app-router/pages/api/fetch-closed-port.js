const handler = async function (req, res) {
  req['pinpoint.metric.uri-template'] = '/user/input/uri/fetch-closed-port'
  try {
    await fetch(`http://127.0.0.1:${req.query.port}/`)
    res.status(200).json({ ok: true })
  } catch (error) {
    res.status(502).json({ code: error.cause?.code })
  }
}

module.exports = handler
module.exports.default = handler
