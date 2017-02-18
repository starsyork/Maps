var map;
var markers = [];

function initMap() { //init map
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 37.4, lng: -121.8 },
        zoom: 9
    });




    //marker color
    var defaultIcon = makeMarkerIcon('FF4040');
    var highlightedIcon = makeMarkerIcon('00CD00');


    //location
    var locations = [{ title: 'University of California, Santa Cruz', location: { lat: 36.9738893, lng: -122.0771595 } },
        { title: 'San Jose State University', location: { lat: 37.335103, lng: -121.877357 } },
        { title: 'Santa Clara University', location: { lat: 37.349649, lng: -121.939213 } },
        { title: 'University of San Francisco', location: { lat: 37.776632, lng: -122.450864 } },
        { title: 'University of California, Berkeley', location: { lat: 37.871467, lng: -122.258915 } },
        { title: 'Stanford University', location: { lat: 37.426385, lng: -122.168552 } },
        { title: 'Northeastern University Silicon Valley', location: { lat: 37.256893, lng: -121.787221 } },
        { title: 'Carnegie Mellon University - Silicon Valley', location: { lat: 37.410445, lng: -122.059858 } },

    ];


    // Knockout
    var viewModel = {
        query: ko.observable(''),
        attachMarkers: function(markers) {
            locations.forEach(function(location, i) {
                location.marker = markers[i];
            });
        },
        activeMarker: function(marker) {
            console.log(marker);
            populateInfoWindow(marker.marker, largeInfowindow);
        },

        showAll: function() {
            var bounds = new google.maps.LatLngBounds();
            // Extend the boundaries of the map for each marker and display the marker
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
                bounds.extend(markers[i].position);
            }
            map.fitBounds(bounds);
        },

        hideAll: function() {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
        },

        enableDetails: function(marker) {
            marker.marker.setIcon(highlightedIcon);
        },

        disableDetails: function(marker) {
            marker.marker.setIcon(defaultIcon);
        }


    };

    viewModel.locations = ko.dependentObservable(function() {
        var search = this.query().toLowerCase();
        return ko.utils.arrayFilter(locations, function(place) {
            var found = place.title.toLowerCase().indexOf(search) >= 0; // true or false
            if (place.marker) {
                place.marker.setVisible(found); // true or false
            }
            return found;
        });
    }, viewModel);

    ko.applyBindings(viewModel);


    var largeInfowindow = new google.maps.InfoWindow();
    //var bounds = new google.maps.LatLngBounds();

    for (var i = 0; i < locations.length; i++) {


        var position = locations[i].location;
        var title = locations[i].title;

        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            icon: defaultIcon,
            animation: google.maps.Animation.DROP,
            id: i //i not 1
        });




        markers.push(marker);
        viewModel.attachMarkers(markers);

        // ============Create element by==============================
        //      function createEle (index) {
        //      var elem = document.createElement('li');
        //  //var title = locations[i].title;
        // elem.textContent = title;

        // elem.addEventListener('click', function(){  
        //  populateInfoWindow(markers[index], largeInfowindow);     
        // });

        // elem.addEventListener('mouseover', function() {
        //           markers[index].setIcon(highlightedIcon);
        //           elem.style.background = "#696969";
        //        });

        //       elem.addEventListener('mouseout', function() {
        //           markers[index].setIcon(defaultIcon);
        //           elem.style.background = "#05090c";
        //        });

        //       document.getElementById('marker-list').appendChild(elem);
        //     }
        //     createEle(i);
        // ==================================================

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

    // document.getElementById('show-listings').addEventListener('click',showListings);
    // document.getElementById('hide-listings').addEventListener('click',hideListings);
       var menu = document.querySelector('#menu');
      var maparea = document.querySelector('#map');
      var drawer = document.querySelector('.side-bar');
      

      menu.addEventListener('click', function(e) {
        drawer.classList.toggle('open');
        e.stopPropagation();
      });
      maparea.addEventListener('click', function() {
        drawer.classList.remove('open');
      });
     
}

// function findId(locations, title) {
//  var len = locations.length;
//  for (var i = 0; i < len; i++) {
//      if (locations[i].indexOf(title) > -1) {
//          return i
//      }
//  }
//  return -1;
// }


// function showListings() {
//       var bounds = new google.maps.LatLngBounds();
//       // Extend the boundaries of the map for each marker and display the marker
//       for (var i = 0; i < markers.length; i++) {
//         markers[i].setMap(map);
//         bounds.extend(markers[i].position);
//       }
//       map.fitBounds(bounds);
// }

// function hideListings() {
//  for (var i = 0; i < markers.length; i++) {
//      markers[i].setMap(null);
//  }
// }


// info window
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    


    
    var wikiurl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';
    var wikiRequestTimeout = setTimeout(function() {
        infowindow.setContent('Fail to get wikipedia resources');
    }, 2000);
    $.ajax({
        url: wikiurl,
        dataType: "jsonp",
        success: function(response) {
            var articleList = response[1];
            articleStr = articleList[0];
            var url = 'http://en.wikipedia.org/wiki/' + articleStr;
            if (infowindow.marker != marker) {
                infowindow.marker = marker;
                if (articleStr == null) {
                    infowindow.setContent('<div>' + marker.title + '</div>' + 'Fail to get wikipedia resources');
                } else {
                    infowindow.setContent('<div>' + '</div>' + '<a href = "' + url + '">' + articleStr + '</a>');
                }
                infowindow.open(map, marker);
                // Make sure the marker property is cleared if the infowindow is closed.            
            }
            clearTimeout(wikiRequestTimeout);
        }
    });
    infowindow.addListener('closeclick', function() {
        infowindow.setMarker = null;
    });
}





//set marker style
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}