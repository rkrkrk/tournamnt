'use strict';


angular.module('tournament').controller('TournamentCtrl',
    ['$scope', '$route', '$timeout','$location', '$http', 'Roundrobin' , 'TournamentStore', '$mdDialog',
    function($scope, $route, $timeout, $location, $http, Roundrobin, TournamentStore, $mdDialog) {

        var tournamentID = $route.current.params.TID
        var pointsForWin = 2;
        var pointsForDraw = 1;
        var pointsForLoss = 0;
        var localHost =  ($location.host() === "localhost" || $location.host() === "127.0.0.1")

        
        
        

        function Game(teamH, scoreH, scoreHpoints, scoreHgoals,
                teamO, scoreO, scoreOpoints, scoreOgoals, order){
            this.teamH = teamH;
            this.scoreHpoints = scoreHpoints;
            this.scoreHgoals = scoreHgoals
            this.teamO = teamO;
            this.scoreOpoints = scoreOpoints;
            this.scoreOgoals = scoreOgoals;
            this.active = false;
            this.order = order;

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
                                team.points = team.points + pointsForLoss;
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
                                team.points = team.points + pointsForLoss;
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


        //initialise
        var games = TournamentStore.getTournamentDetails(tournamentID);
        var tournament = $scope.tournament = TournamentStore.getTournament(tournamentID);
        pointsForWin = tournament.pointsForWin || 2;
        pointsForDraw = tournament.pointsForDraw || 1;
        pointsForLoss = tournament.pointsForLoss || 0;

        //TODO error checking if no tournament

        // initialise tournament
        if (!games) {
            var rrArray = Roundrobin(tournament.teams.length)
            var games = [];
            var gameOrder=1;
            _.forEach(rrArray, function(group, idx){
                _.forEach(group, function(game){
                    games.push(new Game(
                        tournament.teams[game[0]-1],
                        0,0,0,
                        tournament.teams[game[1]-1],
                        0,0,0,
                        gameOrder
                    ));
                    gameOrder++;
                });
            });

            $scope.games = games;
            console.log ('init new games');
            TournamentStore.saveTournamentDetails(tournamentID, games);
        } else {
            console.log ('sort games in');
            $scope.games = _.sortBy(games, ['order']);
            console.log ('sort games in ', $scope.games);
        }

        makeTable($scope.games, tournament.teams);

        $scope.showGameDialog = function(ev, idx) {
            $scope.gameIndex = idx;
            $mdDialog.show({
            controller: 'GameDialogCtrl',
            templateUrl: 'views/dialogGame.html',
            parent: angular.element(document.body),
            locals: {
                gameIdx: $scope.gameIndex,
                games: $scope.games,
                tournamentID: tournamentID
            },
            targetEvent: ev,
            clickOutsideToClose:false,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
            .then(function(games) {
                console.log('game modal saved');
                $scope.games = games;
                makeTable($scope.games, tournament.teams);
            }, function() {
                console.log('game modal concelled');
            });
        };
        


        $scope.updateTable = function(){
            TournamentStore.saveTournamentDetails(tournamentID, $scope.games);
            makeTable($scope.games, tournament.teams);
        }

        $scope.goHome = function(){
            $location.path('/home')
        }

        $scope.goSettings = function(){
            $location.path('/createTournament/'+tournamentID)
        }

        $scope.uploadGroup = function() {

            $scope.success = false;
            $scope.feck = false;
            var url = localHost ? 'http://localhost:8001/db/save' : 'http://tournament-fintanm.rhcloud.com/db/save';
            var params = {
                type: 'games',
                tid: tournamentID,
                gmaes: $scope.games
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


}]);
