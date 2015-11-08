/**
 * Created by Navii on 11/3/2015.
 */

// DOM Ready
$(document).ready(function() {

    $('#form-signup').html('<form class="form-signup"><input id="inputNewUsername" type="text" name="username" placeholder="Username" required="required" autofocus="autofocus" class="form-control"/><br/><input id="inputNewPassword" type="password" name="password" placeholder="Password" required="required" class="form-control"/><br/><button id="btnRegisterUser" type="submit" class="btn btn-lg btn-primary btn-block">Register</button><span class="clearfix"></span> </form>');

    $('#btnRegisterUser').on('click', RegisterUser);      // Sign Up Button Click
});

// Register New User
function RegisterUser(event) {
    event.preventDefault();
    var signupInputs = {
        'username': $('#form-signup form input#inputNewUsername').val(),
        'password': $('#form-signup form input#inputNewPassword').val()
    }
    // Use AJAX to POST the object to our registerUser service
    $.ajax({
        type: 'POST',
        data: signupInputs,
        url: 'http://localhost:3000/signup'
    }).done(function( response ) {
        if (response.success) {
            window.location.href = response.url;
        }
        else {
            $('#message').html('<h1 class="text-center error-message">'+response.message+'</h1>');
        }
    });
};