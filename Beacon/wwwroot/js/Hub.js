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
        DisplaySnackBar('Failed to update the event!', 3);
        console.error(error.toString());
        return 0;
    });
    return 1;
}

connection.on("GetEventUpdate", function (EventId, StoreId, action, current, eventName,storeName) {
    if (StoreId == ActiveStore) {
        UpdateEventPanel(EventId, $('div#' + EventId + '').parent(), SubbedEvents);
        UpdateStoreEventDetails(StoreId, $('div#StoreEventDetails'));

        if (action == 1)
            DisplaySnackBar("New attendee at  " + eventName + "", 0);
        else
            DisplaySnackBar("Removed attendance at   " + eventName + "", 2);
    }
        //if the event is current
        if (current == true){
            UpdateStorePanels($('div#StoreDataWrapper'));
            if (StoreId != ActiveStore &&action==1)
            DisplaySnackBar("More people are going to " + eventName + " at " + storeName, 1);
        }
    
 });

//Create Event

function PostNewEvent(eventData, IsToday, Time, StoreId) {
    connection.invoke("PostNewEvent", eventData, IsToday, Time, StoreId, currentColor).catch(function (error) {
        
        DisplaySnackBar('Failed to post new event!', 3);
        return console.error(error.toString());
    });
}

//Receve New Event from server 
connection.on("GetNewEvent", function (StoreId, EventId,EventName ,StoreName, current) {
    //check if the event is a store that the user is currently viewing 
    if (StoreId == ActiveStore) {
        //check if the event is a current event or one to be scheduled 
        if (current) {
            UpdateEventPanel(EventId, $('div#CurrentEventList'),false);
        }
        else {
            UpdateEventPanel(EventId, $('div#EventList'));
        }
        UpdateStoreEventDetails(StoreId, $('div#StoreEventDetails'));
        DisplaySnackBar("Event added", 0);
    }
    else {
        DisplaySnackBar("Event " + EventName + " created at " + StoreName + "", 1);
    }
     //update the main store panel
    if (current == true) {
        UpdateStorePanels($('div#StoreDataWrapper'));
    }
});


//create new store event from client 
function PostNewStore(newStore) {
    connection.invoke("PostNewStore", JSON.stringify(newStore), StoreCount%5, StoreCount).catch(function (err) {
        DisplaySnackBar('Failed to create new store!', 3);
        return console.error(err.toString());
    });
}

//get storeEvent from server 
connection.on("GetNewStore", function (html, JSONs) {
    UpdateStorePanels($('div#StoreDataWrapper'));//add the new store to the server 
    var modelObject = {"Events": [], "Store": JSON.parse(JSONs), "TotalParticipants": 0, "CurrentEvents": 0}; //add store to the existing list
    StoreObj.push(modelObject);
    DisplaySnackBar("New store added!", 1);
    geocodeAddress(modelObject.Address, modelObject.Id, StoreObj.length - 1, geocoder, map, (StoreCount % MarkerColorSet));
    StoreCount++;

});
