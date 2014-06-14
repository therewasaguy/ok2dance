var recording = false;


var recordButton = function( sketch ) {

  sketch.setup = function() {
    sketch.background(0,255,255);
    mic = new AudioIn();
    sketch.textAlign(sketch.CENTER);
    sketch.textSize(24);
    sketch.noStroke();
  };

  sketch.draw = function() {
  };

  sketch.mousePressed = function() {
    if (recording == false){
      micOn();
    } else {
      micOff();
    }
  };
};

micOn = function() {
  recButtonP5.background(255,0,0);
  recButtonP5.text('micOn',recButtonP5.width/2,recButtonP5.height/2);
  recording = true;
  mic.on();
  startRecording();
};

micOff = function() {
  recButtonP5.background(0,255,0);
  recButtonP5.text('micOff',recButtonP5.width/2,recButtonP5.height/2);
  recording = false;
  mic.off();
  stopRecording();
};

startRecording = function() {

}

stopRecording = function() {

  sendToEchoNest();
}

sendToEchoNest = function() {
  console.log('hi');
}

var recButtonP5 = new p5(recordButton, 'recordButton');

// ======================
// RECORD STUFF, inspired by recorder.js and tone.js
// ======================

