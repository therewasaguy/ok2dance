<?php
  include 'eko.php';
?>

<html>

<head>

  <title>Ok2Dance???</title>

  <script language="javascript" type="text/javascript" src="p5.js"></script>

  <script language="javascript" type="text/javascript" src="p5Sound.js"></script> 

  <script language="javascript" type="text/javascript" src="recorder.js"></script> 
  <script language="javascript" type="text/javascript" src="recorderWorker.js"></script> 

  <script language="javascript" type="text/javascript" src="sketch.js"></script> 

</head>

<body>

</body>


  <footer>
      <script language="javascript" type="text/javascript" src="en.js"></script> 
      <script>
        function getDanceability(trackID) {
          var enkey = "<?php Print($echonest); ?>";
          // load JSON
          loadStrings('http://developer.echonest.com/api/v4/track/profile?api_key='+enkey+'&id='+trackID+'&bucket=audio_summary', parseDanceability);
        }
        </script>
  </footer>
</html>
