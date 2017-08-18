angular.module('tyList.menu', [])

.controller('MenuController', function ($scope, $state, $location, $stateParams, $timeout, $ionicModal, $ionicLoading, $ionicHistory, $http) {
    // Form data for the login modal
    if (Parse.User.current()) {
        $scope.currentUser = Parse.User.current();
        $scope.theUser = $scope.currentUser.attributes;
    }

    $scope.loginData = {};

    $scope.goToMessages = function () {
        $('.cd-close-nav').trigger('click');
        $state.go('app.customerMessages')
    }

    $scope.goToLogin = function () {
        $state.go('app.loginas')
    }

    $scope.logOut = function () {


        $state.go('app.home').then(function () {
            Parse.User.logOut();
            $timeout(function () {

                location.reload();
            }, 300)

        })

    }

    function getMessagesCount() {
        var MessageCount = Parse.Object.extend("Messages");
        var messageCount = new Parse.Query(MessageCount);
        messageCount.equalTo('a' + $scope.currentUser.id, false);
        messageCount.count({
            success: function (count) {
                $scope.messageCount = count;

                $scope.$apply();
            },
            error: function (error) {

            }
        });
        setTimeout(function () {
            getMessagesCount();
        }, 60 * 1000);
    }
    if ($scope.currentUser) {
        getMessagesCount();
    }



    function getPendingCount() {
        var PendingCount = Parse.Object.extend("PreBooking");
        var pendingCount = new Parse.Query(PendingCount);

        pendingCount.equalTo('ReceiverId', $scope.currentUser.id);
        pendingCount.equalTo('Status', 'Nepatvirtintas');

        pendingCount.count({
            success: function (count) {
                $scope.pendingCount = count;

                $scope.$apply();
            },
            error: function (error) {

            }
        });
        setTimeout(function () {
            getPendingCount();
        }, 60 * 1000);
    }
    if ($scope.currentUser && $scope.currentUser.attributes.type != "1") {
        getPendingCount();
    }
    $scope.goToRegisterService = function () {
        $state.go('app.registerservice')
    }
    $scope.goToclientDash = function () {
        $('.cd-close-nav').trigger('click');
        $state.go('app.clientDash');
        var menu = document.querySelector('.dMenuItem .listItem') // Using a class instead, see note below.
        menu.classList.toggle('dMenuItemCurrent');
        //        var d = document.getElementsByClassName("listItem");

        //        d.className += " dMenuItemCurrent";
    }
    $scope.goToBookings = function () {
        if ($scope.currentUser.attributes.type == '3') {
            $state.go('app.companyDash')
        } else if (!$scope.currentUser.attributes.hasService && $scope.currentUser.attributes.type == '2') {
            $state.go('app.registerservice')
        } else {
            $state.go('app.bookings')
        }
    };
    $ionicModal.fromTemplateUrl('app/modals/becomeSpec.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.specModal = modal;
    });
    $ionicModal.fromTemplateUrl('app/modals/aboutUs.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.aboutUsModal = modal;
    });
    $ionicModal.fromTemplateUrl('app/modals/privacy.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.privacyModal = modal;
    });
    $ionicModal.fromTemplateUrl('app/modals/rules.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.rulesModal = modal;
    });
    $ionicModal.fromTemplateUrl('app/modals/duk.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.dukModal = modal;
    });
    $ionicModal.fromTemplateUrl('app/modals/contacts.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.contactsModal = modal;
    });

    $scope.isActive = function (viewLocation) {

        return viewLocation === $location.path();
    };
    $scope.goToRegister = function () {
        $state.go('app.register')
    }
    $scope.goToSpecList = function () {
        $state.go('app.imonesSpecialistai')
    }
    $scope.goToSettings = function () {
        $state.go('app.nustatymai')
    }
    $scope.goToPayments = function () {
        $state.go('app.apmokejimas')
    }
    $scope.goTo = function (page) {
        $('.cd-close-nav').trigger('click');
        $state.go(page)
    }
    $scope.goToCat = function (service) {
        $state.go('app.search', {
            "service": service,
            'sortBy': 0
        });
    };
    $scope.becomeSpec = function () {
        $scope.specModal.show();
    }
    $scope.openModal = function (num) {
        if (num == 1) {
            $scope.aboutUsModal.show()
        } else if (num == 2) {
            $scope.rulesModal.show();
        } else if (num == 3) {
            $scope.privacyModal.show();
        } else if (num == 4) {
            $scope.dukModal.show();
            $('#accordion').find('.accordion-toggle').click(function () {

                //Expand or collapse this panel
                $(this).next().slideToggle('fast');

                //Hide the other panels
                $(".accordion-content").not($(this).next()).slideUp('fast');

            });

        } else if (num == 5) {
            $scope.contactsModal.show();
        }
    }
    $scope.becomeSpecFinal = function () {
        if (!$scope.theUser.data.telNumber) {
            alert("Neįvėdėte telefono numerio");
            return
        }
        $ionicLoading.show();
        $scope.currentUser.set("data", $scope.theUser.data)
        $scope.currentUser.set("type", '2');
        $scope.currentUser.save({
            success: function (user) {
                $scope.theUser = user.attributes;
                $scope.currentUser = user;
                $scope.$apply();
                $ionicLoading.hide();
                $scope.specModal.hide();
            }
        })
    }
    $scope.dataContact = {
        name: "",
        tel: "",
        email: "",
        message: ""
    }
    $scope.sendContact = function () {
        var cont = $scope.dataContact
        if (!cont.name || !cont.tel || !cont.email || !cont.message) {
            alert("Neįvedėte visų laukų arba kai kuriuos langus įvedėte netaisiklingai.")
        } else {
            var req = {
                method: 'POST',
                url: 'http://www.pretit.lt/general/contactForm.php',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: {
                    name: cont.name,
                    tel: cont.tel,
                    email: cont.email,
                    message: cont.message
                }
            };

            $http(req).then(function (success, two) {
                console.log(success);
                console.log(two);
                $scope.contactsModal.hide()
            }, function () {});
            $scope.contactsModal.hide()
        }

    }

});