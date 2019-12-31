//
// Listener
//

//If the back arrow is clicked to exit store Detail
$('body').on('click', 'button#returnStoreDataWrapperView', function () {
    returnToStorePanels();
});

//If a store name is clicked, redirect to maps or website
$('body').on('click', 'h1#StoreTitle', function () {
    LinkToStoreDirections()
});

//
// Logic 
//

function returnToStorePanels()
{
    ActiveStore = "none";
    $('div#StoreEventDataWrapper').toggle(false); //Hide advanced store panel
    $('div#StoreButtonHolder').toggle(true); //show add store button
    $('div#StoreDataWrapper').toggle(true);//Show store panel list
    map.setZoom(11); //revert map zoom
    if ($('div#map').hasClass('MapSlide'))
    {
        $('div#map').toggle(false);

    }
    SubbedEvents = false; //Reset user subbed events 
    //if the "Add new Event" modal is showing, hide it 
    if ($('div#NewEventForm').hasClass('showModal') == true)
        $('div#NewEventForm').removeClass('showModal');
    $('button#returnStoreDataWrapperView').toggle(false); //Hide back button
}
//It is called either by clicking a Map marker or a Store's panel object, calls StoreDetail view
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

//
// Accessory
//

//Sends User to gmail store 
function LinkToStoreDirections()
{
    var text = $(this).attr('Address');
    if //open map with apple maps if on ios
    ((navigator.platform.indexOf("iPhone") != -1) ||
    (navigator.platform.indexOf("iPad") != -1) ||
        (navigator.platform.indexOf("iPod") != -1))
        window.open(genMapLink(text, false));
    else//open map with google if on android 
        window.open(genMapLink(text, true));
}

//Used to refresh Event Details panel
function UpdateStoreEventDetails(ID, element) {
    $.ajax({
        type: "GET",
        url: "/Home/GetStoreDetailEvents",
        contentType: "application/json;charset=utf-8",
        data: { "ID": ID },
        dataType: "html"
    }).done(function (data) {
        $(element).empty();
        $(element).append(data);
        $(element).children('h4').toggle(false);
    }).fail(function () {
        DisplaySnackBar("Failed to fetch new store event details", 3);
    });

}
