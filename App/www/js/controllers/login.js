angular.module('starter.login', ['starter.services.security'])
    .controller('LoginCtrl', function($scope, $state, $ionicHistory, $ionicLoading, wsSecurity) {
        var password = "";
        $scope.addToPassword = function(num) {
            $scope.message = "";
            password += num;
            if ( password.length == 4 ){
                login ();
            }
        };
        $scope.resetPassword = function() {
            $scope.message = "";
            password = "";
        };
        $scope.message = "";
        function login () {
            $ionicLoading.show({template: "chargement..."}).then(function(){});
            wsSecurity.auth('GrabNzbd', password).then(function(data){
                password = "";
                if ( data.statut ) {
                    $ionicLoading.hide().then(function(){});
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $state.go('app.index');
                } else {
                    $scope.message = data.data;
                }
            });
        }
    });