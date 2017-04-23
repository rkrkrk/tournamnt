'use strict';


angular.module('tournament').controller('CreateTournamentCtrl',
    ['$scope', '$location', 'Roundrobin' , 'TournamentStore', '$mdDialog',
    function($scope, $location, Roundrobin, TournamentStore, $mdDialog) {
        console.log('in home controller')
        $scope.tournament = {};
        $scope.tournament.teams=[];
        $scope.allTeams = _.pullAllWith(['Faughs', 'Judes', 'Crokes', 'Boden'], $scope.teams, _.isEqual);
        $scope.tournament.pointsForWin = 2;
        $scope.tournament.pointsForDraw = 1;
        $scope.tournament.pointsForLoss = 0;
       
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
            $scope.allTeams = _.pullAllWith(['Faughs', 'Judes', 'Crokes', 'Boden'], $scope.teams, _.isEqual);
        }

        $scope.removeTeam = function(idx){
            $scope.tournament.teams.splice(idx,1)
            resetTeamDropdown();
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
                var tournamentID = TournamentStore.saveNewTournament($scope.tournament);
                $location.path( '/tournament/' + tournamentID);
            }

           
        }

        $scope.cancel = function(){
            $location.path( '/home');
        }

  


        


        
        
        


}]);
