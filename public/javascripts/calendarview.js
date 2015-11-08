/**
 * Created by Navii on 11/5/2015.
 */

var eventsdata = [];

$(document).ready(function() {
    $.getJSON( '/eventlist', function( data ) {

        $('#title').html('<h1 class="text-center login-title">Welcome ' + data.user.username + '. Check Calender View below:</h1>');

        populate_eventsdata();
    });
});

// Fill calenderview with data
function populate_eventsdata() {
    $.getJSON( '/eventlist', function( data ) {

        // For each item in our JSON, add an event to the event string
        var index = 0;
        $.each(data.events, function(){
            eventsdata[index]={
                title: this.description+ ',at ' + this.location,
                start: this.from_date + 'T' + this.start_time + ':00',
                end: this.to_date + 'T' + this.end_time + ':00'
            }
            index++;
        });

        $('#calendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            defaultDate: new Date(),
            editable: true,
            eventLimit: true, // allow "more" link when too many events
            events: eventsdata
        });
    });
}