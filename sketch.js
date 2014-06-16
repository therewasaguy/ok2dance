var recording = false;
var waiting = false;
var mic = new AudioIn();
var recorder = new Recorder(mic);

// path to current file so it can be deleted
var filePath;


var recordButton = function( sketch ) {

  sketch.setup = function() {
    sketch.createCanvas(600, 400);
    sketch.background(220,220,245);
    sketch.textSize(24);
    sketch.fill(0);
    sketch.text('Is it ok to dance? Press to record and analyze... ', 20, 50);
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


// FFT
var fft;
var fftSize = 1024;
var frequencySpectrum = [];
fft = new FFT(.8, fftSize, -140, 0);
fft.disconnect();
fft.setInput(mic);
var frequencySpectrum = fft.processFrequency();


var ok2dance = function( sketch ) {

  sketch.waiting = false;

  sketch.setup = function() {
    sketch.createCanvas(400, 400);
    sketch.background(255,255,255);
    sketch.textAlign(sketch.CENTER);
    sketch.textSize(24);
    sketch.noStroke();
  };

  sketch.draw = function() {
  };

};

var okP5 = new p5(ok2dance, 'ok2dance');



micOn = function() {
  // mute output to prevent feedback
  p5sound.amp(.0);
  recButtonP5.background(255,0,0);
  recButtonP5.text('Allow microphone to start recording...click here to stop',recButtonP5.width/2,recButtonP5.height/2);
  recording = true;
  mic.on();
  startRecording();
  okP5.background(255,255,255);

  // max record length is 20 seconds
  setTimeout(function() {
    if (recording == true) {
      micOff();
    }
  }, 20000);
};

micOff = function() {
  // turn output back on
  p5sound.amp(1.);

  recButtonP5.background(0,255,0);
  recButtonP5.text('Analyzing...',recButtonP5.width/2,recButtonP5.height/2);
  waiting = true;
  recording = false;
  mic.off();
  stopRecording();
};

function setup() {
  createCanvas(0,0);
}

function draw() {
  if (recording == true) {
    okP5.background(255);
    frequencySpectrum = fft.processFrequency();

    // Draw every value in the frequencySpectrum array as a rectangle
    okP5.fill(random(200,255),random(200,255),0);
    for (var i = 0; i< frequencySpectrum.length; i++){
      okP5.noStroke();
      okP5.rect(map(i, 0, frequencySpectrum.length, 0, okP5.width), okP5.height, fftSize/okP5.width, -frequencySpectrum[i] ) ;
    }
  }
  else{
    okP5.fill(255,255,0);
  }
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

displayResults = function(energy, danceability) {
  waiting = false;
  if (danceability > .5) {
    okP5.background(0,255,0);
    okP5.text('YES!!!',okP5.width/2,okP5.height/2);
    recButtonP5.background(0,255,0);
  }
  else if (energy > .5) {
    okP5.background(255,0,0);
    okP5.text("No",okP5.width/2,okP5.height/2);
    recButtonP5.background(255,0,0);
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
  hf.href = url;
  var fileName = new Date().toISOString() + '.wav';
  hf.download = fileName;
  hf.innerHTML = hf.download;
  li.appendChild(au);
  li.appendChild(hf);
  document.body.appendChild(li);

  saveWav(wavBlob, 'audio', fileName);
}


function saveWav(blob, fileType, fileName) {
  var formData = new FormData();
  formData.append(fileType + '-filename', fileName);
  formData.append(fileType + '-blob', blob);

  xhrRequest('save.php', formData, parseTrackID);
}

function xhrRequest(url, data, callback, progress) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {
      callback(request.responseText);
    }
  };

  // update progress bar if given
  request.onprogress = function(e) {
    if(!progress) return;
    if (e.lengthComputable) {
      progress.value = e.loaded / e.total * 100;
      console.log(progress.value);
      progress.textContent = progress.value; //fallback for unsupported browsers
    }
  }

  request.open('POST', url);
  request.send(data);
}

// get the unique TrackID from our upload, use it to get danceability
function parseTrackID(uploadResponseText) {
  console.log(uploadResponseText);
  var jsonResults = JSON.parse(uploadResponseText);
  var trackID = jsonResults.track.id;
  console.log(trackID);
  setTimeout(function() {getDanceability(trackID);},10000);
}


function parseDanceability(results) {
  var echonestRaw = JSON.parse(results).response;
  var echonestTrack = JSON.parse(results).response.track; //.response.songs[0].audio_summary;

  var analysisStatus = echonestTrack.status;
  var trackID = echonestTrack.id;

  if (analysisStatus == 'pending') {
    setTimeout(function() {getDanceability(trackID);}, 3000);
    console.log(analysisStatus + ' for track # ' +trackID);
  }
  else {
    var echonestJSON = JSON.parse(results).response.track.audio_summary; //.response.songs[0].audio_summary;
    var danceability = echonestJSON.danceability;
    var energy = echonestJSON.energy;
    console.log(echonestRaw);
    console.log('energy: ' + energy + ', danceability: ' + danceability);

    displayResults(energy, danceability);
    deleteFile();
  }
}

function deleteFile() {
  //TO DO
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
