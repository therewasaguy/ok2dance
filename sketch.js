var recording = false;


var recordButton = function( sketch ) {

  sketch.setup = function() {
    sketch.background(0,255,255);
  };

  sketch.draw = function() {
  };

  sketch.mousePressed = function() {
    if (recording == false){
      sketch.record();
    } else {
      sketch.stop();
    }
  };

  sketch.record = function() {
    sketch.background(255,0,0);
    recording = true;
  };

  sketch.stop = function() {
    sketch.background(0,255,0);
    recording = false;
  };

};

var recButtonP5 = new p5(recordButton, 'recordButton');
