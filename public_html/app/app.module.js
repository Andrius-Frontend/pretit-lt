// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('tyList', ['ionic', 'tyList.routes', 'ionic.utils', 'tyList.menu', 'tyList.login', 'tyList.service', 'tyList.home', 'tyList.serviceView', 'tyList.userProfile', 'tyList.bookings', 'tyList.companyDash', 'tyList.messages', 'tyList.customerMessages', 'tyList.clientDash', 'angular-carousel', 'mwl.calendar', 'uiGmapgoogle-maps', 'tyList.common'])

.run(function ($ionicPlatform, $http, $state, $ionicSideMenuDelegate, $window) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)

        //        Parse.initialize("myAppId");
        //        Parse.serverURL = 'http://212.24.106.31:1337/parse'
        //        console.log('aa')

        $ionicSideMenuDelegate.canDragContent(false);

        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        if ($window.innerWidth < 800) {
            window.location.href = 'http://www.pretit.lt/m';
        }
        //        Parse.initialize("pretit");
        //        Parse.serverURL = 'https://pretit.herokuapp.com/parse'
        //parse-dashboard --appId myAppId --masterKey labas --serverURL "http://212.24.106.31:1337/parse" 
        //        window.fbAsyncInit = function () {
        //            Parse.FacebookUtils.init({ // this line replaces FB.init({
        //                appId: '1762482773987575', // Facebook App ID
        //                status: true, // check Facebook Login status
        //                cookie: true, // enable cookies to allow Parse to access the session
        //                xfbml: true, // initialize Facebook social plugins on the page
        //                version: 'v2.5' // point to the latest Facebook Graph API version
        //            });
        //
        //            // Run code after the Facebook SDK is loaded.
        //        };
        //
        //        (function (d, s, id) {
        //            var js, fjs = d.getElementsByTagName(s)[0];
        //            if (d.getElementById(id)) {
        //                return;
        //            }
        //            js = d.createElement(s);
        //            js.id = id;
        //            js.src = "//connect.facebook.net/en_US/sdk.js";
        //            fjs.parentNode.insertBefore(js, fjs);
        //        }(document, 'script', 'facebook-jssdk'));
        //
    });

})

.directive('header', function () {
    return {
        restrict: 'A', //This menas that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements
        replace: true,
        scope: {
            user: '='
        }, // This is one of the cool things :). Will be explained in post.
        templateUrl: "app/directives/header.html",
        controller: 'MenuController'
    }
})

.directive('footer', function () {
    return {
        restrict: 'A', //This menas that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements
        replace: true,
        scope: {
            user: '='
        }, // This is one of the cool things :). Will be explained in post.
        templateUrl: "app/directives/footer.html",
        controller: 'MenuController'
    }
})

.filter('toArray', function () {
    return function (obj) {
        if (!(obj instanceof Object)) return obj;
        return _.map(obj, function (val, key) {
            return Object.defineProperty(val, '$key', {
                __proto__: null,
                value: key
            });
        });
    }
});