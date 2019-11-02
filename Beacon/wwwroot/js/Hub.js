//Set up signalr

"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/appHub").build();

connection.start().then(function () {
    console.log("SignalR Connection Made");

}).catch(function (error) {
    return console.error(error.toString());
    });

//Send event update

function PostEventUpdate(event,action) {
    connection.invoke("PostEventUpdate", event, ActiveStore, action).catch(function (error) {
        return console.error(error.toString());
    });
}


//Recieve event update

connection.on("GetEventUpdate", function (event, store, action) {
    if (store == ActiveStore)
    {
        var number = $('div#' + event + '').children('div#attending').children("p#number").text();
        if (action == 1) {
            number++;
            $('div#' + event + '').children('div#attending').children("p#number").text(number);
        }
        else if (action == -1) {
            number--;
            if (number < 0) number = 0;
            $('div#' + event + '').children('div#attending').children("p#number").text(number);
        }
    }
    UpdateMarkerNotify(store);

});

//Create Event

function PostNewEvent(eventData, IsToday, Time, StoreId) {
    connection.invoke("PostNewEvent", eventData, IsToday, Time,StoreId).catch(function (error) {
        return console.error(error.toString());
        //SnackBar Error
    });
}

//Receve New Event
connection.on("GetNewEvent", function (returnData, StoreId) {
    if (StoreId == ActiveStore) {
        $('div#EventList').append(returnData);
    }
    UpdateMarkerNotify(storeId);
});


//create new store event
function PostNewStore(newStore) {
    connection.invoke("PostNewStore", JSON.stringify(newStore)).catch(function (err) {
        return console.error(err.toString());
    });
}

//get storeEvent
connection.on("GetNewStore", function (html, JSONs) {
    $('div#StoreDataWrapper').prepend(html);
    var store = JSON.parse(JSONs);
    StoreObj.push(JSON.parse(JSONs));
    geocodeAddress(store.Address,store.Id,StoreObj.length-1,geocoder, map);
});
