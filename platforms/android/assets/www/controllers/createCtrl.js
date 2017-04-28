'use strict';


angular.module('tournament').controller('CreateTournamentCtrl',
    ['$scope', '$location', '$timeout', '$document', '$route', 'Roundrobin' , 'TournamentStore', '$mdDialog',
    function($scope, $location, $timeout, $document, $route, Roundrobin, TournamentStore, $mdDialog) {
        console.log('in home controller')
        var tournamentID = $route.current.params.TID;
        var newTournament = $scope.newTournament = tournamentID ? false : true;
        $scope.tournament =  tournamentID ? TournamentStore.getTournament(tournamentID) : {};
        $scope.games = tournamentID ? TournamentStore.getTournamentDetails(tournamentID, ['order']) : [];
        $scope.games = _.sortBy($scope.games, ['order'])
        console.log('sorted groups', $scope.games);
        var teamsOriginal;
        var storedTeams = _.sortBy(TournamentStore.getTeams());
        $scope.allTeams = storedTeams || [];
        

        if (!tournamentID ) {
            $scope.tournament.teams=[];      
            $scope.tournament.pointsForWin = 2;
            $scope.tournament.pointsForDraw = 1;
            $scope.tournament.pointsForLoss = 0;
        } else {
            //store original team names incase they change
            teamsOriginal = [];
            _.forEach($scope.tournament.teams, function(t){
                teamsOriginal.push(t);
            })
        }

        // $scope.allTeams = _.pullAllWith(['Faughs', 'Judes', 'Crokes', 'Boden'], $scope.teams, _.isEqual);

        // $scope.items = [1, 2, 3, 4, 5, 6, 7];
        $scope.selectedTeam;
        $scope.getSelectedTeam = function(idx) {
            if ($scope.selectedTeam !== undefined && $scope.selectedTeam !== null &&
                $scope.selectedTeam !== "")  {
                if($scope.tournament.teams.indexOf($scope.selectedTeam)<0){
                    $scope.tournament.teams.push($scope.selectedTeam);
                    resetTeamDropdown();
                }
  
                return 'add existing team';
            } else {
                return "add existing team";
            }
        };

        $scope.addTeam = function(){
            if ($scope.inputTeam !== undefined && $scope.inputTeam !== null &&
                $scope.inputTeam !== "")  {
                if($scope.tournament.teams.indexOf($scope.inputTeam)<0){
                    $scope.tournament.teams.push($scope.inputTeam);
                    $scope.inputTeam = null;
                    resetTeamDropdown();
                }
                if($scope.tournament.teams.length > 1){
                    $scope.addform.name.$setValidity("size", true);
                }
            }
            
        }

        function resetTeamDropdown(){
            $scope.allTeams = _.pullAllWith(storedTeams, $scope.teams, _.isEqual);
        }

        $scope.removeTeam = function(idx){
            $scope.tournament.teams.splice(idx,1)
            resetTeamDropdown();
        }

        function updateTournamentDetails() {

            var newSort = $scope.sortable.toArray();
            console.log('new Sort ', $scope.sortable.toArray())
            var tournamentDetails = $scope.games;
            tournamentDetails.pointsForWin = $scope.pointsForWin || 2;
            tournamentDetails.pointsForDraw = $scope.pointsForDraw || 1;
            tournamentDetails.pointsForLoss = $scope.pointsForLoss || 0;
            // for (var index = 0; index < tournamentDetails.teams.length; index++) {
            //     var tournamentDetails.team[index].name = array[index];

             console.log('before ', tournamentDetails)

            _.forEach(tournamentDetails, function(game,idx){
                game.order = newSort.indexOf(game.order+'')+1;
            })
             console.log('after ', tournamentDetails)
                
            // }
            // _.forEach(tournamentDetails, function(game,idx){
            //     game.order = newSort[idx]
            //     for (var index = 0; index < teamsOriginal.length; index++) {
            //         if(game.teamH === teamsOriginal[index]){
            //             game.teamH = $scope.tournament.teams[index];
            //         }
            //         if(game.teamO === teamsOriginal[index]){
            //             game.teamO = $scope.tournament.teams[index];
            //         }
            //     }
            // })

            TournamentStore.saveTournamentDetails(tournamentID, tournamentDetails)
            TournamentStore.updateTournament(tournamentID, $scope.tournament);
            $location.path( '/tournament/' + tournamentID);
        }

        $scope.updateNames = function(newName, idx ){
            console.log('newName ', newName);
            if(!$scope.games || $scope.games.length <1){
                return;
            }
            if (!newName){
                $scope.tournament.teams[idx] = teamsOriginal[idx];
                return;
            }
            _.forEach($scope.games, function(game){
                for (var index = 0; index < teamsOriginal.length; index++) {
                    if(game.teamH === teamsOriginal[idx]){
                        game.teamH = newName;
                    }
                    if(game.teamO === teamsOriginal[idx]){
                        game.teamO = newName;
                    }
                }
            })

            teamsOriginal[idx] = newName;
        }




        $scope.saveTournament = function(){
            if ($scope.tournament.teams.length < 2){
                $scope.addform.name.$setValidity("size", false);
                $scope.addform.name.$setTouched();
            }
            if (!$scope.tournament.tournamentName){
                $scope.tSetup.name.$setValidity("required", false);
                $scope.tSetup.name.$setTouched();
            } 

            if ($scope.addform.$invalid || $scope.tSetup.$invalid || $scope.tList.$invalid) {
                console.log('feck');
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('Unable to Save Data')
                        .textContent('Something is invalid.')
                        .ariaLabel('Alert Save Demo')
                        .ok('OK')
                    );
                return;
            }
            
            if ($scope.tournament.teams.length >1 && $scope.tournament.tournamentName && $scope.tournament.tournamentName.length > 0) {
                TournamentStore.saveTeams(_.union(storedTeams, $scope.tournament.teams));
                if (newTournament){
                    var tournamentID = TournamentStore.saveNewTournament($scope.tournament);
                    $location.path( '/tournament/' + tournamentID);
                } else {
                    updateTournamentDetails();
                }
                
            }

           
        }

        $scope.cancel = function(){
            $location.path( '/home');
        }

        $scope.swapGames = function(game){
            var swap = game.teamH;
            game.teamH = game.teamO;
            game.teamO = swap;
        }

        var el = angular.element($document[0].querySelector('#items'));
        $scope.sortable = Sortable.create(el[0], {
            animation: 250
        });

        $timeout(function(){
            // origSort = $scope.sortable.toArray()
            console.log('original Sort ', $scope.sortable.toArray())
        }, 200)




}]);
