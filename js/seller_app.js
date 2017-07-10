/**
 * Created by Yash Bidasaria on 7/3/2017.
 */
var seller_app = angular.module("seller_app", ['ngRoute','ngTagsInput', 'ngTable'])
    .config(['$routeProvider', '$locationProvider',
        function($routeProvider, $locationProvider) {
            $routeProvider
                .when('/seller_info', {
                    templateUrl: 'seller_info.html',
                    controller: 'seller2',
                    controllerAs: 'seller2'
                }).when('/seller_initial', {
                templateUrl: 'seller_initial.html',
                controller: 'seller1',
                controllerAs: 'seller1'
            }).otherwise({
                redirectTo: '/seller_initial'
            });
        }]);
seller_app.config(function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    console.log("IN config");
});
seller_app.service('shared', function() {
    var db_ch = {
        name: "app",
        price: 0,
        seller: "",
        datasets: {}
    };

    var url = {};
    return {
        getProp: function() {
            return db_ch;
        },
        setProp: function(name, datasets, price, seller) {
            db_ch.name = name;
            db_ch.price = price;
            db_ch.seller = seller;
            for(var i = 0; i < datasets.length; i++) {
                db_ch.datasets[i] = datasets[i];
                console.log(datasets[i].url)
                this.addUrl(datasets[i].url)
            }
            console.log("in shared " + name);
        },

        addUrl: function(u) {
            url[url.length] = u;
        },
        getUrls: function() {
            return url;
        }
    }
});

seller_app.controller("seller1", ['$scope', '$rootScope', '$http', 'shared','$route', '$routeParams', '$location',
    function($scope, $rootScope, $http, shared, $route, $routeParams, $location) {
        $rootScope.datasets = {};
        $scope.test = 0;
        $scope.min = 2;
        $scope.max = 4;
        $rootScope.choice = {};

        $http({
            method: "GET",
            url: "http://127.0.0.1:8000/datasets/"
        }).then(function success(response){
            $rootScope.datasets = angular.fromJson(response.data);

            //console.log("status: " + response.status)
        }).catch(function (response) {
           // console.log("Error occured: " + response.status)
        }).finally(function (){
            //console.log("task finished");
        });

        $scope.search = "";

        $scope.selected = function (db) {
            $rootScope.choice.name = db.name;
            $rootScope.choice.price = db.price;
            $rootScope.choice.datasets = db.datasets;
            $rootScope.choice.seller = db.seller;
            //console.log(db.name + db.price);

        };



    }]);

seller_app.controller("seller2", ['$scope', '$rootScope', '$http', 'shared','$route', '$routeParams', '$location',
    function($scope, $rootScope, $http, shared, $route, $routeParams, $location) {
        $scope.datasets = $rootScope.datasets;

        $scope.choice = $rootScope.choice;

        $scope.change = function() {
            //change datasets
            for(var i = 0; i < $scope.datasets.length; i++){
                var name = $scope.datasets[i].name;
                //console.log(name);
                if(name == ($scope.choice.name)) {
                    $scope.datasets[i].name = $scope.choice.name;
                    $scope.datasets[i].price = $scope.choice.price;
                    $scope.datasets[i].seller = $scope.choice.seller;
                    $scope.datasets[i].info = $scope.choice.info;
                    break;
                }
            }
            /*$http({
                method: "POST",
                url: "http://127.0.0.1:8000/datasets/",
                data: angular.toJson($scope.datasets)
        }).then(function success(response) {
                console.log(angular.toJson($scope.datasets))
                console.log("status: " + response.status)
            }).catch(function (response) {
                console.log("Error occured: " + response.status)
            }).finally(function () {
                console.log("task finished");
            });*/
            var data = angular.toJson($scope.datasets);

            var config = {

            };

            $http.post('http://127.0.0.1:8000/datasets/', data, config)
                .success(function (data, status, headers, config) {
                    $scope.PostDataResponse = data;
                })
                .error(function (data, status, header, config) {

                });
        };

    }]);
