var profile;
var res=0;
var user_count=0;
var id=0;

$(document).ready(function () {
  window.setInterval(function () {
    console.log("ran message");
    var env = "http://localhost:8000/message";
    $.ajax(env, {
      URL: env,
      type: "GET",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (result) {
        drawDivsforMsg(result);
      },
      error: function () {
        console.log("failed");
      }
    });
    console.log("ran online");
    env = "http://localhost:8000/user/add";
    $.ajax(env, {
      URL: env+"env",
      type: "GET",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (result) {
        drawDivsforUser(result);
      },
      error: function () {
        console.log("failed");
      }
    });
  }, 1000);
});

function onSignIn(googleUser)
{
  profile = googleUser.getBasicProfile();
  document.getElementById("msg").value = "";
  document.getElementById("loginpage").style.display = 'none';
  document.getElementById("chatwindow").style.display = 'block';
  console.log('ID: ' + profile.getId());
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail());
  var req = JSON.parse('{"user":"'+profile.ig+'", "id":"'+profile.Eea+'"}');
  fetch('http://127.0.0.1:8000/user/add', { //Add address of api host
    method: 'POST',
    body: JSON.stringify(req),
    headers:{
      'Content-Type': 'application/json'
    }
  })
}

function signOut()
{
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
  document.getElementById("loginpage").style.display = 'block';
  document.getElementById("chatwindow").style.display = 'none';
}

function sendMessage()
{
  var msg = document.getElementById("msg").value.toString().trim();
  console.log(profile);
  if(msg.localeCompare("")==0)
  {
    alert("Message cannot be blank!");
  }
  else {
    document.getElementById("msg").value = "";
    var req = JSON.parse('{"user":"'+profile.ig+'", "msg":"'+msg+'", "id":"'+profile.Eea+'"}');
    console.log(req);
    fetch('http://127.0.0.1:8000/message', { //Add address of api host
      method: 'POST',
      body: JSON.stringify(req),
      headers:{
        'Content-Type': 'application/json'
      }
    })
  }
  var myDiv = document.getElementById("msg-update");
  myDiv.scrollTop = myDiv.scrollHeight;
}
function drawDivsforMsg(msgs)
{
  const msgElement = document.getElementById("msg-update");
  console.log(msgs.msg_list);
  for (; res < msgs.msg_list.length; res++) {
    const div = document.createElement('div');
    const name = document.createElement('p');
    name.textContent = msgs.msg_list[res].user;
    const contents = document.createElement('p');
    contents.textContent = msgs.msg_list[res].msg;
    div.appendChild(name);
    div.appendChild(contents);
    console.log(msgs.msg_list[res].id.toString());
    div.style.borderRadius = '5px';
    name.style.paddingLeft = '10px';
    name.style.paddingTop = '5px';
    contents.style.paddingLeft = '10px';
    contents.style.paddingBottom = '5px';
    if(msgs.msg_list[res].id==profile.Eea)
    {
      div.style.marginLeft = '230px';
      div.style.marginRight = '10px';
      div.style.backgroundColor = '#0000FF';
      div.style.color = '#FFFFFF';
      console.log("Same");
    }
    else
    {
      div.style.marginLeft = '10px';
      div.style.backgroundColor = '#D3D3D3';
      div.style.color = '#000000';
      div.style.marginRight = '230px'
    }
    msgElement.appendChild(div);
  }
}
drawDivsforUser(users)
{
  const msgElement = document.getElementById("usr-update");
  console.log(users.user_list);
}
