let express = require('express');
let router = express.Router();

router.get('*', (req, res, next) => {
  if (req.originalUrl === '/graphql') {
    return;
  }
  res.render('dashboard/dashboard');
});

export default router;
