$(document).ready(function() {
  $("#login-modal-button").click(function() {
    $("#loginModal").modal();
  });
  $("#register-modal-button").click(function() {
    $("#registerModal").modal();
  });
});

function loginForm() {
    dat = {
        'username': document.getElementById("loginUsername").value,
        'password': document.getElementById("loginPassword").value,
    };
    console.log(dat)
    var ajax_params = {
        'url'     : "/users",
        'type'    : "GET",
        'data'    : dat,
        'success' : loginResponse
    };

    $.ajax(ajax_params);
}

function loginResponse(response) {
    alert("Logged in!");
}

function registerForm() {
    dat = {
        'username': document.getElementById("registerUsername").value,
        'password': document.getElementById("registerPassword").value,
        'first': document.getElementById("registerFirst").value,
        'last': document.getElementById("registerLast").value
    };
    console.log(dat)
    var ajax_params = {
        'url'     : "/users",
        'type'    : "POST",
        'data'    : dat,
        'success' : registerResponse
    };

    $.ajax(ajax_params);
}

function registerResponse(response) {
    alert("Registered!");
}
