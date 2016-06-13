'use strict';


angular.module('confusionApp')
        .factory('animeFactory', ['$resource', function($resource){
            var anifac = {};
            anifac.load = function(name,hostname){
                return $resource('http://'+hostname+':3000'+'/aList/details/'+name, null, {'get':{mathod:'GET'}});
            }
            return anifac;
        }])


angular.module('malApp')
        .factory('searchFactory', ['$resource', function($resource) {
            var searchfac = {};

            // make query
            searchfac.query1 = function (host) {
                
                return $resource('http://'+host+':3000', null, {'post':{method:'POST'}});
            };

            return searchfac;
        }])