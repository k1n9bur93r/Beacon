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
        console.error(error.toString());
        return 0;
    });
    return 1;
}



connection.on("GetEventUpdate", function (event, store, action, current, storeName) {

    var frontNumber = $('div[Storeid=' + store + '][id=StorePanel]').children('div#storeParticipants').children('h3').text();
    if (store == ActiveStore) {
        var number = $('div#' + event + '').children('div').children('p#attending').siblings("p#number").text();
        var eventName = $('div#' + event + '').children('div').children('p#name').text();
        var totalnumber;
        if (action == 1) {
            number++;
            frontNumber++;
        }
        else {
            number--;
            frontNumber--;
        }
        $('div#' + event + '').children('div').children('p#attending').siblings("p#number").text(number);
        $('div[Storeid=' + store + '][id=StorePanel]').children('div#storeParticipants').children('h3').text(frontNumber);
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

        if (current == true){
         if (action == 1){
                frontNumber++;
                $('div[Storeid=' + store + '][id=StorePanel]').children('div#storeParticipants').children('h3').text(frontNumber);
                DisplaySnackBar("More people are going to an event at " + storeName , 1);
                        }
         else {
              frontNumber--; 
              }
           

        }
    }
        //UpdateMarkerNotify(store);
    

 });

//Create Event

function PostNewEvent(eventData, IsToday, Time, StoreId) {
    connection.invoke("PostNewEvent", eventData, IsToday, Time, StoreId, currentColor).catch(function (error) {
        
        DisplaySnackBar('Failed to post new event!', 3);
        return console.error(error.toString());
    });
}

//Receve New Event
connection.on("GetNewEvent", function (returnData, StoreId, EventName, StoreName, current) {
    if (StoreId == ActiveStore) {
        if (current) {
            $('div#CurrentEventList').append(returnData);
            $('div#CurrentEventList').children('h4').toggle(false);
        }
        else {
            $('div#EventList').append(returnData);
            $('div#EventList').children('h4').toggle(false);
        }
        var data1 = $('h2#CurrentEvents').text();
        data1++;
        $('div#CurrentEventsWrapper').toggle(true);
        $('div#CurrentParts').toggle(true);
        $('div#TotalParts').toggle(true);
        $('h2#CurrentEvents').text(data1);
        $('h3#NoCurrent').toggle(false);
        DisplaySnackBar("Event added", 0);
    }
    
    if (current) {
        var number = $('div[storeid=' + StoreId + ']#storeEvents').children('h3').children('strong').text();
        if (number!=0) {
                number++;
            $('div[storeid=' + StoreId + ']#storeEvents').children('h3').children('strong').text(number);
            }
        else {
            $('div[Storeid=' + StoreId + ']#storeEvents').children('h3').removeClass("No_Show");
                $('div[Storeid=' + StoreId + ']#storeEvents').children('h3').text('1');
                $('div[Storeid=' + StoreId + ']#storeEvents').children('h4').text('Current Events:');
                $('div[Storeid=' + StoreId + ']#storeParticipants').toggle(true);
                $('div[Storeid=' + StoreId + ']#storeParticipants').children('h3').text('0');
            }
    }
    if (StoreId != ActiveStore) {
        DisplaySnackBar("Event " + EventName + " created at " + StoreName + "", 1);
    }
   // UpdateMarkerNotify(storeId);
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
