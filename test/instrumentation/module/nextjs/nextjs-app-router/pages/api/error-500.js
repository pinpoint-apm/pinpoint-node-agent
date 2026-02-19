const handler = function(req, res) {
  res.status(500).json({ error: 'Internal Server Error' })
}

module.exports = handler
module.exports.default = handler
