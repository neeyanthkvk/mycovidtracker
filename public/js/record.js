//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;
var gumStream;
//stream from getUserMedia()
var rec;
//Recorder.js object
var input;
//MediaStreamAudioSourceNode we'll be recording
// shim for AudioContext when it's not avb.
var AudioContext = window.AudioContext || window.webkitAudioContext;

var constraints = {
    audio: true,
    video: false
}

var curBlob;
var rec;
var recordedAudio = document.getElementById("recorded-audio");

var recordDuration = 0;
var isRecording = false;
var recordStatusText = document.getElementById("record-status-text");
var startRecordButton = document.getElementById("start-record-button");
var stopRecordButton = document.getElementById("stop-record-button");
var uploadRecordButton = document.getElementById("upload-record-button");

startRecordButton.disabled = false;
stopRecordButton.disabled = true;

startRecordButton.onclick = function (event) {
    if (!isRecording) {
        recordDuration = 0;
        startRecordButton.disabled = true;
        stopRecordButton.disabled = false;
        isRecording = true;

        navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
            /* assign to gumStream for later use */
            gumStream = stream;
            /* use the stream */
            var audioContext = new AudioContext;
            input = audioContext.createMediaStreamSource(stream);
            /* Create the Recorder object and configure to record mono sound (1 channel) Recording 2 channels will double the file size */
            rec = new Recorder(input, {
                numChannels: 1
            })
            rec.record();
        });
    }
}

stopRecordButton.onclick = function (event) {
    if (isRecording) {
        recordStatusText.innerHTML = "Recording duration " + Math.round(recordDuration * 10) / 10;
        startRecordButton.disabled = false;
        stopRecordButton.disabled = true;
        isRecording = false;

        rec.stop();
        gumStream.getAudioTracks()[0].stop();
        rec.exportWAV(function (blob) {
            curBlob = blob;
            recordedAudio.src = URL.createObjectURL(curBlob);
            recordedAudio.controls = true;
            recordedAudio.autoplay = true;
        });
    }
}

uploadRecordButton.onclick = function (event) {
    if (curBlob == undefined) {
        recordStatusText.innerHTML = "Please record before uploading"
    } else {
        recordStatusText.innerHTML = "Uploaded recording"
        handleFileUpload(curBlob, "recording");
    }
}

var checkFreq = 0.1;
setInterval(function() {
    if (isRecording) {
        recordDuration += checkFreq;
        recordStatusText.innerHTML = "Recording " + Math.round(recordDuration * 10) / 10;
    }
}, 1000 * checkFreq);
