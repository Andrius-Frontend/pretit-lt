angular.module('tyList.login', ['tyList.service'])

.controller('LoginController', function ($scope, $state, $ionicModal, loginCredits, Users, Services, Times, WorkingDaysTimes, $ionicPopup, $ionicScrollDelegate, $location, $timeout, $ionicTabsDelegate, $ionicLoading, $http, Base64) {

    $(document).ready(function () {
        $('.slider2').bxSlider({

        });
    });
    $scope.credits = loginCredits;
    $scope.users = Users;
    $scope.services = Services;
    $scope.times = Times;
    $scope.workingDays = WorkingDaysTimes;
    $scope.currentUser = Parse.User.current();
    var path = $location.path();
    if ($scope.currentUser) {
        $scope.username = $scope.currentUser.get('email');
    } else if (!$scope.currentUser && path == "/app/registerservice") {
        var alertPopup = $ionicPopup.alert({
            title: 'Klaida!',
            template: 'Jūs esate neregistruotas vartotojas. Prisiregistruokite.'
        });
        alertPopup.then(function (res) {
            $state.go('app.home');
        });
    }
    $scope.city = '';
    $scope.company = 'a';
    $scope.map = {
        center: {
            latitude: 45,
            longitude: -73
        },
        zoom: 6
    };

    $scope.marker = {
        id: 0,
        coords: {
            latitude: 0,
            longitude: 0,
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

    var events = {
        places_changed: function (searchBox) {

            var place = searchBox.getPlaces();
            if (!place || place == 'undefined' || place.length == 0) {

                return;
            }

            $scope.formatedAddress = place[0].name + ", " + place[0].vicinity;
            $scope.formatedStreet = place[0].name;
            $scope.formatedCity = place[0].vicinity;
            $scope.map = {
                "center": {
                    "latitude": place[0].geometry.location.lat(),
                    "longitude": place[0].geometry.location.lng()
                },
                "zoom": 15
            };
            $scope.marker = {
                id: 0,
                coords: {
                    latitude: place[0].geometry.location.lat(),
                    longitude: place[0].geometry.location.lng()
                }
            };

        }
    };



    $scope.searchbox = {
        template: 'app/modals/googleMap.html',
        events: events
    }



    if ($scope.currentUser) {
        var query = new Parse.Query(Parse.User);
        query.equalTo("objectId", $scope.currentUser.id);
        query.find({
            success: function (user) {

                $scope.theUser = user[0];
                if (user[0].attributes.WorkingDaysTimes) {

                    $scope.workingDays = user[0].attributes.WorkingDaysTimes;
                    $scope.services = user[0].attributes.PaslaugosAll;
                    if (user[0].attributes.city) {
                        $scope.city = user[0].attributes.city;
                    }
                    if (typeof user[0].attributes.profilePhoto != 'undefined') {
                        $scope.profilePic = user[0].attributes.profilePhoto._url
                    }

                    if (typeof user[0].attributes.coverPhoto != 'undefined') {
                        $scope.coverPic = user[0].attributes.coverPhoto._url;
                        $(".coverbg").css("background", "url('" + $scope.coverPic + "') no-repeat 50% 50%");
                        $(".coverbg").css("background-size", "cover");
                    }

                    $scope.map.center.latitude = $scope.theUser.attributes.address.lat;
                    $scope.map.center.longitude = $scope.theUser.attributes.address.long;
                    $scope.marker.coords.latitude = $scope.theUser.attributes.address.lat;
                    $scope.marker.coords.longitude = $scope.theUser.attributes.address.long;
                    $scope.formatedAddress = $scope.theUser.attributes.formatedAddress;
                    $scope.formatedStreet = $scope.theUser.attributes.formatedStreet;
                    $scope.formatedCity = $scope.theUser.attributes.formatedCity;
                    $scope.map.zoom = 15;


                }

            }

        });
    }

    $scope.signUp = function (tais) {
        if (!tais) {
            var alertPopup = $ionicPopup.alert({
                title: 'Klaida',
                template: 'Nesutikot su taiklėmis'
            });
            return;
        }

        if ($scope.credits.password != $scope.credits.repeatpassword) {
            var alertPopup = $ionicPopup.alert({
                title: 'Klaida',
                template: 'Nesutampa slaptažodžiai'
            });
            return;
        }

        $ionicLoading.show();
        var user = new Parse.User();
        var userName = $scope.credits.email.toLowerCase();
        user.set("username", userName);
        user.set("password", $scope.credits.password);
        user.set("email", $scope.credits.email);
        user.set('data', $scope.credits.data);
        user.set('type', $scope.selectedProfile);
        user.set('rating', 5);

        var file = new Parse.File("profilePhoto.png", {
            base64: Base64
        });
        user.set('profilePhoto', file);
        if ($scope.selectedProfile == '3') {
            user.set('isItCompany', true);
        }

        // other fields can be set just like with Parse.Object
        //        user.set("phone", "415-392-0202");

        user.signUp(null, {
            success: function (user) {
                $ionicLoading.hide();
                $scope.emailTest(user.id, user.attributes.email);
                if ($scope.selectedProfile == '3') {
                    var Company = Parse.Object.extend("Company");
                    var company = new Company();

                    company.set("Title", $scope.credits.data.name);
                    company.set("Tel", $scope.credits.data.telNumber);


                    company.save(null, {
                        success: function (gameScore) {
                            user.set('companyId', gameScore.id);
                            user.save();
                            $scope.logOut2();
                        },
                        error: function (gameScore, error) {
                            // Execute any logic that should take place if the save fails.
                            // error is a Parse.Error with an error code and message.
                            alert('Failed to create new object, with error code: ' + error.message);
                        }
                    });
                } else {
                    $scope.logOut2();
                }

                //                $state.go('app.userProfile', {
                //                    "userId": user.id
                //                });

            },
            error: function (user, error) {
                // Show the error message somewhere and let the user try again.
                alert("Error: " + error.code + " " + error.message);

            }
        });

    }

    $scope.login = function () {
        $ionicLoading.show();
        var userName = $scope.credits.username.toLowerCase();
        Parse.User.logIn(userName, $scope.credits.password, {
            success: function (user) {
                if (user.attributes.emailVerified) {
                    $state.go('app.home');
                    $ionicLoading.hide()
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Klaida',
                        template: 'Jūs dar nepatvirtinot savo elektroninio pašto ' + user.attributes.email
                    });
                    $ionicLoading.hide()
                    $scope.logOut();
                }
            },
            error: function (user, error) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Klaida',
                    template: 'Blogas elektroninio pašto adresas arba slaptažodis'
                });
                $ionicLoading.hide()
            }
        });

    }

    $scope.signOut = function () {
        Parse.User.logOut();
    }
    $scope.deleteUsers = function () {
        var query = new Parse.Query(Parse.User);
        query.find({
            success: function (women) {
                women.forEach(function (user) {
                    user.destroy({
                        success: function (myObject) {

                        },
                        error: function (myObject, error) {

                        }
                    });
                })
            }
        });
    }
    $ionicModal.fromTemplateUrl('app/modals/selectServices.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $ionicModal.fromTemplateUrl('app/modals/rules.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.rulesModal = modal;
    });
    $ionicModal.fromTemplateUrl('app/modals/rules.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.rulesModal = modal;
        $scope.rulesModal.name = 'rules';

    });
    $ionicModal.fromTemplateUrl('app/modals/prices.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.pricesModal = modal;
        $scope.pricesModal.name = 'prices';

    });
    $ionicModal.fromTemplateUrl('app/modals/addAddress.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modalMap = modal;
    });
    $scope.addToServiceList = function () {
        $scope.selectedIndex = $ionicTabsDelegate.selectedIndex();

        $scope.modal.show();

    }
    $scope.closeServicePicker = function () {
        $scope.modal.hide();
    }
    $scope.$on('modal.hidden', function (modal, dar, trys) {
        if (!dar.name) {
            $scope.doYouSave();
        }
    });
    $scope.registerService = function (city) {

        $ionicLoading.show({
            template: 'Prašome palaukti...'
        });

        var bool = false;

        var city = city;

        var time = angular.toJson($scope.times);
        var times = angular.fromJson(time);

        var testas = angular.toJson($scope.services);
        var test = JSON.parse(testas);




        var fileUploadControl = $("#file-input")[0];



        if (fileUploadControl.files.length > 0 && fileUploadControl.files[0].size > 1048576) {
            $scope.showAlert("Per didelis nuotraukos dydis. Nuotrauka turėtų būti ne didesnė nei 1mb.");
            return
        }
        if (fileUploadControl.files.length > 0) {
            var file = fileUploadControl.files[0];
            var name = "photo.png";
            var parseFile = new Parse.File(name, file);
        }


        var galleryArray = [];
        var post = $scope.currentUser;



        //                for (i = 0; i < galleryFileUploadControl.length; i++) {
        //                    $ionicLoading.show()
        //                    convertToSmallerImage(galleryFileUploadControl[i])
        //                    var dfile = galleryFileUploadControl[i];
        //                    var dname = "photo.png";
        //                    $timeout(function () {
        //                        var galleryParseFile = new Parse.File(dname, {
        //                            base64: $scope.str
        //                        });
        //                        galleryArray.push(galleryParseFile);
        //                        //                PhotoUpload(cname, cfile);
        //                        post.add('ImageGallery', galleryParseFile);
        //                        post.save();
        //
        //
        //                    }, 3000);
        //
        //                    if (i = galleryFileUploadControl.length - 1) {
        //                        $ionicLoading.hide()
        //                        $state.go($state.current, {}, {
        //                            reload: true
        //                        })
        //                    }
        //                }
        //



        var serviceArray = [];
        var subServiceArray = [];
        var prices = {};
        for (key in test) {
            var counter = 0;
            for (j in test[key].subcategories) {
                if (test[key].subcategories[j].doing && counter == 0) {
                    serviceArray.push(test[key].name);
                    subServiceArray.push(test[key].subcategories[j].name);
                    prices[test[key].subcategories[j].name] = test[key].subcategories[j].price;
                    counter++;
                } else if (test[key].subcategories[j].doing) {
                    subServiceArray.push(test[key].subcategories[j].name)
                    prices[test[key].subcategories[j].name] = test[key].subcategories[j].price;
                }
            }
        }




        if (!$scope.workingDays) {
            $scope.showAlert("Nepasirinkote darbo dienų");
            return
        }
        //        if (!parseFile && !$scope.profilePic) {
        //            $scope.showAlert("Nepasirinkote profilio nuotraukos");
        //            return
        //        }
        if (subServiceArray.length === 0) {
            $scope.showAlert("Nepasirinkote teikiamų paslaugų");
            return
        }
        var address = {
            long: $scope.marker.coords.longitude,
            lat: $scope.marker.coords.latitude
        }

        if (!$scope.formatedAddress) {
            $ionicLoading.hide();
            //            $scope.showAlert("Nepasirinkote adreso");
            $scope.addNewAdress();
            return;
        }

        post.set('formatedAddress', $scope.formatedAddress);
        post.set('formatedCity', $scope.formatedCity);
        post.set('formatedStreet', $scope.formatedStreet);
        post.set('address', address);
        post.set('WorkingDaysTimes', $scope.workingDays);
        post.set('PaslaugosAll', angular.copy(test));
        post.set('profilePhoto', parseFile);
        var point = new Parse.GeoPoint({
            latitude: $scope.marker.coords.latitude,
            longitude: $scope.marker.coords.longitude
        });
        post.set('location', point);
        post.set('hasService', true);
        post.set('theTimes', times);
        post.set('servicesForSearch', serviceArray);
        post.set('subServicesForSearch', subServiceArray);
        post.set('city', city)
        post.set('prices', prices);

        //        post.set('data', $scope.theUser.attributes.data)


        post.save(null, {
            success: function (postd) {








                if (myDropzone.files.length > 0) {
                    var galleryFileUploadControl = myDropzone.files;
                    if (galleryFileUploadControl.length > 0) {
                        for (i = 0; i < galleryFileUploadControl.length; i++) {

                            //                            var dfile = galleryFileUploadControl[i];
                            var dname = "photo.png";

                            var galleryParseFile = new Parse.File(dname, {
                                base64: galleryFileUploadControl[i].testas
                            });
                            galleryArray.push(galleryParseFile);
                            postd.add('ImageGallery', galleryParseFile);
                            myDropzone.removeFile(galleryFileUploadControl[i]);

                        }
                        postd.save(null, {
                            success: function (asd) {
                                console.log('veikia')
                                $('div.dz-success').remove();
                                $ionicLoading.hide()
                                $state.go($state.current, {}, {
                                    reload: true
                                })
                            }
                        });

                    }
                } else {
                    $ionicLoading.hide()
                    $state.go($state.current, {}, {
                        reload: true
                    })
                }









            },
            error: function (user, error) {
                console.log(error)
            }
        });
    };


    $scope.fbLogin = function () {
        $ionicLoading.show()
        Parse.FacebookUtils.logIn("user_likes,email,public_profile", {
            success: function (user) {

                if (!user.existed()) {

                    FB.api('/me?fields=name,email,picture.type(large)', function (response) {
                        if (!response.error) {

                            convertImgToDataURLviaCanvas(response.picture.data.url, user, response);

                        } else {

                        }
                    });
                } else {
                    $ionicLoading.hide();
                    $state.go('app.home')
                }

            },
            error: function (user, error) {
                $ionicLoading.hide();
                alert("User cancelled the Facebook login or did not fully authorize.");
            }
        });
    }


    function testas() {

    }
    var myElem = document.getElementById('my-awesome-dropzone');

    if (myElem != null) {

        var myDropzone = new Dropzone("#my-awesome-dropzone", {
            url: testas,
            addRemoveLinks: true,
            maxFilesize: 100,
            acceptedFiles: "image/jpeg,image/png,image/gif",
            accept: function (file, done) {
                $scope.doYouSave();
            }
        });

        myDropzone.on('thumbnail', function (file, dataURL) {
            file.testas = dataURL;
            //            console.log(dataURL)
        })

    };

    $scope.goToBookings = function () {
        $state.go('app.bookings')
    }
    $scope.goToMessages = function () {
        $state.go('app.messages')
    }
    $scope.goToRegisterService = function () {
        $state.go('app.registerservice')
    }
    $scope.goToclientDash = function () {
        $state.go('app.clientDash')
    }
    $scope.logOut2 = function () {

        var alertPopup = $ionicPopup.alert({
            title: 'Sėkmingai prisiregistravot',
            template: 'Kelių minučių begyje gausite elektroninį laišką. Norėdami prisijungti patvirtinkite savo el. paštą paspausdami laiške gautą nuorodą.'
        });

        alertPopup.then(function (res) {
            $state.go('app.home').then(function () {
                Parse.User.logOut();
                $state.go($state.current, {}, {
                    reload: true
                })
            })
        });


    }
    $scope.logOut = function () {


        $state.go('app.home').then(function () {
            Parse.User.logOut();
            $state.go($state.current, {}, {
                reload: true
            })
        })



    }

    $scope.deleteFromGallery = function (index) {

        var query = new Parse.Query(Parse.User);
        query.equalTo("objectId", $scope.currentUser.id);
        query.find({
            success: function (user) {

                user[0].remove('ImageGallery', index);
                user[0].save({
                    success: function (res) {
                        $state.go($state.current, {}, {
                            reload: true
                        });
                    }
                });

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

    $scope.scrollTo = function (target, selected) {
        $scope.selectedProfile = selected;
        $location.hash(target); //set the location hash
        var handle = $ionicScrollDelegate.$getByHandle('myPageDelegate');
        handle.anchorScroll(true); // 'true' for animation
    };
    $scope.addNewAdress = function () {
        $scope.modalMap.show();
    }
    $scope.showAlert = function (message) {
        var alertPopup = $ionicPopup.alert({
            title: 'Klaida!',
            template: message
        });

        alertPopup.then(function (res) {
            $ionicLoading.hide();
        });
    };

    $scope.saveAddress = function () {
        //        var address = {
        //                long: $scope.marker.coords.longitude,
        //                lat: $scope.marker.coords.latitude
        //            }
        //        $scope.currentUser.set('formatedAddress', $scope.formatedAddress);
        //        $scope.currentUser.set('formatedCity', $scope.formatedCity);
        //        $scope.currentUser.set('formatedStreet', $scope.formatedStreet);
        //        $scope.currentUser.set('address', address);
        //        $scope.currentUser.save();
        $scope.modalMap.hide();
    };
    $scope.doYouSave = function () {
        var x = document.getElementById("overhang");

        if (!document.getElementById('overhang') || document.getElementById('overhang').style.display == "none") {
            $("body").overhang({
                type: "confirm",
                primary: "#1abc9c",
                accent: "#109077",
                yesColor: "#fff",
                message: "Išsaugoti pakeitimus?",
                callback: function () {
                    var selection = $("body").data("overhangConfirm");
                    var response = selection ? "Taip" : "Ne";
                    if (response == "Taip") {
                        $scope.registerService($scope.city);
                    }
                }
            });
        }
    };
    $scope.goBack = function () {
        $state.go('app.home');
    }
    $scope.specialistEmail = {};
    $scope.addNewSpecialist = function () {
        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="specialistEmail.email">',
            title: 'Įveskite specialisto elektroninį paštą',
            scope: $scope,
            buttons: [
                {
                    text: 'Atgal'
                },
                {
                    text: '<b>Siųsti</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.specialistEmail.email) {
                            //don't allow the user to close unless he enters wifi password

                            e.preventDefault();
                        } else {
                            var query = new Parse.Query(Parse.User);
                            query.equalTo("username", $scope.specialistEmail.email);
                            query.find({
                                success: function (result) {

                                    if (result.length == 0) {

                                        var alertPopup = $ionicPopup.alert({
                                            title: 'Nėra tokio specialisto',
                                            template: 'Patikrinkite įvestą elektroninio pašto adresą ir bandykite dar kartą'
                                        });
                                    } else {
                                        var Request = Parse.Object.extend("PendingCompanyRequest");
                                        var request = new Request();
                                        request.set("Company", $scope.username);
                                        request.set("CompanyId", $scope.currentUser.attributes.companyId);
                                        request.set("Specialist", result[0].attributes.username);
                                        request.set("CompanyName", $scope.currentUser.attributes.data.name);

                                        request.set("CompanyPic", $scope.currentUser.attributes.profilePhoto)

                                        request.save(null, {
                                            success: function (gameScore) {
                                                var alertPopup = $ionicPopup.alert({
                                                    title: 'Kvietimas nusiųstas',
                                                    template: 'Kai specialistas patvirtins, pranešime Jums elektroniniu paštu'
                                                });
                                            },
                                            error: function (gameScore, error) {
                                                // Execute any logic that should take place if the save fails.
                                                // error is a Parse.Error with an error code and message.
                                                alert('Failed to create new object, with error code: ' + error.message);
                                            }
                                        });

                                    }

                                }
                            });

                        }
                    }
      }
    ]
        });

    };
    //    if ($scope.currentUser) {
    //        var companySpecialists = new Parse.Query(Parse.User);
    //        companySpecialists.equalTo("companyId", $scope.currentUser.get('companyId')); // find all the women
    //        companySpecialists.notEqualTo("isItCompany", true); // find all the women
    //        companySpecialists.find({
    //            success: function (results) {
    //                $scope.companyServices = results[0].attributes.PaslaugosAll;
    //
    //                if (results.length > 1) {
    //                    for (i = 1; i < results.length; i++) {
    //                        for (a = 0; a < 4; a++) {
    //                            for (b = 0; b < results[i].attributes.PaslaugosAll[a].subcategories.length; b++) {
    //                                if (results[i].attributes.PaslaugosAll[a].subcategories[b].doing) {
    //                                    $scope.companyServices[a].subcategories[b].doing = true;
    //                                    if (results[i].attributes.PaslaugosAll[a].subcategories[b].price < $scope.companyServices[a].subcategories[b].price) {
    //                                        $scope.companyServices[a].subcategories[b].price = results[i].attributes.PaslaugosAll[a].subcategories[b].price
    //                                    }
    //                                    //                                       if (results[i].attributes.PaslaugosAll[a].subcategories[b].duration < $scope.companyServices[a].subcategories[b].duration) {
    //                                    //                                        $scope.companyServices[a].subcategories[b].price = results[i].attributes.PaslaugosAll[a].subcategories[b].price
    //                                    //                                    }
    //                                }
    //
    //                                //                                $scope.companyServices = $scope.companyServices.concat(results[i].attributes.PaslaugosAll[a].subcategories).unique();
    //                            }
    //                        }
    //                    }
    //                }
    //
    //            }
    //        });
    //    }
    $(document).on({
        'DOMNodeInserted': function () {
            $('.pac-item, .pac-item span', this).addClass('needsclick');
        }
    }, '.pac-container');
    $("#file-input").change(function () {
        $scope.doYouSave();
        readURL(this);
    });

    Array.prototype.unique = function () {
        var a = this.concat();
        for (var i = 0; i < a.length; ++i) {
            for (var j = i + 1; j < a.length; ++j) {
                if (a[i] === a[j])
                    a.splice(j--, 1);
            }
        }

        return a;
    };

    function readURLTwo(input) {

        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                //                $('#blah').attr('src', e.target.result);

                document.getElementById('coverPic').style.backgroundImage = "url(" + e.target.result + ")";
            }

            reader.readAsDataURL(input.files[0]);
        }
    }
    $("#cover-file").change(function () {
        $scope.doYouSave();
        readURLTwo(this);
    });
    $("#my-awesome-dropzone").change(function () {
        $scope.doYouSave();
    });
    $scope.emailTest = function (id, email) {
        var req = {
            method: 'POST',
            url: 'http://www.pretit.lt/general/emailVerify.php',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                id: id,
                email: email
            }
        };

        $http(req).then(function (success, two) {

        }, function () {});
    };
    $scope.showRules = function () {

    }
    $scope.forgotPassword = function () {
        $scope.data = {};

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<input type="email" ng-model="data.email">',
            title: 'Įveskite savo elektroninio pašto adresą',
            scope: $scope,
            buttons: [
                {
                    text: 'Atgal'
                },
                {
                    text: '<b>Keisti</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.data.email) {
                            e.preventDefault();
                        } else {
                            var query = new Parse.Query(Parse.User);
                            query.equalTo("email", $scope.data.email); // find all the women
                            query.find({
                                success: function (user) {
                                    if (user.length === 0) {
                                        var alertPopup = $ionicPopup.alert({
                                            title: 'Klaida!',
                                            template: 'Toks vartotojas neegzistuoja.'
                                        });
                                    } else {

                                        forPass($scope.data.email);
                                        var alertPopup = $ionicPopup.alert({
                                            title: 'Sėkminga!',
                                            template: 'Slaptažodžio keitimo informacija Jums buvo išsiųsta el. paštu.'
                                        });

                                        myPopup.close();
                                    }
                                }
                            });

                        }
                    }
      }
    ]
        });




    }

    var forPass = function (email) {

        var req = {
            method: 'POST',
            url: 'http://www.pretit.lt/general/changePass.php',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                email: email
            }
        };

        $http(req).then(function (success, two) {

        }, function () {});
    };

    function convertImgToDataURLviaCanvas(url, user, response) {

        var img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
            var canvas = document.createElement('CANVAS');
            var ctx = canvas.getContext('2d');
            var dataURL;
            canvas.height = this.height;
            canvas.width = this.width;
            ctx.drawImage(this, 0, 0);
            dataURL = canvas.toDataURL();
            var imageBase64 = dataURL.replace(/^data:image\/(png|jpeg);base64,/, "");

            //            $scope.image64 = imageBase64;
            canvas = null;
            fbLoginLast(user, imageBase64, response);
        };
        img.src = url;

    }

    function fbLoginLast(user, file, response) {
        console.log(response);
        var file = new Parse.File("profilePhoto.png", {
            base64: file
        });
        var data = {
            name: response.name
        }

        user.set("username", response.email);
        user.set("email", response.email);
        user.set("fbId", response.id);
        user.set("rating", 5);
        user.set("type", "1");
        user.set("data", data);
        user.set('profilePhoto', file)
            //                            user.set("profilePhoto", file);
        user.save(null, {
            success: function (user) {;
                $ionicLoading.hide()
                $state.go('app.home')

            },
            error: function (user, error) {

                if (error.code == 202) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Toks vartotojas jau egzistuoja',
                        template: 'Jeigu norite susieti savo paskyra su facebook paskyra prisijunkite prie sistemos ir eikite i savo profilio peržiūrą'
                    });
                    alertPopup.then(function () {
                        user.destroy();
                        $scope.logOut();
                        $ionicLoading.hide()
                    })
                }
            }
        });

    }

    function saveMinifiedImages(image) {

        var dname = "photo.png";

        var galleryParseFile = new Parse.File(dname, {
            base64: image
        });
        //                                galleryArray.push(galleryParseFile);
        console.log(image)
        $scope.currentUser.add('ImageGallery', galleryParseFile);
        $scope.currentUser.save(null, {
            success: function (a) {
                console.log(a)
                    //                console.log(4)
                    //                if (i == galleryFileUploadControl.length) {
                    //                    console.log(true)
                    //                    $ionicLoading.hide()
                    //                    $state.go($state.current, {}, {
                    //                        reload: true
                    //                    })
                    //                }
            }
        });

    }

    function convertToSmallerImage(incomingFile) {

        var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");
        var cw = canvas.width;
        var ch = canvas.height;


        // limit the image to 150x100 maximum size
        var maxW = 150;
        var maxH = 100;

        var input = document.getElementById('input');
        handleFiles(incomingFile);

        function handleFiles(e) {
            var img = new Image;
            img.onload = function () {
                var iw = img.width;
                var ih = img.height;
                var scale = Math.min((maxW / iw), (maxH / ih));
                var iwScaled = iw * scale;
                var ihScaled = ih * scale;
                canvas.width = iwScaled;
                canvas.height = ihScaled;
                ctx.drawImage(img, 0, 0, iwScaled, ihScaled);

                $scope.str = canvas.toDataURL();

                saveMinifiedImages($scope.str);

            }
            img.src = URL.createObjectURL(e);
        }

    }
})

.directive('disableTap', function ($timeout) {
    return {
        link: function () {

            $timeout(function () {
                document.querySelector('.pac-container').setAttribute('data-tap-disabled', 'true')
            }, 500);
        }
    };
});