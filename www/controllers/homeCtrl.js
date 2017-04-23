'use strict';


angular.module('tournament').controller('HomeCtrl',
    ['$scope', '$location', 'Roundrobin' , 'TournamentStore', '$mdDialog',
    function($scope, $location, Roundrobin, TournamentStore, $mdDialog) {
        console.log('in home controller')
        $scope.tournaments = TournamentStore.getAllTournaments();
        var pointsForWin = 2;
        var pointsForDraw = 1;

  
        $scope.createTournament = function(){
            $location.path( '/createTournament');
        }

        $scope.deleteTournament = function(tournament){
            
        };

         $scope.runTournament = function(tournament){
            $location.path( '/tournament/' + tournament.tournamentID);
        };

        $scope.confirmDelete = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Delete Tournament?')
                .textContent(ev.tournamentName)
                .ariaLabel('elete Tournament')
                .targetEvent(ev)
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(function() {
                $scope.tournaments = TournamentStore.deleteTournament(ev.tournamentID);
            }, function() {
                console.log('delete cancel')
            });
        };
        
        

       

}]);
