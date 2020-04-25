var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log("classifier anon()");
	res.render('classifier', {});
});
router.get('/a', function(req, res, next) {
	console.log("classifier anon()");
	res.send('classifier');
});

router.post('/upload_data_worker', function(req, res, next) {
	console.log("upload_data_worker anon()");
	res.send("Success");
});

module.exports = router;
