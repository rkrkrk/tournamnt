'use strict';

console.log('cmon')

// $document.ready(function(){
//   console.log('ready now')
// }

// Declare app level module which depends on views, and components
angular.module('tournament', [
  'ngRoute',
  'ngMaterial',
  'md.data.table'
])

angular.module('tournament').config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  // $locationProvider.hashPrefix('#');

  $routeProvider
  .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeCtrl'
        })
  .when('/game/:IDX', {
            templateUrl: 'views/game.html',
            controller: 'GameCtrl'
        })
  .otherwise({redirectTo: '/'});
}]);
