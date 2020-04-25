var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log("classifier anon()");
	res.render('classifier', {});
});

// python shell for running the ml script
const {PythonShell} = require('python-shell');

//  files to be upload
const fileupload = require("express-fileupload");
router.use(fileupload());

router.post('/upload_file_worker', (req, res) => {
	console.log("upload_file_worker anon()")

	var myFile = req.files.myFile;
	var needsConversion = myFile.name == "blob";
	var fileName = "_" + Math.round(Math.random() * 10000) + "_" + myFile.name;
	if (needsConversion) {
		fileName += ".wav";
	}
	const path = './input/' + fileName

	myFile.mv(path, (error) => {
		if (error) {
			console.error(error)
			res.writeHead(500, {
				'Content-Type': 'application/json'
			})
			res.end(JSON.stringify({ status: 'error', message: error }));
			return;
		}

		res.writeHead(200, {
			'Content-Type': 'application/json'
		})
	});


	// return; // DELETE THIS TO RUN PYTHON SCRIPTS
	var options;
	options = {

	}

	// PythonShell.run("./src/test.py", options, function (err, results) {
	// if (err) {
	// 		throw err;
	// 	};
	// 	console.log("start");
	// 	for (var i = 0; i < results.length; i++) {
	// 		console.log(results[i]);
	// 	}
	// 	console.log("end");
	// });
	var baseFileName = "blob.wav"
	var basePath = __dirname + "/../input/" + baseFileName;
	newPath = __dirname + "/../input/" + fileName;
	options = {
		"args": [basePath, newPath],
	}
	var outputBasePath = __dirname + "/../output/" + baseFileName + "_base.png";
	var outputNewPath = __dirname + "/../output/" + fileName + "_new.png";
	var outputDiffPath = __dirname + "/../output/" + fileName + "_diff.wav";
	var outputDiffImagePath = __dirname + "/../output/" + fileName + "_diff.png";
	// console.log(outputBasePath)
	// console.log(outputNewPath)
	// console.log(outputDiffPath)
	// console.log(outputDiffImagePath)

	PythonShell.run("./src/numerical_comp.py", options, function (err, results) {
		if (err) {
			throw err;
		};
		console.log("numerical_comp done")
		console.log(results);

		const { exec } = require('child_process');
		exec('comp.sh ' + basePath + " " + newPath + " " + outputBasePath + " " + outputNewPath + " " + outputDiffPath + " " + outputDiffImagePath, (err, stdout, stderr) => {
			if (err) {
				//some err occurred
				console.error(err)
			} else {
				res.end(JSON.stringify({ status: 'success', num: results[0]}))
			}
		});
	});


})

module.exports = router;
