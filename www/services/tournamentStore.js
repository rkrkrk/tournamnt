/**
 * Used to store Container Version  and Process Details
 * When Case View is selected the case details and Container Version
 * are retrieved from here so no additional REST call is needed
 */

 angular.module('citiClientOnboarding').factory('TournamentStore', function () {
    var currentTournament;




    var saveCurrentTournament = function (tournament) {
        currentTournament = tournament;
    };

    var getCurrentTournament = function () {
        return tournament;
    };



    return {
        saveCurrentTournament: saveCurrentTournament,
        getCurrentTournament: getCurrentTournament
    };

});
