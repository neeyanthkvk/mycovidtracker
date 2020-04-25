var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {'auth': req.session.username != null});
});

module.exports = router;
