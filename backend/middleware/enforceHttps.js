function enforceHttps(req, res, next) {
  if (process.env.ENFORCE_HTTPS === 'true') {
    const proto = req.headers['x-forwarded-proto'];
    if (proto && proto !== 'https') {
      const host = req.headers.host;
      return res.redirect(308, 'https://' + host + req.originalUrl);
    }
  }
  next();
}
module.exports = enforceHttps;
