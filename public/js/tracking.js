$(document).ready(function() {
  $("#log-modal-button").click(function() {
    $("#logModal").modal();
  });
});


var heartslider = document.getElementById("heartRate");
var heartoutput = document.getElementById("heart");
heartoutput.innerHTML = heartslider.value;

var tempslider = document.getElementById("temperature");
var tempoutput = document.getElementById("temp");
var dat = {}
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
