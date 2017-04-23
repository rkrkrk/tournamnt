'use strict';

console.log('cmon')

// $document.ready(function(){
//   console.log('ready now')
// }

// Declare app level module which depends on views, and components
angular.module('tournament', [
  'ngRoute',
  'ngMaterial',
  'md.data.table',
  'LocalStorageModule',
  'ngMessages'
])

angular.module('tournament').config(
  ['$locationProvider', 
    '$routeProvider', 
    'localStorageServiceProvider',
    function($locationProvider, 
      $routeProvider, 
      localStorageServiceProvider) {
  // $locationProvider.hashPrefix('#');

  $routeProvider
  .when('/home', {
            templateUrl: 'views/home.html',
            controller: 'HomeCtrl'
        })
  .when('/createTournament', {
            templateUrl: 'views/createTournament.html',
            controller: 'CreateTournamentCtrl'
        })
  .when('/tournament/:TID', {
            templateUrl: 'views/tournament.html',
            controller: 'TournamentCtrl'
        })
  .otherwise({redirectTo: '/home'});

  localStorageServiceProvider
    .setPrefix('tournament')
    .setNotify(false, false);


}]);
