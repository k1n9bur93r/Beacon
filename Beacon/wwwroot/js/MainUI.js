function getStoreData(data) {
    $.ajax({
        type: "GET",
        url: "/Home/GetStoreInfo",
        contentType: "application/json;charset=utf-8",
        data: { "JSON": JSON.stringify(StoreObj[data]) },
        dataType: "html"
    }).done(function (data) {
        $('div#StoreEventDataWrapper').html(data);
        $('div#StoreEventDataWrapper').toggle(true);
        $('div#StoreDataWrapper').toggle(false);
        $('button#returnStoreDataWrapperView').toggle(true);
    })
        .fail(function () {
            alert('Failed to get data for ' + StoreObj[0].Name);
        });
}
$('button#returnStoreDataWrapperView').on('click', function () {
    $('div#StoreEventDataWrapper').toggle(false);
    $('div#StoreDataWrapper').toggle(true);
    map.setZoom(11);
    $('button#returnStoreDataWrapperView').toggle(false);
});


$('div#StorePanel').on('click', function () {
    var ClickId = $(this).attr('StoreId');
    var getIndex;
    console.log(ClickId);
    for (var x = 0; x < StoreObj.length; x++)
    {
        if (markers[x].StoreId == ClickId) {
            getIndex = x;
            break;
        }
    }
    console.log(markers[getIndex]);
    google.maps.event.trigger(markers[getIndex], 'click');
});

$('body').on('click', 'button[id*=\'IncStoreEvent\']', function () {
    var id = $(this).attr('eventId');
    $.ajax({
        type: "GET",
        url: "/Home/IncEventAmount",
        contentType: "application/json;charset=utf-8",
        data: { "Id": id },
        dataType: "html"
    }).done(function () {
        var num = $("[eventId=" + id + "]").siblings('p#attending').attr('num');

        num++;
        $("[eventId=" + id + "]").siblings('p#attending').attr('num', num);
        num = "People Attending: " + num;

        $("[eventId=" + id + "]").siblings('p#attending').text(num);
    });
});

$('body').on('click', 'button[id*=\'AddEvent\']', function () {
    var element = $(this);
    if ($(this).next().is(':visible') == false) {
        $(this).next().toggle(true);
    }
    else {
        $(this).next().toggle(false);
    }
    $.ajax({
        type: "GET",
        url: "/Home/GetGames",
        contentType: "application/json;charset=utf-8",
        dataType: "html"
    }
    ).done(function (data)
    {
        data = JSON.parse(data);
        $(element).next().children('form').children('select').children().remove();
        $(element).next().children('form').children('select').append('<option >Select Game</option>');
        for (var x = 0; x < data.length; x++)
        {
            $(element).next().children('form').children('select').append('<option id="' + data[x].Id+ '">' + data[x].GameName + '</option>');
        }
    }
    ).fail(function ()
        {
            //Error Message here
        });
});

$('body').on('click', $('input#EventToday') ,function () {

    if ($('input#EventToday').is(':checked')) {
        $('div#StartDateTime').toggle(false);
        $('div#StartTime').toggle(true);
    }
    else {
        $('div#StartTime').toggle(false);
        $('div#StartDateTime').toggle(true);
    }
        
});

$('body').on('click', 'button[id*=\'SubmitEvent\']', function () {
    var startDate;
    var tempDate = moment();
    var isToday;
    if ($('input#EventToday').is(':checked'))
    {
        startDate = $('#StartTimeValue').data("DateTimePicker").viewDate();
        isToday = true;
     
    }
else
    {

       
        startDate = $('#StartDateTimeValue').data("DateTimePicker").viewDate();
        isToday = false;

    }
    if (startDate < moment()) {
        //highlight in read, create Event a past date/time
        alert('Cannot create events in the past!');
        return;
    }

    var dataPayload = { "Id": 69, "EventName": $('#EventNameInput').val(), "StoreFK": $('button#AddEvent').attr('StoreId'), "GameFK": $('select#EventGameInput').children(':selected').attr('id'), "StartDate": tempDate.format(), "EndDate": tempDate.format(), "Deleted": "False", "Participants": 0 };
    $.ajax({
            type: "GET",
            url: "/Home/CreateEvent",
        contentType: "application/json;charset=utf-8",
        data: { "JSON": JSON.stringify(dataPayload), "IsToday": isToday, "Time": moment(startDate).format('MM/DD/YYYY hh:mm') },
            dataType: "html"
    }
    ).done(function ()
    {
        window.location.reload(); 
        }
    ).fail(function ()
    {
        //Error message here 
    }
        );


});

$('button#AddNewStore').on('click', function () {
    if ($('div#AddNewStoreWrapper').is(':visible') == false) {
        $('div#AddNewStoreWrapper').toggle(true);
    }
    else {
        $('div#AddNewStoreWrapper').toggle(false);
    }

});

$('button#SubmitNewStore').on('click', function () {
    var newAddress = $('input#StoreAddressInput').val() + ' ' + $('input#StoreZipInput').val() + ' ' + $('input#StoreCityInput').val() + ' ' + $('input#StoreCityInput').val();
    checkAddress(newAddress).then(info => {
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