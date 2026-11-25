const handler = function (req, res) {
  return new Promise(resolve => setTimeout(async () => {
    await (await fetch(req.query.target)).text()
    res.status(200).json({ ok: true })
    resolve()
  }, 10))
}

module.exports = handler
module.exports.default = handler
