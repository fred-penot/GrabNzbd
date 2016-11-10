angular.module('starter.services.sabnzbd', ['starter.services.common'])
    .factory('wsSabnzbd', function ($http, serviceCommon) {
        var host = "http://88.190.12.151:9199";
    //var host = "localhost";
    return{
        downloadGetAll: function(){
            return $http.get(host+"/download/api/get/all/"+serviceCommon.getToken())
                .then(serviceCommon.checkApiReturn)
                .then(serviceCommon.sendApiReturn);
        },
        downloadServerInfo: function(){
            return $http.get(host+"/download/api/server/info/"+serviceCommon.getToken())
                .then(serviceCommon.checkApiReturn)
                .then(serviceCommon.sendApiReturn);
        },
        downloadPause: function(isPause, id){
            return $http.get(host+"/download/api/pause/"+serviceCommon.getToken()+"/"+isPause+"/"+id)
                .then(serviceCommon.checkApiReturn)
                .then(serviceCommon.sendApiReturn);
        },
        downloadDelete: function(id){
            return $http.get(host+"/download/api/delete/"+serviceCommon.getToken()+"/"+id)
                .then(serviceCommon.checkApiReturn)
                .then(serviceCommon.sendApiReturn);
        },
        downloadServerLimit: function(limit){
            return $http.get(host+"/download/api/server/speed/"+serviceCommon.getToken()+"/"+limit)
                .then(serviceCommon.checkApiReturn)
                .then(serviceCommon.sendApiReturn);
        },
        downloadServerGetCategories: function(){
            return $http.get(host+"/download/api/get/categories/"+serviceCommon.getToken())
                .then(serviceCommon.checkApiReturn)
                .then(serviceCommon.sendApiReturn);
        },
        downloadChangeCategory: function(id, name){
            return $http.get(host+"/download/api/change/category/"+serviceCommon.getToken()+"/"+id+"/"+name)
                .then(serviceCommon.checkApiReturn)
                .then(serviceCommon.sendApiReturn);
        },
        downloadChangeName: function(id, name){
            return $http.get(host+"/download/api/change/name/"+serviceCommon.getToken()+"/"+id+"/"+name)
                .then(serviceCommon.checkApiReturn)
                .then(serviceCommon.sendApiReturn);
        },
        historyGetAll: function(){
            return $http.get(host+"/history/api/get/all/"+serviceCommon.getToken())
                .then(serviceCommon.checkApiReturn)
                .then(serviceCommon.sendApiReturn);
        },
        historyDelete: function(id){
            return $http.get(host+"/history/api/delete/"+serviceCommon.getToken()+"/"+id)
                .then(serviceCommon.checkApiReturn)
                .then(serviceCommon.sendApiReturn);
        },
        historyGetLog: function(id){
            return $http.get(host+"/history/api/get/log/"+serviceCommon.getToken()+"/"+id)
                .then(serviceCommon.checkApiReturn)
                .then(serviceCommon.sendApiReturn);
        }
    }
  });
