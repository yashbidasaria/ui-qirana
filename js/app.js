/**
 * Created by Yash Bidasaria on 5/23/2017.
 */
var app = angular.module("app", ['ngRoute','ngTagsInput', 'ngTable', 'ngDropdowns','ngSanitize', 'ui.select'])
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
        ["Category 1", "mif-vpn-publ icon"],
        ["Category 2", "mif-drive-eta icon"],
        ["Category 3", "mif-cloud icon"],
        ["Category 4", "mif-snowy3 icon"],
        ["Category 5", "mif-meter icon"]
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

    $scope.choice = shared.getProp();

        $scope.ddSelectOptions = [
            {
                text: 'Query 1',
                value: 'q1',
                query: 'select state, count(*) from crash group by State',
                htmltemplate: 'crashq1.html'
            }, {
                text: 'Query 2',
                value: 'q2',
                query: 'select count(*) from crash where State = \'Texas\' and Gender = \'Male\' and Alcohol_Results > 0.0',
                htmltemplate: 'crashq2.html'
            }, {
                text: 'Query 3',
                value: 'q3',
                query: 'select sum(Fatalities_in_crash) from crash where State = \'California\' and Crash_Date >= date \'2011-01-01\' and Crash_Date < date \'2011-01-01\' + interval \'6\' month;',
                htmltemplate: 'crashq3.html'
            },
            {
                text: 'Query 4',
                value: 'q4',
                query: 'select count(Fatalities_in_crash) from crash where State = \'Wisconsin\' and Injury_Severity = \'Fatal Injury (K)\' and (Atmospheric_Condition = \'Snow\');',
                htmltemplate: 'crashq4.html'
            }
        ];

        $scope.ddSelectSelected = {
            text: "Select Template",
            query: ' ',
            htmltemplate: ''
        };
        $scope.itemArray = [
            {id: 1, name: 'first'},
            {id: 2, name: 'second'},
            {id: 3, name: 'third'},
            {id: 4, name: 'fourth'},
            {id: 5, name: 'fifth'},
        ];

        $scope.selected = { value: $scope.itemArray[0] };
    $scope.loading = false;
    $scope.confirm = false;
    $scope.price = 0;
    $scope.getPurchasePrice = function(q) {
        $scope.loading = true;
        var str = '';
        if(q.value == 'q2') {
            str += '&state=' + $scope.selectedstate.value + '&gender=' + $scope.selectedgender.value + '&alchohol=' + $scope.selectedalchohol
        };
        $http({
            method: "GET",
            url: "http://127.0.0.1:8080/qirana/crash/?id=" + q.value + encodeURI(str)
        }).then(function success(response){
            console.log("price: " + response.data)
            $scope.price = response.data
        }).catch(function (response) {
            console.log("pricing error occured: " + response.status)
        }).finally(function (){
            console.log("pricing finished");
            $scope.loading = false;
            $scope.confirm = true;
        });
    };
    $rootScope.purchases = [];
    $scope.confirmPurchase = function (s) {
        if(s == 'OK') {
            $rootScope.purchases.push($scope.price);
        }
        $scope.confirm = false;
    };

    $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    $scope.gender = ['Male', 'Female']
    $scope.selectedstate = {value : $scope.states[0]};
    $scope.selectedgender = {value : $scope.gender[0]};
    $scope.selecteddate = {value : new Date(2011, 1, 1)};
    $scope.selectedalchohol = 0.0;
    $scope.selectedmonth = 0;
    $scope.maxalchohol = 100;
    $scope.minalchohol = 0.0;
    $scope.atmos_con = ['Clear','Cloudy','Rain','Fog', 'Smog', 'Smoke','Snow','Blowing Snow','Sleet', 'Hail (Freezing Rain or Drizzle)', 'Not Reported', 'Blowing Sand, Soil, Dirt', 'Unknown', 'Severe Crosswinds', 'Other'];
    $scope.severity = ['Non-incapacitating Evident Injury (B)','Fatal Injury (K)','No Injury (O)','Incapacitating Injury (A)','Possible Injury (C)','Injured, Severity Unknown', 'Unknown'];
    $scope.selectedatmos = {value: $scope.atmos_con[0]};
    $scope.selectedseverity = {value : $scope.severity[0]};


    }]);

app.directive('soDropdown', ['$timeout', function($timeout) {
    return {
        restrict: 'E',
        require: 'ngModel',
        replace: true,
        transclude: true,
        template: function (el, atts) {
            var itemName = 'dropdownItem';
            var valueField = itemName + '.' + (atts.valueField || 'id');
            var textField = itemName + '.' + (atts.textField || 'name');
            return "<select class='ui search dropdown'>" +
                "<div ng-transclude></div>" +
                "   <option value='{{" + valueField + "}}' ng-repeat='" + itemName + " in " + atts.dropdownItems + " track by " + valueField + "'>" +
                "       {{" + textField + "}}" +
                "   </option>" +
                "</select>";
        },
        link: function (scope, el, atts, ngModel) {
            $(el).dropdown({
                onChange: function (value, text, choice) {
                    scope.$apply(function () {
                        ngModel.$setViewValue(value);
                    });
                }
            });
            ngModel.$render = function () {
                console.log('set value', el, ngModel, ngModel.$viewValue);
                $timeout(function () {
                    $(el).dropdown('set value', ngModel.$viewValue);
                });
                //$(el).dropdown('set value', ngModel.$viewValue);
            };
        }
    };
}]);
