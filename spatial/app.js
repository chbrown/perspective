/*jslint browser: true */ /*globals angular, google */
var log = console.log.bind(console);

var app = angular.module('app', [
  // 'ngResource',
  'ngStorage',
  // 'ui.router',
  // 'misc-js/angular-plugins',
]);

var options = {
  frozen: {
    draggable: false,
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true
  },
  interactive: {
    draggable: true,
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false
  }
};


app.directive('googleMap', function($timeout) {
  return {
    restrict: 'E',
    scope: {
      zoom: '=',
      lon: '=',
      lat: '=',
    },
    link: function(scope, el, attrs) {
      var map = new google.maps.Map(el[0], {
        mapTypeId: google.maps.MapTypeId.ROADMAP, // "roadmap"
        zoom: scope.zoom,
        center: new google.maps.LatLng(scope.lat, scope.lon),
      });
      map.addListener('center_changed', function() {
        var center = map.getCenter();
        // center is a google.maps.LatLng instance, with lat(), lng(), and toUrlValue() methods
        log('googleMap:center_changed: %s', center.toUrlValue());
        scope.$apply(function() {
          scope.lat = center.lat();
          scope.lon = center.lng();
        });
      });
      map.addListener('zoom_changed', function() {
        var zoom = map.getZoom();
        // zoom is an integer. The larger the zoom, the closer the camera is to the earth.
        log('googleMap:zoom_changed: %s', zoom);
        $timeout(function() {
          // we'll be in a digest state already if we call setZoom from scope.$watch below.
          // but in that case scope.zoom will equal map.getZoom(), so we don't really need to change it anyway
          scope.zoom = zoom;
        });
      });
      // map.addListener('mousedown', function(ev) {
      //   mousedown_latLng = ev.latLng;
      //   if (window.key_state.down[16]) { // shift-down
      //     temporary_rectangle = new google.maps.Rectangle({
      //       bounds: new google.maps.LatLngBounds(ev.latLng, ev.latLng),
      //       clickable: false,
      //       map: map
      //     });
      //   }
      //   // ev.stop() does nothing, so we have
      //   //   do mousedown handling elsewhere for deactivation purposes
      // });
      // map.addListener('mousemove', function(ev) {
      //   if (window.key_state.down[16]) { // shift-down
      //     var initial_bounds = new google.maps.LatLngBounds(mousedown_latLng, mousedown_latLng);
      //     temporary_rectangle.setBounds(initial_bounds.extend(ev.latLng));
      //     // 'lat_lo,lng_lo,lat_hi,lng_hi'
      //   }
      // });
      // map.addListener('mouseup', function(ev) {
      //   else if (!dragging) {
      //     geometry = Point.fromLatLng(ev.latLng);
      //     label = 'Click';
      //   }
      // });
      // map.addListener('dragstart', function() {
      //   dragging = true;
      // });
      // map.addListener('dragend', function() {
      //   dragging = false;
      // });
      map.setOptions(options.interactive);

      scope.$watch('zoom', function(newVal, oldVal) {
        log('scope zoom changed. zoom=%s', scope.zoom, newVal, oldVal);
        map.setZoom(scope.zoom);
      });
    },
  };
});

app.controller('ctrl', function($scope) {
  // navigator.geolocation.getCurrentPosition(function(pos) {
  //   $scope.$apply(function() {
  //     $scope.browser = {position: pos};
  //   });
  // }, function(err) {
  //   $scope.$apply(function() {
  //     $scope.browser = {error: err};
  //   });
  // });
  $scope.zoom = 5;
  $scope.map1 = {lon: -99.6, lat: 31.3}; // Texas
  $scope.map2 = {lon:   2.6, lat: 45.8}; // France

  $scope.$watch('zoom', function() {
    log('ctrl $scope zoom changed. zoom=%s', $scope.zoom);
  });
});
