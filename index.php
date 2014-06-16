<?php
  include 'eko.php';
?>

<html>

<head>

  <title>Ok2Dance???</title>

  <script language="javascript" type="text/javascript" src="p5.js"></script>

  <script language="javascript" type="text/javascript" src="p5Sound.js"></script> 
  <script language="javascript" type="text/javascript" src="p5.dom.js"></script> 

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

        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
        ga('create', 'UA-37186685-1', 'jasonsigal.cc');
        ga('send', 'pageview');
        console.log(ga);
        </script>
  </footer>
</html>
