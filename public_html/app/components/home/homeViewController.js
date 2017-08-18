angular.module('tyList.home', ['tyList.service'])

.controller('HomeController', function ($scope, $state, $ionicSlideBoxDelegate, $interval, Carousel, Services, cityList) {
    $scope.services = Services;

    //    $scope.dateSearch = ''

    //    $scope.selectedService = ''
    //    $scope.selectedSubService = ''
    //    var obj = {
    //        availability: true,
    //        id: '1',
    //        time: '7:00'
    //    }
    $scope.Carousel = Carousel;
    $scope.users = [];


    $scope.cityList = cityList;



    //    var query = new Parse.Query(Parse.User);
    //
    //    query.equalTo('hasService', true);
    //
    //    query.limit(8);
    //    query.find({
    //        success: function (users) {
    //
    //            //            Parse.Cloud.run('hello', {
    //            //                price: 20,
    //            //                service: "Moterų kirpimas"
    //            //            }, {
    //            //                success: function (result) {
    //            //                    console.log(result)
    //            //                },
    //            //                error: function (error) {
    //            //                    alert(error)
    //            //                }
    //            //            });
    //            console.log(users);
    //            $scope.users = users;
    //
    //            $scope.$apply();
    //
    //
    //
    //        }
    //    });

    $scope.openCategorySeachCount = false;
    $scope.openCategorySeach = function () {
        if ($scope.openCategorySeachCount) {
            $scope.openCategorySeachCount = false;
        } else {
            $scope.openCategorySeachCount = true;
            $scope.openSubCategorySeachCount = false;
        }


    }
    $scope.theChangeServ = function (ser) {
        $scope.selectedService = ser
        $scope.openCategorySeachCount = false;
    }

    $scope.openSubCategorySeachCount = false;
    $scope.openSubCategorySeach = function () {

        if ($scope.selectedService) {

            if ($scope.openSubCategorySeachCount) {
                $scope.openSubCategorySeachCount = false;
            } else {
                $scope.openSubCategorySeachCount = true;
                $scope.openCategorySeachCount = false;
            }
        } else {

            //            var backgroundInterval = setInterval(function () {
            //                $div2blink.toggleClass("backgroundRed");
            //            }, 100)
            $div2blink.stop().css("background-color", "#ff8161")
                .animate({
                    backgroundColor: "#FFFFFF"
                }, 1500);
            $scope.openSubCategorySeachCount = false;

        }


    }

    $scope.theChangeSub = function (ser) {
        $scope.selectedSubService = ser
        $scope.openSubCategorySeachCount = false;
    }
    $scope.theChangeCity = function (ser) {
        $scope.citySearch = ser
    }
    $scope.theChangeDate = function (ser) {
        $scope.dateSearch = ser
    }
    $scope.currentUser = Parse.User.current();
    //    if ($scope.currentUser) {
    //        $scope.username = $scope.currentUser.get('email');
    //    }

    //    $scope.goToVerslauk = function () {
    //        if ($scope.currentUser) {
    //            $state.go('app.bookings')
    //        }
    //    }
    //    $scope.logOut = function () {
    //        Parse.User.logOut();
    //        $state.go($state.current, {}, {
    //            reload: true
    //        });
    //    }



    //
    //    var video = document.getElementById('video');
    //
    //    video.play();



    //    $scope.goToLogin = function () {
    //        $state.go('app.loginas')
    //    }


    //    $scope.goToUser = function (id) {
    //        $state.go('app.userProfile', {
    //            "userId": id
    //        });
    //    }
    $scope.search = function () {
        var cit = $(".js-example-responsive option:selected").text();
        if (cit == "Miestas") {
            cit = "";
        }
        $state.go('app.search', {
            "city": cit,
            "date": $scope.dateSearch,
            "service": $scope.selectedService,
            "serviceType": $scope.selectedSubService,
            "sortBy": 0
                //            "time": 'asd'
        });

    }

    $("#datepickeris").datepicker({
        inline: true,
        showOtherMonths: true,
        dayNamesMin: ['Se', 'Pi', 'An', 'Tr', 'Ke', 'Pe', 'Še'],
        monthNames: ['Sausis', 'Vasaris', 'Kovas', 'Balandis', 'Gegužė', 'Birželis',
            'Liepa', 'Rugpjūtis', 'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis'],
        monthNamesShort: ['Sau', 'Vas', 'Kov', 'Bal', 'Geg', 'Bir',
            'Lie', 'Rugpj', 'Rugsej', 'Spa', 'Lap', 'Gru'],
        minDate: 0,
        firstDay: 1,
        showOn: 'button',
        buttonText: ""

        //        onSelect: searchDate

    });

    $("#ui-datepicker-div").addClass("homePageDatePicker");

    $("#datepickeris").focus(function () {
        $("#datepickeris").datepicker("widget").appendTo($(".homeSearch"));
    });



    function searchDate(date) {
        $scope.dateSearch = $(this).val();
    }
    //    $('#datepickeris').focus(function () {
    //        setTimeout(function () {
    //            $('#datepickeris').datepicker('show');
    //        }, 3000);
    //
    //    });
    var $div2blink = $("#serviceHomeBlink"); // Save reference, only look this item up once, then save


    //    $scope.goToBookings = function () {
    //        if ($scope.currentUser.attributes.type == '2' && !$scope.currentUser.attributes.hasService) {
    //
    //            $state.go('app.registerservice')
    //        } else if ($scope.currentUser.attributes.type == '2') {
    //            $state.go('app.bookings')
    //        } else if ($scope.currentUser.attributes.type == '3') {
    //            $state.go('app.companyDash')
    //        } else {
    //            $state.go('app.clientDash')
    //        }
    //    }

    //    function convertImgToDataURLviaCanvas(url, outputFormat) {
    //        var img = new Image();
    //        img.crossOrigin = 'Anonymous';
    //        img.onload = function () {
    //            var canvas = document.createElement('CANVAS');
    //            var ctx = canvas.getContext('2d');
    //            var dataURL;
    //            canvas.height = this.height;
    //            canvas.width = this.width;
    //            ctx.drawImage(this, 0, 0);
    //            dataURL = canvas.toDataURL(outputFormat);
    //
    //            canvas = null;
    //            return dataURL;
    //        };
    //        img.src = url;
    //
    //    }
    //    convertImgToDataURLviaCanvas("http://212.24.106.31:1337/parse/files/myAppId/9d1f6fcc45fd064f9380a78da68c0204_photo.png", 'png');

    //    function belekas(daa) {
    //        console.log(daa)
    //    }
    $(".js-example-responsive").select2({
        placeholder: 'Select an option'
    });

    $scope.goToCat = function (service) {
        $state.go('app.search', {
            "service": service,
            'sortBy': 0
        });
    };


});