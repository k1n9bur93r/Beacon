//
// Listener
//

//if the Add Store form back button is clicked
$(document).on('click', 'button#returnAddStore', function () {
    $('input#StoreNameInput').val('');
    $('input#StoreAddressInput').val('');
    $('input#StoreZipInput').val('');
    $('input#StoreCityInput').val('');
    $('input#StoreStateInput').val('');
    $('div#AddNewStoreWrapper').removeClass('showModal');
});

//if the 'Add new Store' button is clicked
$('button#AddNewStore').on('click', function () {
    //if the form is not visible, show it. If it is visible, hide it 
    if ($('div#AddNewStoreWrapper').hasClass('showModal') == true) {
        $('div#AddNewStoreWrapper').removeClass('showModal');
    }
    else {
        $('div#AddNewStoreWrapper').addClass('showModal');
    }
});

//if the Submit store button is clicked
$('button#SubmitNewStore').on('click', function () {
    GatherStoreFormData();
});

//
// Logic
//


function GatherStoreFormData()
{
    //make a variable to check the addresss
    var newAddress = $('input#StoreAddressInput').val() + ' ' + $('input#StoreZipInput').val() + ' ' + $('input#StoreCityInput').val() + ' ' + $('input#StoreCityInput').val();
    //create an async promise, function calls google Geocode to check if the address is valid 
    //checkAddress(newAddress);
    checkAddress(newAddress).then(info => {
        var dataPayload = { "Name": $('input#StoreNameInput').val(), "Id": 69, "Address": $('input#StoreAddressInput').val(), "Zip": $('input#StoreZipInput').val(), "City": $('input#StoreCityInput').val(), "State": $('input#StoreStateInput').val(), "Deleted": false };
        PostNewStore(dataPayload);
    }).catch(badfo => {
        //fail snack bar
        DisplaySnackBar('Unable to submit new store', 3);
        return;
    });
    $('div#AddNewStoreWrapper').removeClass('showModal');
}
//
// Accessory
//