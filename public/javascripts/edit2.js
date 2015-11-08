/**
 * Created by Navii on 11/3/2015.
 */

var url = window.location.pathname;
var id = url.substring(url.lastIndexOf('/') + 1);

// DOM Ready
$(document).ready(function() {
    var lol = "sala";
    $.getJSON( '/edit/'+ id, function( data ) {
        $('#title').html('<h1 class="text-center login-title">Welcome ' + data.user.username + '. Please update selected event below:</h1>');

        $('#form-editevent').html('<form class="form-editevent"><input id="Fromdate" type="date" value="' + data.event.from_date + '" placeholder="From Date" name="FromDate" required /><input id="Todate" type="date" value="' + data.event.to_date + '" placeholder="To Date" name="ToDate" required /><input id="Starttime" type="time" value="' + data.event.start_time + '" placeholder="Start time" name="Starttime" required /><input id="Endtime" type="time" value="' + data.event.end_time + '" placeholder="End time" name="Endtime" required /><br/><input id="Location" type="text" value="' + data.event.location + '" placeholder="Location" size="20" name="Location" required /><input id="Description" type="text" size="21" value="' + data.event.description + '" placeholder="Description" name="Description" required /><br/><button id="btnUpdateEvent" value="' + data.event._id + '" style="width: 210px; background-color: orange;">Update</button><button id="btnCancelUpdate" style="width: 150px; background-color: orange;">Cancel</button><br/><br/></form>');

        // addevent button click
        $('#btnUpdateEvent').on('click', UpdateEvent);

        // cancel button click
        $('#btnCancelUpdate').on('click', CancelUpdate);
    });
});
//Update event
function UpdateEvent(event) {
    event.preventDefault();
    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to update this event?');
    // Check and make sure the user confirmed
    var updatedevent = {
        'from_date': $('#form-editevent form input#Fromdate').val(),
        'to_date': $('#form-editevent form input#Todate').val(),
        'start_time': $('#form-editevent form input#Starttime').val(),
        'end_time': $('#form-editevent form input#Endtime').val(),
        'location': $('#form-editevent form input#Location').val(),
        'description': $('#form-editevent form input#Description').val(),
    }
    if (confirmation === true) {
        $.ajax({
            type: 'PUT',
            data: updatedevent,
            url: 'http://localhost:3000/updateevent/' + $(this).attr('value')
        }).done(function( res ) {
            // Check for a successful response
            if (res) {
                window.location.href= '/search';
            }
        });
    }
};

//Cancel event Update
function CancelUpdate(event) {
    event.preventDefault();
    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you do not want to update this event?');
    // Check and make sure the user confirmed
    if (confirmation === true) {
        window.location.href= '/search';
    }
};
