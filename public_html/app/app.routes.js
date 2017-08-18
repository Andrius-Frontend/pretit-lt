angular.module('tyList.routes', ['ionic'])

.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "app/components/menu/menuView.html",
            controller: 'MenuController'
        })
        .state('app.loginas', {
            cache: false,
            url: "/loginas",
            views: {
                'content': {
                    templateUrl: "app/components/login/loginView.html",
                    controller: 'LoginController'
                }
            }
        })
        .state('app.patvirtinimas', {
            url: "/patvirtinimas?ide",
            views: {
                'content': {
                    templateUrl: "app/components/menu/confirm.html",
                    controller: 'CommonController'
                }
            }
        })
        .state('app.apmokejimas', {
            url: "/apmokejimas",
            views: {
                'content': {
                    templateUrl: "app/components/commons/payments.html",
                    controller: 'CommonController'
                }
            }
        })
        .state('app.pamirstasSlaptazodis', {
            url: "/pamirstasSlaptazodis?e?a",
            views: {
                'content': {
                    templateUrl: "app/components/menu/pamirstasSlaptazodis.html",
                    controller: 'CommonController'
                }
            }
        })
        .state('app.nustatymai', {
            url: "/nustatymai",
            views: {
                'content': {
                    templateUrl: "app/components/menu/nustatymai.html",
                    controller: 'CommonController'
                }
            }
        })
        .state('app.imonesSpecialistai', {
            url: "/imonesSpecialistai",
            views: {
                'content': {
                    templateUrl: "app/components/menu/imonesSpecialistai.html",
                    controller: 'CommonController'
                }
            }
        })
        .state('app.home', {
            url: "/home",
            views: {
                'content': {
                    templateUrl: "app/components/home/homeView.html",
                    controller: 'HomeController'
                }
            },
            cache: false
        })
        .state('landing', {
            url: "/landing",
            templateUrl: "app/components/home/landing.html",
            controller: 'HomeController'

        })
        .state('app.register', {
            url: "/register",
            views: {
                'content': {
                    templateUrl: "app/components/login/registerView.html",
                    controller: 'LoginController'
                }
            }
        })
        .state('app.registerservice', {
            url: "/registerservice",
            views: {
                'content': {
                    templateUrl: "app/components/login/registerServiceView.html",
                    controller: 'LoginController'
                }
            }
        })
        .state('app.registerservicecompany', {
            url: "/registerservicecompany",
            views: {
                'content': {
                    templateUrl: "app/components/login/registerServiceCompanyView.html",
                    controller: 'LoginController'
                }
            }
        })
        .state('app.forgotPassword', {
            url: "/forgotPassword",
            views: {
                'content': {
                    templateUrl: "app/components/login/forgotPasswordView.html",
                    controller: 'LoginController'
                }
            }
        })
        .state('app.search', {
            url: "/search?city?service?serviceType?date?time?price?sortBy?company",
            cache: false,
            views: {
                'content': {
                    templateUrl: "app/components/services/serviceView.html",
                    controller: 'ServiceViewController'
                }
            }
        })
        .state('app.userProfile', {
            url: "/user/:userId",
            views: {
                'content': {
                    templateUrl: "app/components/UserProfile/userProfileView.html",
                    controller: 'UserProfileViewController'
                }
            }
        })
        .state('app.bookings', {
            url: "/bookings",
            cache: false,
            views: {
                'content': {
                    templateUrl: "app/components/bookings/bookingsView.html",
                    controller: 'BookingsController'
                }
            }
        })
        .state('app.messages', {
            url: "/messages",
            views: {
                'content': {
                    templateUrl: "app/components/messages/messagesView.html",
                    controller: 'MessagesViewController'
                }
            }
        })
        .state('app.customerMessages', {
            cache: false,
            url: "/customerMessages",
            views: {
                'content': {
                    templateUrl: "app/components/customerMessages/customerMessagesView.html",
                    controller: 'CustomerMessagesViewController'
                }
            }
        })
        .state('app.privatumoPolitika', {
            url: "/privatumoPolitika",
            views: {
                'content': {
                    templateUrl: "app/components/home/privatumopolitika.html",
                    controller: 'HomeController'
                }
            }
        })
        .state('app.clientDash', {
            cache: false,
            url: "/clientDash",
            views: {
                'content': {
                    templateUrl: "app/components/clientDash/clientDashView.html",
                    controller: 'clientDashViewController'
                }
            }
        })
        .state('app.companyDash', {
            url: "/companyDash",
            views: {
                'content': {
                    templateUrl: "app/components/companyDash/companyDashView.html",
                    controller: 'CompanyDashViewController'
                }
            }
        })
        //if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');

});