angular.module('tyList.companyDash', ['tyList.service'])




.controller('CompanyDashViewController', function ($scope, $state, Times, $ionicModal, $ionicPopup, $ionicLoading) {
    $scope.userName = Parse.User.current().getUsername()
    $scope.currentUser = Parse.User.current();
    $scope.times = Times;
    $scope.thatDayBookings = [];
    $scope.theBooking = [];
    $scope.noBookings = "Pasirinkite data";

    var currData = $scope.currentUser.get('data');
    var currPic = $scope.currentUser.get('profilePhoto')
    $scope.counter = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
    $scope.registeredService = {
        doing: true,
    };
    $scope.userInfo = {
        userId: 'ghost'
    };









    $(window).bind("load", function () {
        $('.slider4').bxSlider({
            slideWidth: 200,
            minSlides: 2,
            maxSlides: 3,
            moveSlides: 1,
            slideMargin: 10
        });
    });
    $(document).ready(function () {
        $('.slider2').bxSlider({
            slideWidth: 200,
            minSlides: 2,
            maxSlides: 3,
            moveSlides: 1,
            slideMargin: 10
        });
    });


    $("#datepickerBook").datepicker({
        inline: true,
        showOtherMonths: true,
        dayNamesMin: ['Se', 'Pi', 'An', 'Tr', 'Ke', 'Pe', 'Še'],
        monthNames: ['Sausis', 'Vasaris', 'Kovas', 'Balandis', 'Gegužė', 'Birželis',
            'Liepa', 'Rugpjūtis', 'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis'],
        monthNamesShort: ['Sau', 'Vas', 'Kov', 'Bal', 'Geg', 'Bir',
            'Lie', 'Rugpj', 'Rugsej', 'Spa', 'Lap', 'Gru'],
        firstDay: 1,
        onSelect: testComapny,
    });

    var CalCount = Parse.Object.extend("Booking");
    var queryCount = new Parse.Query(CalCount);
    queryCount.equalTo('ReceiverId', $scope.currentUser.id)
    queryCount.count({
        success: function (count) {
            // The count request succeeded. Show the count
            $scope.totalReservs = count
        },
        error: function (error) {
            // The request failed
        }
    });

    function getDayBookings(date) {

        $scope.testCompany(date);
        return
        var firstDate = new Date(date);
        var secDate = new Date(date);
        firstDate.setHours(0, 0, 0, 0);
        secDate.setHours(23, 0, 0, 0);

        //        var data = new Date(firstDate.getFullYear(), firstDate.getUTCMonth(), firstDate.getUTCDate());
        //        data.setHours(21);
        //        var data = firstDate.getTime() / 1000;

        var Calendar = Parse.Object.extend("Calendar");
        var queryCal = new Parse.Query(Calendar);
        $scope.showDate = $(this).val();
        queryCal.greaterThanOrEqualTo("DateUTC", firstDate);
        queryCal.lessThanOrEqualTo("DateUTC", secDate);
        queryCal.equalTo('ReceiverId', $scope.currentUser.id);
        queryCal.find({
            success: function (bookings) {
                $scope.theBooking = [];

                if (bookings.length == 0) {
                    $scope.noBookings = "Uzsakymu sia data nera"
                } else {


                }
                $scope.$apply();
            }

        });
    }
    $ionicModal.fromTemplateUrl('app/modals/theBooking.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.theModal = modal;
    });
    $ionicModal.fromTemplateUrl('app/modals/ghostFromCalendar.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.ghostModal = modal;
    });

    function getLasMessage() {
        var MessagesAll = Parse.Object.extend("Messages");
        var messages = new MessagesAll();

        var query = new Parse.Query(MessagesAll);
        query.equalTo("Verslauk", $scope.currentUser.id);
        query.descending("updatedAt");
        query.limit(1);
        query.find({
            success: function (results) {
                //                $scope.theLastMessage = results[0].attributes;

            },
            error: function (error) {

            }
        });
    }
    getLasMessage();

    function getFormattedDate(date) {

        var year = date.getFullYear();
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;

        return month + '/' + day + '/' + year;
    }

    var currentdate = new Date();
    var formattedDate = getFormattedDate(currentdate);
    $scope.formattedDate = formattedDate;


    var getComingReserv = function () {


        var hour = currentdate.getHours();

        //        var minutes = currentdate.getMinutes();
        //        var minuteChecker = hour + ":" + minutes



        var Calendar = Parse.Object.extend("Calendar");
        var queryCal = new Parse.Query(Calendar);
        queryCal.ascending("Date");
        queryCal.greaterThanOrEqualTo("Date", formattedDate);
        queryCal.equalTo('ReceiverId', $scope.currentUser.id);
        queryCal.limit(2);
        queryCal.find({
            success: function (obj) {
                if (obj.length == 0) {

                } else if (obj[0].attributes.Date == formattedDate) {

                    var ab = hour - 7;
                    var bc = (ab * 2) + 1;

                    for (key in obj[0].attributes.TimeSched) {
                        if (obj[0].attributes.TimeSched[key].registeredService.doing && obj[0].attributes.TimeSched[key].id > bc) {
                            $scope.upcomingReserv = obj[0].attributes.TimeSched[key]
                            return
                        } else {

                        }

                    }
                    if (!$scope.upcomingReserv) {
                        for (key in obj[1].attributes.TimeSched) {
                            if (obj[1].attributes.TimeSched[key].registeredService.doing) {
                                $scope.upcomingResDate = obj[1].attributes.Date;
                                $scope.upcomingReserv = obj[1].attributes.TimeSched[key]

                                return
                            } else {

                            }

                        }
                    }
                } else {
                    for (key in obj[0].attributes.TimeSched) {
                        if (obj[0].attributes.TimeSched[key].registeredService.doing) {
                            $scope.upcomingResDate = obj[0].attributes.Date;
                            $scope.upcomingReserv = obj[0].attributes.TimeSched[key]

                            return
                        } else {

                        }

                    }
                }

            }
        })
    }
    getComingReserv();
    var Booking = Parse.Object.extend("Booking");
    var query = new Parse.Query(Booking);
    query.equalTo("Sender", $scope.currentUser);
    query.descending("Date");
    var getReservations = function () {
        query.find({
            success: function (comments) {
                $scope.myReservations = comments;
                $scope.$apply();

            }
        });
    };
    getReservations();


    var getBookings = function () {
        var queryBuss = new Parse.Query(Booking);
        queryBuss.equalTo("ReceiverId", $scope.currentUser.id);
        queryBuss.find({
            success: function (comments) {
                $scope.myBookings = comments;
                $scope.$apply();



            }
        });
    }
    getBookings();

    $scope.cancelReserv = function (object) {

        var Calendar = Parse.Object.extend("Calendar");
        var queryCal = new Parse.Query(Calendar);
        queryCal.equalTo('ReceiverId', $scope.currentUser.id);
        queryCal.equalTo("Date", $scope.showDate);

        queryCal.find({
            success: function (response) {

                var newTimeSched = response[0].attributes.TimeSched;
                newTimeSched[object].declined = true;
                response[0].set('TimeSched', newTimeSched);
                response[0].save();

            }
        });
    };
    $scope.cancelReservBook = function (object) {


        var Calendar = Parse.Object.extend("Calendar");
        var queryCal = new Parse.Query(Calendar);
        queryCal.equalTo('ReceiverId', object.attributes.ReceiverId);
        queryCal.equalTo("Date", object.attributes.Date);
        var to = parseInt(object.attributes.ReservServic[0].duration) + object.attributes.TimeSched.id

        queryCal.find({
            success: function (response) {

                var newTimeSched = response[0].attributes.TimeSched;
                for (i = object.attributes.TimeSched.id; i < to; i++) {

                    newTimeSched[i].registeredService = {};
                    newTimeSched[i].userInfo = {};
                    newTimeSched[i].availability = true;
                }
                response[0].set('TimeSched', newTimeSched);
                response[0].save();
            }
        });
        object.destroy();

    };



    $scope.deleteObject = function (object) {

    }

    //    $scope.declineReserv = function (object) {
    //        object.destroy({
    //            success: function (myObject) {
    //                alert('Rezervacija atsaukta');
    //
    //                getBookings();
    //            },
    //            error: function (myObject, error) {
    //                alert('Rezervacijos atsaukti nepavyko');
    //            }
    //
    //        });
    //    }
    $scope.openPendingReservation = function (reservation) {

        $scope.reservFor = reservation;
        $scope.reservation = reservation;
        $scope.reservation.duration = 0;
        $scope.reservation.price = 0;
        $scope.reservation.from = reservation.attributes.TimeObject.time.time;

        for (i = 0; i < reservation.attributes.TimeObject.service.length; i++) {
            $scope.reservation.price = $scope.reservation.price + reservation.attributes.TimeObject.service[i].price;
            $scope.reservation.duration = $scope.reservation.duration + parseInt(reservation.attributes.TimeObject.service[i].duration);
        }
        $scope.reservation.to = Times[reservation.attributes.TimeObject.time.id + $scope.reservation.duration].time;
        $scope.preModal.show();

    };

    $scope.acceptReservation = function () {
        var reservation = $scope.reservation;
        var Calendar = Parse.Object.extend("Calendar");
        var calendar = new Parse.Query(Calendar);
        var firstDate = new Date(reservation.attributes.DateUTC);
        firstDate.setHours(0, 0, 0, 0);
        var secDate = new Date(reservation.attributes.DateUTC);
        secDate.setHours(23, 0, 0, 0);
        //        calendar.equalTo("DateUTC", reservation.attributes.DateUTC);
        calendar.greaterThanOrEqualTo("DateUTC", firstDate);
        calendar.lessThanOrEqualTo("DateUTC", secDate);
        calendar.find({
            success: function (results) {

                if (results.length === 0) {
                    var theTimes = Times;
                    var indexOfReserv = reservation.attributes.TimeObject.time.id;
                    var durationOfServices = 0;
                    for (i = 0; i < reservation.attributes.TimeObject.service.length; i++) {
                        durationOfServices = durationOfServices + parseInt(reservation.attributes.TimeObject.service[i].duration);
                    }
                    for (k = indexOfReserv; k < indexOfReserv + durationOfServices; k++) {
                        theTimes[k].registeredService = reservation.attributes.TimeObject.service;
                        theTimes[k].registeredService = reservation.attributes.TimeObject.service;
                        theTimes[k].availability = false;
                        theTimes[k].userInfo = reservation.attributes.UserObject;
                    }

                    var timesVienas = angular.toJson(theTimes);
                    var timesDu = angular.fromJson(timesVienas);

                    var Calendar = Parse.Object.extend("Calendar");
                    var calendar = new Calendar();

                    calendar.set("ReceiverId", reservation.attributes.ReceiverId);
                    calendar.set("ReceiverPic", reservation.attributes.ReceiverPic);
                    calendar.set("TimeSched", timesDu);
                    calendar.set("DateUTC", reservation.attributes.DateUTC);

                    calendar.save(null, {
                        success: function (gameScore) {








                            var Point = Parse.Object.extend("PreBooking");
                            var point = new Parse.Query(Point);

                            //                            point.equalTo("objectId", reservation.id);

                            // Set a new value on quantity
                            //                            point.set("Status", "accepted");

                            // Save
                            point.get(reservation.id, {
                                success: function (point) {

                                    point.set("Status", "accepted");
                                    point.save();
                                    var index = $scope.pendingRequests.indexOf(reservation);
                                    $scope.pendingRequests.splice(index, 1);
                                    $scope.$apply();
                                },
                                error: function (point, error) {

                                }
                            });
                        },
                        error: function (gameScore, error) {
                            // Execute any logic that should take place if the save fails.
                            // error is a Parse.Error with an error code and message.
                            alert('Failed to create new object, with error code: ' + error.message);
                        }
                    });
                } else {
                    var theTimes = results[0].attributes.TimeSched;
                    var indexOfReserv = reservation.attributes.TimeObject.time.id;
                    var durationOfServices = 0;
                    for (i = 0; i < reservation.attributes.TimeObject.service.length; i++) {
                        durationOfServices = durationOfServices + parseInt(reservation.attributes.TimeObject.service[i].duration);
                    }
                    for (k = indexOfReserv; k < indexOfReserv + durationOfServices; k++) {
                        theTimes[k].registeredService = reservation.attributes.TimeObject.service;
                        theTimes[k].registeredService = reservation.attributes.TimeObject.service;
                        theTimes[k].availability = false;
                        theTimes[k].userInfo = reservation.attributes.UserObject;
                    }

                    results[0].set("TimeSched", theTimes);
                    results[0].save();
                }

            },
            error: function (error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    };

    //    $scope.acceptReserv = function (object) {
    //        var timeObject = {
    //            time: object.attributes.TimeSched,
    //            service: object.attributes.ReservServic[0]
    //        }
    //        for (key in $scope.times) {
    //            if ($scope.times[key].time == timeObject.time.time) {
    //                for (i = 0; i < timeObject.service.duration; i++) {
    //                    var theNum = parseInt(key) + parseInt(i);
    //                    $scope.times[theNum].availability = false;
    //                    $scope.times[theNum].registeredService = timeObject.service;
    //                }
    //            }
    //        }

    //
    //        var Calendar = Parse.Object.extend("Calendar");
    //        var calendar = new Calendar();
    //
    //        var query = new Parse.Query(Calendar);
    //        query.equalTo("Date", object.attributes.Date);
    //        query.equalTo("User", $scope.currentUser);
    //        query.find({
    //            success: function (results) {
    //               
    //                if (results.length == 0) {
    //                  
    //                    calendar.set('Date', object.attributes.Date);
    //                    calendar.set("Times", $scope.times);
    //                    calendar.set('User', $scope.currentUser);
    //                    calendar.save(null, {
    //                        success: function (gameScore) {
    //                            alert('Jusu uzsakymas issaugotas su id: ' + gameScore.id);
    //                            $state.go('app.home');
    //                        },
    //                        error: function (gameScore, error) {
    //                            alert('Failed to create new object, with error code: ' + error.message);
    //                        }
    //                    });
    //                } else {
    //
    //                    $scope.times = results[0].attributes.Times;
    //                    for (key in $scope.times) {
    //                        if ($scope.times[key].time == timeObject.time.time) {
    //                            for (i = 0; i < timeObject.service.duration; i++) {
    //                                var theNum = parseInt(key) + parseInt(i);
    //                                $scope.times[theNum].availability = false;
    //                                $scope.times[theNum].registeredService = timeObject.service;
    //                            }
    //                        }
    //                    }
    //                    results[0].set("Times", $scope.times);
    //                    results[0].save({
    //                        success: function (res) {
    //                           
    //                        }
    //                    });
    //                }
    //
    //            },
    //            error: function (error) {
    //                alert("Error: " + error.code + " " + error.message);
    //            }
    //        });
    //
    //        //        calendar.set("Date", object.attributes.Date);
    //        //        calendar.add("Times", timeObject);
    //        //
    //        //
    //        //        gameScore.save(null, {
    //        //            success: function (gameScore) {
    //        //                // Execute any logic that should take place after the object is saved.
    //        //                alert('New object created with objectId: ' + gameScore.id);
    //        //            },
    //        //            error: function (gameScore, error) {
    //        //                // Execute any logic that should take place if the save fails.
    //        //                // error is a Parse.Error with an error code and message.
    //        //                alert('Failed to create new object, with error code: ' + error.message);
    //        //            }
    //        //        });
    //    }
    $scope.check = function () {

    }
    $scope.deleteAllBookings = function () {
        var Calendar = Parse.Object.extend("Calendar");
        var calendar = new Calendar();

        var query = new Parse.Query(Calendar);

        query.find({
            success: function (results) {

                results.forEach(function (user) {
                    user.destroy({
                        success: function () {
                            // SUCCESS CODE HERE, IF YOU WANT
                        },
                        error: function () {
                            // ERROR CODE HERE, IF YOU WANT
                        }
                    });
                });
            },
            error: function (error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    }
    $scope.goToMessages = function (user) {
        //        var customerData = currentUser.get('data');

        //        var channel = $scope.theUser.id + "--" + currentUser.id;
        var channel = $scope.currentUser.id + "--" + user.userId;

        var Messages = Parse.Object.extend("Messages");




        var queryMess = new Parse.Query(Messages);
        queryMess.equalTo("Channel", channel);
        queryMess.find({
            success: function (mess) {
                if (mess.length == 0) {
                    var messages = new Messages();


                    messages.set("Verslauk", $scope.currentUser.id);
                    messages.set("Customer", user.userId);
                    messages.set("VerslaukName", currData.name);
                    messages.set("CustomerName", user.userName);
                    messages.set("VerslaukPic", currPic._url);
                    messages.set("CustomePic", user.userPic._url);
                    messages.set("Channel", channel);


                    messages.save(null, {
                        success: function (gameScore) {
                            // Execute any logic that should take place after the object is saved.

                            $state.go('app.customerMessages');
                        },
                        error: function (gameScore, error) {
                            // Execute any logic that should take place if the save fails.
                            // error is a Parse.Error with an error code and message.
                            alert('Failed to create new object, with error code: ' + error.message);
                        }
                    });
                } else {

                    mess[0].set("Channel", channel);
                    mess[0].save();
                    $state.go('app.customerMessages');

                }
            }
        });
    }

    $scope.logOut = function () {
        Parse.User.logOut();
        $state.go("app.home");
    }
    $scope.goToMessages = function () {
        $state.go('app.messages')
    }
    $scope.goToRegisterService = function () {
        $state.go('app.registerservice')
    }

    $scope.goToMessagesAs = function (user) {

        //        var customerData = currentUser.get('data');
        //        var customerPic = currentUser.get('profilePhoto')
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
        //                            alert('New object created with objectId: ' + gameScore.id);
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
    }
    $ionicModal.fromTemplateUrl('app/modals/ghostBook.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $ionicModal.fromTemplateUrl('app/modals/preBooking.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.preModal = modal;
    });
    $scope.monthNames = ['Sausis', 'Vasaris', 'Kovas', 'Balandis', 'Gegužė', 'Birželis',
            'Liepa', 'Rugpjūtis', 'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis']
    $scope.addGhostReserv = function () {
        $scope.modal.show();


        $("#datepickerGhost").datepicker({
            inline: true,
            showOtherMonths: true,
            dayNamesMin: ['Se', 'Pi', 'An', 'Tr', 'Ke', 'Pe', 'Še'],
            monthNames: $scope.monthNames,
            monthNamesShort: ['Sau', 'Vas', 'Kov', 'Bal', 'Geg', 'Bir',
            'Lie', 'Rugpj', 'Rugsej', 'Spa', 'Lap', 'Gru'],
            minDate: 0,
            firstDay: 1,
            onSelect: getAvailableTimes,
        });



        function getAvailableTimes(dat) {

            $scope.selectedDate = dat;
            var Calendar = Parse.Object.extend("Calendar");
            var query = new Parse.Query(Calendar);
            query.equalTo("Date", dat);
            query.equalTo("ReceiverId", $scope.currentUser.id);
            query.find({
                success: function (response) {
                    if (response.length != 0) {

                        $scope.times = response[0].attributes.TimeSched

                    } else(
                        $scope.times = Times
                    )
                    $scope.$apply();
                }
            })


        }
    }
    $scope.registerGhostService = function () {

        var Calendar = Parse.Object.extend("Calendar");
        var calendar = new Calendar();
        var query = new Parse.Query(Calendar);
        query.equalTo("Date", $scope.selectedDate);
        query.equalTo("ReceiverId", $scope.currentUser.id);
        query.find({
            success: function (response) {
                if (response.length != 0) {
                    for (i = $scope.selectedGhostTime; i < $scope.selectedGhostTime + parseInt($scope.registeredService.duration); i++) {
                        response[0].attributes.TimeSched[i].availability = false;
                        response[0].attributes.TimeSched[i].registeredService = $scope.registeredService;
                        response[0].attributes.TimeSched[i].userInfo = $scope.userInfo;
                        response[0].save();
                    }
                } else {

                    for (i = $scope.selectedGhostTime; i < $scope.selectedGhostTime + parseInt($scope.registeredService.duration); i++) {
                        $scope.times[i].availability = false;
                        $scope.times[i].registeredService = $scope.registeredService;
                        $scope.times[i].userInfo = $scope.userInfo;
                    }

                    calendar.set('Date', $scope.selectedDate);
                    calendar.set("TimeSched", $scope.times);
                    //                    calendar.set('ReservServic', reservService)
                    calendar.set('ReceiverId', $scope.currentUser.id);
                    //                    calendar.set('ReceiverEmail', $scope.theUser.attributes.email);
                    //                    calendar.set("Sender", currentUser);
                    //                    calendar.set('ReceiverPic', $scope.profilePic)
                    calendar.save(null, {
                        success: function (gameScore) {

                            alert('Jusu uzsakymas issaugotas su id: ' + gameScore.id);


                        },
                        error: function (gameScore, error) {
                            alert('Failed to create new object, with error code: ' + error.message);
                        }
                    });

                }
                var Booking = Parse.Object.extend("Booking");
                var myBooking = new Booking();

                myBooking.set("Date", $scope.selectedDate);
                myBooking.set('ReceiverId', $scope.currentUser.id);
                myBooking.set('ReceiverEmail', $scope.currentUser.attributes.email);



                myBooking.save(null, {
                    success: function (gameScore) {
                        // Execute any logic that should take place after the object is saved.
                        $scope.modal.hide();

                        $state.go('app.home')
                    },
                    error: function (gameScore, error) {
                        // Execute any logic that should take place if the save fails.
                        // error is a Parse.Error with an error code and message.
                        alert('Failed to create new object, with error code: ' + error.message);
                    }
                });
            }
        })
    }
    $scope.selectGhostTime = function (time) {
        $scope.selectedGhostTime = time;
    }
    $scope.cloudTest = function () {
        $scope.currentUser.destroy({
            success: function (aaa) {

            }
        })
    }

    var CompanyReq = Parse.Object.extend("PendingCompanyRequest");
    var companyReq = new Parse.Query(CompanyReq);


    companyReq.equalTo("Specialist", $scope.currentUser.get('username'));
    companyReq.find({
        success: function (results) {
            if (results.length > 0) {
                $scope.pendingCompanyRequest = results;

            }
        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
    $scope.cancelRequest = function (request) {

        var index = $scope.pendingCompanyRequest.indexOf(request);
        $scope.pendingCompanyRequest.splice(index, 1);
        request.destroy();
    }
    $scope.acceptRequest = function (request) {
        var user = $scope.currentUser;
        user.set('companyId', request.attributes.CompanyId);
        user.save(null, {
            success: function (gameScore) {
                var index = $scope.pendingCompanyRequest.indexOf(request);
                $scope.pendingCompanyRequest.splice(index, 1);
                request.destroy();

            },
            error: function (gameScore, error) {
                // Execute any logic that should take place if the save fails.
                // error is a Parse.Error with an error code and message.
                alert('Failed to create new object, with error code: ' + error.message);
            }
        });
    };

    function pendingRequests() {
        var GameScore = Parse.Object.extend("PreBooking");
        var query = new Parse.Query(GameScore);
        query.equalTo("ReceiverId", $scope.currentUser.id);
        query.equalTo("Status", "Nepatvirtintas");
        query.find({
            success: function (results) {
                $scope.pendingRequests = results;

            },
            error: function (error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    }
    pendingRequests();


    //----------------Martyno---------------------
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
        var user_q = new Parse.Query(User).equalTo("companyId", company_id);

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
    function _addFreeToCalendarsByCompanyId(company_id, from, to, calendar, callback) {

        var User = Parse.Object.extend("_User");
        //        pakeist kad butu poto imonem
        var user_q = new Parse.Query(User).equalTo("companyId", company_id);
        //        var user_q = new Parse.Query(User).equalTo("objectId", $scope.id);
        user_q.notEqualTo("isItCompany", true);
        //        user_q.containedIn("subServicesForSearch", $scope.selectedServicesForSearch)
        user_q.find({
            success: function (results) {

                calendar = _addFreeToCalendarsByCompanyIdCallback(results, calendar);
                getCalendarFromUsers(results, from, to);
                if (typeof callback !== "undefined") {
                    callback(calendar);
                }
            },
        });
    }

    function _addFreeToCalendarsByCompanyIdCallback(results, calendar) {

        var users = [];
        for (user in results) {
            users[users.length] = results[user].attributes;
        }


        return

        for (day in calendar) {
            for (time in calendar[day]) {
                if (calendar[day][time].availability === true) {
                    // add user as available if user works on that day of
                    // week and time slot is within working hours
                    var date = new Date(day * 1);
                    var dow = _getDayOfWeek(date);
                    calendar[day][time].availableUsers = [];
                    for (var u = 0; u < users.length; ++u) {
                        if (users[u].WorkingDaysTimes[dow].working === true &&
                            _userWorksAtTime(users[u], dow, calendar[day][time].time)
                        ) {

                            var l = calendar[day][time].availableUsers.length;
                            calendar[day][time].availableUsers[l] = users;
                        }
                    }

                    //                    if (calendar[day][time].availableUsers.length === 0) {
                    //                        calendar[day][time].availability = true;
                    //                    }
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
                    _addFreeToCalendarsByCompanyId(company_id, from, to, calendar, callback);
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
    //--------------Martyno galas ----------------------

    function testComapny(date) {
        var data = new Date(date);
        //        data.setHours(0, 0, 0, 0);

        //        secDate.setHours(0, 0, 0, 0);


        $scope.selectedDate = data;

        getCalendarForCompanyByDate($scope.currentUser.attributes.companyId, data, data, theCallback);
        $scope.dateSelection = date;
        $('#loadingCompCal').waitMe({
            effect: 'bounce',
            text: '',


        });
    }
    testComapny(currentdate);

    function theCallback(result) {

        $scope.calendarInfo = [];
        for (key in result) {
            var object = {
                top: {},
                bott: {},

            };
            var date = new Date(key * 1);
            object.top.day = date.getDay();
            object.top.date = date.getDate();
            object.top.month = date.getMonth();
            object.bott = result[key];
            for (i = 1; i < result[key].length; i++) {
                var serviceDuration = 0;
                var skipper = 0;
                if (result[key][i].registeredService.length > 0) {
                    for (b in result[key][i].registeredService) {
                        serviceDuration = parseInt(result[key][i].registeredService[b].duration) + serviceDuration;
                    }

                    for (c = i; c < i + serviceDuration; c++) {
                        if (c === i && c === i + serviceDuration - 1) {
                            result[key][c].cssClass = 'Only'
                        } else if (c === i) {
                            result[key][c].cssClass = 'First'

                        } else if (c === i + serviceDuration - 1) {
                            result[key][c].cssClass = 'Last'

                            skipper = c;
                        } else {
                            result[key][c].cssClass = 'Middle'

                        }

                    }

                    i = i + serviceDuration - 1;
                }

            }
            $scope.calendarInfo.push(object);

        }

        $scope.$apply();
        $('#loading').hide();
    }
    $scope.dayNames = ['Sekmadienis', 'Pirmadienis', 'Antradienis', 'Trečiadienis', 'Ketvirtadienis', 'Penktadienis', 'Šeštadienis'];
    $scope.showOrder = function (order) {

    }

    //    $scope.addNewSpecialist = function () {
    //        var myPopup = $ionicPopup.show({
    //            template: '<input type="text" ng-model="specialistEmail.email">',
    //            title: 'Įveskite specialisto elektroninį paštą',
    //            scope: $scope,
    //            buttons: [
    //                {
    //                    text: 'Atgal'
    //                },
    //                {
    //                    text: '<b>Siųsti</b>',
    //                    type: 'button-positive',
    //                    onTap: function (e) {
    //
    //                        if (!$scope.specialistEmail.email) {
    //                            //don't allow the user to close unless he enters wifi password
    //
    //                            e.preventDefault();
    //                        } else {
    //                            var query = new Parse.Query(Parse.User);
    //                            query.equalTo("username", $scope.specialistEmail.email);
    //                            query.find({
    //                                success: function (result) {
    //
    //                                    if (result.length == 0) {
    //
    //                                        var alertPopup = $ionicPopup.alert({
    //                                            title: 'Nėra tokio specialisto',
    //                                            template: 'Patikrinkite įvestą elektroninio pašto adresą ir bandykite dar kartą'
    //                                        });
    //                                    } else {
    //                                        var Request = Parse.Object.extend("PendingCompanyRequest");
    //                                        var request = new Request();
    //                                        request.set("Company", $scope.username);
    //                                        request.set("CompanyId", $scope.currentUser.attributes.companyId);
    //                                        request.set("Specialist", result[0].attributes.username);
    //                                        request.set("CompanyName", $scope.currentUser.attributes.data.name);
    //
    //                                        request.set("CompanyPic", $scope.currentUser.attributes.profilePhoto)
    //
    //                                        request.save(null, {
    //                                            success: function (gameScore) {
    //                                                var alertPopup = $ionicPopup.alert({
    //                                                    title: 'Kvietimas nusiųstas',
    //                                                    template: 'Kai specialistas patvirtins, pranešime Jums elektroniniu paštu'
    //                                                });
    //                                            },
    //                                            error: function (gameScore, error) {
    //                                                // Execute any logic that should take place if the save fails.
    //                                                // error is a Parse.Error with an error code and message.
    //                                                alert('Failed to create new object, with error code: ' + error.message);
    //                                            }
    //                                        });
    //
    //                                    }
    //
    //                                }
    //                            });
    //
    //                        }
    //                    }
    //      }
    //    ]
    //        });
    //
    //    };
    function getCalendarFromUsers(users, from, to) {

        var someUsers = users;
        var firstDate = new Date(from);
        var secDate = new Date(to);
        firstDate.setHours(0, 0, 0, 0);
        secDate.setHours(23, 0, 0, 0);
        var ids = [];
        for (i = 0; i < users.length; i++) {
            ids.push(users[i].id);
        }


        var GameScore = Parse.Object.extend("Calendar");
        var query = new Parse.Query(GameScore);
        query.containedIn("ReceiverId", ids);
        query.greaterThanOrEqualTo("DateUTC", firstDate);
        query.lessThanOrEqualTo("DateUTC", secDate);

        query.find({
            success: function (results) {
                aaaaa(results, users);

            },
            error: function (error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });





    }

    function idFromTo(from, to) {
        var arr = [];
        var pir = from.split(":");
        var pirm = (parseInt(pir[0]) - 7) * 2 + 1;
        if (pir[1] == "30") {
            pirm++;
        }
        arr.push(pirm);
        var ant = to.split(":");
        var antr = (parseInt(ant[0]) - 7) * 2 + 1;
        if (ant[1] == "30") {
            antr++;
        }
        arr.push(antr);
        return arr;
    }


    function aaaaa(results, users) {
        for (i = 0; i < users.length; i++) {
            var diena = $scope.selectedDate.getDay();

            var te = idFromTo(users[i].attributes.WorkingDaysTimes[diena].hourFrom, users[i].attributes.WorkingDaysTimes[diena].hourTo);
            users[i].notWorking = te;
            for (k = 0; k < results.length; k++) {

                if (users[i].id == results[k].attributes.ReceiverId) {
                    users[i].theTimes = results[k].attributes;

                    for (d = 1; d < Object.keys(users[i].theTimes.TimeSched).length; d++) {
                        //                        console.log(Object.keys(users[i].theTimes.TimeSched).length)
                        var serviceDuration = 0;
                        var skipper = 0;



                        if (users[i].theTimes.TimeSched[d].registeredService.length > 0) {

                            var date = new Date(users[i].theTimes.DateUTC)
                            for (b = 0; b < users[i].theTimes.TimeSched[d].registeredService.length; b++) {
                                serviceDuration = parseInt(users[i].theTimes.TimeSched[d].registeredService[b].duration) + serviceDuration;
                            }

                            for (z = d; z < d + serviceDuration; z++) {
                                //

                                if (date.getDay() == new Date().getDay() && new Date().getTime() - date.getTime() < 72000000) {
                                    users[i].theTimes.TimeSched[z].totalClass = "outdatedToday"
                                } else if (new Date(date).getTime() < new Date().getTime()) {
                                    users[i].theTimes.TimeSched[d].totalClass = "outdated"
                                }
                                if (z == d && z == d + serviceDuration - 1) {
                                    users[i].theTimes.TimeSched[d].cssClass = 'Only'
                                } else if (z == d) {
                                    users[i].theTimes.TimeSched[d].cssClass = 'First'
                                } else {
                                    users[i].theTimes.TimeSched[z].cssClass = 'Middle'
                                }
                            }

                            d = parseInt(d) + serviceDuration - 1;

                        }

                    }
                }
            }


        }
        var currHour = new Date().getHours();
        $scope.timeId = (currHour - 7) * 2 + 1;
        var currMin = new Date().getMinutes();
        if (currMin >= 30) {
            $scope.timeId++
        }
        $scope.currentDay = new Date($scope.selectedDate).getDay();
        console.log($scope.currentDay)
        $scope.companyUsers = users;
        $scope.$apply();
        $('#loadingCompCal').waitMe('hide');

        console.log($scope.companyUsers)
    }




    $scope.showAcceptedReservation = function (reservation, date, id) {
        $scope.reservFor = reservation;
        $scope.acceptedReservation = reservation;


        $scope.acceptedReservation.duration = 0;
        $scope.acceptedReservation.price = 0;
        $scope.acceptedReservation.from = reservation.time;
        $scope.acceptedReservation.fullDate = $scope.selectedDate;
        for (i = 0; i < reservation.registeredService.length; i++) {
            $scope.acceptedReservation.price = $scope.acceptedReservation.price + reservation.registeredService[i].price;
            $scope.acceptedReservation.duration = $scope.acceptedReservation.duration + parseInt(reservation.registeredService[i].duration);
        }
        $scope.acceptedReservation.to = Times[reservation.id + $scope.acceptedReservation.duration].time;
        $scope.acceptedReservation.userId = id;
        $scope.theModal.show();


    }
    $scope.selectedGhostCalendar = {
        cell: {},
        calendar: {
            ReceiverId: ""
        }
    };
    $scope.addGhostFromCalendar = function (calendar, cell, id) {
        console.log(calendar)
        $scope.maxDuration = 0;
        for (i = cell.id; i < 32; i++) {
            if ($scope.maxDuration == 4) {
                break;
            } else if (calendar[i].availability) {
                $scope.maxDuration++
            } else {
                break;
            }
        }

        $scope.selectedGhostCalendar.calendar = calendar;
        $scope.selectedGhostCalendar.id = id;
        $scope.selectedGhostCalendar.cell = cell;

        $scope.ghostModal.show();
    }
    $scope.ghostCalendarObj = {};
    $scope.registerGhostServiceCalendar = function () {


        var registeredService = [];
        var smallObj = {
            name: $scope.ghostCalendarObj.service,
            duration: $scope.ghostCalendarObj.duration,
            time: '30',
            doing: true,
            price: '0',
        };
        var userObj = {
            userName: $scope.ghostCalendarObj.name,
            userId: 'ghost',
            userTel: $scope.ghostCalendarObj.tel,
            userEmail: 'Nėra'
        }
        registeredService.push(smallObj);

        var dateForQuery = new Date($scope.dateSelection);
        dateForQuery.setHours(3);
        var secDateForQuery = new Date($scope.dateSelection);
        secDateForQuery.setHours(23);
        console.log($scope.selectedGhostCalendar)
            //console.log($scope.selectedGhostCalendar)
        var Calendar = Parse.Object.extend("Calendar");
        var calendar = new Calendar();
        var query = new Parse.Query(Calendar);
        query.greaterThanOrEqualTo("DateUTC", dateForQuery);
        query.lessThanOrEqualTo("DateUTC", secDateForQuery);
        if ($scope.selectedGhostCalendar.calendar.ReceiverId) {
            query.equalTo("ReceiverId", $scope.selectedGhostCalendar.calendar.ReceiverId);
        } else {
            query.equalTo("ReceiverId", $scope.selectedGhostCalendar.id)
        }

        query.first({
            success: function (response) {

                if (!response) {

                    for (i = $scope.selectedGhostCalendar.cell.id; i < $scope.selectedGhostCalendar.cell.id + parseInt($scope.ghostCalendarObj.duration); i++) {

                        $scope.selectedGhostCalendar.calendar[i].availability = false;
                        $scope.selectedGhostCalendar.calendar[i].registeredService = registeredService;
                        $scope.selectedGhostCalendar.calendar[i].userInfo = userObj;
                    }
                    //                    console.log($scope.selectedGhostCalendar.calendar)
                    //                    var timesched = toObject($scope.selectedGhostCalendar.calendar);
                    //                    console.log(timesched)
                    //                    var timeschedOne = angular.toJson(timesched);
                    var timeschedTwo = angular.copy($scope.selectedGhostCalendar.calendar);


                    //                    var Ghost = Parse.Object.extend("Calendar");
                    //                    var ghost = new Ghost();
                    dateForQuery.setHours(4);

                    Parse.Cloud.run('createCal', {
                        date: dateForQuery,
                        ReceiverId: $scope.selectedGhostCalendar.id,
                        TimeSched: timeschedTwo


                    }).then(function (ratings) {
                            console.log(ratings)
                            testComapny($scope.selectedDate);
                            $scope.ghostModal.hide();
                        },
                        function (error) {
                            console.log(error)
                            response.error("Error occurred: " + error.message);
                        });

                    //                    ghost.set("DateUTC", dateForQuery);
                    //                    ghost.set("ReceiverId", $scope.selectedGhostCalendar.id);
                    //
                    //                    if ($scope.currentUser.attributes.profilePhoto) {
                    //                        ghost.set("ReceiverPic", $scope.currentUser.attributes.profilePhoto._url);
                    //                    }
                    //                    ghost.set("TimeSched", timeschedTwo);
                    //
                    //                    ghost.save(null, {
                    //                        success: function (gameScore) {
                    //
                    //                            alert('New object created with objectId: ' + gameScore.id);
                    //                        },
                    //                        error: function (gameScore, error) {
                    //                            console.log(error)
                    //                            alert('Failed to create new object, with error code: ' + error.message);
                    //                        }
                    //                    });
                    //                    $scope.ghostModal.hide();
                    //                    $state.go($state.current, {}, {
                    //                        reload: true
                    //                    });
                } else {

                    $ionicLoading.show();
                    $scope.ghostModal.hide();
                    console.log('a')
                    for (i = $scope.selectedGhostCalendar.cell.id; i < $scope.selectedGhostCalendar.cell.id + parseInt($scope.ghostCalendarObj.duration); i++) {

                        response.attributes.TimeSched[i].availability = false;
                        response.attributes.TimeSched[i].registeredService = registeredService;
                        response.attributes.TimeSched[i].userInfo = userObj;
                    }
                    //                    var timesched = toObject($scope.ghostCalendarInfo[0].bott);
                    //                    var timeschedOne = angular.toJson(timesched);
                    //                    var timeschedTwo = angular.fromJson(timeschedOne);
                    Parse.Cloud.run('updateCal', {
                        sched: response.attributes.TimeSched,
                        id: response.id,
                        rId: response.attributes.ReceiverId

                    }).then(function (ratings) {
                            $ionicLoading.hide();
                            testComapny($scope.selectedDate);
                            $scope.ghostModal.hide();
                        },
                        function (error) {
                            console.log(error)
                            response.error("Error occurred: " + error.message);
                        });
                    //                    response.set('TimeSched', response.attributes.TimeSched);

                    //                    response.save(null, {
                    //                        success: function (gameScore) {
                    //                            $ionicLoading.hide();
                    //                            alert('New object created with objectId: ' + gameScore.id);
                    //
                    //                            $state.go($state.current, {}, {
                    //                                reload: true
                    //                            });
                    //                        },
                    //                        error: function (gameScore, error) {
                    //                            $ionicLoading.hide();
                    //                            console.log(error)
                    //                            alert('Failed to create new object, with error code: ' + error.message);
                    //                        }
                    //                    });

                }


            }
        })
        $state.go($state.current, {}, {
            reload: true
        });
    }

    function toObject(arr) {
        var rv = {};
        for (var i = 1; i <= arr.length; ++i)
            rv[i] = arr[i];
        return rv;
    }
    $scope.cancelReqCalendar = function (booking, id) {
        console.log(booking)
        var date = booking.fullDate;
        var reveiverId = id

        var from = booking.id;
        var to = booking.id + booking.duration;
        Parse.Cloud.run('cancelByUser', {
            date: date,
            receiverId: booking.userId,
            from: from,
            to: to,

        }).then(function (ratings) {
                testComapny($scope.selectedDate)
                $scope.theModal.hide();
            },
            function (error) {
                $scope.theModal.hide();
                testComapny($scope.selectedDate)
                console.log(error)

            });


    }
    $scope.moveForward = function () {
        var to = $scope.companyUsers.length - 1
        arraymove($scope.companyUsers, 0, to)
        $scope.$apply()
    }
    $scope.moveBack = function () {
        var to = $scope.companyUsers.length - 1
        arraymove($scope.companyUsers, to, 0)
        $scope.$apply()
    }

    function arraymove(arr, fromIndex, toIndex) {
        var element = arr[fromIndex];
        arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, element);
    }
})

.filter("toArray", function () {
    return function (obj) {
        var result = [];
        angular.forEach(obj, function (val, key) {
            result.push(val);
        });
        return result;
    };
});