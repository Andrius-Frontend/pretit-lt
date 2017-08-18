angular.module('tyList.serviceView', ['tyList.service'])

.controller('ServiceViewController', function ($scope, Services, Carousel, $ionicLoading, $stateParams, $state, cityList) {
    $(".js-example-responsive2").select2({});
    var $example = $(".js-example-responsive2").select2({})
    $scope.filter = {};
    $scope.usersFinal = [];
    $scope.beginToSearch = function () {


        var categoryChoice = '';
        if ($scope.categoryChoice) {
            var categoryChoice = $scope.categoryChoice.name;
        }
        console.log($scope.cityChoice);
        $("#datepicker").datepicker("destroy");
        console.log($("#datepicker").datepicker("destroy"))
        $state.go('app.search', {
            "city": $scope.cityChoice,
            "date": $scope.dateChoiceForSearch,
            "service": categoryChoice,
            "serviceType": $scope.serviceChoice,
            "time": JSON.stringify($scope.filter),
            "price": $scope.price.value,
            "sortBy": $scope.sortBy,
            "company": $scope.filter.salone
        }, {
            reload: true,
            inherit: false
        });
    }
    $scope.price = {
        min: 0,
        max: 300,
        value: 250
    }
    $scope.cityChoice = '';
    $ionicLoading.show({
        template: 'Loading...'
    });

    if ($stateParams.time) {
        $scope.filter = JSON.parse($stateParams.time)
    }
    if ($stateParams.city) {
        $scope.filterCity = $stateParams.city;
    } else {
        $scope.filterCity = 'Vilnius';
    }

    if ($stateParams.price) {
        $scope.price.value = $stateParams.price;
    }

    $scope.sortBy = $stateParams.sortBy;
    var sortByOptions = ['Stars', 'created_at', 'rating'];
    if (!$stateParams.time) {
        $scope.filter = {
            rytas: true,
            diena: true,
            vakaras: true
        }
    }

    $scope.goToUser = function (id) {
        $state.go('app.userProfile', {
            "userId": id
        });
    }
    var selectedService = $stateParams.service;
    var selectedServiceType = $stateParams.serviceType;
    if ($stateParams.date) {
        $scope.dateChoice = $stateParams.date;
    }
    if ($stateParams.city) {
        $scope.cityChoice = $stateParams.city;
        console.log($scope.cityChoice)

    } else {
        $scope.cityChoice = 'Pasirinkite miestą';
    }
    $scope.limitTo = 9;
    $scope.loadMore = function () {
        $scope.limitTo = $scope.limitTo + 3
    }
    $scope.services = Services;
    $scope.Carousel = Carousel;
    $scope.users = [];
    var today = new Date();
    var query = new Parse.Query(Parse.User);
    query.equalTo('hasService', true);
    query.greaterThanOrEqualTo("ValidTill", today);

    if ($stateParams.company == 'true') {
        query.exists("companyId");
    }
    query.descending(sortByOptions[parseInt($scope.sortBy)]);
    if (selectedService) {
        query.equalTo('servicesForSearch', selectedService);
    }
    if (selectedServiceType) {
        query.equalTo('subServicesForSearch', selectedServiceType);
    }
    if ($scope.cityChoice && $scope.cityChoice != 'Pasirinkite miestą') {
        query.equalTo('formatedCity', $scope.cityChoice);

    }
    console.log(query)

    query.find({
        success: function (users) {
            console.log($scope.cityChoice)
            console.log('$scope.cityChoice')

            $example.val($scope.cityChoice).trigger("change");



            $scope.firstCheck = [];
            $scope.secondCheck = users;
            $scope.thirdCheck = [];
            $scope.fourthCheck = [];
            $scope.fifthCheck = [];
            if (selectedService) {
                for (keytwo in Services) {
                    if (Services[keytwo].name == selectedService) {
                        $scope.categoryChoice = Services[keytwo];
                        for (keythree in Services[keytwo].subcategories) {
                            if (Services[keytwo].subcategories[keythree].name == selectedServiceType) {
                                $scope.serviceChoice = Services[keytwo].subcategories[keythree].name;
                                $scope.subServiceData = Services[keytwo].subcategories[keythree];
                                $scope.$apply();
                                break
                            }
                        }

                    }
                }
            }



            if ($stateParams.date) {

                var myDate = new Date($stateParams.date);
                $scope.diena = myDate.getDay();

                for (bla = 0; bla < $scope.secondCheck.length; bla++) {

                    if ($scope.secondCheck[bla].attributes.WorkingDaysTimes[$scope.diena].working) {
                        $scope.thirdCheck.push($scope.secondCheck[bla])
                    }

                }


            } else {
                $scope.thirdCheck = $scope.secondCheck
            }


            if ($stateParams.date) {
                var i = 0;

                var ziuretiDatas = function () {
                    if (i < $scope.thirdCheck.length) {
                        var Calendar = Parse.Object.extend("Calendar");
                        var calendarQuery = new Parse.Query(Calendar);
                        calendarQuery.equalTo("Date", "0" + $stateParams.date);
                        calendarQuery.equalTo("User", $scope.thirdCheck[i]);

                        calendarQuery.find({
                            success: function (results) {

                                var bool = false;
                                if (results.length == 0) {

                                    for (key in $scope.thirdCheck[i].attributes.theTimes) {
                                        if ($scope.thirdCheck[i].attributes.theTimes[key].time == $scope.thirdCheck[i].attributes.WorkingDaysTimes[$scope.diena].hourFrom) {
                                            bool = true;
                                        }
                                        if ($scope.thirdCheck[i].attributes.theTimes[key].time == $scope.thirdCheck[i].attributes.WorkingDaysTimes[$scope.diena].hourTo) {
                                            bool = false;
                                        }
                                        $scope.thirdCheck[i].attributes.theTimes[key].availability = bool;
                                    }
                                } else {

                                    for (key in $scope.thirdCheck[i].attributes.theTimes) {
                                        if ($scope.thirdCheck[i].attributes.theTimes[key].time == $scope.thirdCheck[i].attributes.WorkingDaysTimes[$scope.diena].hourFrom) {
                                            bool = true;
                                        }
                                        if ($scope.thirdCheck[i].attributes.theTimes[key].time == $scope.thirdCheck[i].attributes.WorkingDaysTimes[$scope.diena].hourTo) {
                                            bool = false;
                                        }
                                        $scope.thirdCheck[i].attributes.theTimes[key].availability = bool;
                                    }
                                    for (key in results[0].attributes.Times) {
                                        if (results[0].attributes.Times[key].availability == false) {
                                            $scope.thirdCheck[i].attributes.theTimes[key].availability = false;
                                        }
                                    }
                                }
                                i++;
                                ziuretiDatas();
                            }
                        });

                    } else if (i == $scope.thirdCheck.length) {
                        $scope.lastSerch();
                    }
                }
                ziuretiDatas();
            } else {
                $scope.lastSerch();
            }



        }
    });
    $scope.lastSerch = function () {

        if (selectedServiceType) {

            for (key = 0; key < $scope.thirdCheck.length; key++) {

                for (j in $scope.thirdCheck[key].attributes.PaslaugosAll) {
                    if ($scope.thirdCheck[key].attributes.PaslaugosAll[j].name == selectedService) {
                        for (k in $scope.thirdCheck[key].attributes.PaslaugosAll[j].subcategories) {
                            if ($scope.thirdCheck[key].attributes.PaslaugosAll[j].subcategories[k].name == selectedServiceType) {

                                var duration = $scope.thirdCheck[key].attributes.PaslaugosAll[j].subcategories[k].duration;
                                var counter = 0;

                                for (d in $scope.thirdCheck[key].attributes.theTimes) {



                                    if (duration <= counter) {
                                        if ($scope.filter.rytas && 0 < $scope.thirdCheck[key].attributes.theTimes[d].id && $scope.thirdCheck[key].attributes.theTimes[d].id < 11 && $scope.thirdCheck[key].attributes.theTimes[d].availability) {
                                            $scope.users.push($scope.thirdCheck[key])

                                            break
                                        } else if ($scope.filter.diena && 10 < $scope.thirdCheck[key].attributes.theTimes[d].id && $scope.thirdCheck[key].attributes.theTimes[d].id < 23 && $scope.thirdCheck[key].attributes.theTimes[d].availability) {
                                            $scope.users.push($scope.thirdCheck[key])
                                            break
                                        } else if ($scope.filter.vakaras && 22 < $scope.thirdCheck[key].attributes.theTimes[d].id && $scope.thirdCheck[key].attributes.theTimes[d].id < 32 && $scope.thirdCheck[key].attributes.theTimes[d].availability) {
                                            $scope.users.push($scope.thirdCheck[key])


                                            break
                                        }



                                    } else if ($scope.thirdCheck[key].attributes.theTimes[d].availability) {
                                        counter++
                                    } else {
                                        counter = 0
                                    }
                                }

                            }
                        }
                    }
                }
            }

        } else {
            $scope.users = $scope.thirdCheck
        }

        if (selectedServiceType) {
            for (i = 0; i < $scope.users.length; i++) {

                if ($scope.users[i].attributes.prices[selectedServiceType]) {
                    $scope.users[i].price = $scope.users[i].attributes.prices[selectedServiceType];
                    if ($scope.users[i].price <= $scope.price.value) {
                        $scope.usersFinal.push($scope.users[i])
                    }
                } else {

                }
            }

        } else {
            $scope.usersFinal = $scope.users;
        }
        console.log($scope.users)
        console.log($scope.usersFinal)

        $scope.$apply();
        $ionicLoading.hide();
    }


    $scope.categorySelect = false;
    $scope.changeCategoryList = function (service) {
        if ($scope.categorySelect) {
            $scope.categorySelect = false;
        } else {
            $scope.categorySelect = true
        }
        if ($scope.categoryChoice != service) {
            $scope.serviceChoice = '';
        }
        if (service) {
            $scope.categoryChoice = service;
        }
    }


    //    $scope.categoryChoice = {};
    //    $scope.categoryChoice = selectedService;

    $scope.serviceSelect = false;
    $scope.changeServiceList = function (sub) {
        if ($scope.serviceSelect) {
            $scope.serviceSelect = false;
        } else {
            $scope.serviceSelect = true
        }
        if (sub) {
            $scope.serviceChoice = sub;
        }
    }
    $scope.serviceChoice = '';



    var element = document.getElementById('datosPickeris');
    $scope.dateSelect = false;
    $scope.changeDateList = function () {
            $("#datepicker").datepicker({
                inline: true,
                showOtherMonths: true,
                dayNamesMin: ['Se', 'Pi', 'An', 'Tr', 'Ke', 'Pe', 'Še'],
                monthNames: ['Sausis', 'Vasaris', 'Kovas', 'Balandis', 'Gegužė', 'Birželis',
                         'Liepa', 'Rugpjūtis', 'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis'],
                monthNamesShort: ['Sau', 'Vas', 'Kov', 'Bal', 'Geg', 'Bir',
                         'Lie', 'Rugpj', 'Rugsej', 'Spa', 'Lap', 'Gru'],
                minDate: 0,
                //        dateFormat: 'yy-mm-dd',
                firstDay: 1,
                onSelect: funcForCal,


            });
            if ($stateParams.date) {
                console.log($stateParams.date)
                console.log(new Date($stateParams.date))
                $('#datepicker').datepicker("setDate", new Date($stateParams.date));
            }
            if ($scope.dateSelect) {
                $scope.dateSelect = false;
                element.className = "showDate";
            } else {
                $scope.dateSelect = true;
                element.className = "showDateHeight";
            }

        }
        //    $scope.dateChoice = "";


    function testasss(dateText, inst) {

        element.className = "showDate";
        $scope.dateSelect = false;
        var month = dateText.getUTCMonth();
        var day = dateText.getUTCDate();
        var year = dateText.getUTCFullYear();

    }
    //
    //    $scope.citySelect = false;
    //    $scope.changeCityList = function () {
    //        if ($scope.citySelect) {
    //            $scope.citySelect = false;
    //        } else {
    //            $scope.citySelect = true
    //        }
    //
    //    }
    //    $scope.cityChoice = "city";

    function funcForCal(dateText, inst) {

        var date = $(this).datepicker('getDate'),
            day = date.getDate(),
            month = date.getMonth() + 1,
            year = date.getFullYear();
        $scope.dayOfWeek = date.getUTCDay();

        element.className = "showDate";
        $scope.dateSelect = false;


        var menesiai = ['sausio', 'vasario', 'kovo', 'balandžio', 'gegužės', 'birželio', 'liepos', 'rugpjūčio', 'rugsėjo', 'spalio', 'lapkričio', 'gruodžio']
        var menPavadinimas = menesiai[month - 1];

        $scope.dateChoice = day + ' - ' + menPavadinimas + ' - ' + year;
        $scope.dateChoiceForSearch = month + '/' + day + '/' + year

        $scope.$apply();

    }

    $("#datepicker").datepicker({
        inline: true,
        showOtherMonths: true,
        dayNamesMin: ['Se', 'Pi', 'An', 'Tr', 'Ke', 'Pe', 'Še'],
        monthNames: ['Sausis', 'Vasaris', 'Kovas', 'Balandis', 'Gegužė', 'Birželis',
                         'Liepa', 'Rugpjūtis', 'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis'],
        monthNamesShort: ['Sau', 'Vas', 'Kov', 'Bal', 'Geg', 'Bir',
                         'Lie', 'Rugpj', 'Rugsej', 'Spa', 'Lap', 'Gru'],
        minDate: 0,
        //        dateFormat: 'yy-mm-dd',
        firstDay: 1,
        onSelect: funcForCal,


    });

    if ($stateParams.date) {
        $('#datepicker').datepicker("setDate", new Date($stateParams.date));
        var date = $('#datepicker').datepicker('getDate'),
            day = date.getDate(),
            month = date.getMonth() + 1,
            year = date.getFullYear();
        $scope.dayOfWeek = date.getUTCDay();

        element.className = "showDate";
        $scope.dateSelect = false;


        var menesiai = ['sausio', 'vasario', 'kovo', 'balandžio', 'gegužės', 'birželio', 'liepos', 'rugpjūčio', 'rugsėjo', 'spalio', 'lapkričio', 'gruodžio']
        var menPavadinimas = menesiai[month - 1];

        $scope.dateChoice = day + ' - ' + menPavadinimas + ' - ' + year;
        $scope.dateChoiceForSearch = month + '/' + day + '/' + year

    }


    //    $('#datePicker').datepicker('setDate', '2016-04-30');

    $scope.loadDatePicker = function () {


        $('#datepicker').datepicker('refresh');

    }
    $scope.searchByName = function (name) {
        var tempName = name.toLowerCase();
        var query = new Parse.Query(Parse.User);
        query.matches("namefs", tempName); // find all the women
        query.greaterThanOrEqualTo("ValidTill", today);
        query.equalTo('hasService', true);
        query.equalTo("type", "2"); // find all the women
        query.find({
            success: function (women) {
                $scope.usersFinal = women;
                $scope.$apply();

            }
        });
    }
    $scope.cityList = cityList;
    if ($stateParams.city) {
        $scope.cityChoice = $stateParams.city;


    } else {
        $scope.cityChoice = 'Pasirinkite miestą';
    }

    $scope.revers = false;

    $scope.sortByChanged = function (sort) {
        if (sort == "3" || sort == "4") {
            $scope.orderByProperty = "price";
            if (sort == '3') {
                $scope.revers = false
            } else {
                $scope.revers = true
            }

        } else {
            $scope.orderByProperty = "";
            $scope.sortBy = sort;
            $scope.beginToSearch();
        }


    }
    $scope.citychange = function (city) {
        $scope.cityChoice = city;

    }

    $('select').on('select2:select', function (evt) {

        var newcity = $(".js-example-responsive2 :selected").text()
        $scope.cityChoice = newcity;
    });
})