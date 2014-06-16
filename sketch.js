var recording = false;
var recorder = new Recorder(p5sound);
var waiting = false;

var recordButton = function( sketch ) {

  sketch.setup = function() {
    sketch.createCanvas(600, 400);
    sketch.background(220,220,245);
    sketch.textSize(24);
    sketch.fill(0);
    sketch.text('Is it ok to dance? Press to record and analyze... ', 20, 50);
    mic = new AudioIn();
    sketch.textAlign(sketch.CENTER);
    sketch.textSize(24);
    sketch.noStroke();
    sketch.fill(0);
  };

  sketch.draw = function() {
  };

  sketch.mousePressed = function() {
    if (recording == false && sketch.mouseX > 0 && sketch.mouseX < sketch.width && sketch.mouseY > 0 && sketch.mouseY < sketch.height) {
      micOn();
    } else if (recording == true && sketch.mouseX > 0 && sketch.mouseX < sketch.width && sketch.mouseY > 0 && sketch.mouseY < sketch.height){
      micOff();
    }
  };
};

var recButtonP5 = new p5(recordButton, 'recordButton');


var ok2dance = function( sketch ) {

  sketch.waiting = false;

  sketch.setup = function() {
    sketch.createCanvas(400, 400);
    sketch.background(255,255,255);
    mic = new AudioIn();
    sketch.textAlign(sketch.CENTER);
    sketch.textSize(24);
    sketch.noStroke();
  };

  sketch.draw = function() {
  };

};

var okP5 = new p5(ok2dance, 'recordButton');


micOn = function() {
  recButtonP5.background(255,0,0);
  recButtonP5.text('Allow microphone to start recording...click here to stop',recButtonP5.width/2,recButtonP5.height/2);
  recording = true;
  mic.on();
  startRecording();
  okP5.background(255,255,255);
};

micOff = function() {
  recButtonP5.background(0,255,0);
  recButtonP5.text('Analyzing...',recButtonP5.width/2,recButtonP5.height/2);
  waiting = true;
  recording = false;
  mic.off();
  stopRecording();
  setTimeout(isOK, 12000)
};

function setup() {
  createCanvas(0,0);
}

function draw() {
    if (waiting && frameCount % 200 == 0) {
    okP5.background(0);
    okP5.text('Waiting.',okP5.width/2,okP5.height/2);
  } else if (this.waiting && frameCount % 12 == 0) {
    okP5.background(0);
    okP5.text('Waiting..',okP5.width/2,okP5.height/2);
  } else if (this.waiting && frameCount % 16 == 0) {
    okP5.background(0);
    okP5.text('Waiting...',okP5.width/2,okP5.height/2);
  }
}

isOK = function() {
  waiting = false;
  var x = Math.random(0,1);
  console.log(x);
  if (x > .6) {
    okP5.background(0,255,0);
    okP5.text('YES!!!',okP5.width/2,okP5.height/2);
    recButtonP5.background(0,255,0);
  }
  else {
    okP5.background(255,0,0);
    okP5.text('NO.',okP5.width/2,okP5.height/2);
    recButtonP5.background(255,0,0);
  }

}

startRecording = function() {
  recorder.record();
}

stopRecording = function() {
  // recorder.getBuffer(sendToEchoNest);
  recorder.stop();
  recorder.exportWAV(displayWav);
}

displayWav = function(wavBlob) {
  var url = URL.createObjectURL(wavBlob);
  var li = document.createElement('li');
  var au = document.createElement('audio');
  var hf = document.createElement('a');
  au.controls = true;
  au.src = url;
  console.log(au);
  hf.href = url;
  hf.download = new Date().toISOString() + '.wav';
  hf.innerHTML = hf.download;
  li.appendChild(au);
  li.appendChild(hf);
  document.body.appendChild(li);

  saveWav();
}


function saveWav() {

}


// no longer in use
sendToEchoNest = function(wavBlob) {

  // make the wave the source of an audio element on the page
  var url = URL.createObjectURL(wavBlob);
  var li = document.createElement('li');
  var au = document.createElement('audio');
  var hf = document.createElement('a');
  au.controls = true;
  au.src = url;
  console.log(au);
  hf.href = url;
  hf.download = new Date().toISOString() + '.wav';
  hf.innerHTML = hf.download;
  li.appendChild(au);
  li.appendChild(hf);
  document.body.appendChild(li);

  // make the file to the Echo Nest
  // var f =   document.getElementById('track');
  // track.value = url;
  // console.log(f);


  // ATTEMPT 2
  var file = wavBlob;


  var formData = new FormData();

  console.log(url + ', ' + file.type);

  // if (file.type == 'audio/mp3' || file.type == 'audio/mpeg') {
  //   fileType = 'mp3';
  // }
  // if (file.type == 'audio/wav') {
  //   fileType = 'wav';
  // }
  // if (file.type == 'audio/x-m4a' || file.type == 'audio/aac') {
  //   fileType = 'm4a';
  // }

  formData.append('url', file, hf.download);
  formData.append('filetype', file.type);
  formData.append('api_key', echonest);
  formData.append('format', 'jsonp');
  formData.append('callback', logResults);

  var request = new XMLHttpRequest();
  request.open("POST", "http://developer.echonest.com/api/v4/track/upload", true);

  // Set up a handler for when the request finishes.
  request.onload = function () {
    if (request.status === 200) {
      // File(s) uploaded.
      console.log('Uploaded!!!');
    } else {
      alert('An error occurred!');
    }
  };

  request.send(formData);

}


function getDanceability(trackID) {
  loadStrings('http://developer.echonest.com/api/v4/track/profile?api_key='+echonest+'&id='+trackID+'&bucket=audio_summary', parseDanceability);
}

function parseDanceability(results) {
  var echonestRaw = JSON.parse(results).response;
  var echonestJSON = JSON.parse(results).response.track.audio_summary; //.response.songs[0].audio_summary;
  var danceability = echonestJSON.danceability;
  var energy = echonestJSON.energy;
  console.log(echonestRaw);
  console.log('energy: ' + energy + ', danceability: ' + danceability);
}

function logResults(r) {
  console.log(r);
}

function playBuffers( buffers ) {
    var newSource = p5sound.audiocontext.createBufferSource();
    var newBuffer = p5sound.audiocontext.createBuffer( 2, buffers[0].length, p5sound.audiocontext.sampleRate );
    newBuffer.getChannelData(0).set(buffers[0]);
    newBuffer.getChannelData(1).set(buffers[1]);
    newSource.buffer = newBuffer;

    newSource.connect( p5sound.audiocontext.destination );
    newSource.start(0);
}
