var SubbedEvents = false;// variable that keeps track of all sessions that a user commits themsleves to 
var SubbedEventsID = new Array();
var ActiveStore;
var currentColor = 0;
var isAnimating = false;

$('#Test').on('click', function () {
    $('div#AlertBar').removeClass('Slider_Closed');
});

//Function that is called to get a detailed store panel
//It is called either by clicking a Map marker or a Store's side panel
function getStoreData(data) {

    //set flag for which store is currently active 
    ActiveStore = StoreObj[data].Store.Id;

    $.ajax({ //set up the ajax call
        type: "GET",
        url: "/Home/GetStoreInfo",
        contentType: "application/json;charset=utf-8",
        data: { "JSON": JSON.stringify(StoreObj[data].Store) },
        dataType: "html"
    }).done(function (data) {
        $('div#StoreEventDataWrapper').html(data); //inject the HTML into the webpage
        $('div#StoreEventDataWrapper').toggle(true); //Show this injected HTML
        $('div#StoreDataWrapper').toggle(false); //Hide current Store Panels
        $('div#StoreButtonHolder').toggle(false);
        $('button#returnStoreDataWrapperView').toggle(true); //Show button to return app panels to view
    })
        .fail(function () {
            //Error Message
            DisplaySnackBar("Failed to get data for " + StoreObj[data].Store.Name + "", 3);
        });
}
//if the return to store list view
$('body').on('click','button#returnStoreDataWrapperView', function () {
    ActiveStore = "none";
    $('div#StoreEventDataWrapper').toggle(false); //Hide advanced store panel
    $('div#StoreButtonHolder').toggle(true); //show add store button
    $('div#StoreDataWrapper').toggle(true);//Show store panel list
    map.setZoom(11); //revert map zoom
    if ($('div#NewEventForm').hasClass('showModal') == true) 
        $('div#NewEventForm').removeClass('showModal');
    $('button#returnStoreDataWrapperView').toggle(false); //Hide return button
    
});

//If a store panel is clicked, we want to gather this store's information to display and adjust the map view
$('body').on('click','div#StorePanel', function () {
    var ClickId = $(this).attr('StoreId'); //get store ID
    currentColor = $(this).attr('color');
    var getIndex;//variable that holds a current object index
    //find a matching store id stored in a JS object list
    for (var x = 0; x < StoreObj.length; x++)
    {
        //if you find the store ID
        if (markers[x].StoreId == ClickId) {
            getIndex = x;
            break;
        }
    }
    //Zoom the map into the corret marker,call the return store panel
    google.maps.event.trigger(markers[getIndex], 'click');
    if ($('div#AddNewStoreWrapper').hasClass('showModal') == true) 
        $('div#AddNewStoreWrapper').removeClass('showModal');
   
});
$('body').on('mouseover', 'div#StorePanel', function () {
    var HoveId = $(this).attr('StoreId'); //get store ID
    //find a matching store id stored in a JS object list
    for (var x = 0; x < StoreObj.length; x++) {
        //if you find the store ID
        if (markers[x].StoreId == HoveId ) {
            getIndex = x;
            break;
        }
    }
    //Zoom the map into the corret marker,call the return store panel
    google.maps.event.trigger(markers[getIndex], 'mouseover');

});
$('body').on('mouseleave', 'div#StorePanel', function () {
    var HoveId = $(this).attr('StoreId'); //get store ID
    //find a matching store id stored in a JS object list
    for (var x = 0; x < StoreObj.length; x++) {
        //if you find the store ID
        if (markers[x].StoreId == HoveId) {
            getIndex = x;
            break;
        }
    }
    //Zoom the map into the corret marker,call the return store panel
    google.maps.event.trigger(markers[getIndex], 'mouseout');
});

// If an 'Im Going!' button is clicked for an event
$('body').on('click', 'button[id*=\'IncStoreEvent\']', function () {
    var element = $(this);
    if (!SubbedEvents) {
        var id = $(this).attr('eventId'); //get the related event ID
        
        PostEventUpdate(id, 1);
        SubbedEvents = true;
        $(this).toggle(false); //hide ths clicked button
        if ($('div#NewEventForm').hasClass('showModal') == true) 
            $('div#NewEventForm').removeClass('showModal');
        $(this).siblings('button#DecStoreEvent').removeClass('No_Show'); //show the regert button
    }
});

// If an 'Never Mind...' button is clicked for an event
$('body').on('click', 'button[id*=\'DecStoreEvent\']', function () {
    if (SubbedEvents) {
        var id = $(this).prev().attr('eventId');//get the related event ID
        PostEventUpdate(id, -1);
        SubbedEvents = false;
        $(this).addClass('No_Show');//hide ths clicked button
        $(this).siblings('button#IncStoreEvent').toggle(true);//show the I'm in button
    }
});

