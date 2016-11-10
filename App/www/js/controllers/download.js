angular.module('starter.download', ['starter.services.common', 'starter.services.sabnzbd'])

    .controller('DownloadCtrl', function ($scope, $state, $ionicModal, $cordovaToast, $ionicLoading,
                                          $interval, $cordovaFileTransfer, serviceCommon, wsSabnzbd) {
        var server = {speed: 0};
        $scope.server = server;
        var actionButtons = [];
        var cancelInterval = null;
        var countRefresh = 0;
        var chooseFile = "";
        init();
        function init() {
            actionButtons = [];
            actionButtons.push({
                action: "refresh",
                loading: true,
                icon: "ion-ios-refresh-outline"
            });
            actionButtons.push({
                action: "openUpload",
                loading: true,
                icon: "ion-ios-upload-outline"
            });
            actionButtons.push({
                action: "pause",
                loading: true,
                icon: "ion-play"
            });
            $scope.actionButtons = actionButtons;
            refresh();
            cancelInterval = $interval(function () {
                refresh();
            }, 3000, 0, true);
        }
        $scope.launchAction = function (index) {
            var action = $scope.actionButtons[index].action;
            $scope.actionButtons[index].loading = true;
            if ( action == 'refresh' ) {
                refresh();
            } else if ( action == 'openUpload' ) {
                $scope.actionButtons[index].loading = false;
                openUpload();
            } else if ( action == 'pause' ) {
                pause($scope.actionButtons[index].next);
            }
        };
        function refresh() {
            wsSabnzbd.downloadServerInfo().then(function (dataDownloadServerInfo) {
                var infoServer = dataDownloadServerInfo.data.server;
                wsSabnzbd.downloadGetAll().then(function (dataDownloadGetAll) {
                    var currentDownloads = dataDownloadGetAll.data.downloads;
                    refreshButton(infoServer);
                    refreshSpeed(infoServer);
                    refreshList(currentDownloads);
                    if ( infoServer.pause.next ) {
                        $interval.cancel(cancelInterval);
                    }
                    if ( countRefresh == 0 ) {
                        $scope.server.speed = infoServer.speedLimit;
                    }
                    countRefresh++;
                });
            });
        }
        function refreshButton(infoServer) {
            actionButtons = [];
            actionButtons.push({
                action: "refresh",
                loading: false,
                icon: "ion-ios-refresh-outline"
            });
            actionButtons.push({
                action: "openUpload",
                loading: false,
                icon: "ion-ios-upload-outline"
            });
            actionButtons.push({
                action: "pause",
                loading: false,
                icon: infoServer.pause.icon,
                next: infoServer.pause.next
            });
            $scope.actionButtons = actionButtons;
        }
        function refreshSpeed(infoServer) {
            var speedValue = infoServer.speed;
            var speed = speedValue.replace(/m|k/gi, '');
            if (parseInt(speed.trim()) > 1000) {
                $scope.speed = speed.trim() + " Ko/s";
            } else {
                $scope.speed = speed.trim() + " Mo/s";
            }
        }
        function refreshList(currentDownloads) {
            $scope.downloads = currentDownloads;
            var noDownload = "";
            if (Object.keys(currentDownloads).length == 0) {
                $interval.cancel(cancelInterval);
                noDownload = "Aucun Téléchargement en cours";
            }
            $scope.noDownload = noDownload;
        }
        $scope.progressDownload = function (index, sizeMo, sizeLeftMo) {
            var pourcentDownload = parseInt(100 - ((sizeLeftMo / sizeMo) * 100));
            $scope.pourcentDownload = pourcentDownload;
            return pourcentDownload;
        };
        function pause (isPause) {
            wsSabnzbd.downloadPause(isPause, 0).then(function (data) {
                if (data.statut) {
                    var msgToast = "Reprise du téléchargement.";
                    if (isPause) {
                        msgToast = "Téléchargement en pause.";
                        $interval.cancel(cancelInterval);
                        refresh();
                    } else {
                        cancelInterval = $interval(function () {
                            refresh();
                        }, 3000, 0, true);
                    }
                    serviceCommon.toast(msgToast);
                }
            });
        }
        $scope.validSpeed = function (value) {
            if (parseInt(value) > 100) {
                var limitValue = value * 1000;
            } else {
                var limitValue = value * 1000 * 1000;
            }
            wsSabnzbd.downloadServerLimit(limitValue).then(function() {
                var toastText = "Débit limité à "+value+" Mo/s";
                if ( value == 0 ) {
                    toastText = "Débit sans limite."
                }
                serviceCommon.toast(toastText);
            });
        };

        $ionicModal.fromTemplateUrl('templates/more.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.moreWindow = modal;
        });
        $scope.openMore = function (item) {
            $scope.message = "";
            $scope.shortTitle = item.shortTitle;
            itemSelect = item;
            $scope.itemSelect = item;
            $scope.moreWindow.show();
        };
        $scope.closeMore = function () {
            closeMore();
        };
        function closeMore() {
            $scope.moreWindow.hide();
            $scope.renameOption = false;
            $scope.categoryOption = false;
            $scope.deleteOption = false;
        }

        $ionicModal.fromTemplateUrl('templates/upload.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.uploadWindow = modal;
        });
        function openUpload() {
            chooseFile = "";
            $scope.chooseFile = chooseFile;
            $scope.uploadWindow.show();
        }
        $scope.closeUpload = function () {
            closeUpload();
        };
        function closeUpload() {
            console.log(chooseFile);
            $scope.uploadWindow.hide();
        }
        $scope.setFiles = function(element) {
            chooseFile = element;
        };
        $scope.refreshUploadWindow = function() {
            if ( chooseFile!= "" ) {
                var options = {
                    fileKey: "avatar",
                    fileName: "image.png",
                    chunkedMode: false,
                    mimeType: "image/png"
                };

                $cordovaFileTransfer.upload("http://88.190.12.151:7676", cordova.file.documentsDirectory + '69783.nzb', options).then(function(result) {
                    $scope.message="SUCCESS: " + JSON.stringify(result.response);
                }, function(err) {
                    $scope.message="ERROR: " + JSON.stringify(err);
                }, function (progress) {
                    // constant progress updates
                });
                $scope.chooseFile = chooseFile;
            }
        };
        /*** options ***/
        var option = {title: "", category: ""};
        $scope.option = option;
        var itemSelect = null;
        $scope.showRenameOption = function () {
            $scope.message = "";
            option.title = itemSelect.title;
            $scope.renameOption = true;
            $scope.categoryOption = false;
            $scope.deleteOption = false;
        };
        $scope.showCategoryOption = function () {
            $scope.message = "";
            wsSabnzbd.downloadServerGetCategories().then(function (data) {
                if (data.statut) {
                    $scope.downloadCategories = data.data.categories;
                    option.category = itemSelect.category;
                }
            });
            $scope.categoryOption = true;
            $scope.renameOption = false;
            $scope.deleteOption = false;
        };
        $scope.showDeleteOption = function () {
            $scope.message = "";
            $scope.deleteOption = true;
            $scope.renameOption = false;
            $scope.categoryOption = false;
        };
        $scope.doRename = function () {
            $ionicLoading.show({template: "chargement..."}).then(function () {
            });
            wsSabnzbd.downloadChangeName(itemSelect.id, option.title).then(function (data) {
                if (data.statut) {
                    itemSelect.title = option.title;
                    $ionicLoading.hide().then(function () {
                    });
                    $scope.message = "Renommage effectué !";
                }
            });
        };
        $scope.doChangeCategory = function () {
            $ionicLoading.show({template: "chargement..."}).then(function () {
            });
            wsSabnzbd.downloadChangeCategory(itemSelect.id, option.category).then(function (data) {
                if (data.statut) {
                    itemSelect.category = option.category;
                    $ionicLoading.hide().then(function () {
                    });
                    $scope.message = "Changement de catégorie effectué !";
                }
            });
        };
        $scope.deleteDownload = function () {
            $ionicLoading.show({template: "chargement..."}).then(function () {
            });
            wsSabnzbd.downloadDelete(itemSelect.id).then(function (data) {
                if (data.statut) {
                    $ionicLoading.hide().then(function () {
                    });
                    serviceCommon.toast("Téléchargement de " + itemSelect.title + " supprimé !");
                    closeMore();
                }
            });
        };
    }).directive('downloadTemplate', function () {
    return {
        templateUrl: 'templates/download.html'
    };
});