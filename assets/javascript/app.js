$(document).ready(function ()  {
    // Initialize Firebase
    var firebaseConfig = {
        apiKey: "AIzaSyB-vk1Y2WhTQFr6TMEP1sMXNkiJPGQkM2g",
        authDomain: "train-scheduler-18705.firebaseapp.com",
        databaseURL: "https://train-scheduler-18705.firebaseio.com",
        projectId: "train-scheduler-18705",
        storageBucket: "train-scheduler-18705.appspot.com",
        messagingSenderId: "490032113181",
        appId: "1:490032113181:web:92a09a1bf7f801598dc8f4",
        measurementId: "G-XXBKJXRWVZ"
    };

    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    initApp = function() {
        firebase.auth().onAuthStateChanged( function(user) {
            if (user) {
                // Create a variable to reference the database
                var dataRef = firebase.database();

                $("#addTrainBtn").on("click", function(event) {
                    event.preventDefault();

                    var trainName = $("#trainName").val().trim();
                    var destination = $("#destination").val().trim();
                    var firstTime = $("#firstTime").val().trim();
                    var frequency = $("#frequency").val().trim();

                    // regex for departure time audit
                    var regex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
                    var timeAudit = regex.test(firstTime);

                    if (trainName !== "" && destination !== "" && frequency !== 0 && frequency !== "" && timeAudit) {
                        var newTrain = {
                            trainName: trainName,
                            destination: destination,
                            firstTime: firstTime,
                            frequency: frequency
                        }

                        dataRef.ref().push(newTrain);

                        // clear inputs
                        $("#trainName").val("");
                        $("#destination").val("");
                        $("#firstTime").val("");
                        $("#frequency").val("");
                    } else {
                        $("#errModal").modal()
                    }
                });


                // Firebase watcher + initial loader
                dataRef.ref().on("child_added", function (childSnapshot) {
                    var newName = childSnapshot.val().trainName;
                    var newDestination = childSnapshot.val().destination;
                    var newTime = childSnapshot.val().firstTime;
                    var timeFrequency = childSnapshot.val().frequency;

                    // First Time (pushed back 1 year to make sure it comes before current time)
                    var firstTime = moment(newTrainTime, "HH:mm").subtract(1, "years");

                    // Difference between the times
                    var diffTime = moment().diff(moment(firstTime), "minutes");

                    // Time apart (remainder)
                    var timeRemainder = diffTime % timeFrequency;

                    //minutes until  train
                    var tMinutesTillTrain = timeFrequency - timeRemainder;

                    //next train
                    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
                    var nextTrainArr = moment(nextTrain).format("HH:mm");

                    // set up schedule display
                    var schedLine = "<tr><td id='dispSched'>" + newName + "</td><td id='dispSched'>" + newDestination + "</td><td id='dispSched'>" + tFrequency + "</td><td id='dispSched'>" + nextTrainArr + "</td><td id='dispSched'>" + tMinutesTillTrain + "</td></tr>";
                    // display schedule
                    $("#current-schedule").prepend(schedLine);

                    // Handle the errors
                }), function (errorObject) {
                    console.log("Errors handled: " + errorObject.code);
                } 
            } 
        });
    }   
});





