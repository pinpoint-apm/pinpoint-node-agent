const handler = async function (req, res) {
  await (await fetch(req.query.target)).text()
  await (await fetch(req.query.target)).text()
  res.status(200).json({ ok: true })
}

module.exports = handler
module.exports.default = handler
