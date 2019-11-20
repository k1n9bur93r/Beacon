//Set up signalr

"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/appHub").build();

connection.start().then(function () {
    console.log("SignalR Connection Made");

}).catch(function (error) {
    DisplaySnackBar('Failed to connect to server', 3);
    return console.error(error.toString());
    });

//Send event update

function PostEventUpdate(event,action) {
    connection.invoke("PostEventUpdate", event, ActiveStore, action).catch(function (error) {
        DisplaySnackBar('Failed to add yourself to the event!', 3);
        return console.error(error.toString());
    });
}


//Recieve event update

connection.on("GetEventUpdate", function (event, store, action,current,storeName) {
    if (store == ActiveStore) {
        var number = $('div#' + event + '').children('div').children('p#attending').siblings("p#number").text();
        var eventName = $('div#' + event + '').children('div').children('p#name').text();
        var totalnumber;
            if (action == 1) number++; else number--;
            $('div#' + event + '').children('div').children('p#attending').siblings("p#number").text(number);
            if (current) {
                totalnumber = $('h3#curPartCount').text();
                if (action == 1) totalnumber++; else totalnumber--;
                $('h3#curPartCount').text(totalnumber);
            }
            else {
                totalnumber = $('h3#upPartCount').text();
                if (action == 1) totalnumber++; else totalnumber--;
                $('h3#upPartCount').text(totalnumber);
        }

        if (action==1)
            DisplaySnackBar("New attendee at  "+eventName+"", 0);
        else
            DisplaySnackBar("Removed attendance at   " + eventName+"", 2);
    }
    else {

        if ( current == true)
        {
            if (action == 1)
            DisplaySnackBar("More people are going to an event at " + storeName + "", 1);
            var frontNumber = $('div[Storeid=' + store + ']').children('div#storeParticipants').children('h3').text();
            
            if (action == 1) frontNumber++; else frontNumber--;
            $('div[Storeid=' + store + '][id=StorePanel]').children('div#storeParticipants').children('h3').text(frontNumber);

        }
    }
        UpdateMarkerNotify(store);
    

});

//Create Event

function PostNewEvent(eventData, IsToday, Time, StoreId) {
    connection.invoke("PostNewEvent", eventData, IsToday, Time, StoreId, currentColor).catch(function (error) {
        
        DisplaySnackBar('Failed to post new event!', 3);
        return console.error(error.toString());
    });
}

//Receve New Event
connection.on("GetNewEvent", function (returnData, StoreId, EventName, StoreName,current) {
    if (StoreId == ActiveStore) {
        if (current) {
            $('div#CurrentEventList').append(returnData);
            $('div#CurrentEventList').children('h4').toggle(false);
        }
        else {
            $('div#EventList').append(returnData);
            $('div#EventList').children('h4').toggle(false);
        }
        

        var data = $('h3#CurrentEvents').text();
        data++;
        $('h2#CurrentEvents').text(data);
        $('h3#NoCurrent').toggle(false);
        DisplaySnackBar("Event added", 0);
    }
    else
    {
        if (current) {
            if ($('div[Storeid=' + StoreId + ']').children('div#id=storeEvents').is(':visible')) {
                var number = $('div[Storeid=' + StoreId + ']').children('div#id=storeEvents').children('h3').text();
                number++;
                $('div[Storeid=' + StoreId + '][id=storeEvents]').children('h4').text(number);
            }
            else {
                $('div[Storeid=' + StoreId + ']').children('div#id=storeParticipants').toggle(true);
                $('div[Storeid=' + StoreId + ']').children('div#id=storeParticipants').children('h3').text('0');
                $('div[Storeid=' + StoreId + ']').children('div#id=storeParticipants').children('h4').text('Current Events:');
                $('div[Storeid=' + StoreId + ']').children('div#id=storeEvents').children('h3').text('1');
            }
        }
        DisplaySnackBar("Event " + EventName + " created at " + StoreName + "", 1);
    }
    UpdateMarkerNotify(storeId);
});


//create new store event
function PostNewStore(newStore) {
    connection.invoke("PostNewStore", JSON.stringify(newStore), StoreCount%5, StoreCount).catch(function (err) {
        DisplaySnackBar('Failed to create new store!', 3);
        return console.error(err.toString());
    });
}

//get storeEvent
connection.on("GetNewStore", function (html, JSONs) {

    $('div#StoreDataWrapper').append(html);
    var store = JSON.parse(JSONs);
    var modelObject = {"Events": [], "Store": JSON.parse(JSONs), "TotalParticipants": 0, "CurrentEvents": 0};
    StoreObj.push(modelObject);
    DisplaySnackBar("New store added!", 1);
    geocodeAddress(store.Address, store.Id, StoreObj.length - 1, geocoder, map, (StoreCount % 5));
    StoreCount++;

});
