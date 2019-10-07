

    var map;
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
        geocodeAddress(StoreObj[x].Address, x, geocoder, map);
    }


}

    function geocodeAddress(address,Index,geocoder, map) {
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status === 'OK') {
                map.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location,
                    StoreId: Index
                });
                marker.addListener('click', function () {
                    map.setZoom(15);
                    map.setCenter(marker.getPosition());
                    getStoreData(this.StoreId);
                });
            }
            else {
                //throw alert here 
            }
        });
    }


  