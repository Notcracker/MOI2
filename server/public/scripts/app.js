'use strict';
angular.module('confusionApp', ['ui.router','ngResource','chart.js'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
       
            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'http://'+window.location.hostname+':3000/views/header.html',
                    },
                    'content': {
                        templateUrl : 'http://'+window.location.hostname+':3000/views/animelist.html',
                        controller  : 'animelistController'
                    }
                }

            })
        
            // route for the aboutus page
            .state('app.mangalist', {
                url:'mangalist',
                views: {
                    'content@': {
                        templateUrl : 'http://'+window.location.hostname+':3000/views/mangalist.html'                                           
                    }
                }
            })
        
         
         
    
        $urlRouterProvider.otherwise('/');
    })
;

angular.module('malApp', ['ui.router','ngResource'])
.config(function($stateProvider, $urlRouterProvider) {
    
    })
;
