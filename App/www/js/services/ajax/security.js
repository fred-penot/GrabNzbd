'use strict';

/**
 * @ngdoc service
 * @name angularDomoApp.services.ajax.security
 * @description
 * # serviceAjaxSecurity
 * Factory in the angularDomoApp.
 */
angular.module('starter.services.security', ['starter.services.common'])
    .factory('wsSecurity', function ($http, serviceCommon) {
        var host = "http://88.190.12.151:9199";
        var errorMessage = 'Erreur de connexion au serveur !';
        return{
            auth: function(login, password){
                try {
                    return $http.get(host+"/security/api/auth/"+login+"/"+password)
                        .then(serviceCommon.checkApiReturn)
                        .then(serviceCommon.sendApiReturn);
                } catch(err) {
                    serviceCommon.toast(errorMessage);
                    return false;
                }
            },
            checkAuth: function(){
                try {
                    return $http.get(host+"/security/api/check/auth/"+serviceCommon.getToken())
                        .then(serviceCommon.checkApiReturn)
                        .then(serviceCommon.sendApiReturn);
                } catch(err) {
                    serviceCommon.toast(errorMessage);
                    return false;
                }
            }
        }
    });