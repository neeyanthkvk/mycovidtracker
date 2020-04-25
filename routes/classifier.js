var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log("classifier anon()");
	res.render('classifier', {});
});

// const bodyParser = require("body-parser");
// router.use(
// 	bodyParser.urlencoded({
// 		extended: true
// 	})
// );
//
// router.use(bodyParser.json());
const fileupload = require("express-fileupload");
router.use(fileupload());

router.post('/upload_file_worker', (req, res) => {
	console.log("upload_file_worker anon()")
	var myFile = req.files.myFile;
	const fileName = myFile.name
	const path = './data/' + fileName

	myFile.mv(path, (error) => {
		if (error) {
			console.error(error)
			res.writeHead(500, {
				'Content-Type': 'application/json'
			})
			res.end(JSON.stringify({ status: 'error', message: error }))
			return
		}

		res.writeHead(200, {
			'Content-Type': 'application/json'
		})
		res.end(JSON.stringify({ status: 'success', path: '/img/houses/' + fileName }))
	})
})

module.exports = router;
