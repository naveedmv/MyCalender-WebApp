/**
 * Created by Navii on 11/3/2015.
 */

var eventListData = [];
var today= new Date().toISOString().substr(0, 10); //2015-11-08 format

// DOM Ready
$(document).ready(function() {

    $.getJSON( '/eventlist', function( data ) {
        $('#title').html('<h1 class="text-center login-title">Welcome ' + data.user.username + '. Check your event details below:</h1>');

        $('#eventListTable').html('<table><thead><tr class="head"><th>#</th><th>From Date</th><th>To Date</th><th>Start time</th><th>End time</th><th>Location</th><th>Description</th><th>?</th><th>?</th></tr><tbody></tbody></thead></table>');

        $('#form-addevent').html('<form id="form-addevent"><input id="inputFromdate" type="date"  min= "'+ today + '" placeholder="From Date" name="FromDate" required="required"/><input id="inputTodate" type="date" min= "'+ today + '" placeholder="To Date" name="ToDate" required="required"/><input id="inputStarttime" type="time" placeholder="Start time" name="Starttime" required="required"/><input id="inputEndtime" type="time" placeholder="End time" name="Endtime" required="required"/><br/><input id="inputLocation" type="text" placeholder="Location" size="50" name="Location" required="required"/><input id="inputDescription" type="text" size="51" placeholder="Description" name="Description" required="required"/><br/><button id="btnAddEvent" style="width:780px; background-color: orange;" type="submit">Add Event</button><br/><br/></form>');

        // Populate the event table on initial page load
        populate_eventListTable();

        // deleteevent button click
        $('#eventListTable table tbody').on('click', 'td button.btnDelete', DeleteEvent );

        //editevent button click
        $('#eventListTable table tbody').on('click', 'td button.btnEdit', EditEvent);

        // addevent button click
        $('#form-addevent').on('submit', AddEvent);

    });
});

// Fill table with data
function populate_eventListTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON('/eventlist', function (data) {

        if (data.events) {
            //checking number of elements in json response
            var json = data.events;
            var elements = json.length;
            //show no events found if no elements
            if (elements < 1) {
                // Stick our user data array into a eventlist variable in the global object
                eventListData = data.events;

                // For each item in our JSON, add a table row and cells to the content string
                var index = 1;
                $.each(eventListData, function () {
                    tableContent += '<tr>';
                    tableContent += '<td>' + index + '</td>';
                    tableContent += '<td>' + this.from_date + '</td>';
                    tableContent += '<td>' + this.to_date + '</td>';
                    tableContent += '<td>' + this.start_time + '</td>';
                    tableContent += '<td>' + this.end_time + '</td>';
                    tableContent += '<td>' + this.location + '</td>';
                    tableContent += '<td>' + this.description + '</td>';
                    tableContent += '<td><button id="btnDelete" class="btnDelete" style="background-color: orange;" type="Delete" value="' + this._id + '">Delete</button></td>';
                    tableContent += '<td><button id="btnEdit" class="btnEdit" style="background-color: orange;" type="Edit" value="' + this._id + '">Edit</button></td>';
                    tableContent += '</tr>';
                    index++;
                });

                // Inject the whole content string into our existing HTML table
                $('#eventListTable table tbody').html(tableContent);
                //show no events found
                $('#message').show();
                $('#message').html('<h1 class="text-center login-title">No Event(s) Found</h1>');

            }
            else {
                // Stick our user data array into a eventlist variable in the global object
                eventListData = data.events;

                // For each item in our JSON, add a table row and cells to the content string
                var index = 1;
                $.each(eventListData, function () {
                    tableContent += '<tr>';
                    tableContent += '<td>' + index + '</td>';
                    tableContent += '<td>' + this.from_date + '</td>';
                    tableContent += '<td>' + this.to_date + '</td>';
                    tableContent += '<td>' + this.start_time + '</td>';
                    tableContent += '<td>' + this.end_time + '</td>';
                    tableContent += '<td>' + this.location + '</td>';
                    tableContent += '<td>' + this.description + '</td>';
                    tableContent += '<td><button id="btnDelete" class="btnDelete" style="background-color: orange;" type="Delete" value="' + this._id + '">Delete</button></td>';
                    tableContent += '<td><button id="btnEdit" class="btnEdit" style="background-color: orange;" type="Edit" value="' + this._id + '">Edit</button></td>';
                    tableContent += '</tr>';
                    index++;
                });

                // Inject the whole content string into our existing HTML table
                $('#eventListTable table tbody').html(tableContent);
                $('#message').hide();
            }
        }
    });
}


// Add Event Function
function AddEvent(event) {
    event.preventDefault();
    // retrieve values from input fields
    var event2add = {
        'from_date': $('#form-addevent form input#inputFromdate').val(),
        'to_date': $('#form-addevent form input#inputTodate').val(),
        'start_time': $('#form-addevent form input#inputStarttime').val(),
        'end_time': $('#form-addevent form input#inputEndtime').val(),
        'location': $('#form-addevent form input#inputLocation').val(),
        'description': $('#form-addevent form input#inputDescription').val(),
    }
    // Use AJAX to post the object to our addevent service
    $.ajax({
        type: 'POST',
        data: event2add,
        url: 'http://130.233.42.143:8080/addevent',
        dataType: 'JSON'
    }).done(function( res ) {
        if (res.exists) {
            alert("Event Already Exists!");
        }
        else{
            // Clear the form inputs
            $('#form-addevent form input').val('');
            // Update the eventtable
            populate_eventListTable();
        }
    });
}

// Delete Event
function DeleteEvent(event) {
    event.preventDefault();
    // Pop up a confirmation dialog
    var confirmation = confirm('Confirm Event Deletion?');
    // Check and make sure the user confirmed
    if (confirmation === true) {
        $.ajax({
            type: 'DELETE',
            url: 'http://130.233.42.143:8080/deleteevent/' + $(this).attr('value')
        }).done(function( res ) {
            // Check for a successful response
            if (res) {
                // Update the event list table
                populate_eventListTable();
            }
        });
    }
}

// Edit Event
function EditEvent(event) {
    event.preventDefault();
    // Pop up a confirmation dialog
    var confirmation = confirm('Confirm Event Edition?');
    // Check and make sure the user confirmed
    if (confirmation === true) {
        window.location.href = '/editevent/' + $(this).attr('value');
    }
}
