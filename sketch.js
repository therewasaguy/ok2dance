var recording = false;
var waiting = false;
var mic = new AudioIn();
var recorder = new Recorder(mic);
var recordingTimer = 0;
var recordStart;

// FFT
var fft;
var fftSize = 1024;
var frequencySpectrum = [];
fft = new FFT(.8, fftSize, -140, 0);
fft.disconnect();
fft.setInput(mic);
var frequencySpectrum = fft.processFrequency();

// path to current file so it can be deleted
var filePath;
var finalImage;

var initialize = function() {
  recording = false;
  waiting = false;
  recordingTimer = 0;
  recordStart = null;
  filePath = null;
  recButtonP5.initialize();
  okP5.initialize();
  finalImage.hide();
}

// This canvas is the notification window
var recordButton = function( sketch ) {

  sketch.setup = function() {
    sketch.createCanvas(500, 400);
    sketch.initialize();
  };

  sketch.initialize = function() {
    sketch.background(220,0,0);
    sketch.textSize(48);
    sketch.fill(0,255,0);
    sketch.stroke(255,255,0);
    sketch.textAlign(sketch.LEFT);
    sketch.text('Is it OK to Dance?', 15, 50);
    sketch.textSize(24);
    sketch.text('Ok2Dance will listen & compute danceability.',15,100);
    sketch.textSize(18);
    sketch.text('Click here to begin recording...', 15, 135);
    sketch.textAlign(sketch.CENTER);
    sketch.textSize(24);
    sketch.noStroke();
    sketch.fill(0);
  };

  sketch.draw = function() {
  };

  sketch.mousePressed = function() {
    if (waiting == true) {
      //do nothing
    }
    else if (recording == false && sketch.mouseX > 0 && sketch.mouseX < sketch.width && sketch.mouseY > 0 && sketch.mouseY < sketch.height) {
      if (  recordingTimer > 0 ) {
        initialize();
      }
      micOn();
    }
    else if (recording == true &&  frequencySpectrum[200] == 0) {
      // do nothing because recording has not begun
    }
    else if (recording == true && sketch.mouseX > 0 && sketch.mouseX < sketch.width && sketch.mouseY > 0 && sketch.mouseY < sketch.height){
      micOff();
    }
  };
};

var recButtonP5 = new p5(recordButton, 'recordButton');


