<?php

include 'eko.php';


function postToEchoNest($aFile, $key) {
  global $eko;
  $post = array(
    "track" => "@".$aFile,
    "filetype" => "wav",
    "api_key" => $key
  );

  $curl = curl_init();
  curl_setopt($curl, CURLOPT_HEADER, 0);
  curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($curl, CURLOPT_URL, "http://developer.echonest.com/api/v4/track/upload");
  curl_setopt($curl, CURLOPT_POST, true);
  curl_setopt($curl, CURLOPT_POSTFIELDS, $post);

  $return_data = curl_exec($curl);

  // //remove padding 
  $return_data=utf8_encode($return_data);
  $return_data=preg_replace('/.+?({.+}).+/','$1',$return_data); 

  echo($return_data);
} 

foreach(array('video', 'audio') as $type) {
    if (isset($_FILES["${type}-blob"])) {
        
        $fileName = $_POST["${type}-filename"];
        $uploadDirectory = "audiofiles/".$fileName;
        
        if (!move_uploaded_file($_FILES["${type}-blob"]["tmp_name"], $uploadDirectory)) {
            echo(" problem moving uploaded file");
        }

        // echo($uploadDirectory);
        postToEchoNest($uploadDirectory, $echonest);
    }
}
?>