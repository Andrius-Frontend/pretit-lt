 var loadFile = function (event) {
     var output = document.getElementById('output');
     output.src = URL.createObjectURL(event.target.files[0]);
 };
 var loadProfilePic = function (event) {
     var output = document.getElementById('profilePic');
     output.src = URL.createObjectURL(event.target.files[0]);
 };