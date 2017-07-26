/**
 * Created by Yash Bidasaria on 7/3/2017.
 */
var seller_app = angular.module("seller_app", ['ngRoute','ngTable','ngSanitize', 'ui.select'])
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
    //console.log("IN config");
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
        $rootScope.tables = [];
        $scope.search = '';
        $scope.schema = [];
        $scope.tags = [
            ["Category 1", "mif-vpn-publ icon"],
            ["Category 2", "mif-drive-eta icon"],
            ["Category 3", "mif-cloud icon"],
            ["Category 4", "mif-snowy3 icon"],
            ["Category 5", "mif-meter icon"]
        ];
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
        var call = function(i , db){
            var url = $scope.choice.datasets[i].url;
            $http({
                method: "GET",
                url: "http://127.0.0.1:8000/" + url
            }).then(function success(response){
                $rootScope.tables[i] = angular.fromJson(response.data);
                //$scope.schema = $rootScope.tables[i][0].keys;
                //$rootScope.cols = Object.keys($rootScope.tables)
               // console.log("status: " + response.status)
            }).catch(function (response) {
                console.log("Error occured: " + response.status)
            }).finally(function (){
                console.log("task finished");
            });

        };

        $scope.search = "";

        $scope.selected = function (db) {
            $rootScope.choice.name = db.name;
            $rootScope.choice.price = db.price;
            $rootScope.choice.datasets = db.datasets;
            $rootScope.choice.seller = db.seller;
            //console.log(db.name + db.price);
            for (var i = 0; i < $rootScope.choice.datasets.length; i++) {
                call(i, db);
            }

        };



    }]);

seller_app.controller("seller2", ['$scope', '$rootScope', '$http', 'shared','$route', '$routeParams', '$location',
    function($scope, $rootScope, $http, shared, $route, $routeParams, $location) {
        $scope.datasets = $rootScope.datasets;
        $scope.choice = $rootScope.choice;
        $scope.sets = $rootScope.choice.datasets;
        $scope.query1 = [];
        $scope.query2 = [];
        $scope.q1e1 = false;
        $scope.q1e2 = false;
        $scope.q1e3 = false;
        $scope.q2e1 = false;
        $scope.q2e2 = false;
        $scope.q2e3 = false;
        $scope.q2 = false;
        $scope.selected1 = 0;
        $scope.selected2 = 0;
        $scope.price1 = 0;
        $scope.price2 = 0;
        $scope.selected_tags = {};
        $scope.price2 = 0;
        $scope.setprice = [];
        $scope.tags = {
            available: ["Age", "Alcohol_Results", "Atmospheric_Condition", "Crash_Date", "Drug_Involvement", "Fatalities_in_Crash", "First_Harmful_Event", "Gender", "ID","Injury_Severity","Person_Type", "Race", "Roadway", "State","PK"]

        };
        $scope.addQuery1 = function() {
              //input validation
            console.log("input validation");
            var error = false;
              for(var i = 0; i < $scope.query1.length; i++) {
                  console.log("Lower = " + $scope.query1[i].lower + " Higher = "  + $scope.query1[i].higher);
                  if(($scope.selected1 == $scope.query1[i].lower) && $scope.selected2 == $scope.query1[i].higher) {
                      $scope.q1e1 = true;
                      $scope.q1e2 = false;
                      error = true;
                  }
                  if($scope.selected1 >= $scope.query1[i].lower && $scope.selected2 <= $scope.query1[i].higher
                  && $scope.price1 >= $scope.query1[i].price) {
                      console.log("Error 1 in query 2");
                      $scope.q1e2 = true;
                      $scope.q1e1 = false;
                      error = true;
                  }
              }
              if(!error) {
                  $scope.query1.push({'lower': $scope.selected1, 'higher': $scope.selected2, 'price': $scope.price1});
                  $scope.q1e1 = false;
                  $scope.q1e2 = false;
              }
        };
        $scope.addQuery2 = function() {
            var error = false;
            var check_cols = $scope.tags.selected;
            for(var i = 0; i < $scope.query2.length; i++) {
                var cols = $scope.query2[i].columns;
                var check = 0;
                    for(var x = 0; x < cols.length; x++) {
                        for(var y = x; y < check_cols.length; y++) {
                            if(cols[x] == check_cols[y]){
                                check++;
                            }
                        }
                    }
                if(cols.length == check_cols.length && check == cols.length){
                        $scope.q2e1 = true;
                        $scope.q2e2 = false;
                        error = true;
                }

                var result = check_cols.every(function(val) { return cols.indexOf(val) >= 0; });
                if(result && $scope.price2 >= $scope.query2[i].price){
                    console.log("error 2");
                    $scope.q2e2 = true;
                    $scope.q2e1 = false;
                    error = true;
                }
            }


            if(!error){
                $scope.query2.push({'columns':$scope.tags.selected, 'price': $scope.price2});
                $scope.q2e1 = false;
                $scope.q2e2 = false;
            }

        };
        $scope.change = function() {
            //change datasets
            for(var i = 0; i < $scope.datasets.length; i++){
                var name = $scope.datasets[i].name;
                //console.log(name);
                if(name == ($scope.choice.name)) {
                    var sets = $scope.datasets[i].datasets;
                    $scope.datasets[i].name = $scope.choice.name;
                    $scope.datasets[i].seller = $scope.choice.seller;
                    $scope.datasets[i].info = $scope.choice.info;
                    for(var x = 0; x < sets.length; x++) {
                        $scope.datasets[i].datasets[x].price = $scope.setprice[x];
                    }
                }
            }

            var data = angular.toJson($scope.datasets);

            var config = {

            };

            $http.post('http://127.0.0.1:8000/test/', data, config)
                .success(function (data, status, headers, config) {
                    $scope.PostDataResponse_1 = data;
                    console.log("datasets")
                })
                .error(function (data, status, header, config) {

                });
            var data2 = $scope.query1;
            $http.post('http://127.0.0.1:8000/seller1/', data2, config)
                .success(function (data2, status, headers, config) {
                    $scope.PostDataResponse_2 = data2;
                })
                .error(function (data, status, header, config) {

                });
            var data3 = $scope.query2;
            $http.post('http://127.0.0.1:8000/seller2/', data3, config)
                .success(function (data3, status, headers, config) {
                    $scope.PostDataResponse_3 = data3;
                })
                .error(function (data, status, header, config) {

                });
        };
        $scope.upload = function(){
            var data = angular.toJson($scope.datasets);

            var config = {

            };

            $http.post('http://127.0.0.1:8000/datasets/', data, config)
                .success(function (data, status, headers, config) {
                    $scope.PostDataResponse_1 = data;
                    console.log("datasets")
                })
                .error(function (data, status, header, config) {

                });
        };

    }]);
