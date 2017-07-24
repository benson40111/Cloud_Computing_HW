var yuntech = { lat: 23.692236, lng: 120.534944};
var mapOptions = {
	center: yuntech,
	zoom: 17
};
var map;
var infowindow;
var traffic, transit;

function initmap(){
	infowindow = new google.maps.InfoWindow({
		map: map
	});
	map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
	//獲得當前位置
	get_current;

	//自動補完位址跟搜尋
	//設定範圍
	var defaultBounds = new google.maps.LatLngBounds(
		new google.maps.LatLng(22, 120),
		new google.maps.LatLng(25, 122)
	);
	var options = {bounds: defaultBounds};
	
	//獲取輸入方塊
	var input =  document.getElementById("address");
	var destination = document.getElementById("destination");
	//map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
	//map.controls[google.maps.ControlPosition.TOP_LEFT].push(destination);
	var autocomplete = new google.maps.places.Autocomplete(input, options);
	var autocomplete_des = new google.maps.places.Autocomplete(destination, options);

	//當有這個東西的時候
	var marker = new google.maps.Marker({map:map});
	autocomplete.addListener('place_changed', function(){
		infowindow.close();
		marker.setVisible(false);
		var place = autocomplete.getPlace();
		if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		} 
		else {
			map.setCenter(place.geometry.location);
			map.setZoom(17);
			marker.setPosition(place.geometry.location);
			marker.setVisible(true);
		}
	});
	autocomplete_des.addListener('place_changed', function(){
		infowindow.close();
		var place = autocomplete_des.getPlace();
		if (place.geometry.viewport)
			map.fitBounds(place.geometry.viewport);
		else {
			map.setCenter(place.geometry.location);
			map.setZoom(17);
		}
	});
}

function get_current(){
		if (navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(position){
			var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			var marker = new google.maps.Marker({ position: pos, map: map});
			var content = "Location is founded";
			map.setCenter(pos);
			marker.addListener("click", function(){
				infowindow.open(map, marker);
				infowindow.setContent(content);
			});
			var surround_service = new google.maps.places.PlacesService(map);
			surround_service.nearbySearch({
				location: pos,
				radius: 500,
				type: ["store"]
			}, callback);
		}, function(){
			alert("Location is not founded!");
		});	
	}
}

function callback(results, status){
	if (status == google.maps.places.PlacesServiceStatus.OK){
		for (var i = 0; i < results.length; i++) {
			createMarker(results[i]);
		}
	}
}

function createMarker(place){
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location
	});

	marker.addListener('click', function() {
		infowindow.setContent(place.name);
		infowindow.open(map, this);
	});
}

function route(start, end){
	var current_direction;
	var directions_service = new google.maps.DirectionsService();
	var directions_display = new google.maps.DirectionsRenderer({
		'map' : map,
		'preserveViewport': true,
		'draggable': true
	});
	directions_display.setMap(map);

	var request = {
		origin : start,
		destination : end,
		travelMode: google.maps.DirectionsTravelMode.DRIVING
	};
	directions_service.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK){ 
			directions_display.setDirections(response);
			directions_display.setPanel(document.getElementById("direction_panel"));
		}
	})
}

function traffic_layer(){
	traffic = new google.maps.TrafficLayer();
	traffic.setMap(map);
	transit.setMap(null);
}

function transit_layer(){
	transit = new google.maps.TransitLayer();
  	transit.setMap(map);
	traffic.setMap(null);
}

function normal_mod(){
	traffic.setMap(null);
	transit.setMap(null);
}

//這行等同於 在網址列加上 &callback=initmap
google.maps.event.addDomListener(window, 'load', initmap);
