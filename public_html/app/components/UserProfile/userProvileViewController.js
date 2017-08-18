angular.module('tyList.userProfile', ['tyList.service', 'mwl.calendar'])

.controller('UserProfileViewController', function ($scope, $stateParams, $ionicModal, $state, Times, WorkingDaysTimes, $http, $ionicPopup, $ionicLoading, $ionicTabsDelegate, $timeout, $ionicBackdrop) {

    $scope.selectedDate = "PASIRINKITE DATĄ"
    $scope.workingDays = WorkingDaysTimes;
    $scope.times = Times;
    $scope.map = {
        center: {
            latitude: 45,
            longitude: -73
        },
        zoom: 15
    };
    $scope.marker = {
        id: 0,
        coords: {
            latitude: 52.47491894326404,
            longitude: -1.8684210293371217
        },
        options: {
            draggable: false
        },
        events: {
            dragend: function (marker, eventName, args) {

                $scope.marker.options = {
                    draggable: false,
                    labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
                    labelAnchor: "100 0",
                    labelClass: "marker-labels"
                };
            }
        }
    };


    $scope.timeArray = [];
    $scope.selectedServices = [];
    var unavailable = [];
    $scope.reservation = {
        service: [],
        time: {},
        date: '',
        userId: ''
    };
    $scope.counter = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]

    $scope.id = $stateParams.userId;
    var currentUser = Parse.User.current();
    if (currentUser) {
        $scope.userInfo = currentUser.get('data');
        $scope.userPic = currentUser.get('profilePhoto');
        if (currentUser.attributes.Favorites && currentUser.attributes.Favorites.indexOf($scope.id) >= 0) {
            $scope.favorites = true;
        }

    }





    //    var gallery = new Parse.Query("ImageGallery");
    //    gallery.equalTo("Useris", $scope.id);
    //    gallery.find({
    //        success: function (images) {

    //            $scope.gallery = images;
    //        }
    //    })

    var query = new Parse.Query(Parse.User);

    query.equalTo("objectId", $scope.id);
    query.find({
        success: function (user) {



            $scope.theUser = user[0];
            if ($scope.theUser.attributes.address) {
                $scope.map.center.latitude = $scope.theUser.attributes.address.lat;
                $scope.map.center.longitude = $scope.theUser.attributes.address.long;
                $scope.marker.coords.latitude = $scope.theUser.attributes.address.lat;
                $scope.marker.coords.longitude = $scope.theUser.attributes.address.long;
                $scope.formatedStreet = $scope.theUser.attributes.formatedStreet;
                $scope.formatedCity = $scope.theUser.attributes.formatedCity;
                $scope.formatedAddress = $scope.theUser.attributes.formatedAddress;
            }
            if (user[0].attributes.WorkingDaysTimes) {
                $scope.workingDays = user[0].attributes.WorkingDaysTimes;

                if (user[0].attributes.profilePhoto) {
                    $scope.profilePic = user[0].attributes.profilePhoto._url
                }
                $scope.services = user[0].attributes.PaslaugosAll;
                $timeout(function () {
                    $ionicTabsDelegate.select(0);
                }, 500)

                //                $scope.times = user[0].attributes.theTimes;
                if (user[0].attributes.coverPhoto) {
                    $scope.coverPic = user[0].attributes.coverPhoto._url;
                }

                var i = 0;
                for (var key in $scope.workingDays) {

                    if ($scope.workingDays[key].working == !true) {
                        var skaicius = i.toString();
                        unavailable.push(skaicius);
                    }

                    i++;
                }

                $("#datepicker").datepicker("refresh");
            }
            if ($scope.theUser.attributes.isItCompany) {
                var companySpecialists = new Parse.Query(Parse.User);
                companySpecialists.equalTo("companyId", $scope.theUser.attributes.companyId); // find all the women
                companySpecialists.notEqualTo("isItCompany", true); // find all the women
                companySpecialists.find({
                    success: function (results) {
                        $scope.companyServices = results[0].attributes.PaslaugosAll;

                        if (results.length > 1) {
                            for (i = 1; i < results.length; i++) {
                                for (a = 0; a < 4; a++) {
                                    for (b = 0; b < results[i].attributes.PaslaugosAll[a].subcategories.length; b++) {
                                        if (results[i].attributes.PaslaugosAll[a].subcategories[b].doing) {
                                            $scope.companyServices[a].subcategories[b].doing = true;
                                            if (results[i].attributes.PaslaugosAll[a].subcategories[b].price < $scope.companyServices[a].subcategories[b].price) {
                                                $scope.companyServices[a].subcategories[b].price = results[i].attributes.PaslaugosAll[a].subcategories[b].price
                                            }
                                            //                                       if (results[i].attributes.PaslaugosAll[a].subcategories[b].duration < $scope.companyServices[a].subcategories[b].duration) {
                                            //                                        $scope.companyServices[a].subcategories[b].price = results[i].attributes.PaslaugosAll[a].subcategories[b].price
                                            //                                    }
                                        }

                                        //                                $scope.companyServices = $scope.companyServices.concat(results[i].attributes.PaslaugosAll[a].subcategories).unique();
                                    }
                                }
                            }
                        }
                        $scope.services = $scope.companyServices;


                    }
                });

            }
        }
    });


    $scope.registerService = function () {



        if (!$scope.reservation.time.id) {

            var alertPopup = $ionicPopup.alert({
                title: 'Klaida',
                template: 'Nepasirinkote laiko.'
            });
            return
        }
        $ionicLoading.show()
        var reservServ = angular.toJson($scope.reservation.service);
        var reservService = angular.fromJson(reservServ);
        var time = angular.toJson($scope.reservation.time);
        var times = angular.fromJson(time);
        var timeObject = {
            time: times,
            service: reservService,
        };

        var userObject = {
            userName: $scope.userInfo.name,
            userId: currentUser.id,
            userPic: $scope.userPic,
            userTel: $scope.userInfo.telNumber,
            userEmail: currentUser.attributes.email
        };




        var Booking = Parse.Object.extend("PreBooking");

        //        var time = angular.toJson($scope.reservation.time);
        //        var times = angular.fromJson(time);



        var recei = angular.toJson(currentUser);
        var receiv = angular.fromJson(recei);

        var sende = angular.toJson($scope.theUser);
        var sendi = angular.fromJson(sende);


        var myBooking = new Booking();
        var tempDate = new Date($scope.dateSelection);
        tempDate.setHours(5);
        tempDate.setMinutes(0);
        tempDate.setMilliseconds(0);


        myBooking.set("DateUTC", tempDate);

        myBooking.set('ReservServic', reservService);
        myBooking.set('ReceiverName', $scope.theUser.attributes.data.name);
        myBooking.set('ReceiverId', $scope.theUser.id);
        myBooking.set('ReceiverEmail', $scope.theUser.attributes.email);
        myBooking.set('ReceiverTel', $scope.theUser.attributes.data.telNumber);
        myBooking.set("Sender", currentUser);
        myBooking.set('ReceiverPic', $scope.profilePic);
        myBooking.set('TimeObject', timeObject);
        myBooking.set('UserObject', userObject);
        myBooking.set('Status', "Nepatvirtintas");

        myBooking.save(null, {
            success: function (gameScore) {
                // Execute any logic that should take place after the object is saved.
                emailPrebooking($scope.theUser.attributes.email);
                $ionicLoading.hide();
                $scope.modal.hide();
                var alertPopuptest = $ionicPopup.alert({
                    title: 'Sėkmingai užsiregistravote',
                    template: 'Laukite patvirtinimo iš specialisto.'
                });
                alertPopuptest.then(function (res) {

                    $state.go('app.home');
                    $("body").removeClass("modal-open")

                });


                console.log(gameScore)

            },
            error: function (gameScore, error) {
                // Execute any logic that should take place if the save fails.
                // error is a Parse.Error with an error code and message.
                console.log(error)
                $ionicLoading.hide();

            }
        });
    }
    $scope.sortedTimes = Object.keys($scope.times).sort(function (a, b) {
        return $scope.times[a] - $scope.times[b]
    });

    $scope.addToService = function (item) {
        var test = $.inArray(item, $scope.reservation.service);
        if (test == -1) {
            $scope.reservation.service.push(item);

        } else {
            var index = $scope.reservation.service.indexOf(item);
            $scope.reservation.service.splice(index, 1);

        }


    }
    $scope.testas = function () {

        var Booking = Parse.Object.extend("Booking");
        var query = new Parse.Query(Booking);
        query.equalTo("Receiver", $scope.theUser);
        query.find({
            success: function (comments) {

            }
        });
    }
    $scope.testass = function () {

        var Booking = Parse.Object.extend("Booking");
        var query = new Parse.Query(Booking);
        query.equalTo("Sender", currentUser);
        query.find({
            success: function (comments) {

            }
        });
    }
    $ionicModal.fromTemplateUrl('app/modals/bookService.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    function timesCallback(results, day) {

        if (results.length == 0) {
            for (key in $scope.times) {
                if ($scope.times[key].time == $scope.workingDays[day].hourFrom) {
                    bool = true;
                }

                if ($scope.times[key].time == $scope.workingDays[day].hourTo) {
                    bool = false;
                }

                $scope.times[key].availability = bool;
            }
            $scope.$apply();
        } else {
            for (key in $scope.times) {
                if ($scope.times[key].time == $scope.workingDays[day].hourFrom) {
                    bool = true;
                }

                if ($scope.times[key].time == $scope.workingDays[day].hourTo) {
                    bool = false;
                }

                $scope.times[key].availability = bool;
            }

            for (key in results[0].attributes.TimeSched) {
                if (results[0].attributes.TimeSched[key].availability == false) {
                    $scope.times[key].availability = false;
                }
            }

            $scope.$apply();
        }

    }

    function getQueryForAvailableTimesByUserIdAndDate(date, user_id) {
        var Calendar = Parse.Object.extend("Calendar");
        //        var newDate = date.getTime() / 1000;

        var query = new Parse.Query(Calendar);
        query.equalTo("DateUTC", date);
        query.equalTo("ReceiverId", user_id);
        return query;
    }

    /**
     * Returns a Parse.Query for Calendar collection, matching only entries
     * that relate to users by company_id
     */
    function _getQueryForCalendarByCompanyId(company_id) {
        var Calendar = Parse.Object.extend("Calendar");
        var User = Parse.Object.extend("_User");

        var query = new Parse.Query(Calendar);
        var user_q = new Parse.Query(User).equalTo("objectId", company_id);

        return query.matchesKeyInQuery("ReceiverId", "objectId", user_q);
    }

    /**
     * Returns a Parse.Query for Calendar collection, matching only entries
     * that relate to users by company_id but only within a given time range
     * If either from or to are set to zero, parameter is not used.
     * Do not omit both!
     */
    function _getQueryForCalendarByCompanyIdAndTime(
        company_id,
        from,
        to
    ) {
        var query = _getQueryForCalendarByCompanyId(company_id);

        if (from !== 0) {
            var from_date = new Date(from)

            $scope.theChosenDate = from_date;

            from_date.setUTCHours(0);


            query.greaterThanOrEqualTo("DateUTC", from_date);
        }

        if (to !== 0) {
            var to_date = new Date(to);
            to_date.setUTCHours(23);
            query.lessThanOrEqualTo("DateUTC", to_date);
        }

        return query;
    }

    function _getBlankDay() {
        var TimeSched = [];
        var d = new Date("1970-01-01T07:00Z");
        for (var i = 1; i <= 31; ++i) {
            var h = d.getUTCHours();
            var m = d.getUTCMinutes();
            if (m < 10) {
                m = "0" + m;
            }

            var time = h + ":" + m;

            TimeSched[i] = {
                "time": time,
                "availability": true,
                "id": i,
                "registeredService": {}
            };
            d = _advanceDateByMinutes(d, 30);
        }

        return TimeSched;
    }

    function _advanceDateByMinutes(date, minutes) {
        date.setTime(date.getTime() + minutes * 60 * 1000);
        return date;
    }

    function _advanceDateByDay(date) {
        return _advanceDateByMinutes(date, 24 * 60);
    }

    function _getBlankPeriod(from, to) {

        var date_from = new Date(from);
        var date_to = new Date(to);
        date_from.setHours(0);
        date_from.setMinutes(0);
        date_from.setSeconds(0);
        date_from.setMilliseconds(0);

        date_to.setHours(0);
        date_to.setMinutes(0);
        date_to.setSeconds(0);
        date_to.setMilliseconds(0);

        var timeArray = {};

        while (date_from <= date_to) {
            var name = date_from.getTime();

            timeArray[name] = _getBlankDay();
            date_from = _advanceDateByDay(date_from);

        }

        return timeArray;
    }

    function _mergeCalendarWithResults(calendar, results) {



        for (var i = 0; i < results.length; ++i) {
            var attributes = results[i].attributes;
            var date = attributes["DateUTC"];

            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);

            var timestamp = date.getTime();

            if (typeof calendar[timestamp] !== "undefined") {

                var TimeSched = attributes["TimeSched"];
                for (var t = 1; t <= 31; ++t) {

                    if (!TimeSched[t].availability) {
                        calendar[timestamp][t].availability = false;
                        if (typeof TimeSched[t].registeredService !== "undefined") {

                            //                        if (TimeSched[t].registeredService.length !== 0) {

                            calendar[timestamp][t].registeredService = TimeSched[t].registeredService;
                        }

                        if (typeof TimeSched[t].userInfo !== "undefined") {
                            calendar[timestamp][t].userInfo = TimeSched[t].userInfo;
                        }
                    }
                }
            }
        }


        return calendar;
    }

    /**
     * After retrieving Calendar entries, this function adds free user times
     * for selected days
     */
    function _addFreeToCalendarsByCompanyId(company_id, calendar, callback) {
        var User = Parse.Object.extend("_User");
        //        pakeist kad butu poto imonem
        //        var user_q = new Parse.Query(User).equalTo("companyId", company_id);
        var user_q = new Parse.Query(User).equalTo("objectId", $scope.id);
        user_q.notEqualTo("isItCompany", true);
        user_q.containedIn("subServicesForSearch", $scope.selectedServicesForSearch)
        user_q.find({
            success: function (results) {
                calendar = _addFreeToCalendarsByCompanyIdCallback(results, calendar);
                if (typeof callback !== "undefined") {
                    callback(calendar);
                }
            },
        });
    }

    function _addFreeToCalendarsByCompanyIdCallback(results, calendar) {
        var users = [];
        for (i = 0; i < results.length; i++) {
            users.push(results[i].attributes);
        }

        for (day in calendar) {
            for (time in calendar[day]) {
                if (calendar[day][time].availability === true) {
                    // add user as available if user works on that day of
                    // week and time slot is within working hours
                    var date = new Date(day * 1);
                    //                    var dow = _getDayOfWeek(date);
                    var dow = date.getDay();

                    calendar[day][time].availableUsers = [];
                    for (var u = 0; u < users.length; ++u) {
                        if (users[u].WorkingDaysTimes[dow].working === true &&
                            _userWorksAtTime(users[u], dow, calendar[day][time].time)
                        ) {

                            var l = calendar[day][time].availableUsers.length;
                            calendar[day][time].availableUsers[l] = users;
                        }
                    }

                    if (calendar[day][time].availableUsers.length === 0) {
                        calendar[day][time].availability = false;
                    }
                }
            }
        }

        return calendar;
    }

    function _userWorksAtTime(user, day_of_week, time) {
        if (!user.WorkingDaysTimes) {
            return true;
        }

        var working_hours = user.WorkingDaysTimes[day_of_week];
        var from = working_hours.hourFrom.split(":");
        var date_from = new Date(0);
        date_from.setUTCHours(from[0]);
        date_from.setUTCMinutes(from[1]);

        var to = working_hours.hourTo.split(":");
        var date_to = new Date(0);
        if (to[1] === "00") {
            to[1] = "30";
            var vienas = parseInt(to[0]);
            var du = vienas - 1;
            to[0] = String(du);
        } else {
            to[1] = "00";
        }
        date_to.setUTCHours(to[0]);
        date_to.setUTCMinutes(to[1]);



        var check = time.split(":");
        var date_check = new Date(0);
        date_check.setUTCHours(check[0]);
        date_check.setUTCMinutes(check[1]);

        return date_check >= date_from && date_check <= date_to;
    }

    function _getDayOfWeek(date) {
        var day_of_week = date.getUTCDay();
        if (day_of_week === 0) {
            day_of_week = 6;
        }

        return day_of_week;
    }

    /**
     * Get a formatted calender of user availability with an option to set
     * any clauses for the user query.
     * 
     * The query retrieves all user days related to the company of
     * company_id between from and to days (use MMMM-YY-DD format). If
     * needed, additional filters (services, location, name, etc) can be
     * applied to this query and when passed to
     * getCalendarForCompanyByDateFromQuery() and it will only select work
     * calendar of matching users.
     * 
     * @param company_id Id of object in Company collection
     *
     * @param from Day from which to select Calendar (use MMMM-YY-DD format)
     * 
     * @param to Day until which to select Calendar (use MMMM-YY-DD format)
     * 
     * @param callback Any function that should be called after the results
     * are retrieved. Must take one parameter which will contain the results
     * 
     */
    function getCalendarForCompanyByDate(company_id, from, to, callback) {
        //        from = "2016-06-28";
        //        to = "2016-06-28";
        //        company_id = $scope.theUser.attributes.companyId;
        var query = _getQueryForCalendarByCompanyIdAndTime(
            company_id,
            from,
            to
        );


        getCalendarForCompanyByDateFromQuery(query, company_id, from, to, callback);
    }

    /**
     * @see getCalendarForCompanyByDate()
     */
    function getCalendarForCompanyByDateFromQuery(query, company_id, from, to, callback) {
        var calendar = _getBlankPeriod(from, to);

        query.find({
            success: function (results) {

                calendar = _mergeCalendarWithResults(calendar, results);
                if (typeof callback === "undefined") {
                    _addFreeToCalendarsByCompanyId(company_id, calendar);
                } else {
                    _addFreeToCalendarsByCompanyId(company_id, calendar, callback);
                }
            }
        });
    }

    function getAvailableTimes(date) {
        var startDate = new Date(date);

        $scope.dateSelection = date;
        var user_id = $scope.theUser.id;
        var query = getQueryForAvailableTimesByUserIdAndDate(date, user_id);
        var day = startDate.getDay();

        query.find({
            success: function (results) {

                timesCallback(results, day);
            },
            error: function (error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    }
    $scope.servicesSum = 0;
    $scope.servicesDuration = 0;
    $scope.selectedServicesForSearch = [];

    $scope.bookService = function (service) {
        if (!currentUser) {
            $scope.showAlert = function () {
                var alertPopup = $ionicPopup.alert({
                    title: 'Klaida',
                    template: 'Jūs nesate prisiregistravęs'
                });

                alertPopup.then(function (res) {

                });
            };
            $scope.showAlert();
            return
        }
        $scope.addToService(service)
        $scope.selectedServices.push(service);
        $scope.selectedServicesForSearch.push(service.name);
        $scope.servicesSum = $scope.servicesSum + service.price;
        $scope.servicesDuration = $scope.servicesDuration + parseInt(service.duration);

        $scope.testCompany(new Date());


        $scope.monthNamesShort = ['Sausio', 'Vasario', 'Kovo', 'Balandžio', 'Gegužės', 'Birželio', 'Liepos', 'Rugpjūčio', 'Rugsėjo', 'Spalio', 'Lapkričio', 'Gruodžio'];
        $scope.modal.show();


        $("#datepicker").datepicker({
            inline: true,
            showOtherMonths: true,
            dayNamesMin: ['Se', 'Pi', 'An', 'Tr', 'Ke', 'Pe', 'Še'],
            monthNames: ['Sausis', 'Vasaris', 'Kovas', 'Balandis', 'Gegužė', 'Birželis',
            'Liepa', 'Rugpjūtis', 'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis'],
            monthNamesShort: ['Sau', 'Vas', 'Kov', 'Bal', 'Geg', 'Bir',
            'Lie', 'Rugpj', 'Rugsej', 'Spa', 'Lap', 'Gru'],
            minDate: 0,
            beforeShowDay: isAvailable,
            firstDay: 1,
            onSelect: getAvailableTimes,
        });

        function isAvailable(date) {
            var dateAsString = date.getDay().toString();
            var result = $.inArray(dateAsString, unavailable) == -1 ? [true] : [false];
            return result
        }
        var bool = false;


    }
    $scope.getAvailableTimes = function (date) {
        var startDate = new Date(date);

        $scope.dateSelection = date;
        var user_id = $scope.theUser.id;
        var query = getQueryForAvailableTimesByUserIdAndDate(date, user_id);
        var day = startDate.getDay();

        query.find({
            success: function (results) {

                timesCallback(results, day);
            },
            error: function (error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    }


    $scope.goToMessagesNew = function () {

            var channel;
            var obj;
            if (currentUser.id < $scope.id) {
                var channel = currentUser.id + "--" + $scope.id;
                var obj = {
                    a: {
                        id: currentUser.id,
                        name: currentUser.attributes.data.name,
                        picture: currentUser.attributes.profilePhoto._url
                    },
                    b: {
                        id: $scope.theUser.id,
                        name: $scope.theUser.attributes.data.name,
                        picture: $scope.theUser.attributes.profilePhoto._url
                    }
                };
            } else {
                var channel = $scope.id + "--" + currentUser.id;
                var obj = {
                    b: {
                        id: currentUser.id,
                        name: currentUser.attributes.data.name,
                        picture: currentUser.attributes.profilePhoto._url
                    },
                    a: {
                        id: $scope.theUser.id,
                        name: $scope.theUser.attributes.data.name,
                        picture: $scope.theUser.attributes.profilePhoto._url
                    }
                };

            }


            var Messages = Parse.Object.extend("Messages");




            var queryMess = new Parse.Query(Messages);
            queryMess.equalTo("Channel", channel);
            queryMess.find({
                success: function (mess) {
                    console.log(1)
                    if (mess.length == 0) {
                        console.log(2)
                        var messages = new Messages();
                        messages.set("MessageObject", obj);
                        //                    messages.set("Customer", user.userInfo.userId);
                        //                    messages.set("VerslaukName", currData.name);
                        //                    messages.set("CustomerName", user.userInfo.userName);
                        //                    if (currPic) {
                        //                        messages.set("VerslaukPic", currPic._url);
                        //                    }
                        //                    if (user.userInfo.userPic) {
                        //                        messages.set("CustomePic", user.userInfo.userPic._url);
                        //                    }
                        messages.set("Channel", channel);


                        messages.save(null, {
                            success: function (gameScore) {
                                // Execute any logic that should take place after the object is saved.
                                console.log(gameScore)
                                $state.go('app.customerMessages');
                            },
                            error: function (gameScore, error) {
                                // Execute any logic that should take place if the save fails.
                                // error is a Parse.Error with an error code and message.
                                alert('Failed to create new object, with error code: ' + error.message);
                            }
                        });
                    } else {
                        console.log(3)
                        mess[0].set("Channel", channel);
                        mess[0].save();
                        $state.go('app.customerMessages');

                    }
                }
            });


        }
        //    $scope.goToMessages = function () {
        //        if (!currentUser) {
        //            $scope.showAlert = function () {
        //                var alertPopup = $ionicPopup.alert({
        //                    title: 'Klaida',
        //                    template: 'Jūs nesate prisiregistravęs'
        //                });
        //
        //                alertPopup.then(function (res) {
        //
        //                });
        //            };
        //            $scope.showAlert();
        //            return
        //        }
        //        var customerData = currentUser.get('data');
        //        var customerPic = currentUser.get('profilePhoto');
        //
        //        var channel = $scope.theUser.id + "--" + currentUser.id;
        //
        //        var Messages = Parse.Object.extend("Messages");
        //
        //        var queryMess = new Parse.Query(Messages);
        //        queryMess.equalTo("Channel", channel);
        //        queryMess.find({
        //            success: function (mess) {
        //                if (mess.length == 0) {
        //                    var messages = new Messages();
        //
        //
        //                    messages.set("Verslauk", $scope.theUser.id);
        //                    messages.set("Customer", currentUser.id);
        //                    messages.set("VerslaukName", $scope.theUser.attributes.data.name);
        //                    messages.set("CustomerName", customerData.name);
        //                    messages.set("VerslaukPic", $scope.theUser.attributes.profilePhoto._url);
        //                    messages.set("CustomePic", customerPic._url);
        //                    messages.set("Channel", channel);
        //
        //
        //                    messages.save(null, {
        //                        success: function (gameScore) {
        //                            // Execute any logic that should take place after the object is saved.
        //
        //                            $state.go('app.messages');
        //                        },
        //                        error: function (gameScore, error) {
        //                            // Execute any logic that should take place if the save fails.
        //                            // error is a Parse.Error with an error code and message.
        //                            alert('Failed to create new object, with error code: ' + error.message);
        //                        }
        //                    });
        //                } else {
        //
        //                    mess[0].set("Channel", channel);
        //                    mess[0].save();
        //                    $state.go('app.messages');
        //
        //                }
        //            }
        //        });
        //
        //
        //
        //
        //
        //
        //    }
    var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
    $scope.dayNames = ["Pir", "Ant", "Tre", "Ket", "Pen", "Šeš", "Sek"];
    $scope.dienos = [];
    var sian = new Date();
    $scope.todayMark = sian;
    var gautiDienas = function (data) {
        $scope.dienos = [];
        for (i = 0; i < 7; i++) {
            var tempObj = {};
            tempObj.date = new Date(data.getTime() + i * 24 * 60 * 60 * 1000);
            tempObj.dayDate = tempObj.date.getDate();
            tempObj.dayMonth = tempObj.date.getMonth();
            $scope.dienos.push(tempObj);
        }

        $scope.monthName = monthNames[$scope.dienos[0].date.getMonth()];
    }

    $scope.prevWeek = function () {
        var data = new Date($scope.dienos[0].date.getTime() - 7 * 24 * 60 * 60 * 1000);
        gautiDienas(data);
        $scope.monthName = monthNames[$scope.dienos[0].date.getMonth()];
    }
    $scope.nextWeek = function () {

        var data = new Date($scope.dienos[6].date.getTime() + 1 * 24 * 60 * 60 * 1000);
        gautiDienas(data);
        $scope.monthName = monthNames[$scope.dienos[0].date.getMonth()];
    }
    $scope.checkSelectDate = function (data) {

        $scope.dateSelection = data;
    }

    function getMonday(d) {
        d = new Date(d);
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    }

    var pirmadienid = getMonday(new Date());
    gautiDienas(pirmadienid);

    $scope.testCompany = function (date) {
        $('#registerLoadCal').waitMe({
            effect: 'bounce',
            text: '',


        });
        $scope.month = date.getMonth();
        $scope.monthDay = date.getDate();
        $ionicLoading.show({
            template: 'Loading...'
        })
        var data = new Date(date);


        $scope.theChosenDate = data.getTime() / 1000;


        getCalendarForCompanyByDate($scope.theUser.id, data, data, theCallback);
        $scope.dateSelection = date;

    }
    $scope.theSpecialistWhoDo = [];

    function theCallback(result) {

        $('#registerLoadCal').waitMe('hide');
        $ionicLoading.hide();
        var currentHour = new Date().getHours();
        var hourId = (currentHour - 7) * 2 + 1;
        if (new Date().getMinutes() > 30) {
            hourId++;
        }

        for (key in result) {
            $scope.times = result[key];
            var a = new Date(parseInt(key));

            if (a.getDate() == new Date().getDate() && a.getMonth() == new Date().getMonth()) {
                for (i = 1; i <= hourId; i++) {

                    result[key][i].availability = false;

                }
            }

            var counter = 0;
            for (i = 1; i < result[key].length; i++) {
                if (result[key][i].availability === false) {
                    counter++;
                }
                var viceCounter = 0;
                for (b = i; b < i + $scope.servicesDuration; b++) {
                    if (typeof result[key][b] === "undefined") {

                    } else if (result[key][b].availability === true) {
                        viceCounter++;
                    }
                }

                if (viceCounter != $scope.servicesDuration) {
                    result[key][i].availability = false;
                }
            }
            if (counter >= 31) {
                $scope.times.working = true;
            }
        }

        $scope.$apply();
        $("#loading-overlay").css("visibility", "hidden");
        //        for (i = 0; i < $scope.counter.length; i++) {
        //            
        //
        //
        //        }
    }
    setTimeout(function () {
        if ($scope.times.length == 0) {
            alert('asdasd')
        }
    }, 3000);
    $scope.$on('modal.hidden', function () {

    });
    $scope.$on('modal.removed', function () {

    });
    $scope.addNewToService = function () {
        $scope.modal.hide();
    }
    $scope.deleteFromSelectedService = function (service) {
        var index = $scope.selectedServices.indexOf(service);
        $scope.selectedServices.splice(index, 1);
    }
    $scope.saveToFavorites = function () {
        if (!$scope.favorites) {
            currentUser.addUnique("Favorites", $scope.theUser.id);
            currentUser.save();
            //            var query = new Parse.Query(Parse.User);
            //            query.get(currentUser.id, {
            //                success: function (user) {
            //                    user.addUnique("Favorites", $scope.theUser.id);
            //                    user.save();
            //                }
            //            });
            $scope.favorites = true;
        } else {
            currentUser.remove("Favorites", $scope.theUser.id);
            currentUser.save();
            //            var query = new Parse.Query(Parse.User);
            //            query.get(currentUser.id, {
            //                success: function (user) {
            //                    user.remove("Favorites", $scope.theUser.id);
            //                    user.save();
            //                }
            //            });
            $scope.favorites = false;
        }
    }
    var emailPrebooking = function (email) {
        //        var req = {
        //            method: 'POST',
        //            url: 'http://www.pretit.lt/general/newPreBooking.php',
        //            headers: {
        //                'Content-Type': 'application/x-www-form-urlencoded'
        //            },
        //            data: {
        //                email: email
        //            }
        //        };
        //
        //        $http(req).then(function (success, two) {
        //
        //        }, function () {});
    };



    var Comments = Parse.Object.extend("CommentsOf");
    var comments = new Parse.Query(Comments);
    comments.equalTo("idOfUser", $scope.id);
    comments.find({
        success: function (results) {
            console.log(results)
            $scope.comments = results;
        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
    $scope.checkIfDoing = function (serArray) {
        for (i = 0; i < serArray.subcategories.length; i++) {

            if (serArray.subcategories[i].doing) {
                return true;
            }
        }
        return false;
        $scope.$apply();
    }

});