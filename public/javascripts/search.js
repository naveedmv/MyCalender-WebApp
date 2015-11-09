/**
 * Created by Navii on 11/4/2015.
 */

var searchEventdata=[];

// DOM Ready
$(document).ready(function() {

    $.getJSON( '/eventlist', function( data ) {
        $('#title').html('<h1 class="text-center login-title">Welcome ' + data.user.username + '. Search your events history below:</h1>');

        $('#header-SearchOptions').html('<h3>Search Options</h3>');

        $('#header-SearchResult').html('<h3>Search Result</h3>');

        $('#header-SearchResult').hide();

        $('#searchListTable').html('<table id="searchListTable"><thead><tr class="head"><th>#</th><th>From Date</th><th>To Date</th><th>Start time</th><th>End time</th><th>Location</th><th>Description</th><th>?</th><th>?</th></tr><tbody></tbody></thead></table>');

        $('#searchListTable').hide();

        $('#form-searchevent').html('<form id="form-SearchEvent"><input id="inputStartDate" type="date" name="Startdate" placeholder="Start Date"/><input id="inputEndDate" type="date" name="Enddate" placeholder="End Date"/><input id="inputStarttime" type="time" name="Starttime" placeholder="Start time"/><input id="inputEndtime" type="time" name="Endtime" placeholder="End time"/><br/><input id="inputLocation" type="text" name="Location" placeholder="Location" size="50"/><input id="inputDescription" type="text" name="Description" size="51" placeholder="Description"/><br/><button id="btnSearch" style="width: 500px; background-color: orange;">Search</button><button id="btnClear" style="width: 280px; background-color: orange;">Clear Search</button></form>');

        // Populate the event table on initial page load
        populate_searchListTable();

        // deleteevent button click
        $('#searchListTable table tbody').on('click', 'td button.btnDelete', DeleteEvent );

        //editevent button click
        $('#searchListTable table tbody').on('click', 'td button.btnEdit', EditEvent);

        // addevent button click
        $('#btnSearch').on('click', SearchEvent);

        //form-searchevents inputs clear button click
        $('#btnClear').on('click', SearchClear);
    });
});


// Fill searchListtable with data
function populate_searchListTable() {

    // Empty content string
    var tableContent = '';

    var index = 1;
    $.each(searchEventdata, function(){
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
    $('#searchListTable table tbody').html(tableContent);
};

// Search Event Function
function SearchEvent(event) {
    event.preventDefault();
    // retrieve values from input fields

    $('#searchListTable').show();
    $('#header-SearchResult').show();

    var event2search = {
        'start_date': $('#form-searchevent form input#inputStartDate').val(),
        'end_date': $('#form-searchevent form input#inputEndDate').val(),
        'start_time': $('#form-searchevent form input#inputStarttime').val(),
        'end_time': $('#form-searchevent form input#inputEndtime').val(),
        'location': $('#form-searchevent form input#inputLocation').val(),
        'description': $('#form-searchevent form input#inputDescription').val(),
    }
    // Use AJAX to post the object to our addevent service
    $.ajax({
        type: 'GET',
        data: event2search,
        url: 'http://130.233.42.143:8080/searchevent',
        dataType: 'JSON'
    }).done(function( res ) {
        if (res) {
            //checking number of elements in json response
            var json=res;
            var elements=json.length;
            //show no events found if no elements
            if(elements<1) {
                searchEventdata=res;
                // Update the searchListTable
                populate_searchListTable()
                //show no events found
                $('#message').show();
                $('#message').html('<h1 class="text-center login-title">No Event(s) Found</h1>');

            }
            else{
                searchEventdata=res;
                // Update the searchListTable
                populate_searchListTable()
                $('#message').hide();
            }
        }
    });
};

// Delete Event
function DeleteEvent(event) {
    event.preventDefault();
    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this event?');
    // Check and make sure the user confirmed
    if (confirmation === true) {
        $.ajax({
            type: 'DELETE',
            url: 'http://130.233.42.143:8080/deleteevent/' + $(this).attr('value')
        }).done(function( res ) {
            // Check for a successful response
            if (res) {
                SearchEvent(event);
            }
        });
    }
};

// Edit Event
function EditEvent(event) {
    event.preventDefault();
    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to edit this event?');
    // Check and make sure the user confirmed
    if (confirmation === true) {
        window.location.href= '/editsearchedevent/'+ $(this).attr('value');
    }
};

function SearchClear() {
    $('#form-searchevent input').val('');
}
