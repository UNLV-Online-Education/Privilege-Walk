<?php
// STATEMENT TABLE 
// SET: sets the statements
//     expects:    msg
//                 walk_id
//                 array(statements)
//                 array(directions)
//     returns:    none
// GET: 
//     expects:    msg 
//                 walk_id
//     returns:     ====================================
//                 |{                                   |
//                 |    "statements":[{                 |
//                 |            "position" : "xxx",     |
//                 |            "statement" : "xxx",    |
//                 |            "direction" : "xxx"     |
//                 |        },                          |
//                 |        {                           |
//                 |            ...                     |
//                 |        }]                          |
//                 |}                                   |
//                  ==================================== 
// 
// ###################################################################### 
	// DATABASE
	require_once "includes/connect-dedb.php";
	$mysqliDB	= new mysqli($host,$user,$pass,$dedb);
	if ($mysqliDB->connect_errno) {
		echo "There was an error setting up the Privilege Walk activity, please notify your instructor.";
		exit;
    }
    // VARIABLES
	if(!isset($_POST['msg'])) die('ERROR=no msg'); 
    if(!isset($_POST['walk_id'])) die('ERROR=no walk_id'); 
    $msg = $_POST['msg'];
    $walk_id = $_POST['walk_id'];
    if(!ctype_digit($walk_id)) die('ERROR=no walk_id');
    $result = "";
    if($msg==="set"){
        if(!isset($_POST['statements'])) die('ERROR=no statements'); 
        if(!isset($_POST['directions'])) die('ERROR=no directions'); 
        $statements	= $_POST['statements'];
        $directions	= $_POST['directions'];
        $getStmt = $mysqliDB->prepare("SELECT * FROM pwalk_statements WHERE walk_id=?");
		$getStmt->bind_param('i', $walk_id);
		$getStmt->execute();
        $getStmt->store_result();
        if($getStmt->num_rows==1){
            $result='{"exists":1, "message":"statements already exists"}';
        }
        else{
            $totalStatement = count($statements);
            $count=0;
            
            while ($count<$totalStatement){  
                $statements[$count] = $mysqliDB->real_escape_string($statements[$count]);
                if(!is_numeric($directions[$count]) && !($direction==1||$direction==0||$direction==-1)) die('ERROR = incorrect direction');  
                $num = $count+1;
                $aStmt = $statements[$count];
                $aDir = $directions[$count];
                $insertDB = $mysqliDB->prepare("INSERT INTO pwalk_statements (walk_id, position, prompt, direction) VALUES (?,?,?,?)");
                $insertDB->bind_param('iisi', $walk_id,$num,$aStmt,$aDir);
                $insertDB->execute();
                $count++;
            }
        }
        $getStmt->free_result();
        $getStmt->close();
    }
    else if($msg==="get"){
        $getStmt = $mysqliDB->prepare("SELECT position, prompt, direction FROM pwalk_statements WHERE walk_id=? ORDER BY position");
		$getStmt->bind_param('i', $walk_id);
        $getStmt->execute();
        $getStmt->store_result();
        $getStmt->bind_result($position, $prompt, $direction);
        $result = '{ "exists":1,"statements":[ ';
        $temp = "";
        if($getStmt->num_rows==0){
            $result = '{ "exists":0, "message":"no statements found"}';
        }
        else{
            while($getStmt->fetch()){
                $temp = $temp.'{"position":"'.$position.'","statement":"'.$prompt.'","direction":"'.$direction.'"},';
            }
        }
        $temp = substr($temp,0,strlen($temp)-1);
        $result = $result.$temp."]}";
        $getStmt->free_result();
        $getStmt->close();
    }
    echo $result;
?>