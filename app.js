//List of famous tourist places and restaurants in Ernakulam.
var mainLocations = [{
        title: 'Fort Kochi',
        location: {
            lat: 9.9658,
            lng: 76.2421
        }
    },
    {
        title: 'Vizhinjam Lighthouse',
        location: {
            lat: 8.3829,
            lng: 76.9797
        }
    },
    {
        title: 'Athirapally Waterfalls',
        location: {
            lat: 10.2851,
            lng: 76.5698
        }
    },
    {
        title: 'Idikki Dam',
        location: {
            lat: 9.8431,
            lng: 76.9763
        }
    },
    {
        title: 'Chinese Fishing Nets',
        location: {
            lat: 9.9683,
            lng: 76.2420
        }
    },
    {
        title: 'Periyar Wildlife Sanctuary',
        location: {
            lat: 9.4622,
            lng: 77.2368
        }
    },
    {
        title: 'Teak Museum',
        location: {
            lat: 11.3002,
            lng: 76.2503
        }
    },
    {
        title: 'Marari Beach',
        location: {
            lat: 9.6016,
            lng: 76.2983
        }
    },
    {
        title: 'Kappad Beach',
        location: {
            lat: 11.3807,
            lng: 75.7261
        }
    },
    {
        title: 'Wagamon',
        location: {
            lat: 9.6862,
            lng: 76.9052
        }
    },
    {
        title: 'Padmanabhaswamy temple',
        location: {
            lat: 8.4828,
            lng: 76.9436
        }
    }
];

// Create a styles array to use with the map.
var styles = [{
    featureType: 'water',
    stylers: [{
        color: '#19a0d8'
    }]
}, {
    featureType: 'administrative',
    elementType: 'labels.text.stroke',
    stylers: [{
            color: '#ffffff'
        },
        {
            weight: 6
        }
    ]
}, {
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: [{
        color: '#e85113'
    }]
}, {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{
            color: '#efe9e4'
        },
        {
            lightness: -40
        }
    ]
}, {
    featureType: 'transit.station',
    stylers: [{
            weight: 9
        },
        {
            hue: '#e85113'
        }
    ]
}, {
    featureType: 'road.highway',
    elementType: 'labels.icon',
    stylers: [{
        visibility: 'off'
    }]
}, {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{
        lightness: 100
    }]
}, {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{
        lightness: -100
    }]
}, {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{
            visibility: 'on'
        },
        {
            color: '#f0e4d3'
        }
    ]
}, {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{
            color: '#efe9e4'
        },
        {
            lightness: -25
        }
    ]
}];

//*Model*//

// var Locations = function(data){
//     this.title = ko.observable(data.title);
//     // this.location = ko.observableArray(data.location);
// };
//Creates a new map
var map;

function initMap() {
    // Initialize the map.(only center and zoom are required.)
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 10.0718,
            lng: 76.5488
        }, //Lattitude and Longitude of ERNAKULAM.
        zoom: 13,
        styles: styles
        // mapTypeControl: false
    });
    ko.applyBindings(new ViewModel());

}

//*ViewModel*//
var markers = [];
var ViewModel = function() {

    var self = this;
    self.locationList = ko.observableArray(mainLocations);
    self.title = ko.observable('');
    // self.markers = ko.observableArray();
    // this.markers = function() {
    //     populateInfoWindow(this.marker, largeInfowindow);
    // };
    self.query = ko.observable('');
    self.search = ko.computed(function() {
        return searchResult = ko.utils.arrayFilter(self.locationList(), function(items) {
            if (items.title.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
                if (items.marker) {
                    items.marker.setVisible(true);
                }
                return true;
            } else {
                items.marker.setVisible(false);
            }
        });
    })

    // mainLocations.forEach(function(item){
    //     self.locationList.push(new Locations(item));
    // });
    // this.currentLocation = ko.observable(this.locationList()[0]);//to access zeroth element in the location list.
    // this.setLocation = function(clickedLoctions){
    //     self.currentLocation(clickedLoctions);
    // };
    //     self.currentLocation = function() {
    //     populateInfoWindow(this, largeInfowindow);
    // };

    //Initialize the InfoWindow
    var largeInfowindow = new google.maps.InfoWindow();

    // Style the markers a bit. This will be our listing marker icon.
    var defaultIcon = makeMarkerIcon('39FF14');
    // Create a "highlighted location" marker color for when the user mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FF0000');
    // //Applying bounds inorder to limit the display of mainLocations on the map
    var bounds = new google.maps.LatLngBounds();
    // The following group uses the mainLocation array to create an array of markers on initialize.
    for (i = 0; i < mainLocations.length; i++) {
        // Get the position from the mainLocation array.
        var position = mainLocations[i].location;
        var title = mainLocations[i].title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i
        });

        // Push the marker to our array of markers.
        markers.push(marker);

        // self.markers.push(marker);
        // marker.forEach(function(place){
        //   self.markers()[i].push(marker);
        // })

        //           // self.locationList()[i].marker = marker;

        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
            toggleBounce(this, marker);
        });
        // Two event listeners - one for mouseover, one for mouseout,
        // to change the colors back and forth.
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });

        // Extend the boundaries of the map for each marker and display the marker
        bounds.extend(markers[i].position);
    }
    //make sure all of the markers fit within the map bounds
    map.fitBounds(bounds);
};

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent('');
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });

//Declaring streetViewService and radius
        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;

    //code for wikipedia ajax request.
    var wikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='+marker.title+'&format=json&callback=wikiCallback';
    var wikiTimeoutRequest = setTimeout(function(){
        $wikiElem.text("failed to load wikipedia resources");
    },8000);
    $.ajax({
        url : wikiURL,
        dataType : "jsonp",
        success : function( response ){
            var articleStr = response[1];
                var URL = 'http://en.wikipedia.org/wiki/'+articleStr;
                console.log(URL);
                getStreetView();
            clearTimeout(wikiTimeoutRequest);

              }
              });


        // In case the status is OK, which means the pano was found, compute the
        // position of the streetview image, then calculate the heading, then get a
        // panorama from that and set the options
        function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(
                    nearStreetViewLocation, marker.position);
                infowindow.setContent('<div>' + marker.title + '</div><br><a href ="' + URL + '">'+ URL + '</a><hr><div id="pano"></div>');
                var panoramaOptions = {
                    position: nearStreetViewLocation,
                    pov: {                              //pov:-> point of view
                        heading: heading,
                        pitch: 30                       //slightly above the building
                    }
                };
                var panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('pano'), panoramaOptions);
            } else {
                infowindow.setContent('<div>' + marker.title + '</div>' +
                    '<div>No Street View Found</div>');
            }
        }
        // Use streetview service to get the closest streetview image within
        // 50 meters of the markers position
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
    }
}

//Adding bounce animation to marker when it is clicked and stop animation after 2 seconds
function toggleBounce(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
        marker.setAnimation(google.maps.Animation.null);
    }, 2000);
};

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
};
