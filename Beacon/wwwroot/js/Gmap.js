

var map;
var markers = new Array();
var geocoder;
function initMap() {

    var myStyles = [
        {
    featureType: "poi",
    elementType: "labels",
    stylers: [{visibility: "off" }]
        }
    ];

    map = new google.maps.Map(document.getElementById('map'),{
        center: {lat: 36.269360, lng: -115.210790 },
        zoom: 11,
        disableDefaultUI: true,
        clickableIcons: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: myStyles

    });

   geocoder = new google.maps.Geocoder();
    for (var x = 0; x < StoreCount; x++)
    {
        geocodeAddress(StoreObj[x].Address, StoreObj[x].Id,x, geocoder, map);
    }


}

function checkAddress(address) {
    return new Promise(function (resolve, reject) {
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (google.maps.GeocoderStatus.OK && results.length > 0) {
                DisplaySnackBar('Valid Address',0);
                //change text color,green pop up icon maybe?
               resolve(true);
            }
            else {
                //change text color,red pop up icon maybe?
                DisplaySnackBar('Invalid Address', 3);
               reject(false);
            }
        });
    });
    
        }

    function geocodeAddress(address,Id,Index,geocoder, map) {
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status === 'OK') {
                map.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location,
                    StoreId: Id,
                    ObjIndex: Index
                });
                marker.addListener('click', function (point) {
                    map.setZoom(15);
                    marker.setIcon(null);
                    map.setCenter(this.getPosition());
                    getStoreData(this.ObjIndex);
                });
                markers.push(marker);
            }
            else {
                //throw alert here 
            }
        });
    }


function UpdateMarkerNotify(markerId)
{
    for (var x = 0; x < StoreObj.length; x++) {

        if (markers[x].StoreId == markerId && markers[x].StoreId != ActiveStore)
            markers[x].setIcon(NotifyIconUrl);
    }

   
}