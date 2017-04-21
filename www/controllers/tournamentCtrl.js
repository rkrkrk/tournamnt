'use strict';


angular.module('tournament').controller('TournamentCtrl',
    ['$scope', '$location', 'Roundrobin' , 'TournamentStore', '$mdDialog',
    function($scope, $location, Roundrobin, TournamentStore, $mdDialog) {
        console.log('in home controller')
        $scope.tournaments = ['Feile1', 'Feile2','Feile3'];
        var pointsForWin = 2;
        var pointsForDraw = 1;
        
        

        function Game(teamH, scoreH, scoreHpoints, scoreHgoals,
                teamO, scoreO, scoreOpoints, scoreOgoals){
            this.teamH = teamH;
            this.scoreHpoints = scoreHpoints;
            this.scoreHgoals = scoreHgoals
            this.teamO = teamO;
            this.scoreOpoints = scoreOpoints;
            this.scoreOgoals = scoreOgoals;
            this.active = false;

        }

        function getResult(game){
            // 0 is won, 1 is lost, 2 is draw
            var scoreH = game.scoreHgoals * 3 + game.scoreHpoints;
            var scoreO = game.scoreOgoals * 3 + game.scoreOpoints;
            if (scoreH > scoreO){
                return 0;
            } else if (scoreH < scoreO){
                return 1;
            } else {
                return 2;
            }
        }

        function makeTable(games, teams) {
            var teamsTable = [];
            var result;

            _.forEach(teams, function(t){
                var team = {};
                team.name = t;
                team.played = 0;
                team.won = 0;
                team.drew = 0;
                team.lost = 0;
                team.for = 0;
                team.against = 0;
                team.played = 0;
                team.diff = 0;
                team.points = 0;
                teamsTable.push(team);
            });


            _.forEach(games, function(game){
                if(game.active){
                    _.forEach(teamsTable, function(team){
                        if(game.teamH===team.name){
                            team.played++;
                            result = getResult(game);
                            if(result===0){
                                team.won++;
                                team.points = team.points + pointsForWin;
                            } else if(result===1){
                                team.lost++;
                            } else {
                                team.drew++;
                                team.points = team.points + pointsForDraw;
                            }
                            team.for = team.for + game.scoreHgoals * 3 + game.scoreHpoints;
                            team.against = team.against + game.scoreOgoals * 3 + game.scoreOpoints;
                            team.diff = team.for - team.against;
                        } else if (game.teamO===team.name){
                            team.played++;
                            result = getResult(game);
                            if(result===1){
                                team.won++;
                                team.points = team.points + pointsForWin;
                            } else if(result===0){
                                team.lost++;
                            } else {
                                team.drew++;
                                team.points = team.points + pointsForDraw;
                            }
                            team.for = team.for + game.scoreOgoals * 3 + game.scoreOpoints;
                            team.against = team.against + game.scoreHgoals * 3 + game.scoreHpoints;
                            team.diff = team.for - team.against;
                        }

                
                    })
                }

            })
            $scope.teamsTable = _.orderBy(teamsTable, ['points', 'diff', 'name'], ['desc', 'desc', 'asc']);
        }

       var teams = ["aaa", "bbb", "ccc", "ddd"]

        $scope.games = TournamentStore.getCurrentTournament();

        // initialise tournament
        if (!$scope.games) {
            
             console.log('Roundrobin ', Roundrobin(4));
            var rrArr = Roundrobin(teams.length)
            var games = [];
            _.forEach(rrArr, function(group){
                _.forEach(group, function(game){
                    games.push(new Game(
                        teams[game[0]-1],
                        0,0,0,
                        teams[game[1]-1],
                        0,0,0
                    ));
                });
            });

            $scope.games = games;

            TournamentStore.saveCurrentTournament(games);
        }

        makeTable($scope.games, teams);

        $scope.showGameDialog = function(ev, idx) {
            $scope.gameIndex = idx;
            $mdDialog.show({
            controller: 'GameDialogCtrl',
            templateUrl: 'views/dialogGame.html',
            parent: angular.element(document.body),
            locals: {
                gameIdx: $scope.gameIndex
            },
            targetEvent: ev,
            clickOutsideToClose:false,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
            .then(function(games) {
                console.log('game modal saved');
                $scope.games = games;
                makeTable($scope.games, teams);
            }, function() {
                console.log('game modal concelled');
            });
        };
        
        // played won lost draw for against diff ptslinke

        $scope.loadGame = function(idx){
            console.log('load game');
            $location.path( '/game/'+idx);
        }

         $scope.updateTable = function(){
            TournamentStore.saveCurrentTournament($scope.games);
            makeTable($scope.games, teams);
        }


}]);
