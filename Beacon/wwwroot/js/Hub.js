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

connection.on("GetEventUpdate", function (event, store, action) {
    if (store == ActiveStore) {
        var number = $('div#' + event + '').children('div#attending').children("p#number").text();
        var totalnumber = $('p#partCount').text();
        if (action == 1) {
            number++;
            totalnumber++;
            $('div#' + event + '').children('div#attending').children("p#number").text(number);
            $('p#partCount').text(totalnumber);
        }
        else if (action == -1) {
            number--;
            totalnumber--;
            if (number < 0) number = 0;
            $('div#' + event + '').children('div#attending').children("p#number").text(number);
            $('p#partCount').text(totalnumber);
        }
        DisplaySnackBar("participance adjusted ", 0);
    }
    else {
        DisplaySnackBar("More people are going to an event at " + store + "", 1);
        UpdateMarkerNotify(store);
    }

});

//Create Event

function PostNewEvent(eventData, IsToday, Time, StoreId) {
    connection.invoke("PostNewEvent", eventData, IsToday, Time,StoreId).catch(function (error) {
        
        DisplaySnackBar('Failed to post new event!', 3);
        return console.error(error.toString());
    });
}

//Receve New Event
connection.on("GetNewEvent", function (returnData, StoreId, EventName, StoreName) {
    if (StoreId == ActiveStore) {
        $('div#EventList').append(returnData);
        DisplaySnackBar("Event added", 0);
    }
    else
    {
        DisplaySnackBar("Event " + EventName + " created at " + StoreName + "", 1);
    }
    UpdateMarkerNotify(storeId);
});


//create new store event
function PostNewStore(newStore) {
    connection.invoke("PostNewStore", JSON.stringify(newStore)).catch(function (err) {
        
        DisplaySnackBar('Failed to create new store!', 3);
        return console.error(err.toString());
    });
}

//get storeEvent
connection.on("GetNewStore", function (html, JSONs) {
    $('div#StoreDataWrapper').prepend(html);
    var store = JSON.parse(JSONs);
    StoreObj.push(JSON.parse(JSONs));
    DisplaySnackBar("New store added!", 1);
    geocodeAddress(store.Address,store.Id,StoreObj.length-1,geocoder, map);
});
