/* global Ember, WGN, google */

(function(){
'use strict';


WGN.CourtsView = Ember.View.extend({

	didInsertElement: function() {
	    this._super();
	    this.initializeMap();
	},

	initializeMap: function() {

		var map;

		// Set the center as Granada Theater
		var locations = {
		  'TietzePark': [32.823454, -96.761275],
		  'GranadaTheater': [32.830849, -96.769813]
		};
		var center = locations['GranadaTheater'];

		var radiusInKm = 0.5;


		/*************/
		/*  GEOQUERY */
		/*************/
		var courtsInQuery = {};

		// Create a new GeoQuery instance
		var geoQuery = WGN.geoFire.query({
			center: center,
			radius: radiusInKm
		});


		geoQuery.on('key_entered', function(courtId, courtLocation) {
			// Specify that the court has entered this query
			courtId = courtId.split(":")[1];
			courtsInQuery[courtId] = true;

				// Look up the court's data in the Transit Open Data Set
				WGN.ref.child("courts").child(courtId).once("value", function(dataSnapshot) {
					// Get the court data from the Open Data Set
					var court = dataSnapshot.val();						/* I ADDED THIS VAR!!!!! */

					// If the court has not already exited this query in the time it took to look up its data in the Open Data
					// Set, add it to the map
					if (court !== null && courtsInQuery[courtId] === true) {
						// Add the court to the list of courts in the query
						courtsInQuery[courtId] = court;

						// Create a new marker for the court
						// court.marker = createCourtMarker(court, getCourtColor(court));
						court.marker = createCourtMarker(court);
						console.log(court);
						console.log(court.marker);
					}

				});

		});


		/*****************/
		/*  GOOGLE MAPS  */
		/*****************/		
		// Get the location as a Google Maps latitude-longitude object
		var mapCenter = new google.maps.LatLng(center[0], center[1]);

		// Create the Google Map
		map = new google.maps.Map(document.getElementById('pinnedMap'), {
			center: mapCenter,
			zoom: 15,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});

		// Create a draggable circle centered on the map
		var circle = new google.maps.Circle({
			strokeColor: '#6D3099',
			strokeOpacity: 0.7,
			strokeWeight: 1,
			fillColor: '#B650FF',
			fillOpacity: 0.35,
			map: map,
			center: mapCenter,
			radius: ((radiusInKm) * 1000),
			draggable: true
		});

		//Update the query's criteria every time the circle is dragged
		var updateCriteria = _.debounce(function() {
			var latLng = circle.getCenter();
			geoQuery.updateCriteria({
		  		center: [latLng.lat(), latLng.lng()],
		  		radius: radiusInKm
			});
		}, 10);
		google.maps.event.addListener(circle, "drag", updateCriteria);


		/**********************/
		/*  HELPER FUNCTIONS  */
		/**********************/
		/* Adds a marker for the inputted court to the map */
		// function createCourtMarker(court, courtColor) {
		function createCourtMarker(court) {
			console.log(court);
			console.log(court.latitude);
			var marker = new google.maps.Marker({
				// icon: "https://chart.googleapis.com/chart?chst=d_bubble_icon_text_small&chld=" + vehicle.vtype + "|bbT|" + vehicle.routeTag + "|" + vehicleColor + "|eee",
				icon: 'https://31.media.tumblr.com/avatar_fe3197bc5e11_48.png',
				position: new google.maps.LatLng(court.latitude, court.longitude),
				optimized: true,
				map: map
		  	});
		    console.log(court.lat);

		    return marker;
		}

	},

	// loadGoogleMapsScript: function(){

	// 	var self = this;
	// 	window.map_callback = function() {
	// 	    self.initializeMap();
	// 	}
	// 	window.map_callback();
	// }

});


})();