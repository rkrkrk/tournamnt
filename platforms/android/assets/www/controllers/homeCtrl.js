'use strict';


angular.module('tournament').controller('HomeCtrl',
    ['$scope', '$location', '$timeout', '$http', 'Roundrobin' , 'TournamentStore', '$mdDialog',
    function($scope, $location, $timeout, $http, Roundrobin, TournamentStore, $mdDialog) {
        console.log('in home controller')
        $scope.tournaments = TournamentStore.getAllTournaments();
        var pointsForWin = 2;
        var pointsForDraw = 1;
        var localHost =  ($location.host() === "localhost" || $location.host() === "127.0.0.1")

  
        $scope.createTournament = function(){
            $location.path( '/createTournament');
        }

        $scope.deleteTournament = function(tournament){
            
        };

        $scope.runTournament = function(tournament){
            $location.path( '/tournament/' + tournament.tournamentID);
        };

        $scope.editTournament = function(tournament){
            $location.path( '/createTournament/' + tournament.tournamentID);
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

        

        $scope.uploadTournament = function() {
            $scope.success = false;
            $scope.feck = false;
            var url = localHost ? 'http://localhost:8001/db/save' : 'http://tournament-fintanm.rhcloud.com/db/save';
            var params = {
                type: 'list',
                tournaments : $scope.tournaments
            }
            $http.post(url, params)
                .then(function(res){
                    console.log('call ok');
                    // $scope.result = res.data;
                    $scope.success = true;
                    $timeout(function(){
                        $scope.success = false;
                    }, 4000)

                }, function(err){
                    console.log('call ok', err);
                    // $scope.result = 'error';
                    $scope.feck = true;
                    $timeout(function(){
                        $scope.feck = false;
                    }, 4000)
                    
                })
        };

    

        $scope.downloadTournament = function() {
            $scope.successDL = false;
            $scope.feckDL = false;
            var url = localHost ? 'http://localhost:8001/db/loadTournament' : 'http://tournament-fintanm.rhcloud.com/db/loadTournament';
            $http.get(url)
                .then(function(res){
                    console.log('call ok');
                    TournamentStore.clearLocalStorage();
                    $scope.tournaments = res.data.tournaments;
                    TournamentStore.saveAllTournaments($scope.tournaments);
                    angular.forEach(res.data.groups, function(group){
                        TournamentStore.saveTournamentDetails(group.tid, group.gmaes);
                    })
                    $scope.successDL = true;
                    $timeout(function(){
                        $scope.successDL = false;
                    }, 4000)

                }, function(err){
                    console.log('call error', err);
                    // $scope.result = 'error';
                    $scope.feckDL = true;
                    $timeout(function(){
                        $scope.feckDL = false;
                    }, 4000)
                    
                })
        };
        
        

}]);
