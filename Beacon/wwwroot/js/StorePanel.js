var StoreClickedCount = 0;

//
// Listener
//
//If a store panel is clicked, we want to gather this store's information to display and adjust the map view
$('body').on('click', 'div#StorePanel', function () {
    var screenSpace = window.innerWidth;
    if (screenSpace > 768) {
        StorePanelClicked($(this));
    }
    else {
        if (StoreClickedCount == 0) {
            SlideInMap($(this), $(this).attr('StoreId'));
            StoreClickedCount++;
        }
        else if (LastClickedStore == $(this).attr('StoreId') && StoreClickedCount == 1) {
            StorePanelClicked($(this));
            StoreClickedCount = 0;
        }
        else
        {
            SlideInMap($(this), $(this).attr('StoreId'));
        }

    }
});

//if a user is no longer hovering over a store panel change the color of the marker back
$('body').on('mouseleave', 'div#StorePanel', function () {
    StorePanelMouse(-1,$(this));
});

//If the user hovers their mouse over a store panel, change the color of the store's marker to match
$('body').on('mouseover', 'div#StorePanel', function () {
    StorePanelMouse(1, $(this));
});
//Accessability helper, if a store panel object is in focus and enter is pressed, acts as a click.
$('div#StorePanel').keydown(function () {
    AccessClick();
});

//
// Logic
//

//Function that is called when a store's map marker is clicked, or when a store panel is clicked
function StorePanelClicked(element) {
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

//Used to refresh all store panels
function UpdateStorePanels(element) {
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

//
// Accessory 
//

//Accessability helper, if a store panel object is in focus and enter is pressed, acts as a click.
function AccessClick()
{
    if (event.keyCode != 13) return;
    if ($(this).is(":focus")) {
        StorePanelClicked($(this));
    }
}
//If the user enters/leaves hover over a StorePanel, change it's corresponding Map Markers Color
function StorePanelMouse(EventType,element)
{
    var HoveId = $(element).attr('StoreId'); //get store ID
    //find a matching store id stored in a JS object list
    var getIndex;
    for (var x = 0; x < StoreObj.length; x++) {
        //if you find the store ID
        if (markers[x].StoreId == HoveId) {
            getIndex = x;
            break;
        }
    }
    if (EventType == 1) google.maps.event.trigger(markers[getIndex], 'mouseover');
    else google.maps.event.trigger(markers[getIndex], 'mouseout');
}
