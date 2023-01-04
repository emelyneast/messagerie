
const ip = "127.1";
const port = "3000";
let socket = io(ip + ":" + port, { transports: ["websocket"] });

let newEle = $(`
<div id="mesList">
  <ul id="messages"></ul>
</div>
<div id="insertMes">
  <input id="mesInput" autocomplete="off" />
  <button id="b">envoyer</button>
</div>`);
let userN;

function convert2Digits(pString){
  return ("0" + pString).slice(-2);
}

function sendMes(){
  if ( $("#insertMes").find('#mesInput').val()!="") {
    socket.emit('newMessage',  $("#insertMes").find('#mesInput').val());
    $("#insertMes").find('#mesInput').val("");
  }
}

function appendMes(data){
  let item = $(`<li>`);
  let newDate = new Date();
  $(item).html(`[${convert2Digits(newDate.getHours())}h${convert2Digits(newDate.getMinutes())}] ${data.msg}`);
  if(data.author==userN){
    $(item).find(".author").addClass("authorSelf")
  }
  $('#messages').append(item);
  $('#mesList').animate({scrollTop: $('#mesList').prop("scrollHeight")}, 1);
}

$("#p").on('click', () => {
  if ($('#psInput').val()!="") {
    $("#mesArea").append(newEle);
    $('#psInput').attr("disabled",true);
    $("#insertMes").find("#b").on('click', () => {
        sendMes();
      
    });
    $('#mesInput').on('keypress', (e)=>{
      if(e.which==13){
        sendMes();
      }
    })
    userN = $('#psInput').val()
    socket.emit('utilisateur', userN);
  }

});

socket.on('newMessage', (data)=> {
  appendMes(data);
});

socket.on('lastMesList', (data)=>{
  data.forEach(mesData => {
    appendMes(mesData)
  });
});

