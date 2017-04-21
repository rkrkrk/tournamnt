/**
 * Used to store Container Version  and Process Details
 * When Case View is selected the case details and Container Version
 * are retrieved from here so no additional REST call is needed
 */

 angular.module('tournament').factory('TournamentStore', 
    ['localStorageService',
    function (localStorageService) {
    var currentTournament;
    

    var saveCurrentTournament = function (tournament) {
        currentTournament = tournament;
        if(localStorageService.isSupported) {
            console.log('SAVING' ,JSON.stringify(currentTournament))
            localStorage.setItem('feile', JSON.stringify(currentTournament));
        }
    };

    var getCurrentTournament = function () {
        var stored;
        if(localStorageService.isSupported) {
            stored = JSON.parse(localStorage.getItem('feile'));
            console.log('FROM LS' , stored)
        }
        return stored || currentTournament;
    };

    var saveTournament = function (tournament) {
        tournaments.push(tournament);
        if(localStorageService.isSupported) {
            localStorage.setItem('tournaments', JSON.stringify(tournaments));
        }
    };

    var getTournament = function (idx) {
        var stored;
        if(localStorageService.isSupported) {
            stored = JSON.parse(localStorage.getItem('tournaments'));
            console.log('FROM LS' , stored)
        }
        return stored[idx] || tournaments[idx] || null;
    };

    var getTournaments = function () {
        var stored;
        if(localStorageService.isSupported) {
            stored = JSON.parse(localStorage.getItem('tournaments'));
            console.log('FROM LS' , stored)
        }
        return stored || tournaments || null;
    };

    var tournaments= getTournaments() || [];



    return {
        saveCurrentTournament: saveCurrentTournament,
        getCurrentTournament: getCurrentTournament,
        saveTournament: saveTournament,
        getTournament: getTournament,
        getTournaments: getTournaments

    };

}]);
