'use strict';

console.log('cmon')

// $document.ready(function(){
//   console.log('ready now')
// }

// Declare app level module which depends on views, and components
angular.module('tournament', [
  'ngRoute',
  'ngMaterial'
])

angular.module('tournament').config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('#');

  $routeProvider
  .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeCtrl'
        })
  .otherwise({redirectTo: '/'});
}]);
