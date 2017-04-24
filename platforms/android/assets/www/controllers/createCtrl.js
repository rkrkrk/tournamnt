'use strict';


angular.module('tournament').controller('CreateTournamentCtrl',
    ['$scope', '$location', '$route', 'Roundrobin' , 'TournamentStore', '$mdDialog',
    function($scope, $location, $route, Roundrobin, TournamentStore, $mdDialog) {
        console.log('in home controller')
        var tournamentID = $route.current.params.TID;
        var newTournament = $scope.newTournament = tournamentID ? false : true;
        $scope.tournament =  tournamentID ? TournamentStore.getTournament(tournamentID) : {};
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
            var tournamentDetails = TournamentStore.getTournamentDetails(tournamentID);
            tournamentDetails.pointsForWin = $scope.pointsForWin;
            tournamentDetails.pointsForDraw = $scope.pointsForDraw;
            tournamentDetails.pointsForLoss = $scope.pointsForLoss;
            // for (var index = 0; index < tournamentDetails.teams.length; index++) {
            //     var tournamentDetails.team[index].name = array[index];
                
            // }
            _.forEach(tournamentDetails, function(game){
                for (var index = 0; index < teamsOriginal.length; index++) {
                    if(game.teamH === teamsOriginal[index]){
                        game.teamH = $scope.tournament.teams[index];
                    }
                    if(game.teamO === teamsOriginal[index]){
                        game.teamO = $scope.tournament.teams[index];
                    }
                }
            })

            TournamentStore.saveTournamentDetails(tournamentID, tournamentDetails)
            TournamentStore.updateTournament(tournamentID, $scope.tournament);
            $location.path( '/tournament/' + tournamentID);
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

  


        


        
        
        


}]);
