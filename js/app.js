/**
 * Created by Yash Bidasaria on 5/23/2017.
 */
var app = angular.module("app", ['ngRoute','ngTagsInput', 'ngTable'])
    .config(['$routeProvider', '$locationProvider',
        function($routeProvider, $locationProvider) {
            $routeProvider
                .when('/buyer2', {
                    templateUrl: 'buyer2.html',
                    controller: 'buyer2',
                    controllerAs: 'buyer2'
                }).when('/buyer_new_p', {
                templateUrl: 'buyer_new_partial.html',
                controller: 'buyer1',
                controllerAs: 'buyer1'
            }).otherwise({
                redirectTo: '/buyer_new_p'
            });
        }]);

app.service('shared', function() {
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

app.controller("buyer1", ['$scope', '$rootScope', '$http', 'shared','$route', '$routeParams', '$location',
    function($scope, $rootScope, $http, shared, $route, $routeParams, $location) {
    $scope.selection = false;
    $scope.budget = 0;
    $scope.choice = {
        name: "",
        num: 0
    };
    $scope.tags = [
        "Category 1",
        "Category 2",
        "Category 3",
        "Category 4",
        "Category 5"
    ];
    $rootScope.databases = [
    ];
    $rootScope.tables = [];
    $rootScope.db_choice = {
        name : "initial",
        info : "",
        price: 0,
        seller: "",
        datasets: {}
    };
    $scope.sellerChoice = function(choice){
        $scope.choice.name = choice.name;
        $scope.choice.num = choice.num;
    };



    $http({
            method: "GET",
            url: "http://127.0.0.1:8000/datasets/"
        }).then(function success(response){
            $rootScope.databases = angular.fromJson(response.data);

            console.log("status: " + response.status)
        }).catch(function (response) {
            console.log("Error occured: " + response.status)
        }).finally(function (){
            console.log("task finished");
        });


    var call = function(i , db){
            var url = db.datasets[i].url;
            $http({
                method: "GET",
                url: "http://127.0.0.1:8000/" + url
            }).then(function success(response){
                $rootScope.tables[i] = angular.fromJson(response.data);
                //$rootScope.cols = Object.keys($rootScope.tables)
                console.log("status: " + response.status)
            }).catch(function (response) {
                console.log("Error occured: " + response.status)
            }).finally(function (){
                console.log("task finished");
            });

    };

    $scope.selected = function (db) {
        $scope.selection = true;
        $rootScope.db_choice.name = db.name;
        $rootScope.db_choice.price = db.price;
        $rootScope.db_choice.datasets = db.datasets;
        $rootScope.db_choice.seller = db.seller;
        console.log(db.name + db.price);
        shared.setProp(db.name, db.datasets, db.price, db.seller);
        for (var i = 0; i < $rootScope.db_choice.datasets.length; i++) {
            call(i, db);
        }
    };






    $scope.search = "";

}]);

app.controller("buyer2", ['$scope', '$rootScope', 'shared', '$routeParams', '$http',
    function($scope, $rootScope, shared, $routeParams, $http) {
    $scope.choice = {
        name: "",
        price: 0,
        seller: "",
        datasets: {}
     };
    $scope.t1 = $rootScope.tables;


    $scope.checkSQL = function(query) {
        console.log("HELLO");
        console.log(query);
        console.log(
            SQLParser.parse(query).toString());

    };

    $scope.choice = shared.getProp();
    $scope.db = {};




}]);

app.filter('filterByTags', function () {
    return function (items, tags, search) {
        console.log("In the filter");
        console.log(items.length + "  search = " + search);
        var filtered = [];
        var final_filtered = [];
        items.forEach(function (item) {
            var contains = false;
            console.log(item.tags);
            var con = 1;
            for(var i = 0; i < tags.length; i++) {
                console.log("Tag: " + tags[i].text);
                var temp = tags[i];
                if(item.tags.toLowerCase().indexOf(temp.text.toLowerCase()) >= 0) {
                    console.log("contains");
                    contains = true;
                    con++;
                }
                else {
                    contains = false;
                    break;
                }
            }
            if(contains ) {
                filtered.push(item);
                var x = tags.length;
                if (item.name.toLowerCase().includes(search.toLowerCase())) {
                    final_filtered.push(item);
                }
            }
            var contains2 = false;
            if(tags.length == 0) {
                if (item.name.toLowerCase().includes(search.toLowerCase())) {
                    contains2 = true;
                    final_filtered.push(item);
                }
            }

        });
        return final_filtered;
    };
});

