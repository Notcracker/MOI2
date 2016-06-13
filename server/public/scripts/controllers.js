'use strict';

angular.module('confusionApp')

       .controller('animelistController', ['$scope', 'animeFactory', '$location', function($scope, animeFactory, $location){
        var  nick = $location.absUrl().split('?')[0].split('/')[4].slice(0,-1)//[3]||"Unknown";   
        console.log(nick);
        //console.log(typeof pId);
        $scope.dd = '';
        $scope.value = false;
        var hostname = window.location.hostname;
        animeFactory.load(nick,hostname).get(function(data){
            
            $scope.dd = data.alist[0];
            var m = $scope.dd.types; 
            $scope.value = true;
            $scope.labels = ['TV', "Movie", "OVA", "Special", "ONA"];
            $scope.data = [m.TV, m.Movie, m.OVA, m.Special, m.ONA];
            $scope.meanScore = $scope.dd.meanScore.toFixed(2);
            $scope.dd.genres = {};
            $scope.AllEpsInComp = 0;
            $scope.numbOfComp = 0;
            for(var i in $scope.dd.anime){
                if ($scope.dd.anime[i].myScore!==0){
                    $scope.dd.anime[i].div = ($scope.dd.anime[i].myScore - $scope.dd.anime[i].score).toFixed(2);
                } else {
                    $scope.dd.anime[i].myScore = 0;
                    $scope.dd.anime[i].div = 0;
                }
                //for genres table
                if(($scope.dd.anime[i].myStatus=='completed')&&($scope.dd.anime[i].myScore!==0)){
                    $scope.AllEpsInComp += $scope.dd.anime[i].watchedEp;
                    $scope.numbOfComp += 1;
                }
                
                 for (var l in $scope.dd.anime[i].genres){
                    var genre = $scope.dd.anime[i].genres[l];
                    if(($scope.dd.anime[i].myStatus==='completed')&&($scope.dd.anime[i].myScore!==0)){
                        if($scope.dd.anime[i].genres[l] in $scope.dd.genres){
                            $scope.dd.genres[genre].count += 1;
                            $scope.dd.genres[genre].score += $scope.dd.anime[i].myScore;
                            $scope.dd.genres[genre].episodes += $scope.dd.anime[i].watchedEp;
                            $scope.dd.genres[genre].titles.push({name:$scope.dd.anime[i].seriesTitle,id:$scope.dd.anime[i]._id,scoreOfOne:$scope.dd.anime[i].myScore,
                                epsInOne:$scope.dd.anime[i].watchedEp});
                        } else {
                            $scope.dd.genres[genre] = {count:1,score:$scope.dd.anime[i].myScore,episodes:$scope.dd.anime[i].watchedEp,titles:[{name:$scope.dd.anime[i].seriesTitle,
                                id:$scope.dd.anime[i]._id,scoreOfOne:$scope.dd.anime[i].myScore, epsInOne:$scope.dd.anime[i].watchedEp}]};
                        }
                    };
                 };
                
            };
        });

        
        
        $scope.animeOrder = 'seriesTitle';
        $scope.filterBy = function(filter){
            $scope.animeOrder = filter;
        };
        $scope.animeOrderr = '-weightedScore';
        $scope.filterByy = function(filter){
            $scope.animeOrderr = filter;
            console.log('1');
        };
       
        $scope.tab = 1;
        $scope.filtText = '';

        $scope.select = function(setTab) {
            $scope.tab = setTab;
            
            if (setTab === 6) {
                $scope.filtText = "ptw";
            }
            else if (setTab === 5) {
                $scope.filtText = "dropped";
            } 
            else if (setTab === 2) {
                $scope.filtText = "watching";
            }
            else if (setTab === 3) {
                $scope.filtText = "completed";
            }
            else if (setTab === 4) {
                $scope.filtText = "onhold";
            }
            else {
                $scope.filtText = "";
            }
        };

        $scope.isSelected = function (checkTab) {
            return ($scope.tab === checkTab);
        };
      
    }])
    .controller('statsController',['$scope',function($scope){

        $scope.$watch('value', function() {
           $scope.n = 'N';
            var meanWatchingTime = 0;
            var L = 0;
            var oneDay = 24*60*60*1000; 
            var episodes = 0;
            var N = 0;
            for (var l in $scope.dd.genres){
                $scope.dd.genres[l].summ = 0;

                    for(var m in $scope.dd.genres[l].titles){
                        $scope.dd.genres[l].summ += ($scope.dd.genres[l].titles[m].scoreOfOne*$scope.dd.genres[l].titles[m].epsInOne);
                       
                    };
                 };
            for(var i in $scope.dd.anime){

                

                if($scope.dd.anime[i].myStatus==='completed'){
                    episodes += $scope.dd.anime[i].allEp;
                    N += 1;
                    if (N!==0){
                        $scope.meanEpisodesInSeries = episodes/N;
                    }
                };

                //mean days spent on series
                if (($scope.dd.anime[i].myStartDate.split('-')[0]!=='0000')&&($scope.dd.anime[i].myFinishDate.split('-')[0]!=='0000')){
                    var firstDate = new Date($scope.dd.anime[i].myStartDate.split('-'));
                    var secondDate = new Date($scope.dd.anime[i].myFinishDate.split('-'));
                    var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
                    if(diffDays==0){
                        diffDays=1;
                    };
                    meanWatchingTime += diffDays;
                    L += 1;
                }
                    if (L!==0){
                    $scope.meanWatchingTime = meanWatchingTime/L;
                    };


             };
             $scope.genArr = [];
             var l = '';
             for (var j in $scope.dd.genres){
                l += 'a'
                $scope.dd.genres[j].name = j;
                $scope.dd.genres[j].weightedScore = $scope.dd.genres[j].summ/$scope.dd.genres[j].episodes;
                $scope.dd.genres[j].score = $scope.dd.genres[j].score/$scope.dd.genres[j].count;
                $scope.genArr.push({
                    a:l,
                    anime:$scope.dd.genres[j].titles,
                    count:$scope.dd.genres[j].count,
                    name:j,
                    score: ($scope.dd.genres[j].score).toFixed(2),
                    weightedScore: $scope.dd.genres[j].weightedScore.toFixed(2),
                    episodes: $scope.dd.genres[j].episodes
                });
             }
              
           
                
            });
    
        
    }])

;


angular.module('malApp', ['ui.router','ngResource'])


    .controller('searchController', ['$scope', 'searchFactory', function($scope, searchFactory) {
        $scope.query = {userName:''};

        $scope.sendQuery = function(){
            console.log($scope.query);
            var host = window.location.hostname;
            searchFactory.query1(host).post($scope.query,function(data){
                console.log(data.userName2);
                window.location.replace('http://'+ host +':3000/aList' + '/' + data.userName2);
            });
        }
        
          
    }]);