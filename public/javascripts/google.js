/**
 * Created by Navii on 11/5/2015.
 */

// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '882155603770-h7mt1geshpf64ncp3so65rssiet9spjc.apps.googleusercontent.com';
var SCOPES = ["https://www.googleapis.com/auth/calendar"];
var all_ids=[];

$(document).ready(function() {
    $.getJSON( '/eventlist', function( data ) {

        $('#title').html('<h1 class="text-center login-title">Welcome ' + data.user.username + '. Sync with Google Calender below:</h1>');

        //checkAuth();
    });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//IMPORT
////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Check if current user has authorized this application.
 *
function checkAuth() {
    gapi.auth.authorize(
        {
            'client_id': CLIENT_ID,
            'scope': SCOPES.join(' '),
            'immediate': true
        }, handleAuthResultImport);
}*/

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResultImport(authResult) {
    var authorizeDiv = document.getElementById('authorize-div-import');
    if (authResult && !authResult.error) {
        // Hide auth UI, then load client library.
        authorizeDiv.style.display = 'none';
        loadCalendarApiImport();
    } else {
        // Show auth UI, allowing the user to initiate authorization by
        // clicking authorize button.
        authorizeDiv.style.display = 'inline';
    }
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClickImport(event) {
    gapi.auth.authorize(
        {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
        handleAuthResultImport);
    return false;
}

/**
 * Load Google Calendar client library. List upcoming events
 * once client library is loaded.
 */
function loadCalendarApiImport() {
    gapi.client.load('calendar', 'v3', listUpcomingEvents);
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
    var request = gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    });
    request.execute(function (resp) {
        var events = resp.items;
        var email=resp.summary;
        appendPreImport('Upcoming events:');
        if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
                var event= events[i];
                var when = event.start.dateTime;
                if (!when) {
                    when = event.start.date;
                }
                appendPreImport(event.summary + ' (' + when + ')')
            }
            // Pop up a confirmation dialog
            var confirmation = confirm('Import Google Calender Events from '+ email +' ?');
            // Check and make sure the user confirmed
            if (confirmation === true) {
                ImportGoogleEvents(events);//MyCalender imports events from google calender
            }
        } else {
            appendPreImport('No upcoming events found.');
        }
    });
}

/**
 * Append a pre element to the body containing the given message
 * as its text node.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPreImport(message) {
    var pre = document.getElementById('outputimport');
    var textContent = document.createTextNode(message + '\\n');
    pre.appendChild(textContent);
}

//function imports events from google calender
function ImportGoogleEvents(events) {
    for (i = 0; i < events.length; i++) {
        var event2add={
            'from_date': events[i].start.dateTime.substr(0, 10),
            'to_date': events[i].end.dateTime.substr(0, 10),
            'start_time': events[i].start.dateTime.substr(11, 5), // parsing left
            'end_time': events[i].end.dateTime.substr(11, 5),//parsing left
            'location': events[i].location,
            'description': events[i].summary,
            'google_id' : events[i].iCalUID
        }
        // Use AJAX to post the object to our addevent service
        $.ajax({
            type: 'POST',
            data: event2add,
            url: 'http://130.233.42.143:3000/addevent',
            dataType: 'JSON'
        }).done();
    }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//EXPORT
////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Check if current user has authorized this application.
 *
function checkAuth() {
    gapi.auth.authorize(
        {
            'client_id': CLIENT_ID,
            'scope': SCOPES.join(' '),
            'immediate': true
        }, handleAuthResultExport);
}*/

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResultExport(authResult) {
    var authorizeDivE = document.getElementById('authorize-div-export');
    if (authResult && !authResult.error) {
        // Hide auth UI, then load client library.
        authorizeDivE.style.display = 'none';
        loadCalendarApiExport();
    } else {
        // Show auth UI, allowing the user to initiate authorization by
        // clicking authorize button.
        authorizeDivE.style.display = 'inline';
    }
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClickExport(event) {
    gapi.auth.authorize(
        {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
        handleAuthResultExport);
    return false;
}

/**
 * Load Google Calendar client library. Export local events.
 * once client library is loaded.
 */
function loadCalendarApiExport() {
    gapi.client.load('calendar', 'v3', ExportLocalEvents);
}


function ExportLocalEvents() {

    // Pop up a confirmation dialog
    var confirmation = confirm('Export Local Calender Events?');
    // Check and make sure the user confirmed
    if (confirmation === true) {
        appendPreExport('Exported events:');
        $.getJSON( '/eventlist', function( data ) {
            var eventsdata=data.events;
            $.each(eventsdata, function(){
                if(!this.google_id){
                    //prepare event variable from our events DB
                    var event2export = {
                        'summary': this.description,
                        'location': this.location,
                        'start': {
                            'dateTime': this.from_date+ 'T' + this.start_time + ':00+02:00'//'2015-05-28T09:00:00-07:00',
                            //'timeZone': 'Finland/Helsinki'
                        },
                        'end': {
                            'dateTime': this.to_date+ 'T' +this.end_time  + ':00+02:00'//'2015-05-28T17:00:00-07:00',
                            //'timeZone': 'Finland/Helsinki'
                        }
                    }

                    var request = gapi.client.calendar.events.insert({
                        'calendarId': 'primary',
                        'resource': event2export
                    });
                    request.execute(function(event2export) {
                        appendPreExport(event2export.summary + event2export.start.dateTime);
                    });

                    //assign google_id for the exported event to prevent duplicate export in future
                    var randomN= Math.random();
                    var updateevent_gID = {'google_id': randomN };

                    $.ajax({
                        type: 'PUT',
                        data: updateevent_gID,
                        url: 'http://130.233.42.143:3000/updateevent/' + this._id
                    }).done(function( res ) {
                        console.log(res);
                    });

                }
            });
        });
    }
}

/**
 * Append a pre element to the body containing the given message
 * as its text node.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPreExport(message) {
    var pre = document.getElementById('outputexport');
    var textContent = document.createTextNode(message + '\\n');
    pre.appendChild(textContent);
}