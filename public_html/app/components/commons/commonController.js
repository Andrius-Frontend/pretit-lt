angular.module('tyList.common', ['tyList.service'])



.controller('CommonController', function ($scope, $stateParams, $ionicModal, $ionicPopup, $state, $http, $ionicLoading) {
    $ionicModal.fromTemplateUrl('app/modals/specialList.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.theModal = modal;
    });
    $scope.currentUser = Parse.User.current();
    $scope.emailAutorized = function () {
        Parse.Cloud.run('verify_email', {
            id: $stateParams.ide,

        }, {
            success: function (result) {
                console.log(result)
            },
            error: function (error) {
                console.log(error)
            }
        });
    }
    $scope.loadSpecialists = function () {
        var id = Parse.User.current().get("companyId");
        var query = new Parse.Query(Parse.User);
        query.equalTo("companyId", id); // find all the women
        query.equalTo("hasService", true); // find all the women
        query.find({
            success: function (users) {
                $scope.companySpecialists = users;
                $scope.$apply();
            }
        });
    }
    $scope.specialistList = function (user) {
        $scope.userSubList = user.attributes.subServicesForSearch;
        $scope.theModal.show();
    };
    $scope.removeFromCompany = function (user, index) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Pašalinti specialistą',
            template: 'Ar tikrai norite pašalinti specialistą iš sąrašo?.',
            buttons: [
                {
                    text: 'Atgal'
                },
                {
                    text: '<b>Taip</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        $ionicLoading.show()
                        Parse.Cloud.run('removeFromSpec', {
                            id: user.id,

                        }, {
                            success: function (result) {
                                $scope.companySpecialists.splice(index, 1);
                                $ionicLoading.hide();
                            },
                            error: function (error) {
                                console.log(error)
                            }
                        });
                    }
                }
            ]
        });

    }
    $scope.initiateChanging = function () {
        var query = new Parse.Query(Parse.User);
        query.equalTo("emailAuth", $stateParams.a); // find all the women
        query.first({
            success: function (user) {
                console.log(user)
                if (!user) {
                    $scope.userExists = false;
                } else {
                    $scope.userExists = true;
                }
                $scope.$apply();
            }
        });
    }

    $scope.changePass = function (pass, rpass) {
        if (pass != rpass) {
            alert("Nesutampa slaptažodžiai");
            return
        }
        Parse.Cloud.run('theChange', {
            email: $stateParams.e,
            password: pass,

        }, {
            success: function (result) {
                $state.go('app.home')
            },
            error: function (error) {
                console.log(error)
            }
        });
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
                                        request.set("CompanyPic", $scope.currentUser.attributes.profilePhoto);
                                        request.set("CompanyNr", $scope.currentUser.attributes.data.telNumber);

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
    $scope.goToUser = function (id) {
        $state.go('app.userProfile', {
            "userId": id
        });
    }




    var makeID = function (id) {
        var text = id;
        var possible = "0123456789";
        for (var i = 0; i < 20; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    };
    $scope.daysnstars = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']

    $scope.numbers = {
        days: '1',
        stars: "1"
    }
    $scope.paymentsfunc = function () {

        if ($scope.currentUser.attributes.type == 3) {
            var query = new Parse.Query(Parse.User);
            query.equalTo("companyId", $scope.currentUser.attributes.companyId); // find all the women
            query.notEqualTo("isItCompany", true);
            query.find({
                success: function (users) {
                    $scope.multiplier = users.length;
                    $scope.usersToPayFor = users;
                    $scope.userToPayFor = 1;
                    console.log(users)
                    $scope.generateCode();
                    $scope.$apply();
                }
            });
        }
        $scope.selectedUserEmail = $scope.currentUser.attributes.email;
        $scope.valid = $scope.currentUser.attributes.ValidTill;
        $scope.idOne = makeID('1');
        $scope.idTwo = makeID('2');
        $scope.idThree = makeID('3');

    }


    $scope.generateCode = function () {
        if ($scope.multiplier) {
            $scope.suma = (parseInt($scope.numbers.days) * parseInt($scope.numbers.stars) * 0.90 * $scope.multiplier).toFixed(2);
        } else {
            $scope.suma = (parseInt($scope.numbers.days) * parseInt($scope.numbers.stars) * 0.90).toFixed(2);
        }
        var d = ("0" + $scope.numbers.days).slice(-2);
        var s = ("0" + $scope.numbers.stars).slice(-2);
        var r = "4" + d + s;

        $scope.idFour = makeID(r);
        console.log($scope.idFour)
    }
    $scope.changeUserEmail = function (usermail) {
        if (usermail == '1') {
            $scope.selectedUserEmail = $scope.currentUser.attributes.email;
        } else {
            $scope.selectedUserEmail = usermail
        }
        $scope.generateCode();
    }

});