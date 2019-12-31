var map; //Gmap object
var markers = new Array(); //array that holds all current markers on the map
var geocoder; //object that gets the lat/long of an inputted address
var MarkerColorSet = 5;

function initMap() {

    var mapStyle = 
        [
        {
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#ebe3cd"
                }
            ]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#523735"
                }
            ]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#f5f1e6"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#c9b2a6"
                }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#dcd2be"
                }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#ae9e90"
                }
            ]
        },
        {
            "featureType": "landscape.natural",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#dfd2ae"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#dfd2ae"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#93817c"
                }
            ]
        },
        {
            "featureType": "poi.business",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#a5b076"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#447530"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#f5f1e6"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#fdfcf8"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#f8c967"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#e9bc62"
                }
            ]
        },
        {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#e98d58"
                }
            ]
        },
        {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#db8555"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#806b63"
                }
            ]
        },
        {
            "featureType": "transit",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#dfd2ae"
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#8f7d77"
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#ebe3cd"
                }
            ]
        },
        {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#dfd2ae"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#b9d3c2"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#92998d"
                }
            ]
        }
        ];

    map = new google.maps.Map(document.getElementById('map'),{
        center: {lat: 36.269360, lng: -115.210790 },
        zoom: 11,
        disableDefaultUI: true,
        clickableIcons: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: mapStyle

    });

   geocoder = new google.maps.Geocoder();
    for (var x = 0; x < StoreCount; x++)
    {
        //Fetch the lat long of a store based on it's address, then pass in additonal data as tag information
        geocodeAddress(StoreObj[x].Store.Address, StoreObj[x].Store.Id, x, geocoder, map, (x % MarkerColorSet));
        
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

function geocodeAddress(address, Id, Index, geocoder, map, colorCode) {
        //Check the address of the store, if it exists then create a marker object with store information and listener information
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status === 'OK') {
                var icons = {
                    url:'http://www.google.com/mapfiles/marker.png?i=' + Index + ''
                };
                map.setCenter(results[0].geometry.location);
                //create a new marker
                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location,
                    StoreId: Id,
                    ObjIndex: Index,
                    color: colorCode,
                    icon: icons.url
                });
                //Add a listener to show the Store panel when clicked/to zoom in the map
                marker.addListener('click', function () {
                    map.setZoom(15);
                    $('img[src="' + this.icon + '"]').addClass('Color_Filter_' + this.color + '');
                    map.setCenter(this.getPosition());
                    getStoreData(this.ObjIndex);
                    currentColor = colorCode;
                    
                });
                //add a listener to change the color of the marker when hovered over 
                marker.addListener('mouseover', function () {
                    $('img[src="' + this.icon + '"]').addClass('Color_Filter_' + this.color + '');

                });
                 //add a listener to revert the color of the marker when hover lost
                marker.addListener('mouseout', function () {
                    $('img[src="' + this.icon + '"]').removeClass('Color_Filter_' + this.color + '');


                });
                markers.push(marker);
                
            }
            else {
                DisplaySnackBar("Failed to Place Pins for Store Number "+Id,3);
            }
        });
    }

function SlideInMap(element,ClickID)
{
    var getIndex;
    LastClickedStore = ClickID;
    for (var x = 0; x < StoreObj.length; x++) {
        //if you find the store ID
        
        if (markers[x].StoreId == ClickID) {
            getIndex = x;
            break;
        }
    }
    google.maps.event.trigger(markers[getIndex], 'mouseover');
    map.panTo(markers[getIndex].getPosition());
    map.setZoom(13);
    $('div#map').removeClass('col-sm-6');
    $('div#map').addClass('MapSlide');
    $('div#map').toggle(true);
    $('div#map').insertAfter(element);
    $('html, body').animate({ scrollTop: ($('div#map').first().offset().top - $('div#map').height() / 2)}, 500);
   

}

function UpdateMarkerNotify(markerId)
{
    for (var x = 0; x < StoreObj.length; x++) {

        if (markers[x].StoreId == markerId && markers[x].StoreId != ActiveStore)
            markers[x].setIcon(NotifyIconUrl);
    }

   
}

// generate a link to google maps based on the ouputted geolocation data
function genMapLink(text, status) {
    if (!status) {
        return "maps://maps.google.com/maps?q=" + text;
    }
    else {
        return "http://maps.google.com/maps?q=" + text;
    }
}