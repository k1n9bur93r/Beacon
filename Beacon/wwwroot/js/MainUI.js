var SubbedEvents = false;// variable that keeps track of all sessions that a user commits themsleves to 
var SubbedEventsID = new Array();
var ActiveStore;


$('#Test').on('click', function () {
    $('div#AlertBar').removeClass('Slider_Closed');
});

//Function that is called to get a detailed store panel
//It is called either by clicking a Map marker or a Store's side panel
function getStoreData(data) {

    //set flag for which store is currently active 
    ActiveStore = StoreObj[data].Id;

    $.ajax({ //set up the ajax call
        type: "GET",
        url: "/Home/GetStoreInfo",
        contentType: "application/json;charset=utf-8",
        data: { "JSON": JSON.stringify(StoreObj[data]) },
        dataType: "html"
    }).done(function (data) {
        $('div#StoreEventDataWrapper').html(data); //inject the HTML into the webpage
        $('div#StoreEventDataWrapper').toggle(true); //Show this injected HTML
        $('div#StoreDataWrapper').toggle(false); //Hide current Store Panels
        $('button#returnStoreDataWrapperView').toggle(true); //Show button to return app panels to view
    })
        .fail(function () {
            //Error Message
            alert('Failed to get data for ' + StoreObj[0].Name);
        });
}
//if the return to store list view
$('button#returnStoreDataWrapperView').on('click', function () {
    ActiveStore = "none";
    $('div#StoreEventDataWrapper').toggle(false); //Hide advanced store panel
    $('div#StoreDataWrapper').toggle(true); //Show store panel list
    map.setZoom(11); //revert map zoom
    $('button#returnStoreDataWrapperView').toggle(false); //Hide return button
});

//If a store panel is clicked, we want to gather this store's information to display and adjust the map view
$('div#StorePanel').on('click', function () {
    var ClickId = $(this).attr('StoreId'); //get store ID
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
   
});


// If an 'Im Going!' button is clicked for an event
$('body').on('click', 'button[id*=\'IncStoreEvent\']', function () {
    if (!SubbedEvents) {
        var id = $(this).attr('eventId'); //get the related event ID
        PostEventUpdate(id, 1);
        SubbedEvents = true;
        $(this).toggle(false); //hide ths clicked button
        $(this).siblings('button#DecStoreEvent').toggle(true); //show the regert button
    }
});

// If an 'Never Mind...' button is clicked for an event
$('body').on('click', 'button[id*=\'DecStoreEvent\']', function () {
    if (SubbedEvents) {
        var id = $(this).prev().attr('eventId');//get the related event ID
        PostEventUpdate(id, -1);
        SubbedEvents = false;
        $(this).toggle(false);//hide ths clicked button
        $(this).siblings('button#IncStoreEvent').toggle(true);//show the I'm in button
    }
});

//if the add event button was clicked, g
$('body').on('click', 'button[id*=\'AddEvent\']', function () {
    var element = $(this); //get a copy of the element
    //if the form is not visible, make it visible, if visible make invisible  
    if ($(this).next().is(':visible') == false) {
        $(this).next().toggle(true);
    }
    else {
        $(this).next().toggle(false);
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
            //Error Message here
        });
});
//if the 'is the event today?' check box is clicked
$('body').on('click', $('input#EventToday') ,function () {
    //if the checkbox is checked then uncheck it, if unchecked then check it
    if ($('input#EventToday').is(':checked')) {
        //event is today only allow for time entries
        $('div#StartDateTime').toggle(false);
        $('#StartDateTimeValue').val("");
        $('div#StartTime').toggle(true);
    }
    else {
        //event is in the future allow for date time entries
        $('div#StartTime').toggle(false);
        $('#StartTimeValue').val("");
        $('div#StartDateTime').toggle(true);
    }
        
});
//if the submit 'event button' was clicked
$('body').on('click', 'button[id*=\'SubmitEvent\']', function () {
    var startDate; //hold the entered date
    var tempDate = moment(); //hold a fake date
    var isToday; //is the event scheduled for today
    //if the is the event today checkbox is checked 
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
        alert('Cannot create events in the past!');
        return;
    }
    //create a EventModel payload
    var dataPayload = { "Id": 69, "EventName": $('#EventNameInput').val(), "StoreFK": $('button#AddEvent').attr('StoreId'), "GameFK": $('select#EventGameInput').children(':selected').attr('id'), "StartDate": tempDate.format(), "EndDate": tempDate.format(), "Deleted": "False", "Participants": 0 };
    PostNewEvent(JSON.stringify(dataPayload), isToday, moment(startDate).format('MM/DD/YYYY hh:mm'), $('button#AddEvent').attr('StoreId'));
});
//if the 'Add new Store' button is clicked
$('button#AddNewStore').on('click', function () {
    //if the form is not visible, show it. If it is visible, hide it 
    if ($('div#AddNewStoreWrapper').is(':visible') == false) {
        $('div#AddNewStoreWrapper').toggle(true);
    }
    else {
        $('div#AddNewStoreWrapper').toggle(false);
    }

});
//if the Submit store button is clicked
$('button#SubmitNewStore').on('click', function () {
    //make a variable to check the addresss
    var newAddress = $('input#StoreAddressInput').val() + ' ' + $('input#StoreZipInput').val() + ' ' + $('input#StoreCityInput').val() + ' ' + $('input#StoreCityInput').val();
    //create an async promise, function calls google Geocode to check if the address is valid 
    checkAddress(newAddress).then(info => {
        //if the address is valid, create a StoreDataModel payload and send it out 
        var dataPayload = { "Name": $('input#StoreNameInput').val(), "Id": 69, "Address": $('input#StoreAddressInput').val(), "Zip": $('input#StoreZipInput').val(), "City": $('input#StoreCityInput').val(), "State": $('input#StoreStateInput').val(), "Deleted": false };

        $.ajax(
            {
                type: "GET",
                url: "/Home/CreateStore",
                contentType: "application/json;charset=utf-8",
                data: { "JSON": JSON.stringify(dataPayload) },
                dataType: "html"
            }
        ).done(function () {
            window.location.reload();
        }
        ).fail(function () {
            //Error Message Here
        }
        );
    }).catch(badfo => {
        return;
    });



});