/**
 * Created by Navii on 11/3/2015.
 */

// DOM Ready
$(document).ready(function() {

    $('#form-signin').html('<form class="form-signin"><input id="inputUsername" type="text" name="username" placeholder="Username" autofocus="autofocus" class="form-control" required/><br/><input id="inputPassword" type="password" name="password" placeholder="Password" class="form-control" required/><br/><button type="submit" id="btnSignin" class="btn btn-lg btn-primary btn-block">Sign in</button><span class="clearfix"></span></form>');

    $('#link-signup').html('<a href="" class="text-center new-account">Create an account</a>');

    $('#btnSignin').on('click', Signin);        // Login Button Click
    $('#link-signup').on('click', Signup);      // Sign Up Button Click
});

// Signin User
function Signin(event) {
    event.preventDefault();

    var signinInputs = {
        'username': $('#form-signin form input#inputUsername').val(),
        'password': $('#form-signin form input#inputPassword').val()
    }
    // Use AJAX to post the object to our Signin service
    $.ajax({
        type: 'POST',
        data: signinInputs,
        url: 'http://130.233.42.143:3000/login'
    }).done(function( res ) {
        if(res.success){
            window.location.href = res.url;
        }
        else{
            $('#message').html('<h1 class="text-center error-message">'+res.message+'</h1>');
        }
    });
};

// SignUp User
function Signup(event) {
    event.preventDefault();
    // Use AJAX to Get the object to our SignUp service
    $.ajax({
        type: 'GET',
        url: 'http://130.233.42.143:3000/signup'
    }).done(function( response ) {
        window.location.href = response.url;
    });
};
