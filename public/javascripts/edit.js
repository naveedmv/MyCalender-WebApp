/**
 * Created by Navii on 11/3/2015.
 */

var url = window.location.pathname;
var id = url.substring(url.lastIndexOf('/') + 1);
var today= new Date().toISOString().substr(0, 10);//2015-11-08 format

// DOM Ready
$(document).ready(function() {
    var lol = "sala";
    $.getJSON( '/edit/'+ id, function( data ) {
        $('#title').html('<h1 class="text-center login-title">Welcome ' + data.user.username + '. Please update selected event below:</h1>');

        $('#form-editevent').html('<form class="form-editevent"><input id="Fromdate" required="required" type="date" min= "'+ today + '" value="' + data.event.from_date + '" placeholder="From Date" name="FromDate" required /><input id="Todate" type="date" required="required" min= "'+ today + '" value="' + data.event.to_date + '" placeholder="To Date" name="ToDate" required /><input id="Starttime" type="time" required="required" value="' + data.event.start_time + '" placeholder="Start time" name="Starttime" required /><input id="Endtime" type="time" required="required" value="' + data.event.end_time + '" placeholder="End time" name="Endtime" required /><br/><input id="Location" type="text" required="required" size="50" value="' + data.event.location + '" placeholder="Location" size="50" name="Location" required /><input id="Description" type="text" required="required" size="51" value="' + data.event.description + '" placeholder="Description" name="Description" required /><br/><button id="btnUpdateEvent"  type="submit" value="' + data.event._id + '" style="width: 500px; background-color: orange;">Update</button><button id="btnCancelUpdate" style="width: 280px; background-color: orange;">Cancel</button><br/><br/></form>');

        // addevent button click
        $('#form-editevent').on('submit', UpdateEvent);

        // cancel button click
        $('#btnCancelUpdate').on('click', CancelUpdate);
    });
});
//Update event
function UpdateEvent(event) {
    event.preventDefault();
    // Pop up a confirmation dialog
    var confirmation = confirm('Confirm Event Updation?');
    // Check and make sure the user confirmed
    var updatedevent = {
        'from_date': $('#form-editevent form input#Fromdate').val(),
        'to_date': $('#form-editevent form input#Todate').val(),
        'start_time': $('#form-editevent form input#Starttime').val(),
        'end_time': $('#form-editevent form input#Endtime').val(),
        'location': $('#form-editevent form input#Location').val(),
        'description': $('#form-editevent form input#Description').val()
    };
    if (confirmation === true) {
        $.ajax({
            type: 'PUT',
            data: updatedevent,
            url: 'http://130.233.42.143:8080/updateevent/' + $("#btnUpdateEvent").attr('value')
        }).done(function( res ) {
            // Check for a successful response
            if (res) {
                window.location.href= '/home';
            }
        });
    }
};

//Cancel event Update
function CancelUpdate(event) {
    event.preventDefault();
    // Pop up a confirmation dialog
    var confirmation = confirm('Cancel Event Updation?');
    // Check and make sure the user confirmed
    if (confirmation === true) {
        window.location.href= '/home';
    }
};
