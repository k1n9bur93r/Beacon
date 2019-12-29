var SubbedEvents = false;// variable that keeps track if a user is currently subbed to an event
var SubbedEventsID = new Array(); //array that keeps track of all events that a user is subbed to
var ActiveStore; //variable that stores the ID of the current store page a user is on
var currentColor = 0; //variable that holds the color code of a current store
var isAnimating = false; //used to keep the snackbar's animation from being reset while animating, as this tends to break the snackbar

//Accessability helper, if a store panel object is in focus and enter is pressed, acts as a click.
$('div#StorePanel').keydown(function () {
    if (event.keyCode != 13) return;
    if ($(this).is(":focus"))
    {
        StorePanelClicked($(this));
    }
})

//Function that is called to get a detailed store panel
//It is called either by clicking a Map marker or a Store's panel object
function getStoreData(data) {

    //set flag for which store is currently active 
    ActiveStore = StoreObj[data].Store.Id;

    $.ajax({ //set up the ajax call
        type: "GET",
        url: "/Home/GetStoreDetail",
        contentType: "application/json;charset=utf-8",
        data: { "JSON": JSON.stringify(StoreObj[data].Store), "Color": currentColor },
        dataType: "html"
    }).done(function (data) {
        $('div#StoreEventDataWrapper').html(data); //inject the HTML into the webpage
        $('div#StoreEventDataWrapper').toggle(true); //Show this injected HTML
        $('div#StoreDataWrapper').toggle(false); //Hide current Store Panels
        $('div#StoreButtonHolder').toggle(false);// Hide add new store button
        $('button#returnStoreDataWrapperView').toggle(true); //Show button to return app panels to view
    })
        .fail(function () {
            //Error Message
            DisplaySnackBar("Failed to get data for " + StoreObj[data].Store.Name + "", 3);
        });
}
//If the back arrow is clicked to exit a store panel
$('body').on('click','button#returnStoreDataWrapperView', function () {
    ActiveStore = "none";
    $('div#StoreEventDataWrapper').toggle(false); //Hide advanced store panel
    $('div#StoreButtonHolder').toggle(true); //show add store button
    $('div#StoreDataWrapper').toggle(true);//Show store panel list
    map.setZoom(11); //revert map zoom
    SubbedEvents = false; //Reset user subbed events 
    //if the "Add new Event" modal is showing, hide it 
    if ($('div#NewEventForm').hasClass('showModal') == true) 
        $('div#NewEventForm').removeClass('showModal');
    $('button#returnStoreDataWrapperView').toggle(false); //Hide back button
    
});

//If a store panel is clicked, we want to gather this store's information to display and adjust the map view
$('body').on('click','div#StorePanel', function () {
    StorePanelClicked($(this));
});

//Function that is called when a store's map marker is clicked, or when a store panel is clicked
function StorePanelClicked(element)
{
    var ClickId = $(element).attr('StoreId'); //get store ID
    currentColor = $(element).attr('color');
    var getIndex;//variable that holds a current object index
    //find a matching store id stored in a JS object list
    for (var x = 0; x < StoreObj.length; x++) {
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
}
//If the user hovers their mouse over a store panel, change the color of the store's marker to match
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
    //set the marker color 
    google.maps.event.trigger(markers[getIndex], 'mouseover');

});
//if a user is no longer hovering over a store panel change the color of the marker back
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
    //change the color back
    google.maps.event.trigger(markers[getIndex], 'mouseout');
});

// If an 'Im Going!' button is clicked for an event
$('body').on('click', 'button[id*=\'IncStoreEvent\']', function () {
    //if the user is not currently subbed to an event
    if (!SubbedEvents) {
        var id = $(this).attr('eventId'); //get the related event ID
        var element = $('div#' + id + '').parent();
        $(element).children().hide();
        $(element).append('<div class="Event_SubTheme_' + currentColor + ' Event_Margin  Event_Sub_Structure" style="height:125px!important;"><div class="Spinner"></div><div>');
        //make a call to the server to update the event's participation
        if (PostEventUpdate(id, 1)) {
            SubbedEvents = true; 
            //if the "Add New Event" modal is displayed, hide it 
            if ($('div#NewEventForm').hasClass('showModal') == true)
                $('div#NewEventForm').removeClass('showModal');
        }
    }
});

