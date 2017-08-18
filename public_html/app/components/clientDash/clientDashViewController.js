angular.module('tyList.clientDash', ['tyList.service'])

.controller('clientDashViewController', function ($scope, $ionicModal, $ionicPopup, $state, Times, $ionicLoading, $stateParams, $http) {
    var currentUser = Parse.User.current();
    $scope.currentUser = Parse.User.current();
    if (currentUser) {
        $scope.theUser = currentUser.attributes;

        $scope.profilePic = currentUser.get("profilePhoto");
        console.log(currentUser.attributes)
        console.log($scope.profilePic)

    } else {
        alert("You are not signed in");
    }
    $scope.getAllBookings = function () {
        document.getElementById("allBookings").classList.add('clbuttonactive');
        document.getElementById("allBookings").classList.remove('clbutton');
        document.getElementById("futureBookings").classList.remove('clbuttonactive');
        document.getElementById("futureBookings").classList.add('clbutton');
        document.getElementById("favorites").classList.remove('clbuttonactive');
        document.getElementById("favorites").classList.add('clbutton');
        $scope.favorites = false;
        var diena = new Date();
        diena.setHours(0);
        var MyBookings = Parse.Object.extend("PreBooking");
        var myBookings = new Parse.Query(MyBookings);
        myBookings.equalTo("Sender", currentUser);
        myBookings.ascending("DateUTC");
        myBookings.lessThan("DateUTC", diena);
        myBookings.find({
            success: function (results) {
                $scope.myBookings = results;
                $scope.$apply();
                console.log(results)

            },
            error: function (error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    };


    ;
    $scope.getFutureBookings = function () {
        //        document.getElementById("futureBookings").className += "clbuttonactive";
        //        document.getElementById("futureBookings").className -= "clbutton";
        document.getElementById("futureBookings").classList.add('clbuttonactive');
        document.getElementById("futureBookings").classList.remove('clbutton');
        document.getElementById("allBookings").classList.remove('clbuttonactive');
        document.getElementById("allBookings").classList.add('clbutton');
        document.getElementById("favorites").classList.remove('clbuttonactive');
        document.getElementById("favorites").classList.add('clbutton');
        $scope.favorites = false;
        var diena = new Date();
        diena.setHours(0);
        var MyBookings = Parse.Object.extend("PreBooking");
        var myBookings = new Parse.Query(MyBookings);
        myBookings.equalTo("Sender", currentUser);
        myBookings.ascending("DateUTC");
        myBookings.greaterThan("DateUTC", diena);
        myBookings.find({
            success: function (results) {
                $scope.myBookings = results;
                $scope.$apply();

            },
            error: function (error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    };

    $scope.getFutureBookings();
    $scope.returnDate = function (date) {
        var res = date.toISOString().slice(0, 10);
        return res;
    };
    $ionicModal.fromTemplateUrl('app/modals/myBooking.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $ionicModal.fromTemplateUrl('app/modals/becomeSpec.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.specModal = modal;
    });
    $ionicModal.fromTemplateUrl('app/modals/rateUser.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.rateModal = modal;
    });
    $scope.openBooking = function (booking) {
        $scope.theBooking = booking;
        $scope.theBooking.price = $scope.returnPrice(booking.attributes.ReservServic)
        $scope.theBooking.time = $scope.returnTime(booking.attributes.ReservServic)
        $scope.theBooking.date = $scope.returnDate(booking.attributes.DateUTC)
        $scope.theBooking.from = booking.attributes.TimeObject.time;
        $scope.theBooking.to = returnTimeTo(booking.attributes.TimeObject);
        $scope.theBooking.prev = returnPrev($scope.theBooking);
        $scope.modal.show();
        console.log(booking);
    };

    function returnPrev(booking) {
        var today = new Date().getTime();
        var day = new Date(booking.attributes.DateUTC).getTime();
        var sum = today - day;
        console.log(sum);
        if (sum > 86000000) {
            return true;
        } else if (sum < 86000000 && sum > 0) {
            var hh = new Date().getHours();
            var mm = new Date().getMinutes();
            var ff = booking.to.time.split(":");
            if (hh > parseInt(ff[0])) {
                return true;
            } else if (hh == parseInt(ff[0])) {
                if (mm > parseInt(ff[1])) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }


        } else {
            return false;
        }


    }
    var returnTimeTo = function (time) {
        var duration = 0;
        for (i = 0; i < time.service.length; i++) {
            duration = duration + parseInt(time.service[i].duration);
        }
        var toId = time.time.id + duration;
        console.log(Times[toId].time)
        return Times[toId];

    }
    $scope.returnTime = function (services) {
        var time = 0;
        for (var i = 0; i < services.length; i++) {
            time = time + parseInt(services[i].time);
        }
        return time;
    };
    $scope.returnPrice = function (services) {
        var price = 0;
        for (var i = 0; i < services.length; i++) {
            price = price + services[i].price;
        }
        return price;
    };

    var query = new Parse.Query(Parse.User);
    query.containedIn("objectId", $scope.theUser.Favorites); // find all the women
    query.find({
        success: function (users) {
            $scope.favoriteUsers = users;
            console.log(users)
        }

    });
    $scope.showFavorites = function () {
        if (!$scope.favorites) {
            $scope.favorites = true;
            document.getElementById("favorites").classList.add('clbuttonactive');
            document.getElementById("favorites").classList.remove('clbutton');
            document.getElementById("allBookings").classList.remove('clbuttonactive');
            document.getElementById("allBookings").classList.add('clbutton');
            document.getElementById("futureBookings").classList.remove('clbuttonactive');
            document.getElementById("futureBookings").classList.add('clbutton');
        }
        console.log($scope.favorites)
    }

    $scope.unfollow = function (user) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Vartotojo nebesekimas',
            template: 'Ar tikrai norite išmesti ' + user.attributes.data.name + ' iš mėgstamiausiųjų sąrašo?',
            okText: 'Taip',
            cancelText: 'Ne'
        });

        confirmPopup.then(function (res) {
            if (res) {
                currentUser.remove("Favorites", user.id);
                currentUser.save();
                var index = $scope.favoriteUsers.indexOf(user);
                $scope.favoriteUsers.splice(index, 1);
            } else {
                return;
            }
        });
    }

    function readURL(input) {

        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                //                $('#blah').attr('src', e.target.result);

                document.getElementById('profilePic').style.backgroundImage = "url(" + e.target.result + ")";
            }

            reader.readAsDataURL(input.files[0]);
        }
    }
    $("#file-input").change(function () {
        readURL(this);
    });

    $scope.updateProfile = function () {
        $scope.data = currentUser.attributes.data;
        if (!$scope.data.telNumber) {
            $scope.data.telNumber = 370;
        }
        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.name" placeholder="Vardas/Pavardė" style="text-align:center"><br><input placeholder="Telefono numeris" type="number" ng-model="data.telNumber" style="text-align:center"><br><input placeholder="Nuotrauka" type="file" id="profilePhotoFileUpload">',
            title: 'Keiskite savo duomenis',
            scope: $scope,
            buttons: [
                {
                    text: 'Atgal'
                },
                {
                    text: '<b>Išsaugoti</b>',
                    type: 'button-positive',
                    onTap: function (e) {

                        if (!$scope.data.telNumber) {
                            alert('Neivėdete telefono numerio')
                            e.preventDefault();


                        } else if (!$scope.data.name) {
                            alert('Neivėdete vardo')
                            e.preventDefault();
                        } else {
                            $ionicLoading.show()
                            var fileUploadControl = $("#profilePhotoFileUpload")[0];
                            if (fileUploadControl.files.length > 0) {
                                var file = fileUploadControl.files[0];
                                var name = "photo.jpg";

                                var parseFile = new Parse.File(name, file);
                                currentUser.set('profilePhoto', parseFile);
                            }
                            currentUser.set("data", $scope.data);
                            currentUser.save({
                                success: function (user) {
                                    $scope.theUser = user.attributes;
                                    $scope.$apply()
                                    $ionicLoading.hide()


                                }
                            });
                        }
                    }
                }
        ]
        });






        //        $ionicLoading.show({
        //            template: 'Loading...'
        //        })
        //        var fileUploadControl = $("#file-input")[0];
        //        if (fileUploadControl.files.length > 0) {
        //            var file = fileUploadControl.files[0];
        //            console.log(file);
        //            var name = "photo.png";
        //            var parseFile = new Parse.File(name, file);
        //            currentUser.set("profilePhoto", parseFile)
        //        }
        //        currentUser.save({
        //            success: function (res) {
        //                var alertPopup = $ionicPopup.alert({
        //                    title: 'Profilio pakeitimas',
        //                    template: 'Viskas išsaugota'
        //                });
        //                $ionicLoading.hide()
        //
        //            }
        //        });
    }

    $scope.goToUser = function (userId) {
        $state.go('app.userProfile', {
            "userId": userId
        });
        $scope.modal.hide();
    }
    $scope.declineReservation = function (booking) {
        console.log('1')
        var confirmPopup = $ionicPopup.confirm({
            title: 'Perspėjimas',
            template: 'Ar tikrai norite atšaukti rezervarciją?',
            okText: 'Taip',
            cancelText: 'Ne'
        });

        confirmPopup.then(function (res) {
            if (res) {
                var Reservation = Parse.Object.extend("PreBooking");
                var reservation = new Parse.Query(Reservation);
                reservation.get(booking.id, {
                    success: function (res) {
                        if (res.attributes.Status === "Nepatvirtintas") {
                            res.set("Status", "canceled");
                            res.save();
                            $scope.modal.hide();
                        } else {
                            res.set("Status", "canceled");
                            res.save();
                            console.log('b')
                            _cancelReserv(booking);
                        }
                    },
                    error: function (object, error) {
                        // The object was not retrieved successfully.
                        // error is a Parse.Error with an error code and message.
                    }
                });
            } else {
                console.log('You are not sure');
            }
        });

    }
    var _cancelReserv = function (booking) {

        Parse.Cloud.run('cancelByUser', {
            date: new Date(booking.attributes.DateUTC),
            receiverId: booking.attributes.ReceiverId,
            from: booking.from.id,
            to: booking.to.id,
        }).then(function (ratings) {
            console.log('a')
            console.log(ratings)
        });
        //        return
        //        var temp = new Date(booking.attributes.DateUTC)
        //        temp.setHours(0);
        //        console.log(temp)
        //        var Reservation = Parse.Object.extend("Calendar");
        //        var reservation = new Parse.Query(Reservation);
        //        reservation.greaterThanOrEqualTo("DateUTC", temp);
        //        //        reservation.lessThanOrEqualsTo("DateUTC", booking.attrributes.DateUTC);
        //        reservation.equalTo("ReceiverId", booking.attributes.ReceiverId);
        //        reservation.find({
        //            success: function (res) {
        //                console.log(res)
        //                var newSched = timeSchedFixer(res[0].attributes.TimeSched, booking);
        //                res[0].set("TimeSched", newSched);
        //                res[0].save();
        //                $scope.modal.hide();
        //                var req = {
        //                    method: 'POST',
        //                    url: 'http://www.pretit.lt/general/cancelBookingByUser.php',
        //                    headers: {
        //                        'Content-Type': 'application/x-www-form-urlencoded'
        //                    },
        //                    data: {
        //                        email: booking.attributes.ReceiverEmail
        //                    }
        //                };
        //
        //                $http(req).then(function (success, two) {
        //                    console.log(success);
        //                    console.log(two);
        //                }, function () {});
        //            },
        //            error: function (object, error) {
        //                // The object was not retrieved successfully.
        //                // error is a Parse.Error with an error code and message.
        //            }
        //        });
    }
    var timeSchedFixer = function (calendar, booking) {
        for (i = booking.from.id; i < booking.to.id; i++) {
            calendar[i].availability = true;
            calendar[i].registeredService = [];
            delete calendar[i].userInfo;
        }
        return calendar;
    }
    var sorter = function (a, b) {
        var rObj = {
            a: {},
            b: {}
        }

        if (a.userId) {
            console.log(currPic)
            console.log(a)
            rObj.a.id = a.userId;
            rObj.a.name = a.userName;
            if (a.userPic) {
                rObj.a.picture = a.userPic._url;
            }
            rObj.b.id = b.id;
            rObj.b.name = currData.name;
            if (currPic) {
                rObj.b.picture = currPic._url;
            }


        } else {

            rObj.b.id = b.userId;
            rObj.b.name = b.userName;
            if (b.userPic) {
                rObj.b.picture = b.userPic._url;
            }
            rObj.a.id = a.id;
            rObj.a.name = currData.name;
            if (currPic) {
                rObj.a.picture = currPic._url;
            }
        }
        console.log(rObj)

        return rObj;
    }
    $scope.goToMessagesNew = function (user) {


        var channel;
        var obj;

        if (currentUser.id < user.ReceiverId) {
            var channel = $scope.currentUser.id + "--" + user.ReceiverId;
            var obj = {
                a: {
                    id: currentUser.id,
                    name: currentUser.attributes.data.name,
                    picture: currentUser.attributes.profilePhoto._url
                },
                b: {
                    id: user.ReceiverId,
                    name: user.ReceiverName,
                    picture: user.ReceiverPic
                }
            };
        } else {
            var channel = user.ReceiverId + "--" + $scope.currentUser.id;
            var obj = {
                b: {
                    id: currentUser.id,
                    name: currentUser.attributes.data.name,
                    picture: currentUser.attributes.profilePhoto._url
                },
                a: {
                    id: user.ReceiverId,
                    name: user.ReceiverName,
                    picture: user.ReceiverPic
                }
            };

        }

        var Messages = Parse.Object.extend("Messages");




        var queryMess = new Parse.Query(Messages);
        queryMess.equalTo("Channel", channel);
        queryMess.find({
            success: function (mess) {
                if (mess.length == 0) {
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
        $scope.modal.hide();
    }
    $scope.rateUser = function (booking) {
        $scope.modal.hide();
        $scope.rateModal.show();
        $scope.bookingToRate = booking;
    }
    $scope.saveComment = function (rating, comment) {
        $ionicLoading.show();
        console.log($scope.theBooking.attributes.ReceiverId)

        var GameScore = Parse.Object.extend("CommentsOf");
        var comments = new GameScore();



        comments.set("comment", comment);
        comments.set("rating", rating);

        comments.set("idOfUser", $scope.theBooking.attributes.ReceiverId);
        comments.set("commentator", currentUser);
        //        comment.set("service", theBook);

        comments.save(null, {
            success: function (gameScore) {
                console.log(1)
                $scope.rateModal.hide();
                $ionicLoading.hide()
            },
            error: function (gameScore, error) {
                $ionicLoading.hide()
                alert('Šio vartotojo komentuoti šiuo metu neįmanoma.');
            }
        });
    }









    var rating = 4;
    var ratingCount = 1;
    var currentRating = 5;
    var futureRating = 5;


    var Comments = Parse.Object.extend("CommentsOf");
    var comments = new Parse.Query(Comments);
    query.equalTo("idOfUser", currentUser.id);
    query.count({
        success: function (count) {
            ratingCount = count;
            console.log(count)
        },
        error: function (error) {
            response.error("Something went wrong");
        }
    });
    var qry = new Parse.Query(Parse.User);
    qry.equalTo("objectId", currentUser.id);
    qry.find({
        success: function (user) {
            if (ratingCount == 0) {
                ratingCount = 1;
            }
            currentRating = user[0].attributes.rating;

            var a = (ratingCount * currentRating) / ratingCount;
            console.log(a)
            var b = (a * ratingCount + rating) / (ratingCount + 1)

            console.log(b)
        }
    });
    $scope.linkFb = function () {
        if (!Parse.FacebookUtils.isLinked(currentUser)) {

            Parse.FacebookUtils.link(currentUser, null, {
                success: function (user) {
                    alert("Woohoo, user logged in with Facebook!");
                },
                error: function (user, error) {
                    alert("User cancelled the Facebook login or did not fully authorize.");
                }
            });
        }



    }
    $scope.changePass = function () {
        $scope.data = {};

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<input type="password" ng-model="data.pass" placeholder="Slaptažodis" style="text-align:center"><br><input placeholder="Pakartokite slaptažodį" type="password" ng-model="data.pass2" style="text-align:center">',
            title: 'Įveskite naują slaptažodį',

            scope: $scope,
            buttons: [
                {
                    text: 'Atgal'
                },
                {
                    text: '<b>Išsaugoti</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if ($scope.data.pass != $scope.data.pass2) {
                            e.preventDefault();


                        } else {
                            currentUser.set("password", $scope.data.pass);
                            currentUser.save();
                        }
                    }
      }
        ]
        });


    }
    $scope.becomeSpecialist = function () {
        $scope.specModal.show();
    }
    $scope.becomeSpecFinal = function () {
        if (!$scope.theUser.data.telNumber) {
            alert("Neįvėdėte telefono numerio");
            return
        }
        $ionicLoading.show();
        currentUser.set("data", $scope.theUser.data)
        currentUser.set("type", '2');
        currentUser.save({
            success: function (user) {
                $scope.theUser = user.attributes;
                currentUser = user.attributes;
                $scope.$apply();
                $ionicLoading.hide();
                $scope.specModal.hide();
            }
        })
    }


});