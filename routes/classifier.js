module.exports = func = (io) => {

	const express = require('express');
	const router = express.Router();

	/* GET home page. */
	router.get('/', (req, res) => {
		console.log("classifier anon()");
		console.log("session username: " + req.session.username);
		res.render('classifier', {
			'auth':	req.session.username != null,
			"username": req.session.username,
		});
	});

	// python shell for running the ml script
	const {PythonShell} = require('python-shell');

	//  files to be upload
	const fileupload = require("express-fileupload");
	router.use(fileupload());

	const fs = require("fs");

	router.SOCKET_LIST = {};
	io.sockets.on("connection", function (socket) {
		socket.on("username", function (data){
			console.log("Connected " + data.id)

			socket.id = data.id;
			router.SOCKET_LIST[socket.id] = socket;

			socket.emit("hasBaseAudio", {status: socket.id in router.BASE_FILE_NAMES});
			socket.on("resetBaseAudio", function (data) {
				if (data.id in router.BASE_FILE_NAMES) {
					delete router.BASE_FILE_NAMES[data.id];
					socket.emit("hasBaseAudio", {status: socket.id in router.BASE_FILE_NAMES});
				}
			});

			socket.on("disconnect", function (data) {
				console.log("Disconnected " + socket.id)
				delete router.SOCKET_LIST[socket.id];
			});
		});
	});

	router.BASE_FILE_NAMES = {};
	router.post('/upload_file_worker', (req, res) => {
		console.log("upload_file_worker anon()")

		var myFile;
		var user;
		var audioType;
		for (var k in req.files) {
			myFile = req.files[k];
			var lines = k.split("*");
			user = lines[0];
			audioType = lines[1];
		}
		console.log("From user: " + user);
		console.log("Audio type: " + audioType);

		// initialize socket
		const socket = router.SOCKET_LIST[user];

		let needsConversion = myFile.name == "blob";
		let fileName = "_" + Math.round(Math.random() * 10000) + "_" + myFile.name;
		if (needsConversion) {
			fileName += ".wav";
		}
		const path = './input/' + fileName;

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
			// save base audio paths
			if (audioType == "base") {
				console.log("Saved as " + fileName);
				console.log("Path: " + path);
				router.BASE_FILE_NAMES[user] = fileName;
				socket.emit("hasBaseAudio", {status: true});
				res.end(JSON.stringify({status: 'success', audioType: audioType}));
			}

		});

		if (audioType == "base") {
			return;
		}

		// compare new image to base image

		const baseFileName = router.BASE_FILE_NAMES[user];
		const basePath = __dirname + "/../input/" + baseFileName;
		const newPath = __dirname + "/../input/" + fileName;
		console.log("Paths")
		console.log(basePath);
		console.log(newPath);
		let options = {
			"args": [basePath, newPath],
		}
		const outputBasePath = __dirname + "/../output/" + baseFileName + "_base.png";
		const outputNewPath = __dirname + "/../output/" + fileName + "_new.png";
		const outputDiffPath = __dirname + "/../output/" + fileName + "_diff.wav";
		const outputDiffImagePath = __dirname + "/../output/" + fileName + "_diff.png";
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
			exec('bash ./src/comp.sh ' + basePath + " " + newPath + " " + outputBasePath + " " + outputNewPath + " " + outputDiffPath + " " + outputDiffImagePath, (err, stdout, stderr) => {
				if (err) {
					//some err occurred
					console.error(err)
				} else {

					// TODO: send back image file
					res.end(JSON.stringify({ status: 'success', audioType: audioType, num: results[0]}))


					fs.readFile(outputDiffImagePath, function(err, data){
						var obj = "data:image/png;base64,"+ data.toString("base64");
						socket.emit('diffImage', obj);
						console.log('Image sent');

						// clean up and delete files
						// exec("rm " + newPath + " " + outputBasePath + " " + outputNewPath + " " + outputDiffPath + " " + outputDiffImagePath);
					});
				}
			});
		});
	})

	return router;
}