// This canvas is the FFT window
var ok2dance = function( sketch ) {

  sketch.waiting = false;

  sketch.setup = function() {
    sketch.createCanvas(400, 400);
    sketch.initialize();
  };

  sketch.initialize = function() {
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
  recButtonP5.fill(255,255,0);
  recButtonP5.text('Please enable microphone to begin recording',recButtonP5.width/2,recButtonP5.height/2);

  recording = true;
  mic.on();
  startRecording();
  okP5.background(255,255,255);

  // max record length is 20 seconds
  setTimeout(function() {
    if (recording == true) {
      micOff();
      console.log('bang!');
    }
  }, 20000);
};

micOff = function() {
  // turn output back on
  p5sound.amp(1.);

  recButtonP5.background(0,0,0);
  recButtonP5.fill(255);
  recButtonP5.text('Sending audio to Echo Nest for analysis',recButtonP5.width/2,recButtonP5.height/2);

  setTimeout( function() {
    recButtonP5.background(0,0,0);
    recButtonP5.text('Sending audio to Echo Nest for analysis.',recButtonP5.width/2,recButtonP5.height/2);
  }, 1500);

  setTimeout( function() {
    recButtonP5.background(0,0,0);
    recButtonP5.text('Sending audio to Echo Nest for analysis..',recButtonP5.width/2,recButtonP5.height/2);
  }, 2250);

  setTimeout( function() {
    recButtonP5.background(0,0,0);
    recButtonP5.text('Sending audio to Echo Nest for analysis...',recButtonP5.width/2,recButtonP5.height/2);
  }, 3000);


  setTimeout( function() {
    recButtonP5.background(0,0,0);
    recButtonP5.text('Sending audio to Echo Nest for analysis....',recButtonP5.width/2,recButtonP5.height/2);
  }, 3750);

  // update messages
  setTimeout( function() {
    recButtonP5.background(0,0,0);
    recButtonP5.text('Computing danceability',recButtonP5.width/2,recButtonP5.height/2);
  }, 5000);

  setTimeout( function() {
    recButtonP5.background(0,0,0);
    recButtonP5.text('Computing danceability.',recButtonP5.width/2,recButtonP5.height/2);
  }, 6000);

  setTimeout( function() {
    recButtonP5.background(0,0,0);
    recButtonP5.text('Computing danceability..',recButtonP5.width/2,recButtonP5.height/2);
  }, 6500);

  setTimeout( function() {
    recButtonP5.background(0,0,0);
    recButtonP5.text('Computing danceability...',recButtonP5.width/2,recButtonP5.height/2);
  }, 7000);

  setTimeout( function() {
    recButtonP5.background(0,0,0);
    recButtonP5.text('Parsing danceability',recButtonP5.width/2,recButtonP5.height/2);
  }, 8200);
  setTimeout( function() {
    recButtonP5.background(0,0,0);
    recButtonP5.text('Parsing danceability.',recButtonP5.width/2,recButtonP5.height/2);
  }, 8300);
  setTimeout( function() {
    recButtonP5.background(0,0,0);
    recButtonP5.text('Parsing danceability..',recButtonP5.width/2,recButtonP5.height/2);
  }, 8800);

  setTimeout( function() {
    recButtonP5.background(0,0,0);
    recButtonP5.text('Parsing danceability...',recButtonP5.width/2,recButtonP5.height/2);
  }, 9500);

  waiting = true;
  recording = false;
  mic.off();
  stopRecording();
};

function setup() {
  createCanvas(0,0);
}

function draw() {
  if (recording && frequencySpectrum[200] > 0) {

    // do this once to set initial recordStart and keep track of duration
    if (recordingTimer == 0) {
      recordStart = p5sound.audiocontext.currentTime;
      recordingTimer = 1;

    }
    recButtonP5.background(255,0,0);
    recButtonP5.text('RECORDING',recButtonP5.width/2,recButtonP5.height/2);
    recButtonP5.text('(click here to stop)',recButtonP5.width/2,recButtonP5.height/2 + 30);
    var recTime = round(p5sound.audiocontext.currentTime - recordStart);
    recButtonP5.text('Time: ' + recTime,recButtonP5.width/2,recButtonP5.height/2 + 60);
  }
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
    frequencySpectrum[200] = 0;
  }
    if (waiting && frameCount % 200 == 0) {
    okP5.background(0);
    okP5.text('Please wait.',okP5.width/2,okP5.height/2);
  } else if (this.waiting && frameCount % 9 == 0) {
    okP5.background(0);
    okP5.text('Please wait..',okP5.width/2,okP5.height/2);
  } else if (this.waiting && frameCount % 16 == 0) {
    okP5.background(0);
    okP5.text('Please wait...',okP5.width/2,okP5.height/2);
  }
}

displayResults = function(energy, danceability) {
  waiting = false;





  // success: 
  if (danceability > .01) {
    okP5.background(0,255,0);
    okP5.text('YES!!!',okP5.width/2,okP5.height/2);
    recButtonP5.background(0,255,0);
    recButtonP5.text('click to try again',recButtonP5.width/2,recButtonP5.height/2);
    var yesImg = 'images/yes/'+Math.round(Math.random(1)*18 + 1)+'.gif';
    finalImage = recButtonP5.createImg(yesImg);
    finalImage.show();
  }

  // fail:
  else {
    okP5.background(255,0,0);
    okP5.text('NO.',okP5.width/2,okP5.height/2);
    recButtonP5.background(255,0,0);
    recButtonP5.text('click to try again',recButtonP5.width/2,recButtonP5.height/2);
    var noImg = 'images/no/'+Math.round(Math.random(1)*12 + 1)+'.gif';
    finalImage = recButtonP5.createImg(noImg);
    finalImage.show();
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
  hf.innerHTML = 'click to download your recording';
  li.appendChild(au);
  li.appendChild(hf);
  document.body.appendChild(li);

  saveWav(wavBlob, 'audio', fileName);

  // set global variable so we can delete this file later
  filePath = fileName;
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
  setTimeout(function() {getDanceability(trackID);},11000);
}


function parseDanceability(results) {
  console.log('parsing danceability');
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
  var formData = new FormData();
  formData.append('delete', true);
  formData.append('currentFile', filePath);
  var logSuccess = function(e) {console.log(e);} //log the results
  xhrRequest('delete.php', formData, logSuccess);
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
