$(document).ready(function() {
  $("#log-modal-button").click(function() {
    $("#logModal").modal();
  });
  getData()
});


var heartslider = document.getElementById("heartRate");
var heartoutput = document.getElementById("heart");
heartoutput.innerHTML = heartslider.value;

var tempslider = document.getElementById("temperature");
var tempoutput = document.getElementById("temp");
tempoutput.innerHTML = tempslider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
heartslider.oninput = function() {
  heartoutput.innerHTML = heartslider.value;
}
tempslider.oninput = function() {
  tempoutput.innerHTML = tempslider.value;
}
function postLog() {
    dat = {
        'heartRate': heartslider.value,
        'temperature': tempslider.value,
        'chest': document.getElementById("chest").checked,
        'cough': document.getElementById("cough").checked,
        'breath': document.getElementById("breath").checked,
        'fatigue': document.getElementById("fatigue").checked,
        'muscle': document.getElementById("muscle").checked,
    }
    console.log(dat)
    var ajax_params = {
        'url'     : "/log",
        'type'    : "POST",
        'data'    : dat,
        'success' : logResponse
    };

    $.ajax(ajax_params);
}

function logResponse(response) {
    alert(response);
    window.location.href = '/log';
}

function chestButton() {
    if(dat['chest'] == true) {
        dat['chest'] = false;
        document.getElementById("chestButton").style.fontWeight = 'normal';
    }
    else {
        dat['chest'] = true;
        document.getElementById("chestButton").style.fontWeight = 'bold';
    }
}

function getData() {
    var ajax_params = {
        'url'     : "/log",
        'type'    : "GET",
        'data'    : {
            'data': true
        },
        'success' : dataResponse
    };

    $.ajax(ajax_params);
}

function dataResponse(logData) {
    data = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Temperature',
                backgroundColor: window.chartColors.red,
                borderColor: window.chartColors.red,
                data: [],
                fill: false,
            }, {
                label: 'Heart Rate',
                backgroundColor: window.chartColors.green,
                borderColor: window.chartColors.green,
                data: [],
                fill: false,
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Your Log Data'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
                    }
                }]
            }
        }
    }
    logData.logs.forEach((log) => {
        console.log("DEBUG: " + JSON.stringify(log))
        var dat = new Date(log.time)
        data.data.labels.push(dat.getMonth() + "/" + dat.getDay());
        data.data.datasets[0].data.push(parseInt(log.body.temperature));
        data.data.datasets[1].data.push(parseInt(log.body.heartRate));
    });
    console.log(data)
    var ctx = document.getElementById('canvas').getContext('2d');
	window.myLine = new Chart(ctx, data);
}
