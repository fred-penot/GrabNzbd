angular.module('starter.history', ['starter.services.common', 'starter.services.sabnzbd'])

.controller('HistoryCtrl', function($scope, $ionicModal, $ionicLoading, serviceCommon, wsSabnzbd) {
    var actionButtons = [];
    init(-1);
    function init(index) {
        if ( index < 0 ) {
            $ionicLoading.show({template: "chargement..."}).then(function(){});
        }
        actionButtons = [];
        actionButtons.push({
            action:"refresh",
            icon: "ion-ios-refresh-outline"
        });
        actionButtons.push({
            action:"delete",
            icon: "ion-ios-trash-outline"
        });
        $scope.actionButtons = actionButtons;
        if ( index < 0 ) {
            refresh(index);
        }
    }
    $ionicModal.fromTemplateUrl('templates/log.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.logWindow = modal;
    });
    $scope.launchAction = function (index) {
        var action = $scope.actionButtons[index].action;
        $scope.actionButtons[index].loading = true;
        if ( action == 'refresh' ) {
            refresh(index);
        } else if ( action == 'delete' ) {
            serviceCommon.toast('Fonctionalité à venir.');
            $scope.actionButtons[index].loading = false;
        }
    };
    $scope.showLog = function (history) {
        $scope.title = history.shortTitle;
        $ionicLoading.show({template: "chargement..."}).then(function(){});
        wsSabnzbd.historyGetLog(history.id).then(function(data) {
            if ( data.statut ) {
                $scope.logs = data.data.log;
                $ionicLoading.hide().then(function(){});
                var noLog = false;
                var noLogMsg = "";
                if ( Object.keys( data.data.log ).length == 0 ) {
                    noLog = true;
                    noLogMsg = "Aucun Historique";
                }
                $scope.noLog = noLog;
                $scope.noLogMsg = noLogMsg;
                $scope.logWindow.show();
            }
        });
    };
    $scope.closeLog = function() {
        $scope.logWindow.hide();
    };
    $scope.delete = function (history) {
        $ionicLoading.show({template: "chargement..."}).then(function(){});
        wsSabnzbd.historyDelete(history.id).then(function(data) {
            if ( data.statut ) {
                $ionicLoading.hide().then(function(){});
                serviceCommon.toast('Historique de "'+history.shortTitle+'" supprimé.');
                refresh();
            }
        });
    };
    function refresh(index) {
        $scope.noHistory = false;
        wsSabnzbd.historyGetAll().then(function(data){
            if ( data.statut ) {
                $scope.histories = data.data.histories;
                $ionicLoading.hide().then(function(){});
                var noHistory = "";
                if ( Object.keys( data.data ).length == 0 ) {
                    noHistory = "Aucun Historique";
                    $scope.noHistory = true;
                }
                $scope.noHistoryMsg = noHistory;
                if ( index >= 0 ) {
                    init(index);
                } else {
                    $ionicLoading.hide().then(function(){});
                }
            }
        });
    }
}).directive('historyTemplate', function() {
    return {
        templateUrl: 'templates/history.html'
    };
});
