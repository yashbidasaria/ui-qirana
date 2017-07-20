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
    var getQuery = function(db){
        var url = db.name + 'query/';
        $http({
            method: "GET",
            url: "http://127.0.0.1:8000/" + url
        }).then(function success(response){
            $rootScope.ddSelectOptions = angular.fromJson(response.data);
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
        getQuery(db);
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

       // $rootScope.ddSelectOptions = $rootScope.queries;


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

    var crashQ = function (q){
        var str = '';
        if(q.value == 'q1') {
        }
        if(q.value == 'q2') {
            str += '&state=' + $scope.selectedstate.value + '&gender=' + $scope.selectedgender.value + '&alchohol=' + $scope.selectedalchohol.value
        };
        if(q.value == 'q3') {
            str += '&state=' + $scope.selectedstate.value + '&crash_date=' + $scope.selecteddate.value.toUTCString() + '&interval=' + $scope.selectedmonth.value
        };
        if(q.value == 'q4') {
            str += '&state=' + $scope.selectedstate.value + '&injury_severity=' + $scope.selectedseverity.value + '&atmospheric_condition=' + $scope.selectedatmos.value
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

            });
        };
    var dblpQ = function (q){
        var str = '';
        if(q.value == 'q1') {
            str += '&fromnodeid=' + $scope.selectedFromNode
        };
        if(q.value == 'q2') {
            str += '&fromnodeid1=' + $scope.selectedFrom1 + '&fromnodeid2=' + $scope.selectedFrom2
        };
        $http({
            method: "GET",
            url: "http://127.0.0.1:8080/qirana/dblp/?id=" + q.value + encodeURI(str)
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
    var worldQ = function (q){
        var str = '';
        if(q.value == 'q1' || q.value == 'q15') {
            str += '&continent=' + $scope.selectedCon.value
        };
        if(q.value == 'q2' || q.value == 'q3' || q.value == 'q4' || q.value == 'q6' ||  q.value == 'q7' ||  q.value == 'q8'
            ||  q.value == 'q9' ||  q.value == 'q17' ||  q.value == 'q18' || q.value == 'q24' || q.value == 'q25'
            ||  q.value == 'q32' || q.value == 'q33') {
        };
        if(q.value == 'q5') {
            str += '&name=' + $scope.selectedLetter.value
        };
        if(q.value == 'q10') {
            str += '&name=' + $scope.selectedLetter.value
        };
        if(q.value == 'q11') {
            str += '&continent=' + $scope.selectedCon.value + '&population=' + $scope.selectedPop.value
        };
        if(q.value == 'q12' || q.value == 'q13') {
            str += '&region=' + $scope.selectedRegion.value
        };
        if(q.value == 'q14') {
            str += '&population1=' + $scope.selectedminPop.value + '&population2=' + $scope.selectedmaxPop.value
        };
        if(q.value == 'q16') {
            str += '&code=' + $scope.selectedCode.value
        };
        if(q.value == 'q19') {
            str += '&population=' + $scope.selectedPop.value + '&countrycode=' + $scope.selectedCountryCode.value
        };
        if(q.value == 'q20' || q.value == 'q22' || q.value == 'q23' || q.value == 'q26') {
            str += '&countrycode=' + $scope.selectedCountryCode.value
        };
        if(q.value == 'q21') {
            str += '&isofficial=' + $scope.selectedOfficial.value
        };
        if(q.value == 'q27') {
            str += '&countrycode=' + $scope.selectedCountryCode.value + '&population=' + $scope.selectedPop.value
        };
        if(q.value == 'q28') {
            str += '&language=' + $scope.selectedLang.value
        };
        if(q.value == 'q29') {
            str += '&language=' + $scope.selectedLang.value + '&percentage=' + $scope.selectedPer.value
        };
        if(q.value == 'q31') {
            str += '&language=' + $scope.selectedLang.value
        };
        if(q.value == 'q30') {
            str += '&code=' + $scope.selectedCode.value
        };

        $http({
            method: "GET",
            url: "http://127.0.0.1:8080/qirana/world/?id=" + q.value + encodeURI(str)
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
    var ssbQ = function (q) {
        var str = '';
        if(q.value == 'q1') {
            str += '&d_year=' + $scope.selected_dyear1 + '&lo_discount=' + $scope.selectedlo_discount1 + '&lo_discount='
                + $scope.selectedlo_discount2  + '&lo_quantity=' + $scope.selectedlo_quantity1
        }
        if(q.value == 'q2') {
            str += '&d_yearmonthnum=' + $scope.selectedd_yearmonthnum + '&lo_discount=' + $scope.selectedlo_discount1 + '&lo_discount='
                + $scope.selectedlo_discount2  + '&lo_quantity=' + $scope.selectedlo_quantity1+ '&lo_quantity=' + $scope.selectedlo_quantity2
        }
        if(q.value == 'q3') {
            str += '&d_weeknuminyear=' + $scope.selectedweeknuminyear + '&d_year=' + $scope.selected_dyear1 +
                '&lo_discount=' + $scope.selectedlo_discount1 + '&lo_discount='
                + $scope.selectedlo_discount2  + '&lo_quantity=' + $scope.selectedlo_quantity1+ '&lo_quantity=' +
                $scope.selectedlo_quantity2
        }

        if(q.value == 'q4') {
            str += '&p_cateogry=' + $scope.selectedp_category.value + '&s_region=' + $scope.selecteds_region.value
        }
        if(q.value == 'q5') {
            str += '&p_brand1=' + $scope.selectedp_brand1.value + '&p_brand1=' + $scope.selectedp_brand2.value +
                '&s_region=' + $scope.selecteds_region.value
        }
        if(q.value == 'q6') {
            str += '&p_brand1=' + $scope.selectedp_brand1.value +
                '&s_region=' + $scope.selecteds_region.value
        }
        if(q.value == 'q7') {
            str += '&c_nation=' + $scope.selectedp_brand1.value + '&s_region=' + $scope.selecteds_region.value + '&d_year=' + $scope.selected_dyear1 + '&d_year=' + $scope.selected_dyear2
        }
        if(q.value == 'q8') {
            str += '&c_nation' + $scope.selectedc_nation.value + '&s_region=' + $scope.selecteds_region.value + '&d_year=' + $scope.selected_dyear1 + '&d_year=' + $scope.selected_dyear2
        }
        if(q.value == 'q9') {
            str += '&s_city=' + $scope.selecteds_city1.value + '&s_city=' + $scope.selecteds_city2.value + '&d_year=' + $scope.selected_dyear1 + '&d_year=' + $scope.selected_dyear2
        }
        if(q.value == 'q10') {
            str += '&c_city=' + $scope.selectedc_city1.value + '&c_city=' + $scope.selectedc_city2.value + '&s_city=' +
                $scope.selecteds_city1.value + '&s_city=' + $scope.selecteds_city2.value + '&d_yearmonth=' + $scope.selectedd_yearmonth.value
        }
        if(q.value == 'q11') {
            str += '&s_region=' + $scope.selecteds_region.value + '&p_mfgr=' + $scope.selectedp_mfgr1.value + '&p_mfgr=' +
                $scope.selectedp_mfgr2.value + '&d_yearmonth=' + $scope.selectedd_yearmonth.value
        }
        if(q.value == 'q13') {
            str += '&c_region=' + $scope.selectedc_region.value + '&s_nation=' + $scope.selecteds_nation.value +
                + $scope.selected_dyear1 + '&d_year=' + $scope.selected_dyear2 + '&p_category=' +
                $scope.selectedp_category.value
        }
        if(q.value == 'q12') {
            str += '&c_region=' + $scope.selectedc_region.value + '&s_region=' + $scope.selecteds_region.value +
                + $scope.selected_dyear1 + '&d_year=' + $scope.selected_dyear2 + '&p_mfgr=' +
                $scope.selectedp_mfgr1.value + '&p_mfgr=' + $scope.selectedp_mfgr2.value
        }
        $http({
            method: "GET",
            url: "http://127.0.0.1:8080/qirana/ssb/?id=" + q.value + encodeURI(str)
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


        $scope.getPurchasePrice = function(q) {
        $scope.loading = true;
        if($rootScope.db_choice.name == "crash"){
            crashQ(q);
        }
        if($rootScope.db_choice.name == "DBLP"){
            dblpQ(q);
        }
        if($rootScope.db_choice.name == "world-2"){
                worldQ(q);
        }
        if($rootScope.db_choice.name == "ssb"){
                ssbQ(q)
        }
            $scope.loading = false;
            $scope.confirm = true;

    };

    $rootScope.purchases = [];
    $scope.confirmPurchase = function (s) {
        if(s == 'OK') {
            $rootScope.purchases.push($scope.price);
        }
        $scope.confirm = false;
    };

    //CRASH
    $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    $scope.gender = ['Male', 'Female']
    $scope.selectedstate = {value : $scope.states[0]};
    $scope.selectedgender = {value : $scope.gender[0]};
    $scope.selecteddate = {value : new Date(2011, 1, 1)};
    $scope.selectedalchohol = {value: 0.0};
    $scope.selectedmonth = {value: 1};
    $scope.maxalchohol = 100;
    $scope.minalchohol = 0.0;
    $scope.atmos_con = ['Clear','Cloudy','Rain','Fog', 'Smog', 'Smoke','Snow','Blowing Snow','Sleet', 'Hail (Freezing Rain or Drizzle)', 'Not Reported', 'Blowing Sand, Soil, Dirt', 'Unknown', 'Severe Crosswinds', 'Other'];
    $scope.severity = ['Non-incapacitating Evident Injury (B)','Fatal Injury (K)','No Injury (O)','Incapacitating Injury (A)','Possible Injury (C)','Injured, Severity Unknown', 'Unknown'];
    $scope.selectedatmos = {value: $scope.atmos_con[0]};
    $scope.selectedseverity = {value : $scope.severity[0]};
    $scope.error = false;

    //DBLP
    $scope.selectedFromNode = 10000;
    $scope.selectedFrom1 = 148255;
    $scope.selectedFrom2 = 45479;
    $scope.maxFromNode = 425875;
    $scope.minFromNode = 0;

    //WORLD
    $scope.continents = ['North America', 'Asia', 'Africa', 'Europe', 'South America', 'Oceania', 'Antartica'];
    $scope.selectedCon = {value : $scope.continents[0]};
    $scope.letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'Y', 'Z']
    $scope.selectedLetter = {value: $scope.letters[0]};
    $scope.selectedPop = {value:0};
    $scope.maxPop = 1277558000;
    $scope.minPop = 0;
    $scope.regions = ['Caribbean','Southern and Central Asia','Central Africa','Southern Europe','Middle East','South America','Polynesia', 'Antarctica', 'Australia and New Zealand','Western Europe','Eastern Africa', 'Western Africa', 'Eastern Europe','Central America','North America','Southeast Asia','Southern Africa','Eastern Asia','Nordic Countries','Northern Africa','Baltic Countries','Melanesia','Micronesia','British Islands','Micronesia/Caribbean'];
    $scope.selectedRegion = {value: $scope.regions[0]};
    $scope.selectedminPop = {value:0};
    $scope.selectedmaxPop = {value:$scope.maxPop};
    $scope.code = ['ABW','AFG','AGO','AIA','ALB','AND','ANT','ARE','ARG','ARM','ASM','ATA','ATF','ATG','AUS','AUT','AZE','BDI','BEL','BEN','BFA','BGD','BGR','BHR','BHS','BIH','BLR','BLZ','BMU','BOL','BRA','BRB','BRN','BTN','BVT','BWA','CAF','CAN','CCK','CHE','CHL','CHN','CIV','CMR','COD','COG','COK','COL','COM','CPV','CRI','CUB','CXR','CYM','CYP','CZE','DEU','DJI','DMA','DNK','DOM','DZA','ECU','EGY','ERI','ESH','ESP','EST','ETH','FIN','FJI','FLK','FRA','FRO','FSM','GAB','GBR','GEO','GHA','GIB','GIN','GLP','GMB','GNB','GNQ','GRC','GRD','GRL','GTM','GUF','GUM','GUY','HKG','HMD','HND','HRV','HTI','HUN','IDN','IND','IOT','IRL','IRN','IRQ','ISL','ISR','ITA','JAM','JOR','JPN','KAZ','KEN','KGZ','KHM','KIR','KNA','KOR','KWT','LAO','LBN','LBR','LBY','LCA','LIE','LKA','LSO','LTU','LUX','LVA','MAC','MAR','MCO','MDA','MDG','MDV','MEX','MHL','MKD','MLI','MLT','MMR','MNG','MNP','MOZ','MRT','MSR','MTQ','MUS','MWI','MYS','MYT','NAM','NCL','NER','NFK','NGA','NIC','NIU','NLD','NOR','NPL','NRU','NZL','OMN','PAK','PAN','PCN','PER','PHL','PLW','PNG','POL','PRI','PRK','PRT','PRY','PSE','PYF','QAT','REU','ROM','RUS','RWA','SAU','SDN','SEN','SGP','SGS','SHN','SJM','SLB','SLE','SLV','SMR','SOM','SPM','STP','SUR','SVK','SVN','SWE','SWZ','SYC','SYR','TCA','TCD','TGO','THA','TJK','TKL','TKM','TMP','TON','TTO','TUN','TUR','TUV','TWN','TZA','UGA','UKR','UMI','URY','USA','UZB','VAT','VCT','VEN','VGB','VIR','VNM','VUT','WLF','WSM','YEM','YUG','ZAF','ZMB','ZWE'];
    $scope.selectedCode = {value: $scope.code[0]};
    $scope.countrycode = ['ABW','AFG','AGO','AIA','ALB','AND','ANT','ARE','ARG','ARM','ASM','ATA','ATF','ATG','AUS','AUT','AZE','BDI','BEL','BEN','BFA','BGD','BGR','BHR','BHS','BIH','BLR','BLZ','BMU','BOL','BRA','BRB','BRN','BTN','BVT','BWA','CAF','CAN','CCK','CHE','CHL','CHN','CIV','CMR','COD','COG','COK','COL','COM','CPV','CRI','CUB','CXR','CYM','CYP','CZE','DEU','DJI','DMA','DNK','DOM','DZA','ECU','EGY','ERI','ESH','ESP','EST','ETH','FIN','FJI','FLK','FRA','FRO','FSM','GAB','GBR','GEO','GHA','GIB','GIN','GLP','GMB','GNB','GNQ','GRC','GRD','GRL','GTM','GUF','GUM','GUY','HKG','HMD','HND','HRV','HTI','HUN','IDN','IND','IOT','IRL','IRN','IRQ','ISL','ISR','ITA','JAM','JOR','JPN','KAZ','KEN','KGZ','KHM','KIR','KNA','KOR','KWT','LAO','LBN','LBR','LBY','LCA','LIE','LKA','LSO','LTU','LUX','LVA','MAC','MAR','MCO','MDA','MDG','MDV','MEX','MHL','MKD','MLI','MLT','MMR','MNG','MNP','MOZ','MRT','MSR','MTQ','MUS','MWI','MYS','MYT','NAM','NCL','NER','NFK','NGA','NIC','NIU','NLD','NOR','NPL','NRU','NZL','OMN','PAK','PAN','PCN','PER','PHL','PLW','PNG','POL','PRI','PRK','PRT','PRY','PSE','PYF','QAT','REU','ROM','RUS','RWA','SAU','SDN','SEN','SGP','SGS','SHN','SJM','SLB','SLE','SLV','SMR','SOM','SPM','STP','SUR','SVK','SVN','SWE','SWZ','SYC','SYR','TCA','TCD','TGO','THA','TJK','TKL','TKM','TMP','TON','TTO','TUN','TUR','TUV','TWN','TZA','UGA','UKR','UMI','URY','USA','UZB','VAT','VCT','VEN','VGB','VIR','VNM','VUT','WLF','WSM','YEM','YUG','ZAF','ZMB','ZWE'];
    $scope.selectedCountryCode = {value: $scope.countrycode[0]};
    $scope.official = ['T', 'F'];
    $scope.selectedOfficial = {value: $scope.official[0]};
    $scope.languages = ['Dutch','English','Papiamento','Spanish','Balochi','Dari','Pashto','Turkmenian','Uzbek','Ambo','Chokwe','Kongo','Luchazi','Luimbe-nganguela','Luvale','Mbundu','Nyaneka-nkhumbi','Ovimbundu','Albaniana','Greek','Macedonian','Catalan','French','Portuguese','Arabic','Hindi','Indian Languages','Italian','Armenian','Azerbaijani','Samoan','Tongan','Creole English','Canton Chinese','German','Serbo-Croatian','Vietnamese','Czech','Hungarian','Polish','Romanian','Slovene','Turkish','Lezgian','Russian','Kirundi','Swahili','Adja','Aizo','Bariba','Fon','Ful','Joruba','Somba','Busansi','Dagara','Dyula','Gurma','Mossi','Bengali','Chakma','Garo','Khasi','Marma','Santhali','Tripuri','Bulgariana','Romani','Creole French','Belorussian','Ukrainian','Garifuna','Maya Languages','Aimará','Guaraní','Ketšua','Japanese','Bajan','Chinese','Malay','Malay-English','Asami','Dzongkha','Nepali','Khoekhoe','Ndebele','San','Shona','Tswana','Banda','Gbaya','Mandjia','Mbum','Ngbaka','Sara','Eskimo Languages','Punjabi','Romansh','Araucan','Rapa nui','Dong','Hui','Mantšu','Miao','Mongolian','Puyi','Tibetan','Tujia','Uighur','Yi','Zhuang','Akan','Gur','Kru','Malinke','[South]Mande','Bamileke-bamum','Duala','Fang','Maka','Mandara','Masana','Tikar','Boa','Luba','Mongo','Ngala and Bangi','Rundi','Rwanda','Teke','Zande','Mbete','Mboshi','Punu','Sango','Maori','Arawakan','Caribbean','Chibcha','Comorian','Comorian-Arabic','Comorian-French','Comorian-madagassi','Comorian-Swahili','Crioulo','Moravian','Silesiana','Slovak','Southern Slavic Languages','Afar','Somali','Danish','Norwegian','Swedish','Berberi','Sinaberberi','Bilin','Hadareb','Saho','Tigre','Tigrinja','Basque','Galecian','Estonian','Finnish','Amhara','Gurage','Oromo','Sidamo','Walaita','Saame','Fijian','Faroese','Kosrean','Mortlock','Pohnpei','Trukese','Wolea','Yap','Mpongwe','Punu-sira-nzebi','Gaeli','Kymri','Abhyasi','Georgiana','Osseetti','Ewe','Ga-adangme','Kissi','Kpelle','Loma','Susu','Yalunka','Diola','Soninke','Wolof','Balante','Mandyako','Bubi','Greenlandic','Cakchiquel','Kekchí','Mam','Quiché','Chamorro','Korean','Philippene Languages','Chiu chau','Fukien','Hakka','Miskito','Haiti Creole','Bali','Banja','Batakki','Bugi','Javanese','Madura','Minangkabau','Sunda','Gujarati','Kannada','Malajalam','Marathi','Orija','Tamil','Telugu','Urdu','Irish','Bakhtyari','Gilaki','Kurdish','Luri','Mazandarani','Persian','Assyrian','Icelandic','Hebrew','Friuli','Sardinian','Circassian','Ainu','Kazakh','Tatar','Gusii','Kalenjin','Kamba','Kikuyu','Luhya','Luo','Masai','Meru','Nyika','Turkana','Kirgiz','Tadzhik','Khmer','Tšam','Kiribati','Tuvalu','Lao','Lao-Soung','Mon-khmer','Thai','Bassa','Gio','Grebo','Mano','Mixed Languages','Singali','Sotho','Zulu','Lithuanian','Luxembourgish','Latvian','Mandarin Chinese','Monegasque','Gagauzi','Malagasy','Dhivehi','Mixtec','Náhuatl','Otomí','Yucatec','Zapotec','Marshallese','Bambara','Senufo and Minianka','Songhai','Tamashek','Maltese','Burmese','Chin','Kachin','Karen','Kayah','Mon','Rakhine','Shan','Bajad','Buryat','Dariganga','Dorbet','Carolinian','Chuabo','Lomwe','Makua','Marendje','Nyanja','Ronga','Sena','Tsonga','Tswa','Hassaniya','Tukulor','Zenaga','Bhojpuri','Chichewa','Ngoni','Yao','Dusun','Iban','Mahoré','Afrikaans','Caprivi','Herero','Kavango','Nama','Ovambo','Malenasian Languages','Polynesian Languages','Hausa','Kanuri','Songhai-zerma','Bura','Edo','Ibibio','Ibo','Ijo','Tiv','Sumo','Niue','Fries','Maithili','Newari','Tamang','Tharu','Nauru','Brahui','Hindko','Saraiki','Sindhi','Cuna','Embera','Guaymí','Pitcairnese','Bicol','Cebuano','Hiligaynon','Ilocano','Maguindanao','Maranao','Pampango','Pangasinan','Pilipino','Waray-waray','Palau','Papuan Languages','Tahitian','Avarian','Bashkir','Chechen','Chuvash','Mari','Mordva','Udmur','Bari','Beja','Chilluk','Dinka','Fur','Lotuko','Nubian Languages','Nuer','Serer','Bullom-sherbro','Kono-vai','Kuranko','Limba','Mende','Temne','Nahua','Sranantonga','Czech and Moravian','Ukrainian and Russian','Swazi','Seselwa','Gorane','Hadjarai','Kanem-bornu','Mayo-kebbi','Ouaddai','Tandjile','Ane','Kabyé','Kotokoli','Moba','Naudemba','Watyi','Kuy','Tokelau','Arabic-French','Arabic-French-English','Ami','Atayal','Min','Paiwan','Chaga and Pare','Gogo','Ha','Haya','Hehet','Luguru','Makonde','Nyakusa','Nyamwesi','Shambala','Acholi','Ganda','Gisu','Kiga','Lango','Lugbara','Nkole','Soga','Teso','Tagalog','Karakalpak','Goajiro','Warrau','Man','Muong','Nung','Tho','Bislama','Futuna','Wallis','Samoan-English','Soqutri','Northsotho','Southsotho','Venda','Xhosa','Bemba','Chewa','Lozi','Nsenga'];
    $scope.selectedLang = {value: $scope.languages[0]};
    $scope.selectedPer = {value: 0};

    //SSB
    $scope.selected_dyear1 = 1992;
    $scope.selected_dyear2 = 1997;
    $scope.selectedlo_discount1 = 0;
    $scope.selectedlo_discount2 = 0;
    $scope.selectedlo_quantity1 = 0;
    $scope.selectedlo_quantity2 = 0;
    $scope.d_yearmonthnum = ['199204','199304','199404','199504','199604','199704','199804','199208','199308','199408','199508',
        '199608','199708','199808','199212','199312','199412','199512','199612','199712','199812','199202','199302','199402',
        '199502','199602','199702','199802','199201','199301','199401','199501','199601','199701','199801','199207','199307','199407','199507','199607','199707','199807','199206','199306','199406','199506','199606','199706','199806','199203','199303','199403','199503','199603','199703','199803','199205','199305','199405','199505','199605','199705','199805','199211','199311','199411','199511','199611','199711','199811','199210','199310','199410','199510','199610','199710','199810','199209','199309','199409','199509','199609','199709','199809'];
    $scope.selectedd_yearmonthnum = {value: $scope.d_yearmonthnum[0]};
    $scope.selectedweeknuminyear = 0;
    $scope.selectedlo_year = 0;
    $scope.p_category = ['MFGR#55','MFGR#54','MFGR#53','MFGR#52','MFGR#51','MFGR#45','MFGR#44','MFGR#43','MFGR#42','MFGR#41','MFGR#35','MFGR#34','MFGR#33','MFGR#32','MFGR#31','MFGR#25','MFGR#24','MFGR#23','MFGR#22','MFGR#21','MFGR#15','MFGR#14','MFGR#13','MFGR#12','MFGR#11'];
    $scope.selectedp_category = {value: $scope.p_category[0]};
    $scope.s_region = ['AMERICA','AFRICA','MIDDLE EAST','EUROPE','ASIA'];
    $scope.selecteds_region = {value: $scope.s_region[0]};
    $scope.p_brand1 = ['MFGR#1129','MFGR#1517','MFGR#2130','MFGR#2131','MFGR#2132','MFGR#2240','MFGR#246','MFGR#2515',
        'MFGR#2533','MFGR#3121','MFGR#3124','MFGR#3215','MFGR#3216','MFGR#3225','MFGR#327','MFGR#3312','MFGR#3314','MFGR#3410',
        'MFGR#345','MFGR#348','MFGR#4316','MFGR#443','MFGR#5122','MFGR#5227','MFGR#5239','MFGR#5418','MFGR#5510','MFGR#5523','MFGR#1124','MFGR#1232','MFGR#124','MFGR#1412','MFGR#1424','MFGR#211','MFGR#2111','MFGR#2122','MFGR#2239','MFGR#2329','MFGR#2336','MFGR#242','MFGR#3140','MFGR#4137','MFGR#4310','MFGR#4330','MFGR#444','MFGR#4523','MFGR#4528','MFGR#4538','MFGR#5212','MFGR#5229','MFGR#5322','MFGR#5333','MFGR#5412','MFGR#5421','MFGR#5513','MFGR#555','MFGR#1112','MFGR#1214','MFGR#1316','MFGR#1322','MFGR#133','MFGR#1419','MFGR#215','MFGR#2220','MFGR#236','MFGR#2531','MFGR#2536','MFGR#3113','MFGR#3237','MFGR#3324','MFGR#359','MFGR#4212','MFGR#4331','MFGR#4520','MFGR#5123','MFGR#5316','MFGR#5320','MFGR#5415','MFGR#546','MFGR#1218','MFGR#1312','MFGR#143','MFGR#1432','MFGR#153','MFGR#2125','MFGR#2227','MFGR#223','MFGR#2313','MFGR#2320','MFGR#233','MFGR#2415','MFGR#2437','MFGR#2510','MFGR#2518','MFGR#3235','MFGR#3325','MFGR#3327','MFGR#3330','MFGR#356','MFGR#4238','MFGR#4323','MFGR#4521','MFGR#5224','MFGR#5339','MFGR#547','MFGR#5525','MFGR#5530','MFGR#5531','MFGR#5534','MFGR#558','MFGR#2110','MFGR#2217','MFGR#3326','MFGR#3513','MFGR#3519','MFGR#3529','MFGR#3531','MFGR#358','MFGR#421','MFGR#4319','MFGR#4327','MFGR#4526','MFGR#5111','MFGR#5131','MFGR#5223','MFGR#5234','MFGR#557','MFGR#1230','MFGR#149','MFGR#151','MFGR#1515','MFGR#1522','MFGR#1526','MFGR#1536','MFGR#2426','MFGR#2433','MFGR#2525','MFGR#3130','MFGR#3311','MFGR#3316','MFGR#3521','MFGR#3523','MFGR#4113','MFGR#4128','MFGR#4219','MFGR#4220','MFGR#4232','MFGR#429','MFGR#4333','MFGR#4339','MFGR#4437','MFGR#4510','MFGR#514','MFGR#1324','MFGR#2221','MFGR#319','MFGR#4119','MFGR#4336','MFGR#4410','MFGR#4433','MFGR#447','MFGR#4513','MFGR#4529','MFGR#4533','MFGR#5114','MFGR#513','MFGR#5138','MFGR#5217','MFGR#5232','MFGR#1125','MFGR#1134','MFGR#1137','MFGR#1229','MFGR#1238','MFGR#1328','MFGR#1530','MFGR#2117','MFGR#216','MFGR#2339','MFGR#2425','MFGR#3212','MFGR#3424','MFGR#3438','MFGR#3515','MFGR#4139','MFGR#433','MFGR#4425','MFGR#454','MFGR#5112','MFGR#515','MFGR#5211','MFGR#5420','MFGR#5429','MFGR#5532','MFGR#136','MFGR#148','MFGR#1510','MFGR#157','MFGR#158','MFGR#2115','MFGR#2229','MFGR#2325','MFGR#235','MFGR#2512','MFGR#312','MFGR#3125','MFGR#3416','MFGR#343','MFGR#3437','MFGR#3535','MFGR#4215','MFGR#4229','MFGR#4411','MFGR#446','MFGR#459','MFGR#518','MFGR#5237','MFGR#5438','MFGR#5526','MFGR#1115','MFGR#121','MFGR#1226','MFGR#1331','MFGR#1340','MFGR#1435','MFGR#1525','MFGR#1533','MFGR#2137','MFGR#2234','MFGR#2411','MFGR#3122','MFGR#3315','MFGR#3340','MFGR#3414','MFGR#419','MFGR#4217','MFGR#4223','MFGR#426','MFGR#4423','MFGR#4537','MFGR#458','MFGR#5312','MFGR#5328','MFGR#5417','MFGR#5432','MFGR#5435','MFGR#554','MFGR#1132','MFGR#1411','MFGR#1440','MFGR#219','MFGR#2212','MFGR#2228','MFGR#2523','MFGR#3123','MFGR#3220','MFGR#3426','MFGR#3525','MFGR#3536','MFGR#3538','MFGR#4127','MFGR#4133','MFGR#4439','MFGR#445','MFGR#451','MFGR#457','MFGR#5218','MFGR#537','MFGR#5423','MFGR#1140','MFGR#1227','MFGR#152','MFGR#1521','MFGR#1527','MFGR#2112','MFGR#2114','MFGR#2124','MFGR#2238','MFGR#2435','MFGR#2436','MFGR#3120','MFGR#3136','MFGR#3137','MFGR#317','MFGR#3217','MFGR#3425','MFGR#4116','MFGR#4123','MFGR#4239','MFGR#4312','MFGR#4321','MFGR#435','MFGR#4514','MFGR#5118','MFGR#5125','MFGR#5230','MFGR#5231','MFGR#5528','MFGR#1116','MFGR#2120','MFGR#214','MFGR#2216','MFGR#2224','MFGR#2316','MFGR#237','MFGR#2421','MFGR#2511','MFGR#2522','MFGR#253','MFGR#2538','MFGR#311','MFGR#315','MFGR#323','MFGR#3328','MFGR#3335','MFGR#341','MFGR#3411','MFGR#3412','MFGR#3431','MFGR#3517','MFGR#4111','MFGR#4121','MFGR#437','MFGR#4540','MFGR#5113','MFGR#5116','MFGR#533','MFGR#5533','MFGR#5540','MFGR#1136','MFGR#1216','MFGR#1236','MFGR#1420','MFGR#1427','MFGR#1430','MFGR#1524','MFGR#2327','MFGR#3129','MFGR#316','MFGR#3211','MFGR#3322','MFGR#3528','MFGR#4112','MFGR#4129','MFGR#416','MFGR#417','MFGR#418','MFGR#432','MFGR#4519','MFGR#5214','MFGR#523','MFGR#5327','MFGR#5336','MFGR#5434','MFGR#5515','MFGR#129','MFGR#137','MFGR#142','MFGR#2233','MFGR#2332','MFGR#2333','MFGR#2524','MFGR#2528','MFGR#259','MFGR#3126','MFGR#354','MFGR#428','MFGR#4311','MFGR#455','MFGR#5130','MFGR#5318','MFGR#5331','MFGR#159','MFGR#222','MFGR#2222','MFGR#226','MFGR#2321','MFGR#2331','MFGR#2412','MFGR#245','MFGR#3331','MFGR#349','MFGR#3510','MFGR#4340','MFGR#4435','MFGR#5314','MFGR#532','MFGR#5520','MFGR#5527','MFGR#1529','MFGR#1538','MFGR#2213','MFGR#2314','MFGR#2417','MFGR#4234','MFGR#436','MFGR#4422','MFGR#4516','MFGR#456','MFGR#5437','MFGR#5439','MFGR#1213','MFGR#1222','MFGR#1326','MFGR#138','MFGR#1416','MFGR#1513','MFGR#213','MFGR#2223','MFGR#2516','MFGR#2527','MFGR#3227','MFGR#3427','MFGR#4218','MFGR#4328','MFGR#4426','MFGR#5433','MFGR#1138','MFGR#139','MFGR#1421','MFGR#1436','MFGR#145','MFGR#1512','MFGR#1514','MFGR#2310','MFGR#238','MFGR#2513','MFGR#3231','MFGR#4136','MFGR#415','MFGR#4235','MFGR#4335','MFGR#5121','MFGR#516','MFGR#5222','MFGR#5330','MFGR#538','MFGR#5424','MFGR#117','MFGR#1539','MFGR#2337','MFGR#244','MFGR#3520','MFGR#4134','MFGR#4214','MFGR#4534','MFGR#526','MFGR#5431','MFGR#1119','MFGR#1126','MFGR#2135','MFGR#2312','MFGR#2414','MFGR#3214','MFGR#336','MFGR#3422','MFGR#346','MFGR#3512','MFGR#3514','MFGR#4424','MFGR#1338','MFGR#147','MFGR#2116','MFGR#2128','MFGR#2138','MFGR#442','MFGR#5221','MFGR#5414','MFGR#5512','MFGR#5535','MFGR#5536','MFGR#1123','MFGR#115','MFGR#1534','MFGR#2230','MFGR#2236','MFGR#234','MFGR#2424','MFGR#3114','MFGR#3128','MFGR#3537','MFGR#357','MFGR#5134','MFGR#5325','MFGR#5326','MFGR#5419','MFGR#5425','MFGR#543','MFGR#1431','MFGR#256','MFGR#4140','MFGR#1114','MFGR#1337','MFGR#2328','MFGR#2432','MFGR#251','MFGR#3115','MFGR#3516','MFGR#4414','MFGR#5110','MFGR#5124','MFGR#5324','MFGR#5334','MFGR#1215','MFGR#1239','MFGR#1313','MFGR#243','MFGR#3210','MFGR#3430','MFGR#3432','MFGR#4120','MFGR#4216','MFGR#4226','MFGR#4338','MFGR#4527','MFGR#4539','MFGR#5139','MFGR#5427','MFGR#5537','MFGR#556','MFGR#1130','MFGR#1333','MFGR#1414','MFGR#2214','MFGR#2335','MFGR#2439','MFGR#2535','MFGR#3219','MFGR#3310','MFGR#3436','MFGR#3530','MFGR#5133','MFGR#1325','MFGR#1329','MFGR#155','MFGR#2136','MFGR#2338','MFGR#254','MFGR#3119','MFGR#3132','MFGR#3213','MFGR#3233','MFGR#331','MFGR#3320','MFGR#4436','MFGR#5129','MFGR#5213','MFGR#5337','MFGR#116','MFGR#1323','MFGR#1439','MFGR#1540','MFGR#2218','MFGR#2219','MFGR#3138','MFGR#3238','MFGR#3318','MFGR#332','MFGR#3334','MFGR#3418','MFGR#3429','MFGR#414','MFGR#4326','MFGR#4332','MFGR#4524','MFGR#5228','MFGR#5233','MFGR#5335','MFGR#5539','MFGR#1131','MFGR#1233','MFGR#1537','MFGR#2119','MFGR#217','MFGR#229','MFGR#333','MFGR#3417','MFGR#347','MFGR#5313','MFGR#1317','MFGR#1321','MFGR#2416','MFGR#255','MFGR#3118','MFGR#4325','MFGR#1210','MFGR#126','MFGR#127','MFGR#2431','MFGR#3236','MFGR#3332','MFGR#4430','MFGR#5225','MFGR#534','MFGR#5426','MFGR#1315','MFGR#212','MFGR#3127','MFGR#3139','MFGR#314','MFGR#3232','MFGR#3423','MFGR#352','MFGR#551','MFGR#1212','MFGR#135','MFGR#144','MFGR#1532','MFGR#2530','MFGR#2537','MFGR#3117','MFGR#3413','MFGR#5115','MFGR#1319','MFGR#1327','MFGR#218','MFGR#2226','MFGR#3133','MFGR#3421','MFGR#3435','MFGR#3527','MFGR#355','MFGR#4213','MFGR#4413','MFGR#5120','MFGR#536','MFGR#1224','MFGR#1318','MFGR#1413','MFGR#2438','MFGR#424','MFGR#4417','MFGR#4535','MFGR#5319','MFGR#5321','MFGR#128','MFGR#2215','MFGR#2427','MFGR#334','MFGR#4125','MFGR#4532','MFGR#5128','MFGR#5522','MFGR#1121','MFGR#1511','MFGR#3110','MFGR#3321','MFGR#3539','MFGR#4222','MFGR#4318','MFGR#5119','MFGR#5315','MFGR#3218','MFGR#3223','MFGR#3336','MFGR#3428','MFGR#519','MFGR#1310','MFGR#2210','MFGR#3532','MFGR#452','MFGR#4525','MFGR#2133','MFGR#329','MFGR#4114','MFGR#4131','MFGR#4431','MFGR#5240','MFGR#525','MFGR#2428','MFGR#337','MFGR#411','MFGR#1314','MFGR#1422','MFGR#1523','MFGR#3533','MFGR#4230','MFGR#5117','MFGR#5338','MFGR#5428','MFGR#5514','MFGR#5529','MFGR#4211','MFGR#522','MFGR#3112','MFGR#3433','MFGR#4315','MFGR#4432','MFGR#5310','MFGR#535','MFGR#5416','MFGR#112','MFGR#2211','MFGR#2232','MFGR#2529','MFGR#3339','MFGR#3434','MFGR#4138','MFGR#4320','MFGR#5413','MFGR#544','MFGR#1111','MFGR#1415','MFGR#228','MFGR#2334','MFGR#425','MFGR#4440','MFGR#512','MFGR#227','MFGR#3234','MFGR#3319','MFGR#4135','MFGR#4434','MFGR#549','MFGR#1223','MFGR#1335','MFGR#141','MFGR#2129','MFGR#156','MFGR#2134','MFGR#2324','MFGR#2413','MFGR#249','MFGR#2532','MFGR#3228','MFGR#3317','MFGR#3439','MFGR#3511','MFGR#4324','MFGR#4512','MFGR#5238','MFGR#113','MFGR#224','MFGR#225','MFGR#5135','MFGR#122','MFGR#231','MFGR#2423','MFGR#2440','MFGR#413','MFGR#434','MFGR#4438','MFGR#4518','MFGR#1211','MFGR#123','MFGR#1234','MFGR#2514','MFGR#4130','MFGR#5137','MFGR#119','MFGR#1336','MFGR#2225','MFGR#2318','MFGR#2519','MFGR#3131','MFGR#3229','MFGR#3329','MFGR#5323','MFGR#542','MFGR#239','MFGR#3415','MFGR#448','MFGR#1434','MFGR#2517','MFGR#5220','MFGR#524','MFGR#3116','MFGR#3134','MFGR#4334','MFGR#4522','MFGR#1228','MFGR#5140','MFGR#5332','MFGR#5430','MFGR#2121','MFGR#3440','MFGR#3540','MFGR#4225','MFGR#125','MFGR#1438','MFGR#3333','MFGR#4429','MFGR#1235','MFGR#2118','MFGR#2126','MFGR#342','MFGR#5518','MFGR#2139','MFGR#146','MFGR#2140','MFGR#252','MFGR#258','MFGR#3337','MFGR#339','MFGR#1518','MFGR#2410','MFGR#4126','MFGR#5235','MFGR#528','MFGR#5422','MFGR#1135','MFGR#3111','MFGR#423','MFGR#441','MFGR#453','MFGR#5216','MFGR#5340','MFGR#1428','MFGR#2323','MFGR#2520','MFGR#3518','MFGR#4132','MFGR#4240','MFGR#5329','MFGR#553','MFGR#1433','MFGR#2330','MFGR#4231','MFGR#4233','MFGR#539','MFGR#1113','MFGR#1225','MFGR#2430','MFGR#1426','MFGR#5127','MFGR#548','MFGR#4115','MFGR#4337','MFGR#438','MFGR#4415','MFGR#1535','MFGR#3526','MFGR#4329','MFGR#2340','MFGR#2418','MFGR#4428','MFGR#1128','MFGR#4228','MFGR#1332','MFGR#1520','MFGR#2429','MFGR#1425','MFGR#2326','MFGR#353','MFGR#1139','MFGR#2420','MFGR#5210','MFGR#1417','MFGR#1531','MFGR#2526','MFGR#3135','MFGR#3323','MFGR#4122','MFGR#4227','MFGR#4418','MFGR#4421','MFGR#5132','MFGR#3239','MFGR#427','MFGR#4317','MFGR#1516','MFGR#154','MFGR#4117','MFGR#1339','MFGR#328','MFGR#529','MFGR#5511','MFGR#2237','MFGR#1320','MFGR#511','MFGR#1437','MFGR#2231','MFGR#318','MFGR#338','MFGR#4224','MFGR#517','MFGR#114','MFGR#545','MFGR#5521','MFGR#248','MFGR#4536','MFGR#5236','MFGR#5519','MFGR#2534','MFGR#4124','MFGR#5215','MFGR#3522','MFGR#4517','MFGR#2123','MFGR#2322','MFGR#4420','MFGR#1122','MFGR#134','MFGR#3230','MFGR#1237','MFGR#1330','MFGR#1334','MFGR#257','MFGR#3524','MFGR#412','MFGR#1519','MFGR#1118','MFGR#1231','MFGR#1240','MFGR#3313','MFGR#4236','MFGR#2311','MFGR#1217','MFGR#322','MFGR#5436','MFGR#2315','MFGR#4530','MFGR#313','MFGR#1133','MFGR#2521','MFGR#559','MFGR#1429','MFGR#2235','MFGR#3338','MFGR#3419','MFGR#4322','MFGR#321','MFGR#531','MFGR#2113','MFGR#3224','MFGR#4531','MFGR#1221','MFGR#5524','MFGR#5517','MFGR#326','MFGR#5126','MFGR#232','MFGR#552','MFGR#132','MFGR#1311','MFGR#2422','MFGR#2319','MFGR#5317','MFGR#1117','MFGR#439','MFGR#4427','MFGR#1528','MFGR#521','MFGR#1219','MFGR#351','MFGR#1220','MFGR#4511','MFGR#5226','MFGR#4210','MFGR#5410','MFGR#3226','MFGR#111','MFGR#131','MFGR#3420','MFGR#4221','MFGR#527','MFGR#2419','MFGR#118','MFGR#4416','MFGR#4419','MFGR#5136','MFGR#344','MFGR#449','MFGR#1418','MFGR#1120','MFGR#2127','MFGR#4118','MFGR#4237','MFGR#3221','MFGR#3534','MFGR#4110','MFGR#5440','MFGR#1410','MFGR#5311','MFGR#2539','MFGR#324','MFGR#3240','MFGR#422','MFGR#1423','MFGR#5516','MFGR#5538','MFGR#335','MFGR#1127','MFGR#2434','MFGR#4412','MFGR#247','MFGR#4515','MFGR#241','MFGR#431','MFGR#3222','MFGR#325','MFGR#4313','MFGR#4314','MFGR#2540','MFGR#5411','MFGR#541','MFGR#1110','MFGR#221','MFGR#2317','MFGR#5219'];
    $scope.selectedp_brand1 = {value: $scope.p_brand1[0]};
    $scope.selectedp_brand2 = {value: $scope.p_brand1[0]};
    $scope.c_region = ['AMERICA','AFRICA','MIDDLE EAST','EUROPE','ASIA'];
    $scope.selectedc_region = {value: $scope.c_region[0]};
    //Figure out dates
    $scope.c_city = ['PERU     8','ETHIOPIA 6','ARGENTINA1','MOROCCO  2','IRAQ     1','KENYA    9','UNITED KI2','IRAN     2',
        'UNITED ST5','CHINA    0','INDIA    3','CANADA   3','INDIA    5','RUSSIA   9','ROMANIA  8','MOZAMBIQU2','UNITED ST1',
        'CANADA   6','BRAZIL   2','EGYPT    9','INDONESIA3','ALGERIA  4','RUSSIA   1','VIETNAM  3','CHINA    5','ALGERIA  2','ARGENTINA9','MOZAMBIQU8','MOZAMBIQU1','UNITED KI7','GERMANY  7','IRAN     6','JORDAN   2','ALGERIA  6','EGYPT    6','INDIA    2','RUSSIA   7','CHINA    6','RUSSIA   3','JAPAN    9','GERMANY  4','KENYA    5','KENYA    1','UNITED ST2','INDONESIA5','INDONESIA7','ROMANIA  0','JAPAN    5','UNITED ST8','MOZAMBIQU4','PERU     3','PERU     4','INDIA    6','ROMANIA  1','ETHIOPIA 0','UNITED ST3','RUSSIA   4','UNITED KI8','EGYPT    3','VIETNAM  8','EGYPT    4','FRANCE   1','ARGENTINA0','MOZAMBIQU3','SAUDI ARA6','CHINA    2','KENYA    4','GERMANY  1','ETHIOPIA 7','KENYA    8','VIETNAM  9','JAPAN    8','CHINA    7','GERMANY  8','IRAQ     9','INDONESIA0','FRANCE   7','CANADA   1','BRAZIL   0','MOZAMBIQU5','EGYPT    1','ROMANIA  6','JAPAN    1','VIETNAM  0','VIETNAM  6','IRAQ     5','BRAZIL   4','FRANCE   3','EGYPT    2','VIETNAM  4','UNITED ST9','VIETNAM  7','MOROCCO  0','SAUDI ARA4','UNITED KI1','JORDAN   9','CHINA    3','ALGERIA  8','FRANCE   8','ROMANIA  2','INDIA    8','BRAZIL   1','ARGENTINA2','UNITED KI9','MOROCCO  6','KENYA    0','FRANCE   2','GERMANY  3','ROMANIA  7','MOZAMBIQU0','IRAN     0','JAPAN    7','SAUDI ARA1','FRANCE   9','UNITED KI4','GERMANY  0','RUSSIA   5','UNITED ST4','JORDAN   6','ETHIOPIA 2','ALGERIA  0','BRAZIL   5','SAUDI ARA5','JORDAN   1','UNITED KI6','RUSSIA   8','IRAN     1','JAPAN    4','ALGERIA  9','PERU     7','ARGENTINA8','CHINA    8','INDONESIA4','IRAN     5','CHINA    4','MOROCCO  1','IRAQ     4','MOROCCO  5','CANADA   7','ROMANIA  5','EGYPT    5','BRAZIL   7','BRAZIL   3','GERMANY  9','MOROCCO  9','IRAN     8','INDONESIA8','ROMANIA  9','ETHIOPIA 1','CANADA   8','KENYA    7','KENYA    2','ETHIOPIA 3','GERMANY  5','UNITED KI5','IRAN     3','INDIA    1','IRAQ     2','ARGENTINA7','IRAN     7','INDONESIA9','VIETNAM  1','MOZAMBIQU7','UNITED KI0','ALGERIA  1','GERMANY  6','VIETNAM  5','JAPAN    6','IRAQ     0','PERU     2','MOROCCO  7','CANADA   5','IRAN     4','CANADA   2','MOZAMBIQU9','FRANCE   5','ALGERIA  7','VIETNAM  2','INDONESIA1','UNITED KI3','ARGENTINA5','ETHIOPIA 9','BRAZIL   8','EGYPT    8','CHINA    9','INDIA    7','PERU     1','INDIA    0','JORDAN   8','RUSSIA   0','PERU     6','FRANCE   0','RUSSIA   2','JORDAN   7','ETHIOPIA 8','INDIA    4','JAPAN    0','MOROCCO  8','SAUDI ARA0','ARGENTINA3','INDONESIA6','GERMANY  2','ETHIOPIA 5','SAUDI ARA7','FRANCE   6','JORDAN   0','CHINA    1','IRAQ     6','SAUDI ARA3','FRANCE   4','SAUDI ARA8','PERU     5','CANADA   4','PERU     0','ALGERIA  3','SAUDI ARA9','CANADA   0','KENYA    3','SAUDI ARA2','IRAQ     3','JAPAN    3','IRAN     9','KENYA    6','CANADA   9','RUSSIA   6','UNITED ST7','MOROCCO  3','JAPAN    2','ROMANIA  3','PERU     9','UNITED ST0','MOROCCO  4','IRAQ     8','BRAZIL   9','EGYPT    0','ALGERIA  5','ARGENTINA4','ARGENTINA6','JORDAN   5','MOZAMBIQU6','BRAZIL   6','INDONESIA2','IRAQ     7','ROMANIA  4','INDIA    9','JORDAN   4','ETHIOPIA 4','EGYPT    7','UNITED ST6','JORDAN   3'] ;
    $scope.selectedc_city1 = {value:$scope.c_city[0]};
    $scope.selectedc_city2 = {value:$scope.c_city[0]};
    $scope.s_city = ['PERU     8','ETHIOPIA 6','ARGENTINA1','MOROCCO  2','IRAQ     1','KENYA    9','UNITED KI2','IRAN     2',
        'UNITED ST5','CHINA    0','INDIA    3','CANADA   3','INDIA    5','RUSSIA   9','ROMANIA  8','MOZAMBIQU2','UNITED ST1',
        'CANADA   6','BRAZIL   2','EGYPT    9','INDONESIA3','ALGERIA  4','RUSSIA   1','VIETNAM  3','CHINA    5','ALGERIA  2','ARGENTINA9','MOZAMBIQU8','MOZAMBIQU1','UNITED KI7','GERMANY  7','IRAN     6','JORDAN   2','ALGERIA  6','EGYPT    6','INDIA    2','RUSSIA   7','CHINA    6','RUSSIA   3','JAPAN    9','GERMANY  4','KENYA    5','KENYA    1','UNITED ST2','INDONESIA5','INDONESIA7','ROMANIA  0','JAPAN    5','UNITED ST8','MOZAMBIQU4','PERU     3','PERU     4','INDIA    6','ROMANIA  1','ETHIOPIA 0','UNITED ST3','RUSSIA   4','UNITED KI8','EGYPT    3','VIETNAM  8','EGYPT    4','FRANCE   1','ARGENTINA0','MOZAMBIQU3','SAUDI ARA6','CHINA    2','KENYA    4','GERMANY  1','ETHIOPIA 7','KENYA    8','VIETNAM  9','JAPAN    8','CHINA    7','GERMANY  8','IRAQ     9','INDONESIA0','FRANCE   7','CANADA   1','BRAZIL   0','MOZAMBIQU5','EGYPT    1','ROMANIA  6','JAPAN    1','VIETNAM  0','VIETNAM  6','IRAQ     5','BRAZIL   4','FRANCE   3','EGYPT    2','VIETNAM  4','UNITED ST9','VIETNAM  7','MOROCCO  0','SAUDI ARA4','UNITED KI1','JORDAN   9','CHINA    3','ALGERIA  8','FRANCE   8','ROMANIA  2','INDIA    8','BRAZIL   1','ARGENTINA2','UNITED KI9','MOROCCO  6','KENYA    0','FRANCE   2','GERMANY  3','ROMANIA  7','MOZAMBIQU0','IRAN     0','JAPAN    7','SAUDI ARA1','FRANCE   9','UNITED KI4','GERMANY  0','RUSSIA   5','UNITED ST4','JORDAN   6','ETHIOPIA 2','ALGERIA  0','BRAZIL   5','SAUDI ARA5','JORDAN   1','UNITED KI6','RUSSIA   8','IRAN     1','JAPAN    4','ALGERIA  9','PERU     7','ARGENTINA8','CHINA    8','INDONESIA4','IRAN     5','CHINA    4','MOROCCO  1','IRAQ     4','MOROCCO  5','CANADA   7','ROMANIA  5','EGYPT    5','BRAZIL   7','BRAZIL   3','GERMANY  9','MOROCCO  9','IRAN     8','INDONESIA8','ROMANIA  9','ETHIOPIA 1','CANADA   8','KENYA    7','KENYA    2','ETHIOPIA 3','GERMANY  5','UNITED KI5','IRAN     3','INDIA    1','IRAQ     2','ARGENTINA7','IRAN     7','INDONESIA9','VIETNAM  1','MOZAMBIQU7','UNITED KI0','ALGERIA  1','GERMANY  6','VIETNAM  5','JAPAN    6','IRAQ     0','PERU     2','MOROCCO  7','CANADA   5','IRAN     4','CANADA   2','MOZAMBIQU9','FRANCE   5','ALGERIA  7','VIETNAM  2','INDONESIA1','UNITED KI3','ARGENTINA5','ETHIOPIA 9','BRAZIL   8','EGYPT    8','CHINA    9','INDIA    7','PERU     1','INDIA    0','JORDAN   8','RUSSIA   0','PERU     6','FRANCE   0','RUSSIA   2','JORDAN   7','ETHIOPIA 8','INDIA    4','JAPAN    0','MOROCCO  8','SAUDI ARA0','ARGENTINA3','INDONESIA6','GERMANY  2','ETHIOPIA 5','SAUDI ARA7','FRANCE   6','JORDAN   0','CHINA    1','IRAQ     6','SAUDI ARA3','FRANCE   4','SAUDI ARA8','PERU     5','CANADA   4','PERU     0','ALGERIA  3','SAUDI ARA9','CANADA   0','KENYA    3','SAUDI ARA2','IRAQ     3','JAPAN    3','IRAN     9','KENYA    6','CANADA   9','RUSSIA   6','UNITED ST7','MOROCCO  3','JAPAN    2','ROMANIA  3','PERU     9','UNITED ST0','MOROCCO  4','IRAQ     8','BRAZIL   9','EGYPT    0','ALGERIA  5','ARGENTINA4','ARGENTINA6','JORDAN   5','MOZAMBIQU6','BRAZIL   6','INDONESIA2','IRAQ     7','ROMANIA  4','INDIA    9','JORDAN   4','ETHIOPIA 4','EGYPT    7','UNITED ST6','JORDAN   3'] ;
    $scope.selecteds_city1 = {value:$scope.s_city[0]};
    $scope.selecteds_city2 = {value:$scope.s_city[0]};
    $scope.yearmonth = ['Apr1992','Apr1993','Apr1994','Apr1995','Apr1996','Apr1997','Apr1998','Aug1992','Aug1993','Aug1994',
        'Aug1995','Aug1996','Aug1997','Aug1998','Dec1992','Dec1993','Dec1994','Dec1995','Dec1996','Dec1997','Dec1998','Feb1992',
        'Feb1993','Feb1994','Feb1995','Feb1996','Feb1997','Feb1998','Jan1992','Jan1993','Jan1994','Jan1995','Jan1996','Jan1997','Jan1998','Jul1992','Jul1993','Jul1994','Jul1995','Jul1996','Jul1997','Jul1998','Jun1992','Jun1993','Jun1994','Jun1995','Jun1996','Jun1997','Jun1998','Mar1992','Mar1993','Mar1994','Mar1995','Mar1996','Mar1997','Mar1998','May1992','May1993','May1994','May1995','May1996','May1997','May1998','Nov1992','Nov1993','Nov1994','Nov1995','Nov1996','Nov1997','Nov1998','Oct1992','Oct1993','Oct1994','Oct1995','Oct1996','Oct1997','Oct1998','Sep1992','Sep1993','Sep1994','Sep1995','Sep1996','Sep1997','Sep1998'];
    $scope.selectedd_yearmonth = {value: $scope.yearmonth[0]};
    $scope.p_mfgr = ['MFGR#1','MFGR#2','MFGR#3','MFGR#4','MFGR#5'] ;
    $scope.selectedp_mfgr1 = {value : $scope.p_mfgr[0]};
    $scope.selectedp_mfgr2 = {value : $scope.p_mfgr[0]};
    $scope.s_nation = ['PERU','ETHIOPIA','ARGENTINA','MOROCCO','IRAQ','KENYA','UNITED KINGDOM','IRAN','UNITED STATES','CHINA','INDIA','CANADA','RUSSIA','ROMANIA','MOZAMBIQUE','BRAZIL','EGYPT','INDONESIA','ALGERIA','VIETNAM','GERMANY','JORDAN','JAPAN','FRANCE','SAUDI ARABIA'] ;
    $scope.c_nation = ['PERU','ETHIOPIA','ARGENTINA','MOROCCO','IRAQ','KENYA','UNITED KINGDOM','IRAN','UNITED STATES','CHINA','INDIA','CANADA','RUSSIA','ROMANIA','MOZAMBIQUE','BRAZIL','EGYPT','INDONESIA','ALGERIA','VIETNAM','GERMANY','JORDAN','JAPAN','FRANCE','SAUDI ARABIA'] ;
    $scope.selecteds_nation = {value: $scope.s_nation[0]};
    $scope.selectedc_nation = {value: $scope.c_nation[0]};









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


