angular.module('testing-app', ['perfect_scrollbar'])

.service('PlayersOnline', ['$interval', '$http', function($interval, $http) {
    var players = {};

    var regionCount = {
        "us": 0,
        "eu": 0
    };

    var updatePlayers = function() {
        $http.get('http://127.0.0.1:5001/players').
            success(function(data) {
                angular.copy(data, players);

                var localcount = {
                    "us": 0,
                    "eu": 0
                };

                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        localcount[data[key].region] += 1;
                    }
                }
                angular.copy(localcount, regionCount);
            }
        );
    };

    $interval(function() {
        updatePlayers();
    }, 10000);

    updatePlayers();

    var getPlayers = function() {
        return players;
    };

    var getPlayerCountPerRegion = function() {
        return regionCount;
    };

    return {
        getPlayers: getPlayers,
        getPlayerCountPerRegion: getPlayerCountPerRegion
    };
}])
.controller('rows-controller', function($scope, $http, $interval, PlayersOnline) {

    $scope.rows = PlayersOnline.getPlayers();
    // $scope.updatePlayers = function() {
    //     $http.get('http://127.0.0.1:5001/players').
    //         success(function(data) {
    //             $scope.rows = data;
    //         }
    //     );
    // };

    // $interval(function() {
    //     $scope.updatePlayers();
    // }, 10000);

    // $scope.updatePlayers();

    // $scope.rows = {
    //     123456789: {
    //         name: "foxy",
    //         steamid: "123456789",
    //         friend: false
    //     },
    //     4567897654: {
    //         name: "MS",
    //         steamid: "4567897654",
    //         friend: false
    //     }
    // };

    // $scope.addUser = function(user) {
    //     $scope.rows[user.steamid] = user;
    // };

    // $scope.rows[123456789].friend = true;
})
.controller('player-count', function($scope, PlayersOnline) {
    $scope.playerCounts = PlayersOnline.getPlayerCountPerRegion();
});