//if the add event button was clicked, g
$('body').on('click', 'button[id*=\'AddEvent\']', function () {
    
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
    ).done(function (data)
    {
        data = JSON.parse(data);
        $('select#EventGameInput').children().remove();//clean dropdown
        $('select#EventGameInput').append('<option >Select Game</option>');//add default opiton
        //populate all returned game types 
        for (var x = 0; x < data.length; x++)
        {
            $('select#EventGameInput').append('<option id="' + data[x].Id+ '">' + data[x].GameName + '</option>');
        }
    }
    ).fail(function ()
    {
        DisplaySnackBar("Unable to get game drop down data", 3);
        });
});
//if the 'is the event today?' check box is clicked
$('body').on('click', $('input#EventToday') ,function () {
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
        
});
//if the submit 'event button' was clicked
$('body').on('click', 'button#SubmitEvent', function () {
    event.preventDefault();
    var startDate; //hold the entered date
    var tempDate = moment(); //hold a fake date
    var isToday; //is the event scheduled for today
    //if the is the event today checkbox is checked 
    if ($('#EventNameInput').val() == '')
    {
        DisplaySnackBar('Event has no name!',3);
        return;
    }
    if ($('input#EventToday').is(':checked'))
    {
        //get time 
        startDate = $('#StartTimeValue').data("DateTimePicker").viewDate();
        isToday = true;
    }
else
    {
        //get date time
        startDate = $('#StartDateTimeValue').data("DateTimePicker").viewDate();
        isToday = false;

    }
    //if the selected time is less that the present, fail
    if (startDate < moment()) {
        //highlight in read, create Event a past date/time
        DisplaySnackBar('Cannot create events in the past!', 3);
    }
    else {
        //create a EventModel payload
        var storeId = $('button#AddEvent').attr('StoreId');
        var dataPayload = { "Id": 69, "EventName": $('#EventNameInput').val(), "StoreFK": storeId, "GameFK": $('select#EventGameInput').children(':selected').attr('id'), "StartDate": tempDate.format(), "EndDate": tempDate.format(), "Deleted": "False", "Participants": 0 };
        PostNewEvent(JSON.stringify(dataPayload), isToday, moment(startDate).format('MM/DD/YYYY hh:mm'), storeId);
        $('div#NewEventForm').removeClass('showModal');
        $('#EventNameInput').val("");
        $('#StartDateTimeValue').val("");
        $('#StartTimeValue').val("");
    }
});
//if the 'Add new Store' button is clicked
$('button#AddNewStore').on('click', function () {
    //if the form is not visible, show it. If it is visible, hide it 
    if ($('div#AddNewStoreWrapper').hasClass('showModal') == true) {
        $('div#AddNewStoreWrapper').removeClass('showModal');
    }
    else {
        $('div#AddNewStoreWrapper').addClass('showModal');
    }

});
//if the Submit store button is clicked
$('button#SubmitNewStore').on('click', function () {
    //make a variable to check the addresss
    var newAddress = $('input#StoreAddressInput').val() + ' ' + $('input#StoreZipInput').val() + ' ' + $('input#StoreCityInput').val() + ' ' + $('input#StoreCityInput').val();
    //create an async promise, function calls google Geocode to check if the address is valid 
    //checkAddress(newAddress);
    checkAddress(newAddress).then(info => {
        var dataPayload = { "Name": $('input#StoreNameInput').val(), "Id": 69, "Address": $('input#StoreAddressInput').val(), "Zip": $('input#StoreZipInput').val(), "City": $('input#StoreCityInput').val(), "State": $('input#StoreStateInput').val(), "Deleted": false };
        PostNewStore(dataPayload);
    }).catch(badfo => {
        //fail snack bar
        DisplaySnackBar('Unable to submit new store', 3);
        return;
    });
    $('div#AddNewStoreWrapper').removeClass('showModal');
});
//snack bar logic 
function DisplaySnackBar(msgtext, state) {
    // Get the snackbar DIV'
    $("div#snackbar").removeClass();
    $("div#snackbar").text(msgtext);
    $("div#snackbar").addClass('show');
    var classname;
    classname = 'temp';
    switch (state)
    {
        case 0:
            {
        $("div#snackbar").addClass('SuccessStatus');
        classname = 'SuccessStatus';
                break;
            }
        case 1:
            {
        $("div#snackbar").addClass('InfoStatus');
        classname = 'InfoStatus';
                break;
            }
        case 2:
            {
        $("div#snackbar").addClass('WarningStatus');
        classname = 'WarningStatus';
                break;
            }
        case 3:
            {
        $("div#snackbar").addClass('ErrorStatus');
        classname = 'ErrorStatus';
                break;
            }
    }
    if (isAnimating == false) {
        isAnimating = true;
        // After 3 seconds, remove the show class from DIV
        setTimeout(function () {
            // $("div#snackbar").addClass('show');
            $("div#snackbar").removeClass('show');
            $("div#snackbar").removeClass(classname);
            isAnimating = false;
        }, 3000);
    }
}

$('body').on('click', 'h1#StoreTitle', function () {
    var text = $(this).attr('Address');
     if /* if we're on iOS, open in Apple Maps */
    ((navigator.platform.indexOf("iPhone") != -1) || 
     (navigator.platform.indexOf("iPad") != -1) || 
         (navigator.platform.indexOf("iPod") != -1))
         window.open(genMapLink(text,false));
else /* else use Google */
         window.open(genMapLink(text, true));

});

function genMapLink(text, status)
{
    if (!status) {
        return "maps://maps.google.com/maps?q=" + text;
    }
    else
    {
        return "http://maps.google.com/maps?q=" + text;
        }
}
