<?php
// RESPONSE TABLE 
// SET: set the responses
//     expects:     direction, user_id, statement_id, is_finished
//     returns:     none
// 
// DOES NOT HAVE A GET, GET is a part of pWalkUsers 
// ###################################################################### 
	// DATABASE
	require_once "includes/connect-dedb.php";
	$mysqliDB = new mysqli($host,$user,$pass,$dedb);
	if ($mysqliDB->connect_errno) {
		echo "There was an error setting up the Privilege Walk activity, please notify your instructor.";
		exit;
    }
    // SANITIZE
    if(!isset($_POST['direction'])) die('ERROR=no direction'); 
    if(!isset($_POST['user_id'])) die('ERROR=user_id'); 
    if(!isset($_POST['statement_id'])) die('ERROR=no statement_id'); 
    if(!isset($_POST['is_finished'])) die('ERROR=no is_finished'); 
    $direction = $_POST['direction'];
    $user_id = $_POST['user_id'];
    $statement_id = $_POST['statement_id'];
    $is_finished = $_POST['is_finished'];   
    $direction = preg_replace('/\s+/', '', $direction);
    $user_id = preg_replace('/\s+/', '', $user_id);
    $statement_id = preg_replace('/\s+/', '', $statement_id);
    $is_finished = preg_replace('/\s+/', '', $is_finished);
    if(!is_numeric($direction) && !($direction==1||$direction==0||$direction==-1)) die('ERROR=incorrect direction'); 
    if(!ctype_digit($user_id)) die('ERROR= incorrect user_id'); 
    if(!ctype_digit($statement_id)) die('ERROR= incorrect statement_id'); 
    if(!ctype_digit($is_finished) &&!($is_finished==1||$is_finished==0)) die('ERROR= incorrect is_finished'); 
    $result = "";
    // MAIN
    $getResponse = $mysqliDB->prepare("SELECT * FROM pwalk_responses WHERE `user_id`=? AND statement_id=?");
    $getResponse->bind_param('ii', $user_id,$statement_id);
    $getResponse->execute();
    $getResponse->store_result();
    if ($getResponse->num_rows==1) {
        $updateDB = $mysqliDB->prepare("UPDATE pwalk_responses SET response=? WHERE `user_id`=? AND statement_id=?");
        $updateDB->bind_param('iii', $direction, $user_id, $statement_id);
        $updateDB->execute();
        $result='{"exists":1, "message":"response updated"}';
        $updateDB->close();
    }
    else if($getResponse->num_rows==0){
        $insertDB = $mysqliDB->prepare("INSERT INTO pwalk_responses (`user_id`,response,statement_id) VALUES (?, ?, ?)");
        $insertDB->bind_param('iii', $user_id, $direction, $statement_id);
        $insertDB->execute();
        $result='{"exists":0, "message":"response inserting"}';
        $insertDB->close();
    }
    $getResponse->free_result();
    $getResponse->close();
    if($is_finished==1){
        $updateDBtoComplete = $mysqliDB->prepare("UPDATE pwalk_users SET is_finished=? WHERE `user_id`=?");
        $updateDBtoComplete->bind_param('ii', $is_finished, $user_id);
        $updateDBtoComplete->execute();
        $result='{"exists":1, "message":"response is_finished"}';
        $updateDBtoComplete->close();
    }
	echo $result;
?>