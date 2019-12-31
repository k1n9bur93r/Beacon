//
// Listener
//

//If an I'm going button is clicked, add a participant
$('body').on('click', 'button[id*=\'IncStoreEvent\']', function () {
    AdjustEventParticipant($(this),1);
});

//If an Nevermind button is clicked, remove  a participant
$('body').on('click', 'button[id*=\'DecStoreEvent\']', function () {
    AdjustEventParticipant($(this),-1);
});

//
// Logic
//

//Depending on the button clicked, adjust the Event's particpants accordingly
function AdjustEventParticipant(element,EventType)
{
    var id = $(element).attr('eventId');//get the related event ID
    var parent = $('div#' + id + '').parent();
    if ((SubbedEvents && EventType == -1) || (!SubbedEvents && EventType == 1)) {
        SubbedEvents = !SubbedEvents;
        $(parent).children().hide();
        $(parent).append('<div class="Event_SubTheme_' + currentColor + ' Event_Margin  Event_Sub_Structure" style="height:125px!important;"><div class="Spinner"></div><div>');
        PostEventUpdate(id, EventType);
    }
        //if the "Add New Event" modal is displayed, hide it 
        if ($('div#NewEventForm').hasClass('showModal') == true)
            $('div#NewEventForm').removeClass('showModal');
   }




//
// Accessory
//

//Used to refresh the Event Panel Component
function UpdateEventPanel(ID, element, state) {
    $.ajax({
        type: "GET",
        url: "/Home/GetEventPanel",
        contentType: "application/json;charset=utf-8",
        data: { "ID": ID, "Color": currentColor, "State": state },
        dataType: "html"
    }).done(function (data) {
        $(element).empty();
        $(element).append(data);
        $(element).children('h4').toggle(false);
    }).fail(function () {
        DisplaySnackBar("Failed to fetch new event panel update", 3);

    });
}