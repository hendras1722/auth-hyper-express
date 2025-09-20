const rateLimit = require('express-rate-limit');

function expressToHyper(limiter) {
  return async (req, res) => {
    return new Promise((resolve) => {
      limiter(req, res, (err) => {
        if (err) {
          return resolve(false);
        }
        resolve(true);
      });
    });
  };
}

module.exports = { rateLimit, expressToHyper };
