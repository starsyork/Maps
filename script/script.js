var map;
var markers = [];

function initMap(){               //init map
	map = new google.maps.Map(document.getElementById('map'),{
		center: {lat: 40.7413549, lng: -73.9980244},
		zoom:13
	});

	// var myPlace = {lat:40.6502, lng:-74.1322};             //here is the plave I wanna show
	// var marker = new google.maps.Marker({        //Add a marker to the place
	// 	position: myPlace,
	// 	map:map, 
	// 	title: 'Hello World'           //title will show when cursor hover
	// });
	var defaultIcon = makeMarkerIcon('0091ff');
	var highlightedIcon = makeMarkerIcon('FFFF24');



	var locations = [{title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
		          {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
		          {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
		          {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
		          {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
		          {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
					];
	var largeInfowindow = new google.maps.InfoWindow();
	var bounds = new google.maps.LatLngBounds();

	for (var i = 0; i < locations.length; i++) {
		var position = locations[i].location;
		var title = locations[i].title;

		var marker = new google.maps.Marker({
			map: map,
			position: position,
			title: title,
			icon: defaultIcon,
			animation: google.maps.Animation.DROP,
			id:i        //i not 1
		});

		markers.push(marker);
		
		marker.addListener('click', function(){ 
			populateInfoWindow(this, largeInfowindow);  
		});

		marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
         });

        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
         });
	}
	document.getElementById('show-listings').addEventListener('click',showListings);
	document.getElementById('hide-listings').addEventListener('click',hideListings);
}


function showListings() {
      var bounds = new google.maps.LatLngBounds();
      // Extend the boundaries of the map for each marker and display the marker
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
      }
      map.fitBounds(bounds);
}

function hideListings() {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
}

	// var infowindow = new google.maps.InfoWindow({       //here is the info and it's content
	// 	content: 'do you know'
	// });
	// marker.addListener('click', function(){  //Need a listener for info
	// 	infowindow.open(map, marker);  //We need give infowindow a place to open
	// });
// function populateInfoWindow(marker, infowindow) {
// 	if(infowindow.marker != marker) {
// 		infowindow.marker = marker;
// 		infowindow.setContent('<div>'+ marker.title + '</div>');
// 		infowindow.open(map, marker);

// 		infowindow.addListener('closeclick', function(){
// 			infowindow.setMarker(null);
// 		})
// 	}
// }
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.setMarker = null;
        });
    }
}

function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34),
          new google.maps.Size(21,34));
        return markerImage;
}



