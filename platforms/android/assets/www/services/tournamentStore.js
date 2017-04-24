/**
 * Used to store Container Version  and Process Details
 * When Case View is selected the case details and Container Version
 * are retrieved from here so no additional REST call is needed
 */

 angular.module('tournament').factory('TournamentStore', 
    ['localStorageService',
    function (localStorageService) {
    var currentTournament;

    var checkStorage = function(){
        return localStorage.isSupported
    }
    

    var saveTournamentDetails = function (tournamentID, tournamentDetails) {
        console.log('SAVING' ,JSON.stringify(tournamentDetails))
        localStorageService.set(tournamentID, JSON.stringify(tournamentDetails));
    };

    var getTournamentDetails = function (tournamentID) {
        var tournamentDetails;
        tournamentDetails = JSON.parse(localStorageService.get(tournamentID));
        console.log('RETURNING' ,tournamentDetails)
        return tournamentDetails;
    };

    var saveNewTournament = function (tournament) {
        tournament.tournamentID = new Date().getTime();
        var tournaments = this.getAllTournaments() || [];
        tournaments.push(tournament);
        localStorageService.set('tournaments', JSON.stringify(tournaments));
        return tournament.tournamentID;
    };

    var updateTournament = function (tournamentID,tournament) {
        var storedTournaments = JSON.parse(localStorageService.get('tournaments'));
        var index = _.indexOf(storedTournaments, _.find(storedTournaments, {tournamentID: parseInt(tournamentID,10)}));
        storedTournaments.splice(index, 1, tournament);
        localStorageService.set('tournaments', JSON.stringify(storedTournaments));
    };

    var deleteTournament = function (tournamentID) {
        var stored = JSON.parse(localStorageService.get('tournaments'));
        var t = _.filter(stored, function(t){
                return t.tournamentID !== parseInt(tournamentID,10);
            })
        localStorageService.set('tournaments', JSON.stringify(t));        
        localStorageService.remove(tournamentID);
        return t;
    };

    var getTournament = function (tournamentID) {
        var stored = JSON.parse(localStorageService.get('tournaments'));
        return _.find(stored, {tournamentID: parseInt(tournamentID,10)})
    };

    var getAllTournaments = function () {
        var stored = JSON.parse(localStorageService.get('tournaments'));
        return stored;
    };

    var saveTeams = function (teams) {
        localStorageService.set('teams', JSON.stringify(teams));
    };

    var getTeams = function () {
        return JSON.parse(localStorageService.get('teams'));
    };




    return {
        checkStorage: checkStorage,
        saveTournamentDetails: saveTournamentDetails,
        getTournamentDetails: getTournamentDetails,
        saveNewTournament: saveNewTournament,
        updateTournament: updateTournament,
        deleteTournament: deleteTournament,
        getTournament: getTournament,
        getAllTournaments: getAllTournaments,
        saveTeams: saveTeams,
        getTeams: getTeams
    };

}]);
