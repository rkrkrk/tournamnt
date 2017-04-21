'use strict';


angular.module('tournament').controller('HomeCtrl',
    ['$scope', '$location', 'Roundrobin' , 'TournamentStore', '$mdDialog',
    function($scope, $location, Roundrobin, TournamentStore, $mdDialog) {
        console.log('in home controller')
        $scope.tournaments = TournamentStore.getTournaments();
        var pointsForWin = 2;
        var pointsForDraw = 1;

  
        $scope.createTournament = function(){
            $location.path( '/createTournament');
        }
        
        

       

}]);
