<?PHP

  $directory = getcwd();

if (isset($_POST['delete'])) {

  //reset current file to the incoming file
  $current_file = trim($_POST['currentFile']); 

  //delete unecessary files
  $output7 = exec("rm ".$directory.'/audiofiles/'.$current_file);
  echo ('file deleted successfully!');
}

?>