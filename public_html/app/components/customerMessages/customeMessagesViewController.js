angular.module('tyList.customerMessages', ['tyList.service'])

    .controller('CustomerMessagesViewController', function ($scope, $state, Messages, $timeout, $ionicHistory) {

        var currentUser = Parse.User.current();
        $scope.theCurrentUser = Parse.User.current();
        $scope.noMessages = false;
        var message = Messages;

        var MessagesAll = Parse.Object.extend("Messages");
        var messages = new MessagesAll();

        var query = new Parse.Query(MessagesAll);
        query.exists('a' + currentUser.id);
        query.exists('LastMessage');
        query.descending("TimeSorter");
        query.find({
            success: function (results) {


                console.log(results)

                if (results.length == 0) {
                    $scope.noMessages = true;
                } else {
                    $scope.theAllMessages = results;

                    $scope.getThoseMessages(results[0]);
                    $scope.choice = results[0].attributes.Channel;
                }
            },
            error: function (error) {

            }
        });
        $scope.imageCount = [1, 1, 1, 1, 1];

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
            input = PUBNUB.$('input'),
            button = PUBNUB.$('button'),
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
        $scope.goToMessages = function () {
            $state.go('app.messages')
        }

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
        $scope.deleteTheMessage = function (obj) {
            obj.unset('a' + $scope.theCurrentUser.id);
            obj.save();
            var index = $scope.theAllMessages.indexOf(obj);
            if (index > -1) {
                $scope.theAllMessages.splice(index, 1);
            }
        }
        $scope.getThoseMessages = function (object) {
            $('#messageHis').waitMe({
                effect: 'bounce',
                text: '',
            });
            $scope.content = [];
            $scope.theChannel = object.attributes.Channel
            p.history({
                channel: object.attributes.Channel,
                count: 100,
                callback: function (m) {
                    var querySec = new Parse.Query(MessagesAll);
                    querySec.equalTo('Channel', $scope.theChannel);
                    querySec.first({
                        success: function (response) {
                            if (response.attributes.MessageObject.a.id == $scope.theCurrentUser.id) {
                                $scope.customerPic = response.attributes.MessageObject.b.picture;
                                $scope.customerName = response.attributes.MessageObject.b.name;
                                $scope.myName = response.attributes.MessageObject.a.name;
                                $scope.myPic = response.attributes.MessageObject.a.picture;
                                $scope.customerId = response.attributes.MessageObject.b.id;
                                console.log(response)
                            } else {
                                $scope.customerPic = response.attributes.MessageObject.a.picture;
                                $scope.customerName = response.attributes.MessageObject.a.name;
                                $scope.customerId = response.attributes.MessageObject.a.id;
                                $scope.myName = response.attributes.MessageObject.b.name;
                                $scope.myPic = response.attributes.MessageObject.b.picture;
                            }


                            response.set('a' + $scope.theCurrentUser.id, true);
                            response.save({
                                success: function (response) {
                                    $('#messageHis').waitMe('hide');
                                    $scope.content = m[0];

                                    $scope.$apply();
                                }
                            });
                        }
                    })

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
                        //                    console.log(m);
                        var querySec = new Parse.Query(MessagesAll);
                        querySec.equalTo('Channel', $scope.theChannel);
                        querySec.find({
                            success: function (responses) {
                                responses[0].set('a' + $scope.theCurrentUser.id, true);
                                responses[0].save();
                            }
                        })
                        $scope.content.push(m);
                        $scope.$apply();
                    } else {
                        //                    output.innerHTML = '<p><i class="' + m.avatar + '"></i><span>' + m.text.replace(/[<>]/ig, '') + '</span></p>' + output.innerHTML;
                        //                    console.log(m);
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


        if (!input.value) {
            return
        }


        function publish() {
            var theTime = new Date();
            var tekstas = input.value;
            console.log(tekstas);
            var querySec = new Parse.Query(MessagesAll);
            querySec.equalTo('Channel', $scope.theChannel);
            querySec.find({
                success: function (responses) {

                    responses[0].set("LastMessage", tekstas);
                    responses[0].set("LastMessageTime", theTime.toLocaleString('en-GB'));
                    responses[0].set('TimeSorter', theTime);
                    responses[0].set('a' + $scope.customerId, false);
                    responses[0].set("PNTo", $scope.customerId);
                    console.log($scope.customerId)
                    responses[0].save();
                }
            })
            p.publish({
                channel: $scope.theChannel,
                message: {
                    user: currentUser.id,
                    text: input.value,
                    time: theTime.toLocaleString('en-GB')
                },
                x: (input.value = '')
            });
            console.log('sent');


        }

        var testas = p.get_subscribed_channels();
        console.log(testas);


    })
