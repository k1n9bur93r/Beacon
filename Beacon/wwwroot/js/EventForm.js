//
// Listener
//

//if the 'is the event today?' check box is clicked
$('body').on('click', $('input#EventToday'), function () {
    EventTodayToggle();
});

//if the add event button was clicked, 
$('body').on('click', 'button[id*=\'AddEvent\']', function () {
    DisplayEventForm();
});
//if the submit 'event button' was clicked
$('body').on('click', 'button#SubmitEvent', function () {
    GatherEventFormData();
});

//if the Add Store form back button is clicked
$(document).on('click', 'button#butonreturnAddEvent', function () {
    event.preventDefault();
    $('input#EventNameInput').val('');
    $('input#StartTimeValue').val('');
    $('input#StartDateTimeValue').val('');
    $('div#NewEventForm').removeClass('showModal');
});

//
// Logic
//

function EventTodayToggle()
{
    //if the checkbox is checked then uncheck it, if unchecked then check it
    if ($('input#EventToday').is(':checked')) {
        //event is today only allow for time entries
        $('div#StartDateTime').addClass('No_Show');
        $('#StartDateTimeValue').val("");
        $('div#StartTime').removeClass('No_Show');
    }
    else {
        //event is in the future allow for date time entries
        $('div#StartTime').addClass('No_Show');
        $('#StartTimeValue').val("");
        $('div#StartDateTime').removeClass('No_Show');
    }

}
function DisplayEventForm()
{
    //if the form is not visible, make it visible, if visible make invisible  
    if ($('div#NewEventForm').hasClass('showModal') == true) {
        $('div#NewEventForm').removeClass('showModal');
        return;
    }
    else {
        $('div#NewEventForm').addClass('showModal');
    }
    //get the dropdown data for game types
    $.ajax({
        type: "GET",
        url: "/Home/GetGames",
        contentType: "application/json;charset=utf-8",
        dataType: "html"
    }
    ).done(function (data) {
        data = JSON.parse(data);
        $('select#EventGameInput').children().remove();//clean dropdown
        $('select#EventGameInput').append('<option value="" ></option>');//add default opiton
        //populate all returned game types 
        for (var x = 0; x < data.length; x++) {
            $('select#EventGameInput').append('<option id="' + data[x].Id + '">' + data[x].GameName + '</option>');
        }
    }
    ).fail(function () {
        DisplaySnackBar("Unable to get game drop down data", 3);
    });
}
function GatherEventFormData()
{
    var startDate; //hold the entered date
    var tempDate = moment(); //hold a fake date
    var isToday; //is the event scheduled for today
    //if the is the event today checkbox is checked 
    //check if the event name exists 
    if ($('#EventNameInput').val() == '') {
        DisplaySnackBar('Event has no name!', 3);
        return;
    }
    //check if an input type was selected
    if ($('select#EventGameInput').val() == '') {
        DisplaySnackBar('Event type not selected!', 3);
        return;
    }
    //check if the input is selected for today
    if ($('input#EventToday').is(':checked')) {
        //get time 
        startDate = $('#StartTimeValue').data("DateTimePicker").viewDate();
        startDate.add(1, 'minutes');
        isToday = true;
    }
    else {
        //get date time
        startDate = $('#StartDateTimeValue').data("DateTimePicker").viewDate();
        isToday = false;

    }
    //if the selected time is less that the present, fail
    if (startDate < tempDate) {
        //highlight in read, create Event a past date/time
        DisplaySnackBar('Cannot create events in the past!', 3);
        return;
    }
    else if (startDate > tempDate.add(1, 'months')) {
        DisplaySnackBar('Cannot create events more than 1 month in the future!', 3);
        return;
    }
    else {
        //create a EventModel payload
        var storeId = $('button#AddEvent').attr('StoreId');
        var dataPayload = { "Id": 69, "EventName": $('#EventNameInput').val(), "StoreFK": storeId, "GameFK": $('select#EventGameInput').children(':selected').attr('id'), "StartDate": moment(startDate).format('MM/DD/YYYY hh:mm a'), "EndDate": moment(startDate).format('MM/DD/YYYY hh:mm a'), "Deleted": "False", "Participants": 0 };
        PostNewEvent(JSON.stringify(dataPayload), isToday, moment(startDate).format('MM/DD/YYYY hh:mm a'), storeId);
        $('div#NewEventForm').removeClass('showModal');
        $('#EventNameInput').val("");
        $('#StartDateTimeValue').val("");
        $('#StartTimeValue').val("");
    }
}


//
// Accessory
//