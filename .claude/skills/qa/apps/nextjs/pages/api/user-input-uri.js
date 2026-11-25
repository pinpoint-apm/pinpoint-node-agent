'use strict'

module.exports = (req, res) => {
    req['pinpoint.metric.uri-template'] = '/user/input/uri'
    res.status(200).json({ ok: true })
}
