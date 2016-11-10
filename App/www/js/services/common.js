'use strict';

/**
 * @ngdoc service
 * @name angularDomoApp.services.common
 * @description
 * # serviceCommon
 * Factory in the GrabMangaApp.
 */
angular.module('starter.services.common', ['ionic-toast', 'LocalStorageModule'])
    .factory('serviceCommon', function ($state, $ionicHistory, $ionicLoading,
                                        $cordovaToast, ionicToast, localStorageService) {
        return{
            getToken: function(){
                var tokenApp = "none";
                if (localStorageService.get("token")) {
                    tokenApp = localStorageService.get("token");
                }
                return tokenApp;
            },
            setToken: function(tokenApp){
                localStorageService.set("token", tokenApp);
                localStorageService.set("connect", true);
            },
            getConnect: function(){
                if (localStorageService.get("connect")) {
                    var connectApp = localStorageService.get("connect");
                } else {
                    var connectApp = false;
                }
                return connectApp;
            },
            logout: function(){
                localStorageService.set("token", "none");
                localStorageService.set("connect", false);
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                try {
                    $cordovaToast.showLongBottom("Vous êtes déconnecté !");
                } catch(err) {
                    ionicToast.show("Vous êtes déconnecté !", 'bottom', false, 2500);
                }
                $ionicLoading.hide().then(function(){});
                $state.go('app.login');
            },
            checkApiReturn: function(response){
                if ( response.status == 200 ) {
                    if ( response.data.statut ) {
                        var token = "";
                        if ( response.data.data.token != undefined ) {
                            token = response.data.data.token;
                        } else {
                            token = response.data.data;
                        }
                        localStorageService.set("token", token);
                        localStorageService.set("connect", true);
                        return {statut: true, data: response.data.data};
                    } else {
                        return {statut: false, data: response.data.data};
                    }
                } else {
                    return {statut: false, data: 'Erreur interne'};
                }
            },
            sendApiReturn: function(checkApiReturn){
                if ( checkApiReturn.statut === false ) {
                    localStorageService.set("token", "none");
                    localStorageService.set("connect", false);
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    try {
                        $cordovaToast.showLongBottom("Vous êtes déconnecté !");
                    } catch(err) {
                        ionicToast.show("Vous êtes déconnecté !", 'bottom', false, 2500);
                    }
                    $ionicLoading.hide().then(function(){});
                    $state.go('app.login');
                    return {statut: false, data: checkApiReturn.data};
                } else {
                    return {statut: true, data: checkApiReturn.data};
                }
            },
            toast: function(message){
                try {
                    $cordovaToast.showLongBottom(message);
                } catch(err) {
                    ionicToast.show(message, 'bottom', false, 2500);
                }
            },
            paginator: function (totalItems, currentPage, pageSize) {
                // default to first page
                currentPage = currentPage || 1;

                // default page size is 10
                pageSize = pageSize || 10;

                // calculate total pages
                var totalPages = Math.ceil(totalItems / pageSize);

                var startPage, endPage;
                if (totalPages <= 10) {
                    // less than 10 total pages so show all
                    startPage = 1;
                    endPage = totalPages;
                } else {
                    // more than 10 total pages so calculate start and end pages
                    if (currentPage <= 6) {
                        startPage = 1;
                        endPage = 10;
                    } else if (currentPage + 4 >= totalPages) {
                        startPage = totalPages - 9;
                        endPage = totalPages;
                    } else {
                        startPage = currentPage - 5;
                        endPage = currentPage + 4;
                    }
                }

                // calculate start and end item indexes
                var startIndex = (currentPage - 1) * pageSize;
                var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

                // create an array of pages to ng-repeat in the pager control
                //var pages = _.range(startPage, endPage + 1);
                var pages = [];
                for (var i=startPage; i<(endPage + 1); i++) {
                    pages.push(i);
                }

                // return object with all pager properties required by the view
                return {
                    totalItems: totalItems,
                    currentPage: currentPage,
                    pageSize: pageSize,
                    totalPages: totalPages,
                    startPage: startPage,
                    endPage: endPage,
                    startIndex: startIndex,
                    endIndex: endIndex,
                    pages: pages
                };
            }
        }
    });