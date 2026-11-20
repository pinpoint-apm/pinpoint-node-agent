'use strict'

module.exports = (call) => async (req, res) => {
    const { status, body } = await call(req.headers)
    res.status(status).json(body)
}