// If an 'Never Mind...' button is clicked for an event
$('body').on('click', 'button[id*=\'DecStoreEvent\']', function () {
    //if someone is subscribed to an event
    if (SubbedEvents) {
        var id = $(this).attr('eventId');//get the related event ID
        var element = $('div#' + id + '').parent();
        $(element).children().hide();
        $(element).append('<div class="Event_SubTheme_' + currentColor + ' Event_Margin  Event_Sub_Structure" style="height:125px!important;"><div class="Spinner"></div><div>');
        PostEventUpdate(id, -1);
        SubbedEvents = false;
        //if the "Add New Event" modal is displayed, hide it 
        if ($('div#NewEventForm').hasClass('showModal') == true)
            $('div#NewEventForm').removeClass('showModal');
      
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
        $('select#EventGameInput').append('<option value="" ></option>');//add default opiton
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
//if the Add Event form back button is clicked
$(document).on('click', 'button#butonreturnAddEvent', function () {
    event.preventDefault();
    $('input#EventNameInput').val('');
    $('input#StartTimeValue').val('');
    $('input#StartDateTimeValue').val('');
    $('div#NewEventForm').removeClass('showModal');
});
//if the Add Event form back button is clicked
$(document).on('click', 'button#returnAddStore', function () {
    $('input#StoreNameInput').val('');
    $('input#StoreAddressInput').val('');
    $('input#StoreZipInput').val('');
    $('input#StoreCityInput').val('');
    $('input#StoreStateInput').val('');
    $('div#AddNewStoreWrapper').removeClass('showModal');
});
//if the submit 'event button' was clicked
$('body').on('click', 'button#SubmitEvent', function () {
    var startDate; //hold the entered date
    var tempDate = moment(); //hold a fake date
    var isToday; //is the event scheduled for today
    //if the is the event today checkbox is checked 
    //check if the event name exists 
    if ($('#EventNameInput').val() == '')
    {
        DisplaySnackBar('Event has no name!',3);
        return;
    }
    //check if an input type was selected
    if ($('select#EventGameInput').val()=='')
    {
        DisplaySnackBar('Event type not selected!', 3);
        return;
    }
    //check if the input is selected for today
    if ($('input#EventToday').is(':checked'))
    {
        //get time 
        startDate = $('#StartTimeValue').data("DateTimePicker").viewDate();
        startDate.add(1, 'minutes');
        isToday = true;
    }
else
    {
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
    else if (startDate > tempDate.add(1, 'months'))
    {
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
    // reset the snackbar for the next message, add the text, show the bar
    $("div#snackbar").removeClass();
    $("div#snackbar").text(msgtext);
    $("div#snackbar").addClass('show');
    var classname;
    classname = 'temp';
    //depending on the state passed in, color the snack bar accordingly 
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
    //if the snackbar is not currently visible, start the animation agian
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
     if //open map with apple maps if on ios
    ((navigator.platform.indexOf("iPhone") != -1) || 
     (navigator.platform.indexOf("iPad") != -1) || 
         (navigator.platform.indexOf("iPod") != -1))
         window.open(genMapLink(text,false));
else//open map with google if on android 
         window.open(genMapLink(text, true));

});



function UpdateEventPanel(ID,element,state)
{
    $.ajax({
        type: "GET",
        url: "/Home/GetEventPanel",
        contentType: "application/json;charset=utf-8",
        data: { "ID": ID, "Color": currentColor,"State":state},
        dataType: "html"
    }).done(function (data) {
        $(element).empty();
        $(element).append(data);
        $(element).children('h4').toggle(false);
    }).fail(function () {
        DisplaySnackBar("Failed to fetch new event panel update", 3);

    });
}

function UpdateStorePanels(element)
{
        $.ajax({
            type: "GET",
            url: "/Home/GetStorePanel",
            contentType: "application/json;charset=utf-8",
            dataType: "html"
        }).done(function (data) {
            $(element).empty();
            $(element).append(data);
            }).fail(function () {
                DisplaySnackBar("Failed to fetch new store panel update", 3);
        });

}
function UpdateStoreEventDetails(ID,element) {
    $.ajax({
        type: "GET",
        url: "/Home/GetStoreDetailEvents",
        contentType: "application/json;charset=utf-8",
        data: { "ID": ID},
        dataType: "html"
    }).done(function (data) {
        $(element).empty();
        $(element).append(data);
        $(element).children('h4').toggle(false);
    }).fail(function () {
        DisplaySnackBar("Failed to fetch new store event details", 3);
    });

}

