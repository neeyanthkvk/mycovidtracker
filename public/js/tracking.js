var heartslider = document.getElementById("heartmyRange");
var heartoutput = document.getElementById("heart");
heartoutput.innerHTML = heartslider.value;

var tempslider = document.getElementById("tempmyRange");
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
    dat = {}; //?
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