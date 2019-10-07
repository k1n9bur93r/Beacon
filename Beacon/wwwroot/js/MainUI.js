function getStoreData(data) {
    console.log(data);
    console.log(StoreObj[data]);
    $.ajax({
        type: "GET",
        url: "/Home/GetStoreInfo",
        contentType: "application/json;charset=utf-8",
        data: { "JSON": JSON.stringify(StoreObj[data]) },
        dataType: "html"
    }).done(function (data) {
        console.log(data);
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
        console.log($(element).next().children('form').children('select'));
        console.log(data);
        $(element).next().children('form').children('select').children().remove();
        for (var x = 0; x < data.length; x++)
        {
            $(element).next().children('form').children('select').append('<option>'+data[x].GameName+'</option>');
        }
    }
    ).fail(function ()
        {
            //Error Message here
        });
});

$('body').on('click', 'button[id*=\'SubmitEvent\']', function () {

});