angular.module('tyList.messages', ['tyList.service'])

.controller('MessagesViewController', function ($scope, $state, Messages, $timeout, $stateParams) {

    var currentUser = Parse.User.current();
    $scope.theCurrentUser = Parse.User.current();
    $scope.noMessages = false;
    var message = Messages;

    var MessagesAll = Parse.Object.extend("Messages");
    var messages = new MessagesAll();

    var query = new Parse.Query(MessagesAll);
    query.equalTo("Customer", currentUser.id);
    query.descending("updatedAt");
    query.find({
        success: function (results) {
            if (results.length === 0) {

                $scope.noMessages = true;
                $scope.$apply();
            } else {
                $scope.theAllMessages = results;
                $scope.getThoseMessages(results[0]);
                $scope.choice = results[0].attributes.Channel;
            }


        },
        error: function (error) {

        }
    });
    $scope.returnFixedTime = function (time) {
        var res = time.split(", ");
        return res[1];
    };

    $scope.returnFixedDate = function (date) {
        var res = date.split(", ");
        return res[0];
    };

    //    gameScore.save(null, {
    //        success: function (gameScore) {
    //            // Execute any logic that should take place after the object is saved.
    //            alert('New object created with objectId: ' + gameScore.id);
    //        },
    //        error: function (gameScore, error) {
    //            // Execute any logic that should take place if the save fails.
    //            // error is a Parse.Error with an error code and message.
    //            alert('Failed to create new object, with error code: ' + error.message);
    //        }
    //    });


    var output = PUBNUB.$('output'),
        input = PUBNUB.$('inputas'),
        button = PUBNUB.$('buttonas'),
        avatar = PUBNUB.$('avatar'),
        presence = PUBNUB.$('presence');

    var channel;

    // Assign a random avatar in random color
    //    avatar.className = 'face-' + ((Math.random() * 13 + 1) >>> 0) + ' color-' + ((Math.random() * 10 + 1) >>> 0);

    var p = PUBNUB.init({
        uuid: currentUser.id,
        subscribe_key: 'sub-c-e3e72da0-fcc8-11e5-b552-02ee2ddab7fe',
        publish_key: 'pub-c-eb631fa3-367f-4368-9dcf-369492dd3362'
    });


    $scope.goToCustomerMessages = function () {
        $state.go('app.customerMessages')
    }
    $scope.goToBookings = function () {
        $state.go('app.bookings')
    }
    $scope.goToRegisterService = function () {
        $state.go('app.registerservice')
    }
    $scope.logOut = function () {
        Parse.User.logOut();
        $state.go("app.home");
    }


    $scope.getThoseMessages = function (object) {
        $scope.content = [];
        $scope.theChannel = object.attributes.Channel
        p.history({
            channel: object.attributes.Channel,
            count: 100,
            callback: function (m) {
                var querySec = new Parse.Query(MessagesAll);
                querySec.equalTo('Channel', $scope.theChannel);
                querySec.find({
                    success: function (responses) {
                        responses[0].set("CSeen", true);
                        responses[0].save();
                    }
                })
                $scope.content = m[0];

                $scope.$apply();
                $timeout(function () {
                    var scroller = document.getElementById("messageHis");
                    scroller.scrollTop = scroller.scrollHeight;
                }, 0, false);
            }
        });

        p.subscribe({
            channel: $scope.theChannel,
            callback: function (m) {
                if (currentUser.id == m.user) {
                    //                    output.innerHTML = '<li style="float:right"><i class="' + m.avatar + '"></i><span>' + m.text.replace(/[<>]/ig, '') + '</span></li><br>' + output.innerHTML;

                    var querySec = new Parse.Query(MessagesAll);
                    querySec.equalTo('Channel', $scope.theChannel);
                    querySec.find({
                        success: function (responses) {
                            responses[0].set("CSeen", true);
                            responses[0].save();
                        }
                    })
                    $scope.content.push(m);
                    $scope.$apply();
                } else {
                    //                    output.innerHTML = '<p><i class="' + m.avatar + '"></i><span>' + m.text.replace(/[<>]/ig, '') + '</span></p>' + output.innerHTML;

                    $scope.content.push(m);
                    $scope.$apply();
                }
                $timeout(function () {
                    var scroller = document.getElementById("messageHis");
                    scroller.scrollTop = scroller.scrollHeight;
                }, 0, false);
            },
            presence: function (m) {
                if (m.occupancy > 1) {
                    presence.textContent = m.occupancy + ' people online';
                } else {
                    presence.textContent = 'Nobody else is online';
                }
            }
        });
    }

    p.bind('keyup', input, function (e) {
        (e.keyCode || e.charCode) === 13 && publish()
    });

    p.bind('click', button, publish);


    function publish() {
        var theTime = new Date();
        var tekstas = input.value;

        var querySec = new Parse.Query(MessagesAll);
        querySec.equalTo('Channel', $scope.theChannel);
        querySec.find({
            success: function (responses) {
                responses[0].set("LastMessage", tekstas);
                responses[0].set("LastMessageTime", theTime.toLocaleString('en-GB'));
                responses[0].set("VSeen", false);
                responses[0].save();
            }
        })
        p.publish({
            channel: $scope.theChannel,
            message: {
                user: currentUser.id,
                text: input.value
            },
            x: (input.value = '')
        });

    }

    var testas = p.get_subscribed_channels();








})