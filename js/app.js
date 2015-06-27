angular.module('testing-app', ['perfect_scrollbar'])

.service('PlayersOnline', ['$interval', '$http', '$rootScope', function($interval, $http, $rootScope) {
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

    // $interval(function() {
    //     updatePlayers();
    // }, 10000);

    // updatePlayers();

    var getPlayers = function() {
        return players;
    };

    var getPlayerCountPerRegion = function() {
        return regionCount;
    };

    var addPlayer = function(event, playerData) {
        var steamid = playerData['steamid']
        var name = playerData['name']
        var region = playerData['region']

        players[steamid] = {
            'steamid': steamid,
            'name': name,
            'region': region
        };

        regionCount[region] += 1

        console.log(Object.keys(players).length);
    };

    $rootScope.$on('addPlayer', addPlayer); 

    return {
        getPlayers: getPlayers,
        getPlayerCountPerRegion: getPlayerCountPerRegion,
        addPlayer: addPlayer,
        players: players
    };
}])
.controller('rows-controller', function($scope, $http, $interval, PlayersOnline) {
    $scope.rows = PlayersOnline.players;
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

function broadcastAngularEvent(eventName, data) {
    var scope = angular.element(document).scope(); 
    scope.$broadcast(eventName, data);
    scope.$apply();
}

function addPlayer(data) {
    broadcastAngularEvent('addPlayer', data);
}