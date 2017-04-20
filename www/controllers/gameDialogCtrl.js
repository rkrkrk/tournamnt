'use strict';


angular.module('tournament').controller('GameDialogCtrl',
    ['$scope', '$mdDialog', 'gameIdx', 'TournamentStore',
    function($scope, $mdDialog, gameIdx, TournamentStore) {
        console.log('in GameDialogCtrl controller');
        var games = TournamentStore.getCurrentTournament();

        var game = $scope.game = games[gameIdx];

        $scope.reset = function() {
            game.scoreHpoints = 0;
            game.scoreHgoals = 0
            game.scoreOpoints = 0;
            game.scoreOgoals = 0;
            game.active = false;
            TournamentStore.saveCurrentTournament(games);
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            game.active = false;
            $mdDialog.cancel(game);
        };

        $scope.save = function() {
            game.active = true;
            TournamentStore.saveCurrentTournament(games);
            $mdDialog.hide();
        };

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

    

}]);
