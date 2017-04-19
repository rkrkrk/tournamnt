'use strict';


angular.module('tournament').controller('GameCtrl',
    ['$scope', '$route', 'TournamentStore', '$location',
    function($scope, $route, TournamentStore, $location) {
        console.log('in GameCtrl controller');

        var idx = $route.current.params.IDX

        var games = TournamentStore.getCurrentTournament();

        $scope.game = games[idx];

        $scope.modScore = function(team, type, num){
            if (team===0){
                if (type===1){
                    $scope.game.scoreHpoints = Math.max($scope.game.scoreHpoints + num, 0);
                } else if (type===0){
                    $scope.game.scoreHgoals = Math.max($scope.game.scoreHgoals + num, 0);
                }
            } else if (team===1){
                if (type===1){
                    $scope.game.scoreOpoints = Math.max($scope.game.scoreOpoints + num, 0);
                } else if (type===0){
                    $scope.game.scoreOgoals = Math.max($scope.game.scoreOgoals + num, 0);
                }
            }
        }

        $scope.saveScore = function(){
            $scope.game.active=true;
            TournamentStore.saveCurrentTournament(games);
            $location.path( '/');
        }
        








}]);
