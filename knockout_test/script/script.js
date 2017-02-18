$(function() {
    var locations = [{ title: 'University of California, Santa Cruz', location: { lat: 36.9738893, lng: -122.0771595 } },
        { title: 'San Jose State University', location: { lat: 37.335103, lng: -121.877357 } },
        { title: 'Santa Clara University', location: { lat: 37.349649, lng: -121.939213 } },
        { title: 'University of San Francisco', location: { lat: 37.776632, lng: -122.450864 } },
        { title: 'University of California, Berkeley', location: { lat: 37.871467, lng: -122.258915 } },
        { title: 'Stanford University', location: { lat: 37.426385, lng: -122.168552 } },
        { title: 'Northeastern University Silicon Valley', location: { lat: 37.256893, lng: -121.787221 } },
        { title: 'Carnegie Mellon University - Silicon Valley', location: { lat: 37.410445, lng: -122.059858 } },

    ];

    var viewModel = {
        query: ko.observable('')
    };

    viewModel.locations = ko.dependentObservable(function() {
        var search = this.query().toLowerCase();
        return ko.utils.arrayFilter(locations, function(place) {
            return place.title.toLowerCase().indexOf(search) >= 0;
        });
    }, viewModel);

    ko.applyBindings(viewModel);
});
