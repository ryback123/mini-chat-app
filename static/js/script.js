var profile;
function onSignIn(googleUser)
{
  profile = googleUser.getBasicProfile();
  document.getElementById("msg_input").value = "";
  document.getElementById("signout").disabled = false;
  document.getElementById("msg_input").disabled = false;
  console.log('ID: ' + profile.getId());
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail());
}

function signOut()
{
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
  document.getElementById("signout").disabled = true;
  document.getElementById("msg_input").disabled = true;
  document.getElementById("msg_input").value = "";
}

function sendMessage()
{
  var msg = document.getElementById("msg_input").value.toString().trim();
  console.log(profile);
  if(msg.localeCompare("")==0)
  {
    alert("Message cannot be blank!");
  }
  else {
    var req = JSON.parse('{"user":"'+profile.Eea+'", "msg":"'+msg+'"}');
    console.log(req);
    fetch('http://127.0.0.1:5000/message', {
      method: 'POST',
      body: JSON.stringify(req),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
    .then(res => {
      console.log(res);
    });
  }
}
