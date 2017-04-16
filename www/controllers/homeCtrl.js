'use strict';


angular.module('tournament').controller('HomeCtrl',
    ['$scope', 'Roundrobin' ,
    function($scope, Roundrobin) {
        console.log('in home controller')
        $scope.hey = 'Hey Dere';
        $scope.tournaments = ['Feile1', 'Feile2','Feile3']
        $scope.teams = ["aaa", "bbb", "ccc", "ddd"]
        
        console.log('Roundrobin ', Roundrobin(4));
        var rrArr = Roundrobin($scope.teams.length)

        function Game(teamH, scoreH, scoreHpoints, scoreHgoals,
                teamO, scoreO, scoreOpoints, scoreOgoals){
            this.teamH = teamH;
            this.scoreH = scoreH;
            this.scoreHpoints = scoreHpoints;
            this.scoreHgoals = scoreHgoals
            this.teamO = teamO;
            this.scoreO = scoreO;
            this.scoreOpoints = scoreOpoints;
            this.scoreOgoals = scoreOgoals;

        }


        var games = [];

        _.forEach(rrArr, function(group){
            _.forEach(group, function(game){
                games.push(new Game(
                    $scope.teams[game[0]-1],
                    0,0,0,
                    $scope.teams[game[1]-1],
                    0,0,0
                ));
            });
        });

        $scope.games = games;

        $scope.loadGame(idx){
            console.log('load game')
        }

        console.log('games ', games);








}]);
